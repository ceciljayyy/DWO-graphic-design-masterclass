import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-full border border-transparent bg-[#e8ff47] px-4 py-2 text-xs font-bold uppercase tracking-widest text-black transition duration-150 ease-in-out hover:bg-[#f3ff7a] focus:outline-none focus:ring-2 focus:ring-[#e8ff47] focus:ring-offset-2 focus:ring-offset-[#0b0b0c] active:bg-[#d6ef2f] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
