import { z } from 'zod';
import { 
  insertVehicleSchema, 
  insertPackageSchema, 
  insertTestimonialSchema, 
  insertBookingSchema, 
  insertContactSchema,
  insertPhotoSchema,
  vehicles,
  packages,
  testimonials,
  bookings,
  contacts,
  safariPhotos
} from './schema';
import { users } from './models/auth';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

export const api = {
  vehicles: {
    list: {
      method: 'GET' as const,
      path: '/api/vehicles' as const,
      responses: {
        200: z.array(z.custom<typeof vehicles.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/vehicles/:id' as const,
      responses: {
        200: z.custom<typeof vehicles.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/vehicles' as const,
      input: insertVehicleSchema,
      responses: {
        201: z.custom<typeof vehicles.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/vehicles/:id' as const,
      input: insertVehicleSchema.partial(),
      responses: {
        200: z.custom<typeof vehicles.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/vehicles/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  
  packages: {
    list: {
      method: 'GET' as const,
      path: '/api/packages' as const,
      responses: {
        200: z.array(z.custom<typeof packages.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/packages/:id' as const,
      responses: {
        200: z.custom<typeof packages.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/packages' as const,
      input: insertPackageSchema,
      responses: {
        201: z.custom<typeof packages.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/packages/:id' as const,
      input: insertPackageSchema.partial(),
      responses: {
        200: z.custom<typeof packages.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/packages/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },

  // --- SAFARI PHOTOS (GALLERY) ---
  photos: {
    list: {
      method: 'GET' as const,
      path: '/api/photos' as const,
      responses: {
        200: z.array(z.custom<typeof safariPhotos.$inferSelect>()),
      },
    },
    featured: {
      method: 'GET' as const,
      path: '/api/photos/featured' as const,
      responses: {
        200: z.array(z.custom<typeof safariPhotos.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/photos/:id' as const,
      responses: {
        200: z.custom<typeof safariPhotos.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/photos' as const,
      input: insertPhotoSchema,
      responses: {
        201: z.custom<typeof safariPhotos.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/photos/:id' as const,
      input: insertPhotoSchema.partial(),
      responses: {
        200: z.custom<typeof safariPhotos.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/photos/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },

  testimonials: {
    list: {
      method: 'GET' as const,
      path: '/api/testimonials' as const,
      responses: {
        200: z.array(z.custom<typeof testimonials.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/testimonials' as const,
      input: insertTestimonialSchema,
      responses: {
        201: z.custom<typeof testimonials.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/testimonials/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    }
  },

  bookings: {
    list: {
      method: 'GET' as const,
      path: '/api/bookings' as const,
      responses: {
        200: z.array(z.custom<typeof bookings.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/bookings/:id' as const,
      responses: {
        200: z.custom<typeof bookings.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/bookings' as const,
      input: insertBookingSchema,
      responses: {
        201: z.custom<typeof bookings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/bookings/:id/status' as const,
      input: z.object({ status: z.string() }),
      responses: {
        200: z.custom<typeof bookings.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    // ADDED: Delete booking endpoint
    delete: {
      method: 'DELETE' as const,
      path: '/api/bookings/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },

  contacts: {
    list: {
      method: 'GET' as const,
      path: '/api/contacts' as const,
      responses: {
        200: z.array(z.custom<typeof contacts.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/contacts' as const,
      input: insertContactSchema,
      responses: {
        201: z.custom<typeof contacts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    markRead: {
      method: 'PATCH' as const,
      path: '/api/contacts/:id/read' as const,
      responses: {
        200: z.custom<typeof contacts.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    // ADDED: Delete contact endpoint
    delete: {
      method: 'DELETE' as const,
      path: '/api/contacts/:id' as const,
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}