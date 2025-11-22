import { renderHook, waitFor } from '@testing-library/react'
import { useProperties, useProperty } from '../useProperties'
import { mockProperty } from '@/__mocks__/data'

// Mock fetch
global.fetch = jest.fn()

describe('useProperties', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch properties successfully', async () => {
    const mockData = {
      success: true,
      data: [mockProperty],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    })

    const { result } = renderHook(() => useProperties())

    expect(result.current.loading).toBe(true)
    expect(result.current.properties).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.properties).toEqual([mockProperty])
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    const mockError = {
      success: false,
      error: 'Failed to fetch',
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockError,
    })

    const { result } = renderHook(() => useProperties())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to fetch')
    expect(result.current.properties).toEqual([])
  })

  it('should build query params correctly', async () => {
    const mockData = { success: true, data: [] }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    })

    const options = {
      listingType: 'sale' as const,
      featured: true,
      location: 'Seminyak',
      priceMin: 100000000,
      priceMax: 1000000000,
      bedrooms: 3,
      bathrooms: 2,
    }

    renderHook(() => useProperties(options))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0][0]
    expect(fetchCall).toContain('listingType=sale')
    expect(fetchCall).toContain('featured=true')
    expect(fetchCall).toContain('area=Seminyak')
    expect(fetchCall).toContain('priceMin=100000000')
    expect(fetchCall).toContain('priceMax=1000000000')
    expect(fetchCall).toContain('bedrooms=3')
    expect(fetchCall).toContain('bathrooms=2')
  })

  it('should handle network error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    )

    const { result } = renderHook(() => useProperties())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Network error')
    expect(result.current.properties).toEqual([])
  })

  it('should provide refetch function', async () => {
    const mockData = { success: true, data: [mockProperty] }
    ;(global.fetch as jest.Mock).mockResolvedValue({
      json: async () => mockData,
    })

    const { result } = renderHook(() => useProperties())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)

    // Call refetch
    result.current.refetch()

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })
})

describe('useProperty', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch single property successfully', async () => {
    const mockData = {
      success: true,
      data: mockProperty,
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    })

    const { result } = renderHook(() => useProperty(mockProperty.id))

    expect(result.current.loading).toBe(true)
    expect(result.current.property).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.property).toEqual(mockProperty)
    expect(result.current.error).toBeNull()
  })

  it('should handle property not found', async () => {
    const mockError = {
      success: false,
      error: 'Property not found',
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockError,
    })

    const { result } = renderHook(() => useProperty('invalid-id'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Property not found')
    expect(result.current.property).toBeNull()
  })

  it('should not fetch if id is empty', async () => {
    renderHook(() => useProperty(''))

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should fetch with correct endpoint', async () => {
    const mockData = { success: true, data: mockProperty }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockData,
    })

    renderHook(() => useProperty(mockProperty.id))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/properties/${mockProperty.id}`
      )
    })
  })
})
