'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button label or content */
  children?: ReactNode;
  /** Custom element type for the button */
  as?: React.ElementType;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

export const Button = ({
  children,
  as: Component = 'button',
  type = 'button',
  ariaLabel,
  ...rest
}: ButtonProps) => (
  <Component
    type={Component === 'button' ? type : undefined}
    aria-label={ariaLabel}
    className="flex items-center justify-center gap-0 h-12 px-6 py-[14px] rounded-s bg-yellow-50 text-on-primary font-bold text-m leading-[1] tracking-[0.5px] font-[K2D]"
    {...rest}
  >
    <span className="text-on-primary text-m font-bold leading-[1] tracking-[0.5px] font-[K2D]">
      {children}
    </span>
  </Component>
);
