export default function Loading() {
  return (
    <div className="container py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight gradient-text">Loading...</h1>
          <p className="mt-4 text-muted-foreground">Retrieving your token information</p>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
