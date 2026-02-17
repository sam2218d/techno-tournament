
import React, { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'danger' }> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyle = "font-display font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-primary text-white hover:brightness-110 shadow-[0_4px_20px_rgba(37,106,244,0.3)]",
    secondary: "bg-surface-dark text-white hover:bg-white/10 border border-white/5",
    outline: "bg-transparent border border-primary/30 text-primary hover:bg-primary/10",
    danger: "bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 mb-4">
    {label && <label className="text-slate-400 text-xs uppercase font-bold tracking-wider ml-1">{label}</label>}
    <input
      className={`bg-surface-dark/50 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(37,106,244,0.15)] transition-all placeholder:text-slate-600 ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, className = '', children, ...props }) => (
  <div className="flex flex-col gap-1 mb-4">
    {label && <label className="text-slate-400 text-xs uppercase font-bold tracking-wider ml-1">{label}</label>}
    <select
      className={`bg-surface-dark/50 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; glowing?: boolean; borderColor?: string }> = ({
  children,
  className = '',
  glowing = false,
  borderColor = 'border-white/5'
}) => (
  <div className={`bg-surface-dark backdrop-blur-md border ${borderColor} p-6 relative rounded-xl overflow-hidden ${className} ${glowing ? 'shadow-[0_0_30px_rgba(37,106,244,0.15)]' : ''}`}>
    {children}
  </div>
);
