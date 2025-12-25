import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, ShoppingBag } from "lucide-react";
import NProgress from "nprogress";

export default function NotFound() {
  NProgress.done();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black text-primary/10 leading-none select-none">
            404
          </h1>
        </div>

        {/* Title & Description */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          {`Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.`}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground mb-4">
            Or try these popular pages:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button asChild variant="ghost" size="sm">
              <Link href="/categories">Categories</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/brands">Brands</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/deals">Deals</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/cart">Cart</Link>
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 rounded-xl bg-accent/50 backdrop-blur-sm border border-border/40">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our{" "}
            <Link
              href="/support"
              className="text-primary hover:underline font-medium"
            >
              support team
            </Link>{" "}
            or check our{" "}
            <Link
              href="/faq"
              className="text-primary hover:underline font-medium"
            >
              FAQ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
