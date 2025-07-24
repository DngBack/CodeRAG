import { FC, memo } from 'react';
import { Text } from '@/components/atoms/Text';
import { TextField, TextFieldProps } from '@/components/atoms/TextField';

interface TextFormProps {
  /** Label text */
  label: string;
  /** Placeholder for input */
  placeholder?: string;
  /** Input props */
  inputProps?: Omit<TextFieldProps, 'placeholder'>;
  /** Optional icon element (for password field, etc.) */
  icon?: React.ReactNode;
  /** Additional class names */
  className?: string;
}

export const TextForm: FC<TextFormProps> = memo(({ label, placeholder, inputProps, icon, className }) => (
  <div className={`flex flex-col gap-xs w-full ${className || ''}`.trim()}>
    <Text variant="s-bold-primary" as="label" className="w-full">
      {label}
    </Text>
    <div className="flex items-center gap-m w-full">
      <TextField
        placeholder={placeholder}
        {...inputProps}
        className="flex-1"
      />
      {icon && (
        <span className="w-xl h-xl flex items-center justify-center">{icon}</span>
      )}
    </div>
  </div>
));

TextForm.displayName = 'TextForm';
