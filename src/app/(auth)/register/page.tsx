"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { registerSchema } from "@/schemas/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IProcessResponse, IRegister } from "@/interfaces";
import { useForm } from "react-hook-form";
import PasswordStrength from "@/components/utils/passwordStrength";

export default function Register() {
  const router = useRouter();
  const { register: authRegister } = useAuth();
  const {
    register: rhfRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRegister>({
    mode: "onSubmit",
    resolver: zodResolver(registerSchema),
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [serverError, setServerError] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);


  const password = watch("password", "");
  const rePassword = watch("rePassword", "");
  const email = watch("email", "");

  const handleRegister = async (data: IRegister) => {
    setSubmitting(true);
    setServerError(null);
    try {
      const response: IProcessResponse = await authRegister(data);
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 700);
      } else {
        setServerError(response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setServerError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const el = document.getElementById("name") as HTMLInputElement | null;
    el?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <motion.form
        onSubmit={handleSubmit(handleRegister)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="w-full max-w-lg space-y-6 p-6 rounded-2xl shadow-lg ring-1 bg-primary/1  ring-secondary"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">Create your account</h2>
          </div>

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={success ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="flex items-center gap-2"
            aria-hidden
          >
            {submitting ? <Loader2 className="animate-spin h-5 w-5 text-primary" /> : success ? <CheckCircle className="h-6 w-6 text-emerald-500" /> : null}
          </motion.div>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Ola.." className="mt-1" {...rhfRegister("name")} />
          {errors.name?.message && (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-4 w-4" /> <span>{String(errors.name.message)}</span>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" className="mt-1" {...rhfRegister("email")} />
          {errors.email?.message ? (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-4 w-4" /> <span>{String(errors.email.message)}</span>
            </div>
          ) : (
            email && <div className="mt-1 text-xs text-muted-foreground">Looks good</div>
          )}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" className="pr-10" {...rhfRegister("password")} />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <PasswordStrength password={password} />

          {errors.password?.message && (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-4 w-4" /> <span>{String(errors.password.message)}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="rePassword">Confirm password</Label>
          <div className="relative mt-1">
            <Input id="rePassword" type={showRePassword ? "text" : "password"} placeholder="Repeat password" className="pr-10" {...rhfRegister("rePassword")} />
            <button type="button" onClick={() => setShowRePassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Toggle confirm password visibility">
              {showRePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {errors.rePassword?.message ? (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-4 w-4" /> <span>{String(errors.rePassword.message)}</span>
            </div>
          ) : rePassword && password === rePassword ? (
            <div className="mt-1 flex items-center gap-2 text-xs text-emerald-600">
              <CheckCircle className="h-4 w-4" /> Passwords match
            </div>
          ) : null}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="01010101010" className="mt-1" {...rhfRegister("phone")} />
          {errors.phone?.message && (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-4 w-4" /> <span>{String(errors.phone.message)}</span>
            </div>
          )}
        </div>

        {serverError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700 flex items-start gap-2">
            <AlertCircle className="h-5 w-5" />
            <div>{serverError}</div>
          </motion.div>
        )}

        <div className="flex items-center justify-between gap-3">
          <Button type="submit" disabled={submitting || success} className="flex items-center gap-2">
            {submitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Creating...
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Created
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <Button type="button" variant="ghost" onClick={() => router.push("/login")}>
            Sign in
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          By creating an account you agree to our <a className="underline">terms</a>.
        </p>
      </motion.form>
    </div>
  );
}
