import { ElementType, memo } from 'react';
import { Rectangle } from '@/components/atoms/Rectangle';

export interface AccountProps {
  /** Array of account images */
  accounts?: Array<{
    src: string;
    alt?: string;
    size?: 'xl' | '2xl';
    ariaLabel?: string;
    className?: string;
  }>;
  /** Custom component type for container */
  as?: ElementType;
  /** Custom className for container */
  className?: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

export const Account = memo(function Account({
  accounts = [],
  as: Component = 'div',
  className = '',
  ariaLabel,
}: AccountProps) {
  return (
    <Component
      className={`flex items-center gap-xxs ${className}`}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {accounts.map((item, idx) => (
        <Rectangle
          key={idx}
          src={item.src}
          alt={item.alt}
          size={item.size}
          ariaLabel={item.ariaLabel}
          className={item.className}
        />
      ))}
    </Component>
  );
});