"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, User, Settings, MapPin, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { apiService } from "@/service/apiService";

import ProfileSection from "./sections/profile";
import SecuritySection from "./sections/security";
import AddressesSection from "./sections/address";
import type { IUserData } from "@/interfaces";
import type { IShippingAddress } from "@/interfaces";

export default function ProfilePage() {
  const auth = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "addresses"
  >("profile");

  const [user, setUser] = useState<IUserData | null>(null);
  const [addresses, setAddresses] = useState<IShippingAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    
    let mounted = true;
    if(!auth.isAuthenticated) {
      router.push("/login");
    }

    const handleFetchUser = async (userId?: string) => {
      if (!userId) return null;
      try {
        const response = await apiService.getUserInfo(userId);
        if (!mounted) return null;
        if (response?.data) {
          setUser(response.data as IUserData);
          return response.data as IUserData;
        }
      } catch (err) {
        console.error("handleFetchUser error:", err);
      }
      return null;
    };

    const handleFetchAddresses = async () => {
      try {
        const response = await apiService.getAddresses();
        if (!mounted) return null;
        if (response?.data) {
          setAddresses(response.data as IShippingAddress[]);
          return response.data as IShippingAddress[];
        }
      } catch (err) {
        console.error("handleFetchAddresses error:", err);
      }
      return null;
    };

    const load = async () => {
      setLoading(true);
      try {
        if (auth?.user?.id) {
          await handleFetchUser(auth.user.id);
        }
        await handleFetchAddresses();
      } catch (err) {
        console.error("ProfilePage load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    
    load();


    return () => {
      mounted = false;
    };
  }, [auth?.user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 container mx-auto max-w-6xl  mt-22">
        <div className="grid md:grid-cols-3 gap-6">
          {/* SIDEBAR SKELETON */}
          <aside className="md:col-span-1">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-muted/30 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/30 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-muted/20 rounded w-1/2 animate-pulse" />
                </div>
                <div className="w-8 h-8 rounded bg-muted/20 animate-pulse" />
              </div>

              <div className="mt-4 space-y-3">
                <div className="h-3 bg-muted/20 rounded w-full animate-pulse" />
                <div className="h-3 bg-muted/20 rounded w-5/6 animate-pulse" />
                <div className="h-3 bg-muted/20 rounded w-4/6 animate-pulse" />
              </div>
            </div>
          </aside>

          {/* MAIN SKELETON */}
          <main className="md:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="h-6 w-1/3 bg-muted/20 rounded animate-pulse" />

              <div className="grid grid-cols-1 gap-6">
                <div className="p-4 rounded-2xl border bg-muted/10 animate-pulse h-44" />
                <div className="p-4 rounded-2xl border bg-muted/10 animate-pulse h-44" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-muted/5 container mx-auto max-w-6xl mt-22">
      <div className="grid md:grid-cols-3 gap-6">
        <aside className="md:col-span-1 md:sticky md:top-24 self-start">
          <Card className="p-0">
            <CardContent className="space-y-4 mt-4 md:h-[calc(100vh-170px)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("") ??
                    auth?.user?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")}
                </div>

                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    {user?.name ?? auth?.user?.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user?.email ?? ""}
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setActiveTab("profile");
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-sm">
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="font-medium">{user?.phone}</div>
              </div>

              <div>
                <div className="pt-4 border-t -mx-4 px-4 flex flex-col justify-between h-full">
                  <nav className="flex flex-col gap-2">
                    <button
                      className={`flex items-center gap-3 text-left px-3 py-2 rounded ${
                        activeTab === "profile"
                          ? "bg-primary/5 font-medium"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="h-4 w-4" /> Profile
                    </button>

                    <button
                      className={`flex items-center gap-3 text-left px-3 py-2 rounded ${
                        activeTab === "security"
                          ? "bg-primary/5 font-medium"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setActiveTab("security")}
                    >
                      <Settings className="h-4 w-4" /> Security
                    </button>

                    <button
                      className={`flex items-center gap-3 text-left px-3 py-2 rounded ${
                        activeTab === "addresses"
                          ? "bg-primary/5 font-medium"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setActiveTab("addresses")}
                    >
                      <MapPin className="h-4 w-4" /> Addresses
                    </button>
                  </nav>

                  <div className="py-4 mt-4 border-t -mx-4 px-4 flex flex-col gap-2">
                    <button
                      className={`flex items-center gap-3 text-left px-3 py-2 rounded hover:bg-muted/50`}
                      onClick={async () => {
                        await auth.logout();
                        router.push("/");
                      }}
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="md:col-span-2 space-y-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeTab === "profile" && (
              <ProfileSection
                user={user}
                setUser={setUser}
              />
            )}
            {activeTab === "security" && <SecuritySection />}
            {activeTab === "addresses" && (
              <AddressesSection
                addresses={addresses}
                setAddresses={setAddresses}
              />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
