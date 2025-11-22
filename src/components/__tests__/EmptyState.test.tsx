import { render, screen, fireEvent } from '@testing-library/react'
import EmptyState from '../EmptyState'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('EmptyState', () => {
  it('should render title and description', () => {
    render(
      <EmptyState
        title="No Properties Found"
        description="Try adjusting your search filters"
      />
    )

    expect(screen.getByText('No Properties Found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search filters')).toBeInTheDocument()
  })

  it('should render with default home icon', () => {
    const { container } = render(
      <EmptyState
        title="Empty"
        description="No data"
      />
    )

    // Check if icon is rendered (SVG element)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should render with custom icon', () => {
    render(
      <EmptyState
        icon="search"
        title="No Results"
        description="No search results"
      />
    )

    // Component should render without errors
    expect(screen.getByText('No Results')).toBeInTheDocument()
  })

  it('should render link action when actionHref is provided', () => {
    render(
      <EmptyState
        title="Empty"
        description="No data"
        actionLabel="Browse Properties"
        actionHref="/properties"
      />
    )

    const link = screen.getByRole('link', { name: 'Browse Properties' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/properties')
  })

  it('should render button action when onAction is provided', () => {
    const handleAction = jest.fn()

    render(
      <EmptyState
        title="Empty"
        description="No data"
        actionLabel="Try Again"
        onAction={handleAction}
      />
    )

    const button = screen.getByRole('button', { name: 'Try Again' })
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('should not render action when neither actionHref nor onAction is provided', () => {
    render(
      <EmptyState
        title="Empty"
        description="No data"
        actionLabel="Action"
      />
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should not render action when actionLabel is not provided', () => {
    render(
      <EmptyState
        title="Empty"
        description="No data"
        actionHref="/somewhere"
      />
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
