export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  size = "md",
}) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
