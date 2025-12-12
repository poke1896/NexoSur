"use client";

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-dark focus:ring-brand',
    neutral: 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-800',
    outline:
      'border border-gray-300 text-gray-800 hover:bg-gray-50 focus:ring-gray-300',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
