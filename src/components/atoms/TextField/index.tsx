import { forwardRef, InputHTMLAttributes } from 'react';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Custom HTML tag for the input */
  as?: React.ElementType;
  /** Optional className for custom styling */
  className?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ as: Component = 'input', placeholder, className = '', ...props }, ref) => (
    <div
      className={
        `flex items-center gap-0 h-12 px-[20px] py-[14px] pb-[16px] w-full bg-accent border border-tertiary rounded-s ${className}`
      }
      role="presentation"
    >
      <Component
        ref={ref}
        type="text"
        aria-label={placeholder}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-s font-medium text-placeholder tracking-[0.03em] font-[K2D]"
        {...props}
      />
    </div>
  )
);

TextField.displayName = 'TextField';
