/**
 * Mock Next.js navigation hooks for testing
 */

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
  route: '/',
}))

export const usePathname = jest.fn(() => '/')

export const useSearchParams = jest.fn(() => ({
  get: jest.fn(),
  getAll: jest.fn(),
  has: jest.fn(),
  keys: jest.fn(),
  values: jest.fn(),
  entries: jest.fn(),
  forEach: jest.fn(),
  toString: jest.fn(() => ''),
}))

export const useParams = jest.fn(() => ({}))

export const redirect = jest.fn()
export const notFound = jest.fn()
