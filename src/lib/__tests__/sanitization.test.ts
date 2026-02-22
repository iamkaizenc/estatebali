import {
  sanitizeString,
  sanitizeHTML,
  escapeHTML,
  sanitizeObject,
  sanitizeEmail,
  sanitizeURL,
  sanitizePhone,
  sanitizeNumber,
  sanitizePropertyData,
} from '../sanitization'

describe('Sanitization Utilities', () => {
  describe('sanitizeString', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("XSS")</script> World'
      const output = sanitizeString(input)
      expect(output).toBe('Hello  World')
      expect(output).not.toContain('script')
    })

    it('should remove event handlers', () => {
      const input = '<div onclick="alert(1)">Click me</div>'
      const output = sanitizeString(input)
      expect(output).not.toContain('onclick')
    })

    it('should remove javascript: protocol', () => {
      const input = '<a href="javascript:alert(1)">Link</a>'
      const output = sanitizeString(input)
      expect(output).not.toContain('javascript:')
    })

    it('should remove data: protocol', () => {
      const input = '<img src="data:text/html,<script>alert(1)</script>">'
      const output = sanitizeString(input)
      expect(output).not.toContain('data:')
    })

    it('should remove iframe tags', () => {
      const input = 'Text <iframe src="evil.com"></iframe> More text'
      const output = sanitizeString(input)
      expect(output).toBe('Text  More text')
      expect(output).not.toContain('iframe')
    })

    it('should handle empty or null input', () => {
      expect(sanitizeString('')).toBe('')
      expect(sanitizeString(null as any)).toBe('')
      expect(sanitizeString(undefined as any)).toBe('')
    })

    it('should trim whitespace', () => {
      const input = '  Hello World  '
      const output = sanitizeString(input)
      expect(output).toBe('Hello World')
    })
  })

  describe('sanitizeHTML', () => {
    it('should remove dangerous tags while keeping safe content', () => {
      const input = '<p>Hello <strong>World</strong></p>'
      const output = sanitizeHTML(input)
      // The current implementation removes HTML tags but keeps content
      expect(output).toContain('Hello')
      expect(output).toContain('World')
    })

    it('should remove script tags from HTML', () => {
      const input = '<p>Hello</p><script>alert(1)</script>'
      const output = sanitizeHTML(input)
      expect(output).not.toContain('script')
      expect(output).not.toContain('alert')
    })

    it('should handle empty input', () => {
      expect(sanitizeHTML('')).toBe('')
    })
  })

  describe('escapeHTML', () => {
    it('should escape HTML entities', () => {
      const input = '<div>Test & "quotes" \'apostrophes\'</div>'
      const output = escapeHTML(input)
      expect(output).toContain('&lt;')
      expect(output).toContain('&gt;')
      expect(output).toContain('&amp;')
      expect(output).toContain('&quot;')
      expect(output).toContain('&#x27;')
    })

    it('should handle empty input', () => {
      expect(escapeHTML('')).toBe('')
    })
  })

  describe('sanitizeObject', () => {
    it('should sanitize all string values in object', () => {
      const input = {
        name: 'John <script>alert(1)</script>',
        email: 'test@example.com',
        nested: {
          value: '<iframe src="evil.com"></iframe>',
        },
      }
      const output = sanitizeObject(input)
      expect(output.name).not.toContain('script')
      expect(output.email).toBe('test@example.com')
      expect(output.nested.value).not.toContain('iframe')
    })

    it('should sanitize arrays of strings', () => {
      const input = {
        tags: ['<script>alert(1)</script>', 'safe tag'],
      }
      const output = sanitizeObject(input)
      expect(output.tags[0]).not.toContain('script')
      expect(output.tags[1]).toBe('safe tag')
    })
  })

  describe('sanitizeEmail', () => {
    it('should return valid email in lowercase', () => {
      const input = '  Test@Example.COM  '
      const output = sanitizeEmail(input)
      expect(output).toBe('test@example.com')
    })

    it('should return empty string for invalid email', () => {
      expect(sanitizeEmail('invalid-email')).toBe('')
      expect(sanitizeEmail('no@domain')).toBe('')
      expect(sanitizeEmail('@nodomain.com')).toBe('')
    })

    it('should handle empty input', () => {
      expect(sanitizeEmail('')).toBe('')
      expect(sanitizeEmail(null as any)).toBe('')
    })
  })

  describe('sanitizeURL', () => {
    it('should return valid HTTP/HTTPS URLs', () => {
      expect(sanitizeURL('http://example.com')).toBe('http://example.com/')
      expect(sanitizeURL('https://example.com')).toBe('https://example.com/')
    })

    it('should reject non-HTTP protocols', () => {
      expect(sanitizeURL('javascript:alert(1)')).toBe('')
      expect(sanitizeURL('data:text/html,<script>alert(1)</script>')).toBe('')
      expect(sanitizeURL('file:///etc/passwd')).toBe('')
    })

    it('should handle invalid URLs', () => {
      expect(sanitizeURL('not a url')).toBe('')
      expect(sanitizeURL('')).toBe('')
    })
  })

  describe('sanitizePhone', () => {
    it('should keep only valid phone characters', () => {
      const input = '+62-812-3456-7890'
      const output = sanitizePhone(input)
      expect(output).toBe('+62-812-3456-7890')
    })

    it('should remove invalid characters', () => {
      const input = '+30<script>alert(1)</script>6989273327'
      const output = sanitizePhone(input)
      expect(output).not.toContain('script')
      expect(output).toMatch(/^\+?[0-9\-\s()]+$/)
    })

    it('should handle empty input', () => {
      expect(sanitizePhone('')).toBe('')
    })
  })

  describe('sanitizeNumber', () => {
    it('should parse valid numbers', () => {
      expect(sanitizeNumber('123')).toBe(123)
      expect(sanitizeNumber('123.45')).toBe(123.45)
      expect(sanitizeNumber(456)).toBe(456)
    })

    it('should return null for invalid numbers', () => {
      expect(sanitizeNumber('not a number')).toBeNull()
      expect(sanitizeNumber(NaN)).toBeNull()
      expect(sanitizeNumber(Infinity)).toBeNull()
    })

    it('should handle null/undefined', () => {
      expect(sanitizeNumber(null)).toBeNull()
      expect(sanitizeNumber(undefined)).toBeNull()
    })
  })

  describe('sanitizePropertyData', () => {
    it('should sanitize property fields correctly', () => {
      const input = {
        title: 'Villa <script>alert(1)</script>',
        description: '<p>Beautiful villa</p><script>evil()</script>',
        contactEmail: '  CONTACT@EXAMPLE.COM  ',
        contactPhone: '+62-812-ABCD-3456',
      }

      const output = sanitizePropertyData(input)

      expect(output.title).not.toContain('script')
      expect(output.description).toContain('Beautiful villa')
      expect(output.description).not.toContain('<script>')
      expect(output.contactEmail).toBe('contact@example.com')
      expect(output.contactPhone).not.toContain('ABCD')
    })

    it('should handle optional fields', () => {
      const input = {
        title: 'Villa',
        description: 'Beautiful villa',
      }

      const output = sanitizePropertyData(input)

      expect(output.title).toBe('Villa')
      expect(output.description).toBe('Beautiful villa')
      expect(output.address).toBeUndefined()
      expect(output.contactEmail).toBeUndefined()
    })
  })
})
