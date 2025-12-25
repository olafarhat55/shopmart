import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmailForm } from "@/schemas/resetPassword/emailSchema";
import { UseFormReturn } from "react-hook-form";
import { IProcessResponse } from "@/interfaces";
import { AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  setEmail: (v: string) => void;
  emailForm: UseFormReturn<EmailForm>;
  handleSendOtp: (email: string) => Promise<IProcessResponse>;
  onContinue: () => void;
};

export default function InputEmail({
  setEmail,
  emailForm,
  handleSendOtp,
  onContinue,
}: Props) {
  const {
    formState: { errors: emailErrors }
  } = emailForm;
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const email = emailForm.watch("email") ?? "";

  const submit = async () => {
    setServerError(null);

    setLoading(true);
    const { ok, message } = await handleSendOtp(email);
    setLoading(false);

    if (!ok) {
      setServerError(
        message || "Failed to send reset email. Please try again."
      );
      return;
    }

    setEmail(email);
    onContinue();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="space-y-4"
      onSubmit={emailForm.handleSubmit(submit)}
    >
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email Address
        </label>
        <Input
          type="email"
          placeholder="you@example.com"
          {...emailForm.register("email")}
          aria-invalid={!!emailErrors.email}
        />
        {emailErrors.email && (
          <p className="text-sm text-destructive mt-1">{`${
            emailErrors.email.message || ""
          }`}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!!emailErrors?.email || loading}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4" /> {"loading..."}
          </>
        ) : (
          "Continue"
        )}
      </Button>
      {serverError && (
        <div className="rounded-md bg-red-800/10 border border-red-700/10 p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="h-5 w-5" />
          <div>{serverError}</div>
        </div>
      )}
    </motion.form>
  );
}
