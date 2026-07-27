// src/components/common/Button.tsx

import React, { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "warning"
  | "dark"
  | "white";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type ButtonState = "default" | "loading" | "disabled";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  isLoading?: boolean;
}

const LoadingSpinner = () => (
  <svg
    className="h-4 w-4 animate-spin shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      className="opacity-25"
    />
    <path
      fill="currentColor"
      className="opacity-75"
      d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"
    />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      state = "default",
      icon: Icon,
      iconPosition = "left",
      children,
      fullWidth = false,
      className = "",
      isLoading = false,
      disabled = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const sizeClasses: Record<ButtonSize, string> = {
      xs: "px-2.5 py-1.5 text-xs gap-1.5",
      sm: "px-3 py-2 text-sm gap-2",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
      xl: "px-8 py-4 text-lg gap-3",
    };

    const variantClasses: Record<ButtonVariant, string> = {
      primary:
        "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm hover:shadow",

      secondary:
        "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 active:bg-emerald-300",

      outline:
        "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100",

      ghost:
        "text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100",

      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow",

      success:
        "bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow",

      warning:
        "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm hover:shadow",

      dark:
        "bg-slate-800 text-white hover:bg-slate-900 active:bg-black shadow-sm hover:shadow",

      white:
        "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-sm",
    };

    const stateClasses: Record<ButtonState, string> = {
      default: "",
      loading: "cursor-wait opacity-70 pointer-events-none",
      disabled: "cursor-not-allowed opacity-50 pointer-events-none",
    };

    const loading = isLoading || state === "loading";
    const buttonDisabled =
      disabled || state === "disabled" || loading;

    const currentState: ButtonState = loading
      ? "loading"
      : buttonDisabled
      ? "disabled"
      : "default";

    const classes = `
      inline-flex items-center justify-center
      rounded-xl font-medium
      transition-all duration-200
      focus:outline-none
      focus:ring-2
      focus:ring-emerald-500
      focus:ring-offset-2
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      ${stateClasses[currentState]}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `
      .trim()
      .replace(/\s+/g, " ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={buttonDisabled}
        aria-busy={loading}
        className={classes}
        {...props}
      >
        {loading && <LoadingSpinner />}

        {!loading && Icon && iconPosition === "left" && (
          <Icon className="h-4 w-4 shrink-0" />
        )}

        {children && <span>{children}</span>}

        {!loading && Icon && iconPosition === "right" && (
          <Icon className="h-4 w-4 shrink-0" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;