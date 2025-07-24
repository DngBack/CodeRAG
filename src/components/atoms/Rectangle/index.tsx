import { forwardRef, ElementType } from 'react';
import Image from 'next/image';

export interface RectangleProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Rectangle size variant */
  size?: 'xl' | '2xl';
  /** Custom component type */
  as?: ElementType;
  /** Custom className for container */
  className?: string;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

const sizeClassMap = {
  xl: 'w-[32px] h-[32px]',
  '2xl': 'w-[40px] h-[40px]',
};
const sizePxMap = {
  xl: 32,
  '2xl': 40,
};

export const Rectangle = forwardRef<HTMLDivElement, RectangleProps>(
  (
    {
      src,
      alt = '',
      size = 'xl',
      as: Component = 'div',
      className = '',
      ariaLabel,
      ...rest
    },
    ref
  ) => (
    <Component
      ref={ref}
      className={`flex items-center justify-center flex-shrink-0 overflow-hidden bg-neutral-10 rounded-s ${sizeClassMap[size]} ${className}`}
      {...rest}
    >
      <Image
        src={src}
        alt={alt}
        width={sizePxMap[size]}
        height={sizePxMap[size]}
        className="object-cover rounded-s"
        draggable={false}
        role={alt ? undefined : 'presentation'}
        aria-label={ariaLabel || (alt ? undefined : 'decorative')}
        aria-hidden={alt ? undefined : 'true'}
      />
    </Component>
  )
);
Rectangle.displayName = 'Rectangle';

/** Thank you for your feedback. Please install the required dependencies with:
 * 
 * npm install react next
 * npm install --save-dev @types/react @types/node
 * 
 * Also, verify your tsconfig.json is configured for JSX and module resolution to ensure successful compilation and execution.
 */
