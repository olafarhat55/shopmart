export default function Loading() {
  return (
    <div className="mt-22 min-h-screen bg-gradient-to-b from-background via-accent/6 to-background pt-20 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: gallery + meta */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Main image */}
            <div className="rounded-3xl overflow-hidden relative bg-muted/60 animate-pulse">
              <div
                className="relative w-full bg-muted/60"
                style={{ aspectRatio: "4 / 3", maxHeight: "70vh" }}
              >
                <div className="absolute inset-0 bg-muted/60" />
              </div>
            </div>

            {/* Thumbnails (use product-card style tokens) */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-border/40 bg-muted/60 animate-pulse"
                />
              ))}
            </div>

            {/* Meta panels */}
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/40 p-4 bg-background"
                >
                  <div className="h-4 w-32 bg-muted rounded mb-3" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-border/40 p-6 bg-background">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-1">
                  <div className="h-6 w-48 bg-muted rounded mb-4 animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                    <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-4/6 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                  </div>
                </div>

                <div className="w-48 hidden md:block">
                  <div className="h-4 w-24 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: sticky buy box skeleton */}
          <aside className="sticky top-24 self-start rounded-2xl border border-border/40 p-6 bg-background shadow-sm">
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Price</div>

                {/* price line: integer + fraction + currency (aligned like product-card design) */}
                <div className="flex items-end gap-3">
                  <div className="h-10 w-28 bg-muted rounded animate-pulse" />
                  <div className="flex items-end gap-1">
                    <div className="h-4 w-10 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-8 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div className="text-sm text-muted-foreground mb-2">Availability</div>
                <div className="h-4 w-36 bg-muted rounded animate-pulse" />
              </div>

              <div className="mt-4">
                <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
                <div className="mt-3 h-9 w-full rounded-md bg-muted animate-pulse" />
              </div>

              <div className="pt-2 border-t border-border/40">
                <div className="text-xs text-muted-foreground mb-2">Shipping</div>
                <div className="h-3 w-full bg-muted rounded animate-pulse" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}