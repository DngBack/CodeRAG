import React from 'react';

export interface IconFakeProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  /** Icon size using Tailwind design tokens */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Tailwind text color class from design tokens */
  colorClass?: 'text-primary' | 'text-secondary' | 'text-tertiary' | 'text-alert' | 'text-disabled';
  /** Accessible label for the icon */
  ariaLabel?: string;
  /** Additional SVG className */
  className?: string;
  /** Component type to render */
  as?: React.ElementType;
}

const sizeMap: Record<NonNullable<IconFakeProps['size']>, string> = {
  sm: 'w-sm h-sm',
  md: 'w-md h-md',
  lg: 'w-lg h-lg',
  xl: 'w-xl h-xl',
  '2xl': 'w-2xl h-2xl',
};

export const IconFake = React.memo<IconFakeProps>(function IconFake({
  size = 'lg',
  colorClass = 'text-primary',
  ariaLabel = 'Fake icon',
  className,
  as: Component = 'svg',
  ...rest
}) {
  const ariaProps = ariaLabel ? { 'aria-label': ariaLabel } : {};
  return (
    <Component
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      className={`${sizeMap[size]} ${colorClass} ${className ?? ''}`.trim()}
      {...ariaProps}
      {...rest}
    >
      <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" />
      <path d="M8 12h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </Component>
  );
});

/** To resolve the errors and compile/run the component:

1. Install React and ReactDOM:
   npm install react react-dom

2. Install React type declarations:
   npm install --save-dev @types/react @types/react-dom

3. Update your tsconfig.json to include:
   "jsx": "react-jsx"

After these steps, your atom component will compile and run correctly.
*/