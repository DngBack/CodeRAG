import React from 'react';

export interface DividerProps {
  as?: React.ElementType;
  className?: string;
  ariaLabel?: string;
}

export const Divider = React.memo(
  ({ as: Component = 'hr', className = '', ariaLabel }: DividerProps) => {
    const role = Component === 'hr' ? 'separator' : undefined;
    const ariaProps = ariaLabel ? { 'aria-label': ariaLabel } : {};
    return (
      <Component
        className={`w-full h-px flex items-center justify-center self-stretch border-t border-primary ${className}`}
        {...ariaProps}
        {...(role ? { role } : {})}
      />
    );
  }
);
