import { z } from 'zod';

// Property validation schemas
export const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255, "Title must be less than 255 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(5000, "Description must be less than 5000 characters"),
  type: z.enum(['villa', 'apartment', 'house', 'land']),
  listingType: z.enum(['sale', 'rent']),
  source: z.enum(['owner', 'agent']).optional(),
  price: z.number().int().positive("Price must be positive"),
  location: z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    area: z.string().min(2, "Area must be at least 2 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
  }),
  details: z.object({
    bedrooms: z.number().int().min(0).optional(),
    bathrooms: z.number().int().min(0).optional(),
    area: z.number().int().positive("Area must be positive"),
    furnished: z.boolean().optional(),
  }).optional(),
  features: z.record(z.string(), z.any()).optional(),
  images: z.array(z.string()).optional(),
  contact: z.object({
    name: z.string().min(2),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
  }).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
});

// User registration schema
export const registerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  phone: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    return val;
  }, z.string().optional()),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// User profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").optional(),
  phone: z.string().optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

// Property search/filter schema
export const propertyFilterSchema = z.object({
  listingType: z.enum(['sale', 'rent']).optional(),
  propertyType: z.array(z.enum(['villa', 'apartment', 'house', 'land'])).optional(),
  priceMin: z.number().int().min(0).optional(),
  priceMax: z.number().int().min(0).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  location: z.string().optional(),
  query: z.string().optional(),
  featured: z.boolean().optional(),
  userId: z.string().uuid().optional(),
});

// Validation helper function
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Get all errors and format them nicely
      const errors = error.issues && error.issues.length > 0 ? error.issues : [];
      
      if (errors.length > 0) {
        // Format error message with field name
        const errorMessages = errors.map((err: z.ZodIssue) => {
          const field = err.path && err.path.length > 0 ? err.path.join(".") : "";
          return field ? `${field}: ${err.message}` : err.message;
        });
        
        // Return first error or combined message if multiple
        const errorMessage = errorMessages.length === 1 
          ? errorMessages[0] 
          : `Validation errors: ${errorMessages.join(", ")}`;
        
        return { success: false, error: errorMessage };
      }
      
      return { success: false, error: "Validation failed" };
    }
    return { success: false, error: "Validation failed" };
  }
}

