import Image from "next/image";
import type { ButtonHTMLAttributes } from "react";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string;
  label: string;
  isActive?: boolean;
};

export function IconButton({
  icon,
  label,
  isActive = false,
  className = "",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`grid h-10 w-10 place-items-center rounded-md border transition ${
        isActive
          ? "border-blue-600 bg-blue-50"
          : "border-slate-300 bg-white hover:bg-slate-50"
      } ${className}`}
      title={label}
      type={type}
      {...props}
    >
      <Image alt="" height={20} src={icon} width={20} />
    </button>
  );
}
