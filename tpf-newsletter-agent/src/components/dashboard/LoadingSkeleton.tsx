import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <Skeleton className="h-10 w-48 mb-2 bg-white/5" />
        <Skeleton className="h-5 w-64 bg-white/5" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24 bg-white/5" />
              <Skeleton className="h-8 w-8 rounded-lg bg-white/5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Skeleton className="h-7 w-48 mb-4 bg-white/5" />
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-20 bg-white/5" />
                  <Skeleton className="h-4 w-16 bg-white/5" />
                </div>
                <Skeleton className="h-5 w-full mb-1 bg-white/5" />
                <Skeleton className="h-5 w-2/3 bg-white/5" />
                <Skeleton className="h-4 w-24 mt-2 bg-white/5" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-1 bg-white/5" />
                <Skeleton className="h-4 w-full mb-1 bg-white/5" />
                <Skeleton className="h-4 w-3/4 mb-4 bg-white/5" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16 bg-white/5" />
                  <Skeleton className="h-4 w-16 bg-white/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
