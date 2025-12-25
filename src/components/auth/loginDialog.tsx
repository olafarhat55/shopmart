"use client";

import React from "react";
import {
  Dialog,
  DialogPortal,
  DialogContent,
} from "@/components/ui/dialog";
import LoginForm from "@/app/(auth)/login/LoginForm";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: (() => void) | null | undefined;
}

export default function LoginDialog({
  open,
  onOpenChange,
  onLogin,
}: Props) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogContent className="bg-secondary/80 backdrop-blur-xl ">
          <LoginForm onLogin={onLogin}  className="bg-transparent shadow-transparent ring-0 ring-transparent border-transparent" />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
