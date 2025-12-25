import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  onStartOver: () => void;
};

export default function SuccessStep({ onStartOver }: Props) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
        <CheckCircle className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold">Success</h3>
      <p className="text-sm text-muted-foreground">Your password has been reset. You can now sign in with your new password.</p>

      <div className="pt-2 space-y-2">
        <Link href="/login">
          <Button className="w-full">Go to Sign in</Button>
        </Link>
        <Button variant="ghost" className="w-full" onClick={onStartOver}>
          Start over
        </Button>
      </div>
    </div>
  );
}