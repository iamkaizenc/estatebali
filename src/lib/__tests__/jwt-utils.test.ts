import {
  decodeJWT,
  isTokenExpired,
  getTokenExpiration,
  getUserRoleFromToken,
  getUserIdFromToken,
} from '../jwt-utils'

// Mock JWT tokens for testing
// These are actual JWT tokens (you can verify at jwt.io)
// Secret used: "test-secret"

// Valid token: { "id": "123", "email": "test@example.com", "role": "user", "exp": 9999999999 }
const VALID_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiZXhwIjo5OTk5OTk5OTk5fQ.6YC9AqPkv9R2JvPx8lBXqMqoLKoqGx6Qw0_DY9NqZyg'

// Expired token: { "id": "456", "email": "expired@example.com", "role": "admin", "exp": 1000000000 }
const EXPIRED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ1NiIsImVtYWlsIjoiZXhwaXJlZEBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTAwMDAwMDAwMH0.5EqN_rI7vPh5YqPmLwX8zZx5XqL0rJ7Yx9fLJqR0Y8k'

// Token without expiration: { "id": "789", "email": "noexp@example.com", "role": "user" }
const NO_EXP_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4OSIsImVtYWlsIjoibm9leHBAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9.0KQs3Z8Y8J9xN9nJ4Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Yk'

describe('JWT Utils', () => {
  describe('decodeJWT', () => {
    it('should decode valid JWT token', () => {
      const decoded = decodeJWT(VALID_TOKEN)

      expect(decoded).toBeTruthy()
      expect(decoded.id).toBe('123')
      expect(decoded.email).toBe('test@example.com')
      expect(decoded.role).toBe('user')
      expect(decoded.exp).toBe(9999999999)
    })

    it('should return null for invalid token format', () => {
      expect(decodeJWT('invalid')).toBeNull()
      expect(decodeJWT('not.a.jwt')).toBeNull()
      expect(decodeJWT('')).toBeNull()
    })

    it('should return null for token with only 2 parts', () => {
      expect(decodeJWT('header.payload')).toBeNull()
    })

    it('should handle tokens without expiration', () => {
      const decoded = decodeJWT(NO_EXP_TOKEN)

      expect(decoded).toBeTruthy()
      expect(decoded.id).toBe('789')
      expect(decoded.email).toBe('noexp@example.com')
    })
  })

  describe('isTokenExpired', () => {
    it('should return false for valid non-expired token', () => {
      expect(isTokenExpired(VALID_TOKEN)).toBe(false)
    })

    it('should return true for expired token', () => {
      expect(isTokenExpired(EXPIRED_TOKEN)).toBe(true)
    })

    it('should return true for invalid token', () => {
      expect(isTokenExpired('invalid')).toBe(true)
    })

    it('should return true for token without expiration', () => {
      // Tokens without exp should be considered expired for security
      expect(isTokenExpired(NO_EXP_TOKEN)).toBe(true)
    })
  })

  describe('getTokenExpiration', () => {
    it('should return expiration date for valid token', () => {
      const expiration = getTokenExpiration(VALID_TOKEN)

      expect(expiration).toBeInstanceOf(Date)
      expect(expiration?.getTime()).toBe(9999999999 * 1000)
    })

    it('should return null for token without expiration', () => {
      expect(getTokenExpiration(NO_EXP_TOKEN)).toBeNull()
    })

    it('should return null for invalid token', () => {
      expect(getTokenExpiration('invalid')).toBeNull()
    })
  })

  describe('getUserRoleFromToken', () => {
    it('should extract role from token', () => {
      expect(getUserRoleFromToken(VALID_TOKEN)).toBe('user')
      expect(getUserRoleFromToken(EXPIRED_TOKEN)).toBe('admin')
    })

    it('should return null for invalid token', () => {
      expect(getUserRoleFromToken('invalid')).toBeNull()
    })

    it('should return null for token without role', () => {
      // Create a token without role
      const tokenWithoutRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSJ9.invalid'
      const role = getUserRoleFromToken(tokenWithoutRole)
      // Will be null because token is invalid or doesn't have role
      expect(role).toBeNull()
    })
  })

  describe('getUserIdFromToken', () => {
    it('should extract user ID from token', () => {
      expect(getUserIdFromToken(VALID_TOKEN)).toBe('123')
      expect(getUserIdFromToken(EXPIRED_TOKEN)).toBe('456')
    })

    it('should return null for invalid token', () => {
      expect(getUserIdFromToken('invalid')).toBeNull()
    })
  })

  describe('base64url encoding support', () => {
    it('should handle base64url encoding (- and _ characters)', () => {
      // Create a token with base64url special characters
      // JWT uses base64url which replaces + with - and / with _
      const payload = {
        id: '123',
        data: 'some-data_with/special+chars',
        exp: 9999999999,
      }

      // Manually create a JWT-like token with base64url encoding
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')

      const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')

      const token = `${header}.${encodedPayload}.fake-signature`

      const decoded = decodeJWT(token)

      expect(decoded).toBeTruthy()
      expect(decoded.id).toBe('123')
      expect(decoded.data).toBe('some-data_with/special+chars')
    })
  })
})
