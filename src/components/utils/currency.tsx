"use client";

import React from "react";

type CurrencyProps = {
  value?: number | string | null;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  className?: string;
  renderAs?: "span" | "text";
  direction?: "ltr" | "rtl";
  currencySize?: number;
  gap?: number;
};

export const formatCurrency = (
  raw: number | string | null | undefined,
  opts?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string => {
  const { locale, minimumFractionDigits, maximumFractionDigits } = opts ?? {};

  if (raw === null || raw === undefined || raw === "") return "—";
  const n = typeof raw === "string" ? Number(raw) : raw;
  if (!isFinite(n)) return "—";

  try {
    const nf = new Intl.NumberFormat(locale ?? "en-US", {
      minimumFractionDigits:
        minimumFractionDigits ?? (Math.round(n) === n ? 0 : 2),
      maximumFractionDigits: maximumFractionDigits ?? 2,
      useGrouping: true, // <-- add this to ensure commas
    });

    return nf.format(n);
  } catch {
    return n.toFixed(maximumFractionDigits ?? 2);
  }
};


export default function Currency({
  value,
  currency = "EGP",
  minimumFractionDigits,
  maximumFractionDigits,
  className = "",
  renderAs = "span",
  direction = "rtl",
  currencySize = 0.75,
  gap = 2,
}: CurrencyProps) {
  const formatted = formatCurrency(value, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  if (renderAs === "text") return <>{formatted}</>;

  return (
    <span
      className={`inline-flex items-baseline justify-center ${className}`}
      aria-label={`Price: ${formatted}`}
    >
      {direction === "rtl" ? (
        <>
          <span
            className="leading-none font-normal"
            style={{ fontSize: `${currencySize}em`, marginRight: `${gap}px` }}
          >
            {currency}
          </span>
          <span className="leading-none">{formatted}</span>
        </>
      ) : (
        <>
          <span className="leading-none">{formatted}</span>
          <span
            className="leading-none font-normal"
            style={{ fontSize: `${currencySize}em`, marginLeft: `${gap}px` }}
          >
            {currency}
          </span>
        </>
      )}
    </span>
  );
}
