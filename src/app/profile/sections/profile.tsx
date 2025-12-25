"use client";

import React, { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Edit2 } from "lucide-react";
import { apiService } from "@/service/apiService";
import type { IUserData } from "@/interfaces";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

type Props = {
  user: IUserData | null;
  setUser: (u: IUserData | null) => void;
};

export default function ProfileSection({ user, setUser }: Props) {
  const auth = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "" },
  });

  React.useEffect(() => {
    if (!user) return;
    const parts = (user.name || "").trim().split(" ");
    form.reset({
      firstName: parts.slice(0, -1).join(" ") || parts[0] || "",
      lastName: parts.length > 1 ? parts[parts.length - 1] : "",
      email: user.email,
      phone: user.phone,
    });
  }, [user]); // eslint-disable-line

  const watched = form.watch();
  const canSave = useMemo(() => {
    if (!user) return false;
    const name = `${watched.firstName} ${watched.lastName ?? ""}`.trim();
    return (
      editing &&
      (name !== user.name || watched.email !== user.email || watched.phone !== user.phone)
    );
  }, [user, editing, watched.firstName, watched.lastName, watched.email, watched.phone]);


  const onSubmit = async (data: ProfileForm) => {
    if (!user) return;
    setSaving(true);
    try {
      const name = `${data.firstName} ${data.lastName ?? ""}`.trim();
      const payload: Partial<IUserData> = {};
      if (name && name !== user.name) payload.name = name;
      if (data.email !== user.email) payload.email = data.email;
      if ((data.phone ?? "") !== (user.phone ?? "")) payload.phone = data.phone;
      if (Object.keys(payload).length === 0) {
        setEditing(false);
        return;
      }

      const res = await apiService.updateUserInfo(payload);
      // console.log("ProfileSection update response:", res);
      const updated = res?.user ?? null;
      // console.log("Payload:", updated);
      if (updated) {
        const merged: IUserData = ({ ...(user ?? {}), ...(payload as Partial<IUserData>) } as IUserData);
        setUser(merged);
        toast.success("Profile updated successfully.", {
          description: "Please login again to show updates.",
          action: {
            label: "Login Again",
            onClick: () => {auth.logout(); router.push("/login"); },
          },
          duration: 4000,
        });
        try { await auth?.verify?.(); } catch {}
        const parts = ((updated.name as string) ?? name).trim().split(" ");
        form.reset({
          firstName: parts.slice(0, -1).join(" ") || parts[0] || "",
          lastName: parts.length > 1 ? parts[parts.length - 1] : "",
          email: (updated.email as string) ?? data.email,
          phone: (updated.phone as string) ?? data.phone,
        });
      }
      setEditing(false);
    } catch (err) {
      console.error("ProfileSection update failed:", err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  
  if(!auth.isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Profile</h3>
        <p className="text-sm text-muted-foreground">View & Update Your Personal and Contact Information</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="rounded-xl">
          <CardContent>
            <CardTitle className="mb-4">Contact Information</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First name</Label>
                <Input {...form.register("firstName")} disabled={!editing} className="rounded-lg mt-1" />
                {form.formState.errors.firstName && <div className="text-sm text-destructive mt-1">{form.formState.errors.firstName.message}</div>}
              </div>
              <div>
                <Label>Last name</Label>
                <Input {...form.register("lastName")} disabled={!editing} className="rounded-lg mt-1" />
              </div>
              <div>
                <Label>Email</Label>
                <Input {...form.register("email")} disabled={!editing} className="rounded-lg mt-1" />
                {form.formState.errors.email && <div className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</div>}
              </div>
              <div>
                <Label>Phone number</Label>
                <Input {...form.register("phone")} disabled={!editing} className="rounded-lg mt-1" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">This can be used to login across all apps.</div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            {!editing ? (
              <Button onClick={() => setEditing(true)}><Edit2 className="mr-2 h-4 w-4" /> Edit</Button>
            ) : (
              <>
                <Button type="submit" disabled={!canSave || saving}>{saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null} Update Profile</Button>
                <Button variant="ghost" onClick={() => {
                  setEditing(false);
                  if (user) {
                    const parts = user.name.split(" ");
                    form.reset({
                      firstName: parts.slice(0, -1).join(" ") || parts[0] || "",
                      lastName: parts.length > 1 ? parts[parts.length - 1] : "",
                      email: user.email,
                      phone: user.phone,
                    });
                  }
                }}>Cancel</Button>
              </>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}