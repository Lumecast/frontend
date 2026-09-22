import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <div>
      <EmptyState title="Page not found" description="That page doesn't exist." />
      <p className="mt-6 text-center">
        <Link to="/" className="text-sm font-medium text-brand-600 hover:underline">
          Back to markets
        </Link>
      </p>
    </div>
  )
}