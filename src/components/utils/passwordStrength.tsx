import React, { useMemo } from "react";

export default function PasswordStrength({ password }: { password: string }) {
  const strength = useMemo(() => {
    const pw = password || "";
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const pct = (score / 4) * 100;
    const color =
      score <= 1
        ? "bg-red-400"
        : score === 2
        ? "bg-yellow-400"
        : score === 3
        ? "bg-emerald-400"
        : "bg-green-500";
    const label = ["Very weak", "Weak", "Okay", "Strong", "Very strong"][score];
    return { score, pct, color, label };
  }, [password]);

  return (
    <div id="pw-help" className="mt-2 flex items-center gap-3">
      <div className="flex-1 h-2 bg-primary/10 rounded overflow-hidden">
        <div
          className={`h-full ${strength.color} transition-all`}
          style={{ width: `${strength.pct}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground w-24 text-right">
        {strength.label}
      </div>
    </div>
  );
}
