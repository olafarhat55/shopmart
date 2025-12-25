"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { apiService } from "@/service/apiService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmNew: z.string().min(1, "Confirm new password"),
  })
  .refine((d) => d.newPassword === d.confirmNew, { path: ["confirmNew"], message: "Passwords do not match" });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function SecuritySection() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNew: "" },
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    setStatus(null);
    setLoading(true);
    try {
      const payload = { currentPassword: data.currentPassword, password: data.newPassword, rePassword: data.confirmNew };
      const res = await apiService.changeUserPassword(payload);
      if (res?.message === "success") {
        confirm("hello");
        toast.info("Password updated successfully. Please login again.");
        try { await auth.logout(); } catch {}
        router.push("/login");
        return;
      }
      setStatus(res?.errors?.msg ?? res?.message ?? "Failed to update password");
    } catch (err) {
      console.error("SecuritySection change password", err);
      setStatus("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold">Security</h3>
        <p className="text-sm text-muted-foreground">Change your password to keep your account secure.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="rounded-xl">
          <CardContent>
            <CardTitle className="mb-4">Change Password</CardTitle>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Current password</Label>
                <div className="relative mt-1">
                  <Input type={showCurrent ? "text" : "password"} {...form.register("currentPassword")} />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1" onClick={() => setShowCurrent((s) => !s)} aria-label="toggle current password">
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.currentPassword && <div className="text-sm text-destructive mt-1">{form.formState.errors.currentPassword.message}</div>}
              </div>

              <div>
                <Label>New password</Label>
                <div className="relative mt-1">
                  <Input type={showNew ? "text" : "password"} {...form.register("newPassword")} />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1" onClick={() => setShowNew((s) => !s)} aria-label="toggle new password">
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.newPassword && <div className="text-sm text-destructive mt-1">{form.formState.errors.newPassword.message}</div>}
              </div>

              <div>
                <Label>Confirm new password</Label>
                <div className="relative mt-1">
                  <Input type={showConfirm ? "text" : "password"} {...form.register("confirmNew")} />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1" onClick={() => setShowConfirm((s) => !s)} aria-label="toggle confirm password">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.confirmNew && <div className="text-sm text-destructive mt-1">{form.formState.errors.confirmNew.message}</div>}
              </div>
            </div>

            {status && <div className={`text-sm mt-3 ${status === "Password updated" ? "text-success" : "text-destructive"}`}>{status}</div>}
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button type="submit" disabled={loading}>{loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null} Update password</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
} 