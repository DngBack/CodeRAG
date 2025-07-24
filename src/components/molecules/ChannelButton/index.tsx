'use client'
import { ElementType, MouseEvent, ReactNode, memo } from 'react';
import { Text } from '@/components/atoms/Text';

interface ChannelButtonProps {
  /** Channel name */
  label: string;
  /** Channel icon (SVG or ReactNode) */
  icon: ReactNode;
  /** Button background style: 'primary' or 'secondary' */
  variant?: 'primary' | 'secondary';
  /** Semantic HTML tag, defaults to button */
  as?: ElementType;
  /** Additional class names */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Click handler */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  /** Disabled state */
  disabled?: boolean;
}

const variantMap = {
  primary: 'bg-yellow-50',
  secondary: 'bg-yellow-20',
};

export const ChannelButton = memo(function ChannelButton({
  label,
  icon,
  variant = 'secondary',
  as: Component = 'button',
  className = '',
  ariaLabel,
  onClick,
  disabled,
  ...rest
}: ChannelButtonProps) {
  const Comp = Component as ElementType;
  return (
    <Comp
      type={Component === 'button' ? 'button' : undefined}
      className={`flex items-center gap-[2px] h-[40px] px-[12px] py-[8px] w-full rounded-s ${variantMap[variant]} ${className}`.trim()}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      <span
        className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center"
        aria-hidden="true"
      >
        {icon}
      </span>
      <Text
        variant={variant === 'primary' ? 's-bold-onprimary-italic' : 's-bold-primary-italic'}
        className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
        ariaLabel={label}
      >
        {label}
      </Text>
    </Comp>
  );
});
