'use client';

import * as React from "react"

import {cn} from "@/lib/utils"
import {useRef} from "react";

export interface InputProps extends React.ComponentProps<"input"> {
    onValidate?:  (value: string) => void;
    onCancel?: () => void;
}

function Input({onValidate, onCancel, onBlur, className, onChange, onKeyDown, type, ...props}: InputProps) {
    const [value, setValue] = React.useState('');
    const ref = useRef<HTMLInputElement>(null);
    const blurCause = useRef<"escape" | "enter">(null);

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            blurCause.current = "enter"
            ref?.current?.blur();
        }
        if (event.key === 'Escape') {
            blurCause.current = "escape"
            ref?.current?.blur();
        }
        onKeyDown?.(event);
    }

    function handleOnBlur(event: React.FocusEvent<HTMLInputElement>) {
        if (blurCause.current === "escape") {
            onCancel?.();
        }
        else {
            onValidate?.(value);
        }

        blurCause.current = null;

        onBlur?.(event);
    }

    function handleOnChange(event : React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
        onChange?.(event);
    }

    return (
        <input
            ref={ref}
            type={type}
            data-slot="input"
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            onBlur={handleOnBlur}
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    )
}

export {Input}
