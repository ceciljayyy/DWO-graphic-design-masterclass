import { ButtonHTMLAttributes, useState } from 'react';

type Props = {
    value: string;
    label?: string;
    copiedLabel?: string;
    variant?: 'button' | 'icon';
    className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children' | 'value'>;

export default function CopyButton({
    value,
    label = 'Copy',
    copiedLabel = 'Copied',
    variant = 'button',
    className = '',
    ...props
}: Props) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            const el = document.createElement('textarea');
            el.value = value;
            el.setAttribute('readonly', '');
            el.style.position = 'fixed';
            el.style.opacity = '0';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        }
    };

    if (variant === 'icon') {
        return (
            <button
                type="button"
                onClick={() => void copy()}
                aria-label={copied ? copiedLabel : `Copy ${value}`}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ff47] ${className}`}
                {...props}
            >
                {copied ? '✓' : '⧉'}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => void copy()}
            aria-label={copied ? copiedLabel : label}
            className={`inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8ff47] ${className}`}
            {...props}
        >
            {copied ? `✓ ${copiedLabel}` : label}
        </button>
    );
}
