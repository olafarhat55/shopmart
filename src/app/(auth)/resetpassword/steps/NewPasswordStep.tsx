import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { IProcessResponse } from "@/interfaces";
import { PasswordForm } from "@/schemas/resetPassword/passwordSchema";
import { UseFormReturn } from "react-hook-form";
import PasswordStrength from "@/components/utils/passwordStrength";

type Props = {
  passwordForm: UseFormReturn<PasswordForm>;
  handleResetPassword: (password: string) => Promise<IProcessResponse>;
  onContinue: (token: string) => void;
};
export default function NewPasswordStep({
  passwordForm,
  onContinue,
  handleResetPassword,
}: Props) {
  const {handleSubmit, register, formState: { errors }, watch} = passwordForm;

  const password = watch("password") ?? "";
  const confirmPassword = watch("confirm") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const submit = async () => {
    setServerError(null);

    setLoading(true);
    const res = await handleResetPassword(password);
    setLoading(false);

    if (!res?.ok) {
      setServerError(res?.message || "Verification failed.");
      return;
    }
    onContinue(res.message);
  };


  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(submit)}
    >
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          New Password
        </label>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <PasswordStrength password={password} />
        <p className="text-sm text-muted-foreground">
          Password must be at least 8 characters with uppercase, lowercase, and
          number.
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="confirm" className="text-sm font-medium">
          Confirm Password
        </label>

        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirm")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label={
              showConfirm ? "Hide confirm password" : "Show confirm password"
            }
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      {errors?.confirm && (
        <p className="text-sm text-destructive">{errors?.confirm?.message}</p>
      )}
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1"
          type="submit"
          disabled={password.length === 0 || confirmPassword.length === 0 || loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" /> Verifying...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </div>
    </form>
  );
}
