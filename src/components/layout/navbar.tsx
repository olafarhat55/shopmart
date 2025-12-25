"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  ShoppingCart,
  User,
  Heart,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "@/redux/store";
import { fetchCart } from "@/redux/slices/cartSlice";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { fetchWishList } from "@/redux/slices/wishListSlice";
import NProgress from "nprogress";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  // Cart Slice
  const cartCount = useSelector(
    (state: StoreType) => state.cart.cart.cart?.products?.length ?? 0
  );
  const cartLoading = useSelector(
    (state: StoreType) => state.cart.cart.firstFetching
  );

  // Wishlist Slice
  const wishlistCount = useSelector(
    (state: StoreType) => state.wishlist.wishList.products?.length ?? 0
  );
  const wishlistLoading = useSelector(
    (state: StoreType) => state.wishlist.wishList.firstFetching
  );

  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const pathname = usePathname();

  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishList());
    }
  }, [isAuthenticated]);

  const startLoader = (href: string) => {
    if (pathname !== href) {
      NProgress.start();
    }
  };

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/brands", label: "Brands" },
    { href: "/categories", label: "Categories" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`w-full transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-5xl rounded-2xl border border-border/40 bg-white/80 backdrop-blur-xl shadow-lg"
            : "max-w-7xl rounded-xl border-b border-border/40 bg-white/60 backdrop-blur-md"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                    className="hover:bg-accent rounded-xl"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-80">
                  <SheetHeader className="text-left">
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-2">
                        <span
                          className="text-2xl font-bold tracking-tight"
                          style={{ fontFamily: "var(--font-logo)" }}
                        >
                          ShopMart
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 px-4">
                    {/* Nav links */}
                    <div className="flex flex-col space-y-1">
                      {navLinks.map((link, i) => {
                        const active = pathname?.startsWith(link.href);
                        return (
                          <Link
                            key={i}
                            href={link.href}
                            onClick={() => startLoader(link.href)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                              active
                                ? "bg-accent/80 text-foreground shadow-sm"
                                : "text-foreground/80 hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <span
                              className={`inline-block h-2 w-2 rounded-full ${
                                active ? "bg-primary" : "bg-muted-foreground/60"
                              }`}
                            />
                            <span className="truncate">{link.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="my-4">
                      <Separator />
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-col gap-2">
                      {isAuthenticated && (
                        <>
                          <Link
                            href="/wishlist"
                            onClick={() => startLoader("/wishlist")}
                            className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Heart className="h-4 w-4" />
                              <span>Wishlist</span>
                            </div>
                            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                              {wishlistLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                wishlistCount
                              )}
                            </span>
                          </Link>

                          <Link
                            href="/cart"
                            onClick={() => startLoader("/cart")}
                            className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <ShoppingCart className="h-4 w-4" />
                              <span>Cart</span>
                            </div>
                            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                              {cartLoading ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                cartCount
                              )}
                            </span>
                          </Link>
                        </>
                      )}

                      {!isAuthenticated && (
                        <div className="flex gap-2">
                          <Link
                            href="/login"
                            onClick={() => startLoader("/login")}
                            className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground"
                          >
                            Login
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => startLoader("/register")}
                            className="flex-1 rounded-lg border border-border/40 px-3 py-2 text-center text-sm font-medium text-foreground/90 hover:bg-accent"
                          >
                            Register
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <span
                className="hidden sm:block text-xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-logo)" }}
              >
                ShopMart
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {navLinks.map((link, i) => (
                  <NavigationMenuItem key={i}>
                    <NavigationMenuLink asChild>
                      <Link
                        className="rounded-xl px-4 py-2 text-sm font-medium text-foreground/70 hover:bg-accent hover:text-foreground transition-colors"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Wishlist"
                asChild
                className="rounded-xl hover:bg-accent relative"
              >
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {wishlistLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      wishlistCount
                    )}
                  </span>
                </Link>
              </Button>
            )}

            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Cart"
                asChild
                className="rounded-xl hover:bg-accent relative"
              >
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {cartLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      cartCount
                    )}
                  </span>
                </Link>
              </Button>
            )}

            {/* Profile dropdown */}
            <div className="hidden sm:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Profile"
                    className="rounded-xl hover:bg-accent"
                  >
                    {isAuthenticated ? (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {(user?.name ?? "U").slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  {user ? (
                    <>
                      <div className="px-3 py-3 border-b border-border/40">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {(user?.name ?? "U").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">
                              {user?.name ?? "User"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <DropdownMenuItem asChild>
                          <Link href="/allorders">Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile">Settings</Link>
                        </DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem
                          onClick={() => {
                            logout();
                            router.push("/");
                          }}
                        >
                          Logout
                        </DropdownMenuItem>
                      </div>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/register">Register</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/login">Login</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
