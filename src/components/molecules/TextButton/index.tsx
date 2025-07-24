import { ReactNode, ElementType, memo } from 'react';
import { Button, ButtonProps } from '@/components/atoms/Button';
import { Text, TextVariant } from '@/components/atoms/Text';

interface TextButtonProps extends Omit<ButtonProps, 'children'> {
  /** Icon element (e.g., ArrowLeftIcon) */
  icon?: ReactNode;
  /** Text label */
  label: string;
  /** Text variant */
  textVariant?: TextVariant;
  /** Custom element type for Button */
  as?: ElementType;
  /** Additional class names */
  className?: string;
  /** Accessible label for button */
  ariaLabel?: string;
}

export const TextButton = memo(function TextButton({
  icon,
  label,
  textVariant = 's-bold-secondary',
  as,
  className = '',
  ariaLabel,
  ...rest
}: TextButtonProps) {
  return (
    <Button
      as={as}
      ariaLabel={ariaLabel}
      className={`flex items-center gap-[var(--Spacing-XXXS,4px)] px-0 py-0 bg-transparent shadow-none border-none ${className}`.trim()}
      {...rest}
    >
      {icon && (
        <span
          className="flex-shrink-0 w-[20px] h-[20px] flex items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <Text variant={textVariant} className="font-bold">
        {label}
      </Text>
    </Button>
  );
});
