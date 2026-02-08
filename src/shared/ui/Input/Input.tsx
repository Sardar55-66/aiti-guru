import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  onClear?: () => void;
  wrapperClassName?: string;
}

export default function Input({
  label,
  error,
  iconLeft,
  iconRight,
  onClear,
  className,
  wrapperClassName,
  ...props
}: InputProps) {
  const hasError = Boolean(error);

  return (
    <div className={clsx(styles.field, className)}>
      {label && <label className={styles.label}>{label}</label>}

      <div
        className={clsx(
          styles.wrapper,
          hasError && styles.error,
          wrapperClassName
        )}
      >
        {iconLeft && <div className={styles.iconLeft}>{iconLeft}</div>}

        <input className={styles.input} {...props} />

        {onClear && props.value && (
          <button
            type="button"
            className={styles.clear}
            onClick={onClear}
          >
            ×
          </button>
        )}

        {iconRight && <div className={styles.iconRight}>{iconRight}</div>}
      </div>

      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
