'use client'
import { ElementType, ReactNode, forwardRef } from 'react';

export type TextVariant =
  | 'xxl-bold-center-primary-italic'
  | 'xxl-bold-center-primary'
  | 'xxl-bold-center-emphasis-italic'
  | 'xl-bold-center-primary-italic'
  | 'xl-bold-center-secondary-italic'
  | 'l-bold-primary-italic'
  | 'm-bold-primary-italic'
  | 'm-bold-secondary-italic'
  | 'm-bold-tertiary-italic'
  | 'm-bold-disabled-italic'
  | 'm-bold-emphasis-italic'
  | 'm-bold-alert-italic'
  | 'm-bold-onprimary-italic'
  | 'm-bold-onsecondary-italic'
  | 'm-bold-ontertiary-italic'
  | 'm-medium-primary-italic'
  | 'm-medium-secondary-italic'
  | 'm-medium-tertiary-italic'
  | 'm-medium-placeholder-italic'
  | 's-bold-primary-italic'
  | 's-bold-secondary-italic'
  | 's-medium-primary-italic'
  | 's-medium-secondary-italic'
  | 's-medium-tertiary-italic'
  | 's-medium-placeholder-italic'
  | 'xs-bold-secondary-italic'
  | 'xs-bold-ontertiary-italic'
  | 'xs-bold-alert-italic'
  | 'xxs-bold-secondary-italic';

interface TextProps {
  /** Text content */
  children: ReactNode;
  /** Semantic HTML tag, defaults to span */
  as?: ElementType;
  /** Visual style variant */
  variant?: TextVariant;
  /** Additional class names */
  className?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Accessible role */
  role?: string;
  /** Tab index for keyboard navigation */
  tabIndex?: number;
  /** Truncate text */
  truncate?: boolean;
  /** Number of lines to display before truncating */
  lines?: number;
}

const variantMap: Record<TextVariant, string> = {
  'xxl-bold-center-primary-italic': 'text-xxl font-bold italic text-primary text-center leading-[1] tracking-[0.8px] font-english',
  'xxl-bold-center-primary': 'text-xxl font-bold text-primary text-center leading-[1] tracking-[0.8px] font-english',
  'xxl-bold-center-emphasis-italic': 'text-xxl font-bold italic text-emphasis text-center leading-[1] tracking-[0.8px] font-english',
  'xl-bold-center-primary-italic': 'text-xl font-bold italic text-primary text-center leading-[1] tracking-[0.64px] font-english',
  'xl-bold-center-secondary-italic': 'text-xl font-bold italic text-secondary text-center leading-[1] tracking-[0.64px] font-english',
  'l-bold-primary-italic': 'text-l font-bold italic text-primary leading-[1] tracking-[0.5px] font-english',
  'm-bold-primary-italic': 'text-m font-bold italic text-primary leading-[1] tracking-[0.5px] font-english',
  'm-bold-secondary-italic': 'text-m font-bold italic text-secondary leading-[1] tracking-[0.5px] font-english',
  'm-bold-tertiary-italic': 'text-m font-bold italic text-tertiary leading-[1] tracking-[0.5px] font-english',
  'm-bold-disabled-italic': 'text-m font-bold italic text-disabled leading-[1] tracking-[0.5px] font-english',
  'm-bold-emphasis-italic': 'text-m font-bold italic text-emphasis leading-[1] tracking-[0.5px] font-english',
  'm-bold-alert-italic': 'text-m font-bold italic text-alert leading-[1] tracking-[0.5px] font-english',
  'm-bold-onprimary-italic': 'text-m font-bold italic text-on-primary leading-[1] tracking-[0.5px] font-english',
  'm-bold-onsecondary-italic': 'text-m font-bold italic text-on-secondary leading-[1] tracking-[0.5px] font-english',
  'm-bold-ontertiary-italic': 'text-m font-bold italic text-on-tertiary leading-[1] tracking-[0.5px] font-english',
  'm-medium-primary-italic': 'text-m font-medium italic text-primary leading-[1] tracking-[0.5px] font-english',
  'm-medium-secondary-italic': 'text-m font-medium italic text-secondary leading-[1] tracking-[0.5px] font-english',
  'm-medium-tertiary-italic': 'text-m font-medium italic text-tertiary leading-[1] tracking-[0.5px] font-english',
  'm-medium-placeholder-italic': 'text-m font-medium italic text-placeholder leading-[1] tracking-[0.5px] font-english',
  's-bold-primary-italic': 'text-s font-bold italic text-primary leading-[1.55] tracking-[0.48px] font-english',
  's-bold-secondary-italic': 'text-s font-bold italic text-secondary leading-[1.55] tracking-[0.48px] font-english',
  's-medium-primary-italic': 'text-s font-medium italic text-primary leading-[1.55] tracking-[0.48px] font-english',
  's-medium-secondary-italic': 'text-s font-medium italic text-secondary leading-[1.55] tracking-[0.48px] font-english',
  's-medium-tertiary-italic': 'text-s font-medium italic text-tertiary leading-[1.55] tracking-[0.48px] font-english',
  's-medium-placeholder-italic': 'text-s font-medium italic text-placeholder leading-[1.55] tracking-[0.48px] font-english',
  'xs-bold-secondary-italic': 'text-xs font-bold italic text-secondary text-center leading-[1] tracking-[0.42px] font-english',
  'xs-bold-ontertiary-italic': 'text-xs font-bold italic text-on-tertiary text-center leading-[1] tracking-[0.42px] font-english',
  'xs-bold-alert-italic': 'text-xs font-bold italic text-alert text-center leading-[1] tracking-[0.42px] font-english',
  'xxs-bold-secondary-italic': 'text-xxs font-bold italic text-secondary leading-[1] tracking-[0.48px] font-english'
};

function filterRestProps(rest: Record<string, unknown>) {
  const {
    as,
    variant,
    className,
    ariaLabel,
    role,
    tabIndex,
    truncate,
    lines,
    ...filtered
  } = rest;
  return filtered;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  ({
    children,
    as: Component = 'span',
    variant = 's-bold-primary-italic',
    className = '',
    ariaLabel,
    role,
    tabIndex,
    truncate,
    lines,
    ...rest
  }, ref) => {
    const Comp = Component as ElementType;
    const htmlProps = filterRestProps(rest);
    let truncateClass = '';
    if (truncate) {
      if (lines && lines > 1) {
        truncateClass = 'overflow-hidden text-ellipsis';
      } else {
        truncateClass = 'truncate';
      }
    }
    const style = lines && lines > 1 ? {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: lines,
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    } : undefined;
    return (
      <Comp
        ref={ref}
        className={`${variantMap[variant] ?? ''} ${truncateClass} ${className}`.trim()}
        {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
        {...(role ? { role } : {})}
        {...(typeof tabIndex === 'number' ? { tabIndex } : {})}
        {...htmlProps}
        style={style}
      >
        {children}
      </Comp>
    );
  }
);

Text.displayName = 'Text';