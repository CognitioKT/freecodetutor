import React from 'react';
import type { ButtonProps } from './types';

const computeClassNames = ({
  size,
  variant,
  disabled,
  block
}: {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  disabled?: boolean;
  block?: boolean;
}) => {
  const classNames = [
    'relative cursor-pointer border-3 border-solid text-center no-underline active:before:w-full active:before:h-full active:before:absolute active:before:inset-0 active:before:border-3 active:before:border-transparent active:before:bg-gray-900 active:before:opacity-20 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 focus:outline-none focus:ring focus:ring-focus-outline-color'
  ];

  if (block) {
    classNames.push('block', 'w-full');
  }

  switch (variant) {
    case 'danger':
      classNames.push(
        'border-foreground-danger',
        'bg-background-danger',
        'text-foreground-danger',
        ...(disabled
          ? ['active:before:hidden']
          : [
              'hover:bg-foreground-danger',
              'hover:text-background-danger',
              'dark:hover:bg-background-danger',
              'dark:hover:text-foreground-danger'
            ])
      );
      break;
    case 'info':
      classNames.push(
        'border-foreground-info',
        'bg-background-info',
        'text-foreground-info',
        ...(disabled
          ? ['active:before:hidden']
          : [
              'hover:bg-foreground-info',
              'hover:text-background-info',
              'dark:hover:bg-background-info',
              'dark:hover:text-foreground-info'
            ])
      );
      break;
    // default variant is 'primary'
    default:
      classNames.push(
        'border-foreground-secondary',
        'bg-background-quaternary',
        'text-foreground-secondary',
        ...(disabled
          ? ['active:before:hidden']
          : [
              'hover:bg-foreground-primary',
              'hover:text-background-primary',
              'dark:hover:bg-background-primary',
              'dark:hover:text-foreground-primary'
            ])
      );
  }

  switch (size) {
    case 'large':
      classNames.push('px-4 py-[10px] text-lg');
      break;
    case 'small':
      classNames.push('px-2.5 py-1 text-sm');
      break;
    // default size is 'medium'
    default:
      classNames.push('px-3 py-1.5 text-md');
  }

  return classNames.join(' ');
};

const StylessButton = React.forwardRef<React.ElementRef<'button'>, ButtonProps>(
  ({ className, onClick, disabled, children, type, ...rest }, ref) => {
    // Manually prevent click event if the button is disabled
    // as `aria-disabled` marks the element disabled but still registers the click event.
    // Ref: https://css-tricks.com/making-disabled-buttons-more-inclusive/#aa-the-difference-between-disabled-and-aria-disabled

    return (
      <button
        className={className}
        {...(disabled === true
          ? { onClick: () => void {} }
          : { onClick: onClick })}
        aria-disabled={disabled}
        ref={ref}
        type={type ?? 'button'}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

const Link = React.forwardRef<
  React.ElementRef<'a'>,
  ButtonProps<HTMLAnchorElement>
>(({ className, href, download, target, children, ...rest }, ref) => {
  return (
    <a
      className={className}
      download={download}
      target={target}
      ref={ref}
      href={href ?? undefined}
      {...rest}
    >
      {children}
    </a>
  );
});

export const HeadlessButton = React.forwardRef<
  React.ElementRef<'button' | 'a'>,
  ButtonProps<HTMLAnchorElement | HTMLButtonElement>
>(
  (
    { onClick, className, children, disabled, href, download, target, ...rest },
    ref
  ) => {
    if (href && !disabled) {
      return (
        <Link
          className={className}
          href={href}
          download={download}
          target={target}
          ref={ref as React.Ref<HTMLAnchorElement>}
          onClick={onClick}
          {...rest}
        >
          {children}
        </Link>
      );
    } else {
      return (
        <StylessButton
          className={className}
          onClick={onClick}
          aria-disabled={disabled}
          ref={ref as React.Ref<HTMLButtonElement>}
          {...rest}
        >
          {children}
        </StylessButton>
      );
    }
  }
);

export const Button = React.forwardRef<
  React.ElementRef<'button' | 'a'>,
  ButtonProps
>(({ className, size, disabled, variant, block, ...rest }, ref) => {
  const classes = computeClassNames({ size, variant, disabled, block });

  const buttonStyle = [className, classes].join(' ');

  return (
    <HeadlessButton
      className={buttonStyle}
      ref={ref}
      disabled={disabled}
      {...rest}
    />
  );
});

Button.displayName = 'Button';
HeadlessButton.displayName = 'HeadlessButton';
StylessButton.displayName = 'StylessButton';
Link.displayName = 'Link';
