import {
  propertySchema,
  registerSchema,
  loginSchema,
  passwordResetSchema,
  forgotPasswordSchema,
  profileUpdateSchema,
  propertyFilterSchema,
  validateData,
} from '../validation'

describe('Validation Schemas', () => {
  describe('propertySchema', () => {
    const validProperty = {
      title: 'Beautiful Villa',
      description: 'A stunning 3-bedroom villa with pool in Seminyak',
      type: 'villa',
      listingType: 'sale',
      price: 500000000,
      location: {
        address: 'Jl. Sunset Road No. 123',
        area: 'Seminyak',
        city: 'Bali',
      },
      details: {
        bedrooms: 3,
        bathrooms: 2,
        area: 250,
      },
    }

    it('should validate a valid property', () => {
      const result = propertySchema.safeParse(validProperty)
      expect(result.success).toBe(true)
    })

    it('should reject property with short title', () => {
      const invalid = { ...validProperty, title: 'AB' }
      const result = propertySchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject property with invalid type', () => {
      const invalid = { ...validProperty, type: 'castle' }
      const result = propertySchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject property with negative price', () => {
      const invalid = { ...validProperty, price: -100 }
      const result = propertySchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject property with invalid email in contact', () => {
      const invalid = {
        ...validProperty,
        contact: {
          name: 'John',
          email: 'invalid-email',
        },
      }
      const result = propertySchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    const validRegistration = {
      email: 'test@example.com',
      password: 'SecurePass123',
      name: 'John Doe',
    }

    it('should validate valid registration data', () => {
      const result = registerSchema.safeParse(validRegistration)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalid = { ...validRegistration, email: 'not-an-email' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject weak password (too short)', () => {
      const invalid = { ...validRegistration, password: 'Pass1' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject password without lowercase', () => {
      const invalid = { ...validRegistration, password: 'PASSWORD123' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject password without uppercase', () => {
      const invalid = { ...validRegistration, password: 'password123' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject password without number', () => {
      const invalid = { ...validRegistration, password: 'PasswordOnly' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject short name', () => {
      const invalid = { ...validRegistration, name: 'J' }
      const result = registerSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should accept optional phone', () => {
      const withPhone = { ...validRegistration, phone: '+306989273327' }
      const result = registerSchema.safeParse(withPhone)
      expect(result.success).toBe(true)
    })
  })

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      }
      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = {
        email: 'not-an-email',
        password: 'password123',
      }
      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject empty password', () => {
      const data = {
        email: 'test@example.com',
        password: '',
      }
      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('passwordResetSchema', () => {
    const validReset = {
      token: 'reset-token-123',
      password: 'NewSecurePass123',
    }

    it('should validate valid password reset', () => {
      const result = passwordResetSchema.safeParse(validReset)
      expect(result.success).toBe(true)
    })

    it('should reject weak password', () => {
      const invalid = { ...validReset, password: 'weak' }
      const result = passwordResetSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })

    it('should reject empty token', () => {
      const invalid = { ...validReset, token: '' }
      const result = passwordResetSchema.safeParse(invalid)
      expect(result.success).toBe(false)
    })
  })

  describe('forgotPasswordSchema', () => {
    it('should validate valid email', () => {
      const data = { email: 'test@example.com' }
      const result = forgotPasswordSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = { email: 'invalid' }
      const result = forgotPasswordSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('profileUpdateSchema', () => {
    it('should validate valid profile update', () => {
      const data = {
        name: 'John Doe',
        phone: '+306989273327',
        avatar: 'https://example.com/avatar.jpg',
      }
      const result = profileUpdateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept partial updates', () => {
      const data = { name: 'John Doe' }
      const result = profileUpdateSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid avatar URL', () => {
      const data = { avatar: 'not-a-url' }
      const result = profileUpdateSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject short name', () => {
      const data = { name: 'J' }
      const result = profileUpdateSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('propertyFilterSchema', () => {
    it('should validate valid filters', () => {
      const data = {
        listingType: 'sale',
        propertyType: ['villa', 'apartment'],
        priceMin: 100000000,
        priceMax: 1000000000,
        bedrooms: 3,
        location: 'Seminyak',
      }
      const result = propertyFilterSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should accept empty filters', () => {
      const data = {}
      const result = propertyFilterSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject negative price', () => {
      const data = { priceMin: -100 }
      const result = propertyFilterSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('validateData helper', () => {
    it('should return success for valid data', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      }
      const result = validateData(loginSchema, data)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(data)
      }
    })

    it('should return error for invalid data', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      }
      const result = validateData(loginSchema, data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('email')
      }
    })

    it('should format multiple errors', () => {
      const data = {
        email: 'invalid',
        password: '',
      }
      const result = validateData(loginSchema, data)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeTruthy()
      }
    })
  })
})
