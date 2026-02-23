import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, jsonb, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export * from "./models/auth";

// --- VEHICLES ---
export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  capacity: text("capacity").notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  imageUrl: text("image_url"),
  status: text("status").notNull().default('available'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true, createdAt: true, updatedAt: true });
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type UpdateVehicleRequest = Partial<InsertVehicle>;

// --- TOUR PACKAGES ---
export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  price: text("price").notNull(),
  itinerary: jsonb("itinerary").notNull().$type<string[]>(),
  imageUrl: text("image_url"),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPackageSchema = createInsertSchema(packages).omit({ id: true, createdAt: true, updatedAt: true });
export type Package = typeof packages.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type UpdatePackageRequest = Partial<InsertPackage>;

// --- SAFARI PHOTOS (GALLERY) ---
export const safariPhotos = pgTable("safari_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category"),
  location: text("location"),
  takenDate: date("taken_date"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPhotoSchema = createInsertSchema(safariPhotos).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type SafariPhoto = typeof safariPhotos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type UpdatePhotoRequest = Partial<InsertPhoto>;

// --- TESTIMONIALS ---
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientName: text("client_name").notNull(),
  content: text("content").notNull(),
  rating: text("rating").notNull(), // Keep as text to match existing DB
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// OVERRIDE: Force rating to be string in Zod schema
export const insertTestimonialSchema = createInsertSchema(testimonials, {
  rating: z.string().min(1).max(2) // Override to accept string
}).omit({ id: true, createdAt: true });

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

// --- BOOKINGS (Inquiries) ---
export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  packageId: varchar("package_id").references(() => packages.id),
  vehicleId: varchar("vehicle_id").references(() => vehicles.id),
  message: text("message"),
  status: text("status").notNull().default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, updatedAt: true, status: true });
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type UpdateBookingRequest = Partial<InsertBooking> & { status?: string };

// --- CONTACT INQUIRIES ---
export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true, isRead: true });
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;