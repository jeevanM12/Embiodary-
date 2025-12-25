
import React from 'react';
import { Loader2, X } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
  as?: React.ElementType;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', className = '', isLoading, as: Component = 'button', ...props 
}) => {
  const baseStyle = "px-6 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-wide";
  
  const variants = {
    primary: "bg-brand-burgundy text-white shadow-lg hover:shadow-brand-burgundy/30 hover:bg-[#600018]",
    secondary: "bg-brand-gold text-white shadow-lg hover:shadow-brand-gold/30 hover:bg-[#B8962E]",
    outline: "border border-brand-burgundy text-brand-burgundy hover:bg-brand-burgundy/5",
    ghost: "text-luxe-700 hover:bg-luxe-100",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
  };

  return (
    <Component className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
    </Component>
  );
};

// --- Card ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-xl shadow-glass border border-white/50 p-6 ${className}`} {...props}>
    {children}
  </div>
);

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="mb-4 w-full">
    {label && <label className="block text-sm font-medium text-luxe-800 mb-1.5">{label}</label>}
    <input 
      className={`w-full px-4 py-2.5 rounded-lg border border-luxe-200 bg-luxe-50/50 focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy outline-none transition-all placeholder:text-luxe-300 ${className}`}
      {...props} 
    />
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-luxe-100 text-luxe-800' }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${color}`}>
    {children}
  </span>
);

// --- Modal ---
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxe-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 border border-luxe-100">
        <div className="p-6 border-b border-luxe-100 flex justify-between items-center bg-luxe-50">
          <h3 className="text-xl font-serif font-semibold text-brand-burgundy">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-luxe-200 rounded-full transition-colors text-luxe-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
