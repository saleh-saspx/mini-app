import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
};

export default function Button({ variant = 'primary', className, ...props }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition',
        {
          'bg-brand-500 text-white hover:bg-brand-700': variant === 'primary',
          'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50': variant === 'secondary',
          'bg-rose-600 text-white hover:bg-rose-700': variant === 'danger'
        },
        className
      )}
      {...props}
    />
  );
}
