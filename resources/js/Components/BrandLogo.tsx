import { ImgHTMLAttributes } from 'react';

type Variant = 'full' | 'mark';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
    variant?: Variant;
    alt?: string;
};

const SRC: Record<Variant, string> = {
    full: '/brand/dwo-logo-white.png',
    mark: '/brand/dwo-logo-white.png',
};

/**
 * Official DWO mark — white artwork on transparent PNG.
 * Inverts automatically in light mode so it stays visible.
 */
export default function BrandLogo({
    variant = 'mark',
    className = '',
    alt = 'DWO',
    ...props
}: Props) {
    return (
        <img
            src={SRC[variant]}
            alt={alt}
            draggable={false}
            className={`dwo-brand-logo inline-block h-auto w-auto select-none object-contain ${className}`}
            {...props}
        />
    );
}
