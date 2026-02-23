import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPgSimple(session);

// Hardcoded admin credentials - CHANGE THESE IN PRODUCTION
// In production, use environment variables or database
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123"; // Change this immediately after first login

export function setupAuth(app: Express) {
  // Session middleware
  app.use(
    session({
      store: new PostgresSessionStore({
        pool: pool,
        tableName: 'sessions',
        createTableIfMissing: true
      }),
      secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict'
      },
      name: 'safari.sid' // Custom session name
    })
  );

  // Login endpoint
  app.post("/api/login", (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set session
      req.session.user = { 
        id: '1',
        username, 
        role: "admin",
        email: 'mattjoe787@gmail.com',
        firstName: 'Admin',
        lastName: 'User'
      };
      
      return res.json({ 
        success: true, 
        user: {
          id: '1',
          username, 
          role: "admin",
          email: 'mattjoe787@gmail.com',
          firstName: 'Admin',
          lastName: 'User'
        }
      });
    }
    
    res.status(401).json({ message: "Invalid credentials" });
  });

  // Logout endpoint
  app.post("/api/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ success: true });
    });
  });

  // Check auth status
  app.get("/api/auth/user", (req: Request, res: Response) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Middleware to protect admin routes
  // FIXED: Removed the * wildcard - app.use matches all sub-routes automatically
  app.use("/api/admin", (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user?.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Admin access required" });
    }
  });
}

// Type augmentation for session
declare module 'express-session' {
  interface SessionData {
    user: {
      id: string;
      username: string;
      role: 'admin' | 'staff' | 'customer';
      email: string;
      firstName: string;
      lastName: string;
    };
  }
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
}