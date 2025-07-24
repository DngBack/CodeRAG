'use client'
import { ElementType, memo } from 'react';
import { Text } from '@/components/atoms/Text';

export interface TabProps {
  /** Main label for the tab */
  label: string;
  /** Optional value or count to display */
  value?: string | number;
  /** Whether the tab is active */
  active?: boolean;
  /** Custom HTML tag for the container */
  as?: ElementType;
  /** Additional class names */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
}

export const Tab = memo(function Tab({
  label,
  value,
  active = false,
  as: Component = 'div',
  className = '',
  ariaLabel,
  ...rest
}: TabProps) {
  return (
    <Component
      className={`flex flex-col gap-xs pb-m items-start${
        active ? ' border-b-4 border-emphasis' : ''
      } ${className}`.trim()}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      {...rest}
    >
      <div className="flex gap-s items-start">
        <Text
          variant={active ? 'm-bold-emphasis-italic' : 'm-bold-tertiary-italic'}
        >
          {label}
        </Text>
        {value !== undefined && (
          <Text
            variant={active ? 'm-bold-emphasis-italic' : 'm-bold-tertiary-italic'}
          >
            {value}
          </Text>
        )}
      </div>
    </Component>
  );
});
