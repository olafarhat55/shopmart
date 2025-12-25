"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Lock, CheckCircle } from "lucide-react";
import Link from "next/link";

import InputEmail from "./steps/InputEmail";
import OtpStep from "./steps/OtpStep";
import NewPasswordStep from "./steps/NewPasswordStep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EmailForm, emailSchema } from "@/schemas/resetPassword/emailSchema";
import { apiService } from "@/service/apiService";
import { OtpForm, otpSchema } from "@/schemas/resetPassword/otpSchema";
import {
  PasswordForm,
  passwordSchema,
} from "@/schemas/resetPassword/passwordSchema";
import { useAuth } from "@/context/AuthContext";

export default function AuthFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [email, setEmail] = useState<string>("");

  const OTP_LENGTH = 6;
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const {verify} = useAuth();

  // Forms
  const emailForm = useForm<EmailForm>({
    mode: "onSubmit",
    resolver: zodResolver(emailSchema),
  });

  const otpForm = useForm<OtpForm>({
    mode: "onSubmit",
    resolver: zodResolver(otpSchema),
  });

  const passwordForms = useForm<PasswordForm>({
    mode: "onSubmit",
    resolver: zodResolver(passwordSchema),
  });

  // Progress index
  const progressIndex = step; // 1..4

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(
      () => setResendCooldown((c) => (c > 0 ? c - 1 : 0)),
      1000
    );
    return () => clearInterval(t);
  }, [resendCooldown]);

  // handlers
  const handleSendOtp = async (data: string) => {
    const response = await apiService.sendOtp(data);
    if (response?.statusMsg === "success") {
      setResendCooldown(60); // start cooldown
      return { ok: true, message: "OTP sent successfully" };
    }
    return { ok: false, message: response?.message || "Failed to send OTP" };
  };

  const handleVerifyOtp = async (otp: string) => {
    const response = await apiService.verifyOtp(otp);
    console.log(response);
    console.log("Verify Otp");
    if (response?.status === "Success") {
      console.log("OTP verified");
      return { ok: true, message: "OTP verified successfully" };
    }
    return { ok: false, message: response?.message || "Invalid OTP" };
  };

  const handleResetPassword = async (password: string) => {
    const response = await apiService.resetPassword(email, password);

    if (response?.token) {
      return { ok: true, message: response?.token };
    }

    return {
      ok: false,
      message: response?.message || "Failed to reset password",
    };
  };




  const back = () => {
    if (step === 1) return;
    setStep((s) => (s === 4 ? 3 : ((s - 1) as 1 | 2 | 3)));
  };

  const startOver = () => {
    setStep(1);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="bg-card text-card-foreground">
          <CardHeader className="text-center px-6 pt-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border bg-muted/50">
              {step === 4 ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Lock className="h-6 w-6" />
              )}
            </div>

            <CardTitle className="text-2xl font-semibold">
              {step === 1 && "Reset Your Password"}
              {step === 2 && "Verify your identity"}
              {step === 3 && "Create a new secure password"}
              {step === 4 && "Password Reset Successful"}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {step === 1 && "First, let's identify your account"}
              {step === 2 && "Enter the verification code we sent"}
              {step === 3 && "Choose a strong password"}
              {/* {step === 4 && "You're all set — sign in with your new password"} */}
            </p>

            {step != 4 && (
              <div className="mt-6 flex w-full items-center gap-2 px-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      progressIndex >= i
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent className="px-6 py-4">
            {step === 1 && (
              <InputEmail
                setEmail={setEmail}
                emailForm={emailForm}
                handleSendOtp={handleSendOtp}
                onContinue={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <OtpStep
                email={email}
                otpForm={otpForm}
                resendCooldown={resendCooldown}
                OTP_LENGTH={OTP_LENGTH}
                handleVerifyOtp={handleVerifyOtp}
                handleSendOtp={handleSendOtp}
                onBack={back}
                onContinue={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <NewPasswordStep
                passwordForm={passwordForms}
                onContinue={(token: string) => {
                  setStep(4);
                  console.log("Received token:", token);

                  apiService.setToken(token);
                  verify().then((res) => {
                    console.log(res);
                    if(res) {
                      setTimeout(() => {
                        window.location.href = "/";
                      }, 600);
                    }
                  });
                  
                }}
                handleResetPassword={handleResetPassword}
              />
            )}

            {/* {step === 4 && <SuccessStep onStartOver={startOver} />} */}
          </CardContent>

          {step != 4 && (
            <CardFooter className="border-t px-6 py-4 flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary font-medium">
                  Sign in
                </Link>
              </p>
              <button
                onClick={startOver}
                className="text-xs text-muted-foreground underline underline-offset-2"
              >
                Start over
              </button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
