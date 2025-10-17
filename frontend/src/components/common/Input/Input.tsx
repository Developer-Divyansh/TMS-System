import React from 'react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  type?: string;
  rows?: number;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, InputProps>(
  ({ className, label, error, helperText, containerClassName, type, rows, children, onChange, ...props }, ref) => {
    const isTextarea = type === 'textarea';
    const isSelect = type === 'select';

    return (
      <div className={`w-full ${containerClassName || ''}`}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        {isTextarea ? (
          <textarea
            className={`input ${error ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''} ${className || ''}`}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows || 4}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : isSelect ? (
          <select
            className={`input ${error ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''} ${className || ''}`}
            ref={ref as React.Ref<HTMLSelectElement>}
            onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
            {...(props as unknown as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
        ) : (
          <input
            className={`input ${error ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''} ${className || ''}`}
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            {...(props as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && (
          <p className="mt-1 text-sm text-danger-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };