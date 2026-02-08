import type { ReactNode, ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  noHover?: boolean;
  hoverStyle?: string; 
  variant?: 'primary' | 'secondary' | 'ghost' | 'ghostNoHover';
}

export default function Button({
  children,
  loading = false,
  variant = 'primary',
  disabled,
  className,
  noHover = false,
  hoverStyle,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.button,
        noHover && styles.noHover,
        hoverStyle && hoverStyle,
        styles[variant],
        loading && styles.loading,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Загрузка…' : children}
    </button>
  );
}
