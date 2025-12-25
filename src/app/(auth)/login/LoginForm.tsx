"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { loginSchema } from "@/schemas/LoginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ILogin, IProcessResponse } from "@/interfaces";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginForm({
  className,
  onLogin,
}: {
  className?: string;
  onLogin?: (() => void) | null | undefined;
}) {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);

  const { login, setOpenLoginDialog } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);

  const handleLogin = async (data: ILogin) => {
    setSubmitting(true);
    try {
      const response: IProcessResponse = await login(data);
      if (response.ok) {
        setSuccess(true);
        setOpenLoginDialog(false);
        setTimeout(() => {
          
          if (onLogin) {
            onLogin();
          } else {
            router.push("/");
          }
        }, 300);
      } else {
        setServerError(response.message);
      }
    } catch (error) {
      setServerError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return (
    <motion.form
      onSubmit={handleSubmit(handleLogin)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className={`w-full max-w-md space-y-6 p-6 rounded-2xl shadow-lg ring-1 bg-primary/1  ring-secondary ${
        className || ""
      }`}
    >
      <div>
        <h1 className="text-2xl font-extrabold">Sign in</h1>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="mt-1"
          {...register("email")}
        />
        {errors.email?.message && (
          <div className="mt-1 flex items-center gap-2 text-xs text-red-600 p-1">
            <>{errors.email.message}</>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative mt-1">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Your password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password?.message && (
          <div className="mt-1 flex items-center gap-2 text-xs text-red-600 p-1">
            <>{errors.password.message}</>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(v) => setRememberMe((prv) => !prv)}
          />
          <span className="text-sm">Remember me</span>
        </label>

        <Link
          className="text-sm text-muted-foreground hover:underline"
          onClick={() => {
            setOpenLoginDialog(false);
          }}
          href="/resetpassword"
        >
          {"Forgot password?"}
        </Link>
      </div>

      {serverError && (
        <div className="rounded-md bg-red-800/10 border border-red-700/10 p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="h-5 w-5" />
          <div>{serverError}</div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="submit"
            disabled={submitting || success}
            className="flex items-center gap-2  w-[120px]"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Loading...
              </>
            ) : success ? (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-500" /> Done
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setOpenLoginDialog(false);
              router.push("/register");
            }}
          >
            Create account
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        By signing in you agree to our <a className="underline">terms</a>.
      </p>
    </motion.form>
  );
}