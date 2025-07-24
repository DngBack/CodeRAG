'use client'
import { forwardRef, useId, memo, InputHTMLAttributes, TextareaHTMLAttributes, Ref } from 'react';
import { Text } from '@/components/atoms/Text';

type InputTag = 'input' | 'textarea';

type CommonProps = {
  label?: string;
  placeholder?: string;
  as?: InputTag;
  className?: string;
  id?: string;
  value?: string | number;
};

type TextFieldProps = CommonProps & (
  | ({ as?: 'input' } & Omit<InputHTMLAttributes<HTMLInputElement>, keyof CommonProps | 'size'>)
  | ({ as: 'textarea' } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof CommonProps | 'size'>)
);

function filterInputProps(props: TextFieldProps, as: InputTag) {
  const {
    label,
    placeholder,
    className,
    as: tag,
    id,
    value,
    ...rest
  } = props;
  if (as === 'input') {
    const { type, ...inputRest } = rest as InputHTMLAttributes<HTMLInputElement>;
    return inputRest;
  }
  if (as === 'textarea') {
    return rest as TextareaHTMLAttributes<HTMLTextAreaElement>;
  }
  return {};
}

const BaseTextField = forwardRef<HTMLElement, TextFieldProps>(
  (props, ref) => {
    const {
      label,
      placeholder = '',
      as = 'input',
      className = '',
      id,
      value,
      ...rest
    } = props;
    const inputId = id || useId();
    const showPlaceholder = !value;
    const ariaLabel = label ? label : placeholder;
    return (
      <div
        className={`flex items-center gap-0 h-12 w-full border border-tertiary bg-tertiary rounded-s px-xxl py-xl relative ${className}`.trim()}
        style={{ flex: '1 0 0' }}
      >
        {label && (
          <label htmlFor={inputId} className="sr-only">
            {label}
          </label>
        )}
        {showPlaceholder && placeholder && (
          <Text
            variant="s-medium-placeholder-italic"
            className="absolute left-xxl top-1/2 -translate-y-1/2 pointer-events-none select-none"
            ariaLabel={ariaLabel}
            role="presentation"
          >
            {placeholder}
          </Text>
        )}
        {as === 'input' ? (
          <input
            ref={ref as Ref<HTMLInputElement>}
            id={inputId}
            type="text"
            value={value}
            aria-label={ariaLabel}
            className="flex-1 bg-transparent outline-none"
            {...filterInputProps({ ...rest, label, placeholder, className, as, id, value }, 'input')}
          />
        ) : (
          <textarea
            ref={ref as Ref<HTMLTextAreaElement>}
            id={inputId}
            value={typeof value === 'string' ? value : ''}
            aria-label={ariaLabel}
            className="flex-1 bg-transparent outline-none resize-none"
            {...filterInputProps({ ...rest, label, placeholder, className, as, id, value }, 'textarea')}
          />
        )}
      </div>
    );
  }
);

BaseTextField.displayName = 'TextField';

export const TextField = memo(BaseTextField);
