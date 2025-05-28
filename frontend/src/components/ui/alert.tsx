import React from 'react';
import { cn } from '../../lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'destructive';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = 'default', ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="alert"
                className={cn(
                    'relative w-full rounded-lg border p-4',
                    {
                        'bg-red-50 border-red-200 text-red-800': variant === 'destructive',
                        'bg-blue-50 border-blue-200 text-blue-800': variant === 'default',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);

Alert.displayName = 'Alert';

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('text-sm [&_p]:leading-relaxed', className)}
                {...props}
            />
        );
    }
);

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription }; 