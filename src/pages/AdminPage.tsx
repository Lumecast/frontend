import { EmptyState } from '@/components/ui/EmptyState'

export function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Market creation and resolution — gated to allowlisted resolvers (M4).
      </p>
      <div className="mt-8">
        <EmptyState
          title="Admin panel locked"
          description="This area is role-gated. Connect an allowlisted wallet to access market creation and resolution tooling."
        />
      </div>
    </div>
  )
}