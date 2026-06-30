import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: "primary" | "neutral";
};

export function Button({
  children,
  className = "",
  tone = "neutral",
  type = "button",
  ...props
}: ButtonProps) {
  const toneClass =
    tone === "primary"
      ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
      : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50";

  return (
    <button
      className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition ${toneClass} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
