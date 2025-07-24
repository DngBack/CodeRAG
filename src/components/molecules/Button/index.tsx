'use client'
import { ButtonHTMLAttributes, ElementType, ReactNode, forwardRef, memo } from 'react';
import { Text } from '@/components/atoms/Text';

export type ButtonVariant =
  | 'tertiary-mail'
  | 'tertiary-google'
  | 'tertiary-apple'
  | 'secondary-signin'
  | 'disabled-upload'
  | 'channel-secondary'
  | 'channel-primary';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Button label text */
  label: string;
  /** Optional icon element (SVG, ReactNode) */
  icon?: ReactNode;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Additional class names */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Component type to render as (e.g., 'a', 'button', etc.) */
  as?: ElementType;
}

const variantMap: Record<ButtonVariant, string> = {
  'tertiary-mail': 'flex items-center justify-center gap-xxxxs h-[40px] px-xl py-s rounded-s border border-tertiary bg-tertiary',
  'tertiary-google': 'flex items-center justify-center gap-xxxxs h-[40px] px-xl py-s rounded-s border border-tertiary bg-tertiary',
  'tertiary-apple': 'flex items-center justify-center gap-xxxxs h-[40px] px-xl py-s rounded-s border border-tertiary bg-tertiary',
  'secondary-signin': 'flex items-center justify-center gap-xxxxs h-[32px] px-m py-xxs rounded-s bg-secondary',
  'disabled-upload': 'flex items-center justify-center gap-xxxs h-[48px] px-xxxl py-l rounded-s bg-disabled',
  'channel-secondary': 'flex items-center gap-xxxxs h-[40px] px-m py-xs rounded-s bg-secondary',
  'channel-primary': 'flex items-center gap-xxxxs h-[40px] px-m py-xs rounded-s bg-primary',
};

const textVariantMap: Record<ButtonVariant, string> = {
  'tertiary-mail': 'xs-bold-ontertiary-italic',
  'tertiary-google': 'xs-bold-ontertiary-italic',
  'tertiary-apple': 'xs-bold-ontertiary-italic',
  'secondary-signin': 'xs-bold-ontertiary-italic',
  'disabled-upload': 'm-bold-disabled-italic',
  'channel-secondary': 's-bold-primary-italic',
  'channel-primary': 's-bold-onprimary-italic',
};

const iconSizeMap: Record<ButtonVariant, string> = {
  'tertiary-mail': 'w-[18px] h-[18px]',
  'tertiary-google': 'w-[18px] h-[18px]',
  'tertiary-apple': 'w-[18px] h-[18px]',
  'secondary-signin': 'w-[18px] h-[18px]',
  'disabled-upload': 'w-[24px] h-[24px]',
  'channel-secondary': 'w-[18px] h-[18px]',
  'channel-primary': 'w-[18px] h-[18px]',
};

function filterRestProps(rest: Record<string, unknown>) {
  const {
    as,
    variant,
    className,
    ariaLabel,
    label,
    icon,
    ...filtered
  } = rest;
  return filtered;
}

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      icon,
      variant = 'tertiary-mail',
      className = '',
      ariaLabel,
      as: Component = 'button',
      ...rest
    },
    ref
  ) => {
    const Comp = Component as ElementType;
    const htmlProps = filterRestProps(rest);
    return (
      <Comp
        ref={ref}
        className={`${variantMap[variant]} ${className}`.trim()}
        {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
        type={Component === 'button' ? 'button' : undefined}
        {...htmlProps}
      >
        {icon && (
          <span className={`flex items-center justify-center shrink-0 ${iconSizeMap[variant]}`} aria-hidden="true">
            {icon}
          </span>
        )}
        <Text variant={textVariantMap[variant]} truncate={variant.startsWith('channel-')} lines={1}>{label}</Text>
      </Comp>
    );
  }
));

Button.displayName = 'Button';

/** Thank you for your feedback. Please install the required dependencies with:
npm install react react-dom @types/react @types/react-dom
Then verify your tsconfig.json paths configuration and ensure '@/components/atoms/Text' resolves correctly. Also, check your Node.js and npm/yarn installation. */
