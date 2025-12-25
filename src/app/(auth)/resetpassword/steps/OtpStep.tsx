import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AlertCircle, Loader2 } from "lucide-react";
import type { IProcessResponse } from "@/interfaces";
import { OtpForm } from "@/schemas/resetPassword/otpSchema";

type Props = {
  email: string;
  otpForm: UseFormReturn<OtpForm>;
  resendCooldown: number;
  OTP_LENGTH?: number;
  handleSendOtp: (otp: string) => Promise<IProcessResponse>;
  handleVerifyOtp: (email: string) => Promise<IProcessResponse>;
  onBack: () => void;
  onContinue: () => void;
};

export default function OtpStep({
  email,
  otpForm,
  handleVerifyOtp,
  onBack,
  handleSendOtp,
  resendCooldown,
  onContinue,
  OTP_LENGTH = 6,
}: Props) {
  const {
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
  } = otpForm;

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const otpValue = watch("otp") ?? "";

  const submit = async () => {
    setServerError(null);
    setLoading(true);
    try {
      const res = await handleVerifyOtp(otpValue);
      setLoading(false);
      if (!res?.ok) {
        setServerError(res?.message || "Verification failed.");
        return;
      }
      onContinue();
    } catch (err) {
      setLoading(false);
      setServerError("Verification failed. Try again.");
      console.error(err);
    }
  };

  const handleResendClick = async () => {
    if (resendCooldown > 0) return;
    setServerError(null);
    setLoading(true);
    try {
      const res = await handleSendOtp(email);
      setLoading(false);
      if (!res?.ok) {
        setServerError(res?.message || "Failed to resend code.");
      }
    } catch (err) {
      setLoading(false);
      setServerError("Failed to resend code.");
      console.error(err);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="space-y-4"
      onSubmit={handleSubmit(submit)}
    >
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          We sent a {OTP_LENGTH}-digit code to <strong>{email}</strong>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={OTP_LENGTH}
          {...otpForm.register("otp")}
          onChange={(val: string) => {
            const numRegix = /^\d*$/;
            if (numRegix.test(val)) {
              setValue("otp", String(val).slice(0, OTP_LENGTH), {
                shouldValidate: true,
              });
            }
          }}
          value={otpValue}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {serverError && (
        <div className="rounded-md bg-red-800/10 border border-red-700/10 p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="h-5 w-5" />
          <div>{serverError}</div>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onBack}
          type="button"
        >
          Back
        </Button>

        <Button
          className="flex-1"
          type="submit"
          disabled={loading || otpValue.length < OTP_LENGTH}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" /> Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
        <button
          type="button"
          onClick={handleResendClick}
          className={`text-sm underline underline-offset-2 ${
            resendCooldown > 0 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Resend code
        </button>

        <div>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : ""}</div>
      </div>
    </motion.form>
  );
}
