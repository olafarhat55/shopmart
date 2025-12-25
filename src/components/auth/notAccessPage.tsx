"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NProgress from "nprogress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

type Action = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost";
};

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  primary?: Action;
  secondary?: Action;
  tertiary?: Action;
  className?: string;
};

export default function NotAuthorized({
  icon,
  title,
  description,
  primary,
  secondary,
  tertiary,
  className,
}: Props) {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className={`mt-22 min-h-screen py-16 bg-gradient-to-b from-background/60 to-background ${className || ""}`}>
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36 }}
            className="rounded-2xl border border-border/40 p-8 text-center bg-background shadow-lg"
          >
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>

            <h1 className="text-2xl font-extrabold mb-2">Verifying user</h1>

            <p className="text-sm text-muted-foreground mb-6">
              Checking authentication — please wait.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-22 min-h-screen py-16 bg-gradient-to-b from-background/60 to-background ${className || ""}`}>
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36 }}
          className="rounded-2xl border border-border/40 p-8 text-center bg-background shadow-lg"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full p-3 bg-primary/6">{icon}</div>
          </div>

          <h1 className="text-2xl font-extrabold mb-2">{title}</h1>

          {description && <p className="text-sm text-muted-foreground mb-6">{description}</p>}

          <div className="flex items-center justify-center gap-3">
            {primary &&
              (primary.href ? (
                <Link href={primary.href} onClick={() => NProgress.start()} passHref>
                  <Button className="flex items-center gap-2" type="button">
                    {primary.label}
                  </Button>
                </Link>
              ) : (
                <Button className="flex items-center gap-2" onClick={() => primary.onClick && primary.onClick()}>
                  {primary.label}
                </Button>
              ))}

            {secondary &&
              (secondary.href ? (
                <Link href={secondary.href} onClick={() => NProgress.start()} passHref>
                  <Button variant="outline" className="flex items-center gap-2" type="button">
                    {secondary.label}
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="flex items-center gap-2" onClick={() => secondary.onClick && secondary.onClick()}>
                  {secondary.label}
                </Button>
              ))}

            {tertiary &&
              (tertiary.href ? (
                <Link href={tertiary.href} onClick={() => NProgress.start()} passHref>
                  <Button variant="ghost" className="flex items-center gap-2" type="button">
                    {tertiary.label}
                  </Button>
                </Link>
              ) : (
                <Button variant="ghost" className="flex items-center gap-2" onClick={() => tertiary.onClick && tertiary.onClick()}>
                  {tertiary.label}
                </Button>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}