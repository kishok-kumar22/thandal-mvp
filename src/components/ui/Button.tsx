import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", icon, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6BFF] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg cursor-pointer";

    const variantStyles = {
      primary: "bg-[#1F6BFF] text-white hover:bg-[#1757D6] shadow-sm border border-transparent",
      outline: "bg-white text-[#1F6BFF] border border-[#1F6BFF] hover:bg-blue-50/70",
      secondary: "bg-white text-[#334155] border border-[#E6ECF5] hover:bg-slate-50 shadow-sm",
      ghost: "text-[#64748B] hover:text-[#0B1B3F] hover:bg-slate-100",
      danger: "bg-[#E5252A] text-white hover:bg-[#C91F24] shadow-sm border border-transparent",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-3.5 text-sm gap-2",
      lg: "h-10 px-4 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
