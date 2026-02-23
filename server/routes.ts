import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import express from "express";

// Configure multer for file uploads
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: uploadStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

// Seed function
async function seedDatabase() {
  try {
    const existingVehicles = await storage.getVehicles();
    if (existingVehicles.length === 0) {
      await storage.createVehicle({
        name: "Suzuki Alto",
        description: "Compact and efficient, perfect for city tours or solo travelers on a budget.",
        capacity: "3 Passengers",
        features: ["Air Conditioning", "Compact", "Budget Friendly"],
        imageUrl: "",
        status: "available"
      });
      await storage.createVehicle({
        name: "Toyota Premio",
        description: "Comfortable sedan offering a smooth ride for small families or business travelers.",
        capacity: "4 Passengers",
        features: ["Air Conditioning", "Comfortable Seating", "Ample Trunk Space"],
        imageUrl: "",
        status: "available"
      });
      await storage.createVehicle({
        name: "Toyota Noah",
        description: "Spacious minivan ideal for group safaris or family trips, offering excellent visibility.",
        capacity: "7 Passengers",
        features: ["Spacious Interior", "Air Conditioning", "Perfect for Groups", "Good Ground Clearance"],
        imageUrl: "",
        status: "available"
      });
    }

    const existingPackages = await storage.getPackages();
    if (existingPackages.length === 0) {
      await storage.createPackage({
        name: "Maasai Mara Experience",
        description: "Experience the magic of the Maasai Mara. Witness the Great Migration and enjoy luxury camping.",
        duration: "3 Days, 2 Nights",
        price: "Ksh 150,000",
        itinerary: ["Day 1: Arrival and Evening Game Drive", "Day 2: Full Day Game Drive & Sundowner", "Day 3: Morning Game Drive and Departure"],
        imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop  ",
        isPopular: true
      });
      await storage.createPackage({
        name: "Amboseli & Tsavo Adventure",
        description: "Iconic views of Mount Kilimanjaro and massive elephant herds in this dual-park adventure.",
        duration: "5 Days, 4 Nights",
        price: "Ksh 230,000",
        itinerary: ["Day 1-2: Amboseli Exploration", "Day 3: Transfer to Tsavo West", "Day 4: Tsavo Game Drives", "Day 5: Departure"],
        imageUrl: "https://images.unsplash.com/photo-1521651201144-634f700b36ef?q=80&w=2070&auto=format&fit=crop  ",
        isPopular: false
      });
    }

    const existingPhotos = await storage.getPhotos();
    if (existingPhotos.length === 0) {
      await storage.createPhoto({
        title: "Lion Pride at Sunset",
        description: "Magnificent lion pride resting during golden hour in Maasai Mara",
        imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop ",
        category: "Wildlife",
        location: "Maasai Mara, Kenya",
        isFeatured: true
      });
      await storage.createPhoto({
        title: "Elephant Herd at Amboseli",
        description: "Large elephant family with Mount Kilimanjaro in the background",
        imageUrl: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop ",
        category: "Wildlife",
        location: "Amboseli National Park",
        isFeatured: true
      });
      await storage.createPhoto({
        title: "Hot Air Balloon Safari",
        description: "Early morning balloon ride over the savannah",
        imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop ",
        category: "Adventure",
        location: "Maasai Mara",
        isFeatured: false
      });
    }
  } catch (e) {
    console.error("Failed to seed database", e);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  seedDatabase();

  // File Upload Endpoint - MUST BE BEFORE OTHER ROUTES
  app.post("/api/upload", upload.single("image"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        success: true, 
        imageUrl,
        message: "File uploaded successfully" 
      });
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error: (error as Error).message });
    }
  });

  // Serve uploaded files statically
  app.use("/uploads", express.static("uploads"));

  // Vehicles
  app.get(api.vehicles.list.path, async (req, res) => {
    const vehicles = await storage.getVehicles();
    res.json(vehicles);
  });

  app.get(api.vehicles.get.path, async (req, res) => {
    const vehicle = await storage.getVehicle(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Not found" });
    res.json(vehicle);
  });

  app.post(api.vehicles.create.path, async (req, res) => {
    try {
      const data = api.vehicles.create.input.parse(req.body);
      const vehicle = await storage.createVehicle(data);
      res.status(201).json(vehicle);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.put(api.vehicles.update.path, async (req, res) => {
    try {
      const data = api.vehicles.update.input.parse(req.body);
      const vehicle = await storage.updateVehicle(req.params.id, data);
      res.json(vehicle);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.vehicles.delete.path, async (req, res) => {
    await storage.deleteVehicle(req.params.id);
    res.status(204).end();
  });

  // Packages
  app.get(api.packages.list.path, async (req, res) => {
    const packages = await storage.getPackages();
    res.json(packages);
  });

  app.get(api.packages.get.path, async (req, res) => {
    const pkg = await storage.getPackage(req.params.id);
    if (!pkg) return res.status(404).json({ message: "Not found" });
    res.json(pkg);
  });

  app.post(api.packages.create.path, async (req, res) => {
    try {
      const data = api.packages.create.input.parse(req.body);
      const pkg = await storage.createPackage(data);
      res.status(201).json(pkg);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.put(api.packages.update.path, async (req, res) => {
    try {
      const data = api.packages.update.input.parse(req.body);
      const pkg = await storage.updatePackage(req.params.id, data);
      res.json(pkg);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.packages.delete.path, async (req, res) => {
    await storage.deletePackage(req.params.id);
    res.status(204).end();
  });

  // Photos (Safari Gallery)
  app.get(api.photos.list.path, async (req, res) => {
    try {
      const photos = await storage.getPhotos();
      res.json(photos);
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.photos.featured.path, async (req, res) => {
    try {
      const photos = await storage.getFeaturedPhotos();
      res.json(photos);
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.get(api.photos.get.path, async (req, res) => {
    try {
      const photo = await storage.getPhoto(req.params.id);
      if (!photo) return res.status(404).json({ message: "Not found" });
      res.json(photo);
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.post(api.photos.create.path, async (req, res) => {
    try {
      const data = api.photos.create.input.parse(req.body);
      const photo = await storage.createPhoto(data);
      res.status(201).json(photo);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.put(api.photos.update.path, async (req, res) => {
    try {
      const data = api.photos.update.input.parse(req.body);
      const photo = await storage.updatePhoto(req.params.id, data);
      res.json(photo);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.photos.delete.path, async (req, res) => {
    try {
      await storage.deletePhoto(req.params.id);
      res.status(204).end();
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  // Testimonials
  app.get(api.testimonials.list.path, async (req, res) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  app.post(api.testimonials.create.path, async (req, res) => {
    try {
      const data = api.testimonials.create.input.parse(req.body);
      const testimonial = await storage.createTestimonial(data);
      res.status(201).json(testimonial);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.testimonials.delete.path, async (req, res) => {
    await storage.deleteTestimonial(req.params.id);
    res.status(204).end();
  });

  // Bookings
  app.get(api.bookings.list.path, async (req, res) => {
    const bookings = await storage.getBookings();
    res.json(bookings);
  });

  app.get(api.bookings.get.path, async (req, res) => {
    const booking = await storage.getBooking(req.params.id);
    if (!booking) return res.status(404).json({ message: "Not found" });
    res.json(booking);
  });

  app.post(api.bookings.create.path, async (req, res) => {
    try {
      const data = api.bookings.create.input.parse(req.body);
      const booking = await storage.createBooking(data);
      res.status(201).json(booking);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.patch(api.bookings.updateStatus.path, async (req, res) => {
    try {
      const data = api.bookings.updateStatus.input.parse(req.body);
      const booking = await storage.updateBookingStatus(req.params.id, data.status);
      res.json(booking);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.bookings.delete.path, async (req, res) => {
    try {
      await storage.deleteBooking(req.params.id);
      res.status(204).end();
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  // Contacts
  app.get(api.contacts.list.path, async (req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post(api.contacts.create.path, async (req, res) => {
    try {
      const data = api.contacts.create.input.parse(req.body);
      const contact = await storage.createContact(data);
      res.status(201).json(contact);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.patch(api.contacts.markRead.path, async (req, res) => {
    try {
      const contact = await storage.markContactRead(req.params.id);
      res.json(contact);
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  app.delete(api.contacts.delete.path, async (req, res) => {
    try {
      await storage.deleteContact(req.params.id);
      res.status(204).end();
    } catch (e) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  // ADMIN DASHBOARD STATS
  app.get("/api/admin/dashboard", async (req, res) => {
    try {
      const [bookings, vehicles, packages, contacts] = await Promise.all([
        storage.getBookings(),
        storage.getVehicles(),
        storage.getPackages(),
        storage.getContacts()
      ]);

      res.json({
        totalBookings: bookings.length,
        totalVehicles: vehicles.length,
        totalPackages: packages.length,
        totalContacts: contacts.length
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  return httpServer;
}