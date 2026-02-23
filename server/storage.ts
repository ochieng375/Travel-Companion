import { db } from "./db";
import {
  vehicles,
  packages,
  testimonials,
  bookings,
  contacts,
  safariPhotos,
  type Vehicle, type InsertVehicle, type UpdateVehicleRequest,
  type Package, type InsertPackage, type UpdatePackageRequest,
  type Testimonial, type InsertTestimonial,
  type Booking, type InsertBooking, type UpdateBookingRequest,
  type Contact, type InsertContact,
  type SafariPhoto, type InsertPhoto, type UpdatePhotoRequest
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
// Replit Auth
import { users, type User, type UpsertUser } from "@shared/models/auth";

export interface IStorage {
  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  getVehicle(id: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, updates: UpdateVehicleRequest): Promise<Vehicle>;
  deleteVehicle(id: string): Promise<void>;
  
  // Packages
  getPackages(): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, updates: UpdatePackageRequest): Promise<Package>;
  deletePackage(id: string): Promise<void>;

  // Safari Photos (Gallery)
  getPhotos(): Promise<SafariPhoto[]>;
  getFeaturedPhotos(): Promise<SafariPhoto[]>;
  getPhoto(id: string): Promise<SafariPhoto | undefined>;
  createPhoto(photo: InsertPhoto): Promise<SafariPhoto>;
  updatePhoto(id: string, updates: UpdatePhotoRequest): Promise<SafariPhoto>;
  deletePhoto(id: string): Promise<void>;

  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: string, status: string): Promise<Booking>;
  deleteBooking(id: string): Promise<void>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactRead(id: string): Promise<Contact>;
  deleteContact(id: string): Promise<void>;

  // Dashboard Stats - NEW METHOD ADDED
  getDashboardStats(): Promise<{
    totalBookings: number;
    totalVehicles: number;
    totalPackages: number;
    totalContacts: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles);
  }
  async getVehicle(id: string): Promise<Vehicle | undefined> {
    const [v] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return v;
  }
  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [v] = await db.insert(vehicles).values(vehicle).returning();
    return v;
  }
  async updateVehicle(id: string, updates: UpdateVehicleRequest): Promise<Vehicle> {
    const [v] = await db.update(vehicles).set({...updates, updatedAt: new Date()}).where(eq(vehicles.id, id)).returning();
    return v;
  }
  async deleteVehicle(id: string): Promise<void> {
    await db.delete(vehicles).where(eq(vehicles.id, id));
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages);
  }
  async getPackage(id: string): Promise<Package | undefined> {
    const [p] = await db.select().from(packages).where(eq(packages.id, id));
    return p;
  }
  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [p] = await db.insert(packages).values(pkg).returning();
    return p;
  }
  async updatePackage(id: string, updates: UpdatePackageRequest): Promise<Package> {
    const [p] = await db.update(packages).set({...updates, updatedAt: new Date()}).where(eq(packages.id, id)).returning();
    return p;
  }
  async deletePackage(id: string): Promise<void> {
    await db.delete(packages).where(eq(packages.id, id));
  }

  // Safari Photos (Gallery)
  async getPhotos(): Promise<SafariPhoto[]> {
    return await db.select().from(safariPhotos).orderBy(desc(safariPhotos.createdAt));
  }

  async getFeaturedPhotos(): Promise<SafariPhoto[]> {
    return await db
      .select()
      .from(safariPhotos)
      .where(eq(safariPhotos.isFeatured, true))
      .orderBy(desc(safariPhotos.createdAt));
  }

  async getPhoto(id: string): Promise<SafariPhoto | undefined> {
    const [photo] = await db.select().from(safariPhotos).where(eq(safariPhotos.id, id));
    return photo;
  }

  async createPhoto(photo: InsertPhoto): Promise<SafariPhoto> {
    const [newPhoto] = await db.insert(safariPhotos).values(photo).returning();
    return newPhoto;
  }

  async updatePhoto(id: string, updates: UpdatePhotoRequest): Promise<SafariPhoto> {
    const [updatedPhoto] = await db
      .update(safariPhotos)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(safariPhotos.id, id))
      .returning();
    return updatedPhoto;
  }

  async deletePhoto(id: string): Promise<void> {
    await db.delete(safariPhotos).where(eq(safariPhotos.id, id));
  }

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  }
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [t] = await db.insert(testimonials).values(testimonial).returning();
    return t;
  }
  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }
  async getBooking(id: string): Promise<Booking | undefined> {
    const [b] = await db.select().from(bookings).where(eq(bookings.id, id));
    return b;
  }
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [b] = await db.insert(bookings).values(booking).returning();
    return b;
  }
  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const [b] = await db.update(bookings).set({status, updatedAt: new Date()}).where(eq(bookings.id, id)).returning();
    return b;
  }
  // ADDED: Delete booking method
  async deleteBooking(id: string): Promise<void> {
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  async createContact(contact: InsertContact): Promise<Contact> {
    const [c] = await db.insert(contacts).values(contact).returning();
    return c;
  }
  async markContactRead(id: string): Promise<Contact> {
    const [c] = await db.update(contacts).set({isRead: true}).where(eq(contacts.id, id)).returning();
    return c;
  }
  // ADDED: Delete contact method
  async deleteContact(id: string): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  // Dashboard Stats - NEW METHOD IMPLEMENTATION
  async getDashboardStats(): Promise<{
    totalBookings: number;
    totalVehicles: number;
    totalPackages: number;
    totalContacts: number;
  }> {
    const [bookingsList, vehiclesList, packagesList, contactsList] = await Promise.all([
      this.getBookings(),
      this.getVehicles(),
      this.getPackages(),
      this.getContacts()
    ]);

    return {
      totalBookings: bookingsList.length,
      totalVehicles: vehiclesList.length,
      totalPackages: packagesList.length,
      totalContacts: contactsList.length
    };
  }
}

export const storage = new DatabaseStorage();