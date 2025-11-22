# Testing Documentation

## Overview

This project uses **Jest** and **React Testing Library** for comprehensive testing coverage.

## Test Infrastructure

### Testing Stack
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM
- **@testing-library/user-event** - User interaction simulation

### Configuration Files
- `jest.config.js` - Jest configuration with Next.js integration
- `jest.setup.js` - Test environment setup and global mocks

## Running Tests

### Available Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests in CI environment
npm run test:ci
```

## Test Structure

### Directory Organization

```
src/
├── __mocks__/              # Global mock utilities
│   ├── supabase.ts        # Supabase client mock
│   ├── next-navigation.ts # Next.js navigation mocks
│   └── data.ts            # Mock data (properties, users, etc.)
├── lib/__tests__/         # Utility function tests
│   ├── sanitization.test.ts
│   └── validation.test.ts
├── components/__tests__/  # Component tests
│   ├── LoadingState.test.tsx
│   ├── EmptyState.test.tsx
│   └── SearchBar.test.tsx
├── hooks/__tests__/       # Custom hook tests
│   └── useProperties.test.ts
└── app/api/__tests__/     # API route tests
    └── auth.test.ts
```

## Current Test Coverage

### Summary (as of implementation)

- **Test Suites**: 7 passed
- **Tests**: 100 passed
- **Coverage Areas**:
  - ✅ **Sanitization utilities** - 100% coverage
  - ✅ **Validation schemas** - 93.75% coverage
  - ✅ **Custom hooks** - 87.5% coverage
  - ✅ **Loading components** - 100% coverage
  - ✅ **Empty state component** - 100% coverage

### Coverage Goals

The project aims for the following coverage thresholds:
- **Statements**: 50%
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%

Current overall coverage is ~6% due to many untested files. Priority should be given to testing:
1. API routes
2. Complex components (PropertyCard, SearchBar, etc.)
3. Authentication context
4. Protected route components

## Test Examples

### Unit Test Example (Utility Functions)

```typescript
// src/lib/__tests__/sanitization.test.ts
import { sanitizeString } from '../sanitization'

describe('sanitizeString', () => {
  it('should remove script tags', () => {
    const input = 'Hello <script>alert("XSS")</script> World'
    const output = sanitizeString(input)
    expect(output).toBe('Hello  World')
    expect(output).not.toContain('script')
  })
})
```

### Component Test Example

```typescript
// src/components/__tests__/LoadingState.test.tsx
import { render, screen } from '@testing-library/react'
import LoadingState from '../LoadingState'

describe('LoadingState', () => {
  it('should render with custom message', () => {
    render(<LoadingState message="Please wait..." />)
    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })
})
```

### Hook Test Example

```typescript
// src/hooks/__tests__/useProperties.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useProperties } from '../useProperties'

describe('useProperties', () => {
  it('should fetch properties successfully', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: async () => ({ success: true, data: [mockProperty] }),
    })

    const { result } = renderHook(() => useProperties())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.properties).toEqual([mockProperty])
  })
})
```

## Mocking Strategies

### Supabase Client Mock

```typescript
// src/__mocks__/supabase.ts
export const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  // ... more methods
}
```

### Next.js Navigation Mock

```typescript
// src/__mocks__/next-navigation.ts
export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  pathname: '/',
}))
```

### Mock Data

```typescript
// src/__mocks__/data.ts
export const mockProperty = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Beautiful Villa in Seminyak',
  // ... full property object
}
```

## Best Practices

### 1. Test Organization
- Group related tests with `describe()` blocks
- Use clear, descriptive test names
- One assertion per test when possible

### 2. Mock Management
- Clear mocks between tests with `beforeEach(() => jest.clearAllMocks())`
- Mock only what's necessary for the test
- Use realistic mock data

### 3. Async Testing
- Always use `waitFor()` for async operations
- Test loading and error states
- Verify data updates correctly

### 4. Component Testing
- Test user interactions with `fireEvent` or `userEvent`
- Test accessibility (screen readers, keyboard navigation)
- Test different prop combinations

### 5. Coverage Guidelines
- Don't aim for 100% coverage - focus on critical paths
- Test edge cases and error handling
- Test business logic thoroughly
- UI components: test behavior, not implementation

## Expanding Test Coverage

### Priority Areas to Test

1. **API Routes** (High Priority)
   - Authentication endpoints
   - Property CRUD operations
   - Authorization checks
   - Rate limiting

2. **Components** (Medium Priority)
   - PropertyCard
   - SearchBar
   - Header
   - BookingForm
   - InvestmentLeadForm

3. **Context & State** (High Priority)
   - AuthContext
   - Protected routes

4. **Integration Tests** (Future)
   - Full user flows
   - End-to-end scenarios

### API Route Testing Template

```typescript
// Example structure for API route tests
describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    // Mock Supabase response
    // Mock bcrypt.compare
    // Call route handler
    // Assert JWT token returned
  })

  it('should reject invalid credentials', async () => {
    // Mock failed authentication
    // Assert error response
  })

  it('should enforce rate limiting', async () => {
    // Make multiple requests
    // Assert rate limit error
  })
})
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Check path aliases in `tsconfig.json` and `jest.config.js`
   - Ensure `moduleNameMapper` is correctly configured

2. **"act(...)" warnings**
   - Wrap state updates in `await waitFor()`
   - Use `renderHook` for testing hooks

3. **Timeout errors**
   - Increase Jest timeout for slow tests
   - Check for unresolved promises

4. **Mock not working**
   - Ensure mock is created before import
   - Use `jest.mock()` at the top of test file
   - Clear mocks between tests

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing](https://nextjs.org/docs/testing)

## Contributing

When adding new features:
1. Write tests alongside your code
2. Ensure existing tests still pass
3. Add new test cases for edge cases
4. Update this documentation if needed
5. Aim to maintain or improve coverage percentage

---

**Last Updated**: 2025-01-22
