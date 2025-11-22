import { render, screen } from '@testing-library/react'
import LoadingState, {
  Spinner,
  CardSkeleton,
  PropertyCardSkeleton,
  PropertyGridSkeleton,
  PageLoading,
} from '../LoadingState'

describe('LoadingState', () => {
  it('should render with default message', () => {
    render(<LoadingState />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render with custom message', () => {
    render(<LoadingState message="Please wait..." />)
    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })

  it('should render without message when not provided', () => {
    const { container } = render(<LoadingState message="" />)
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })

  it('should render with different sizes', () => {
    const { rerender, container } = render(<LoadingState size="sm" />)
    let spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('h-4', 'w-4')

    rerender(<LoadingState size="md" />)
    spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('h-8', 'w-8')

    rerender(<LoadingState size="lg" />)
    spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('h-12', 'w-12')
  })

  it('should render fullscreen variant', () => {
    const { container } = render(<LoadingState fullScreen />)
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
  })

  it('should render inline variant by default', () => {
    const { container } = render(<LoadingState />)
    expect(container.querySelector('.min-h-screen')).not.toBeInTheDocument()
  })
})

describe('Spinner', () => {
  it('should render spinner with default size', () => {
    const { container } = render(<Spinner />)
    const spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('h-6', 'w-6')
  })

  it('should render spinner with different sizes', () => {
    const { container } = render(<Spinner size="lg" />)
    const spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('h-8', 'w-8')
  })

  it('should have animate-spin class', () => {
    const { container } = render(<Spinner />)
    const spinner = container.querySelector('svg')
    expect(spinner).toHaveClass('animate-spin')
  })
})

describe('CardSkeleton', () => {
  it('should render skeleton structure', () => {
    const { container } = render(<CardSkeleton />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})

describe('PropertyCardSkeleton', () => {
  it('should render property card skeleton structure', () => {
    const { container } = render(<PropertyCardSkeleton />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
  })
})

describe('PropertyGridSkeleton', () => {
  it('should render default number of skeletons', () => {
    const { container } = render(<PropertyGridSkeleton />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(6)
  })

  it('should render custom number of skeletons', () => {
    const { container } = render(<PropertyGridSkeleton count={3} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(3)
  })
})

describe('PageLoading', () => {
  it('should render page loading with default message', () => {
    render(<PageLoading />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render page loading with custom message', () => {
    render(<PageLoading message="Loading page..." />)
    expect(screen.getByText('Loading page...')).toBeInTheDocument()
  })

  it('should render fullscreen', () => {
    const { container } = render(<PageLoading />)
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
  })
})
