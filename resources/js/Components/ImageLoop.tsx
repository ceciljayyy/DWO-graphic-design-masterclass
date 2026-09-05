import { useEffect, useState } from 'react';

type Props = {
    images: string[];
    altPrefix: string;
    intervalMs?: number;
};

export default function ImageLoop({ images, altPrefix, intervalMs = 2200 }: Props) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) {
            return;
        }

        const id = window.setInterval(() => {
            setIndex((current) => (current + 1) % images.length);
        }, intervalMs);

        return () => window.clearInterval(id);
    }, [images.length, intervalMs]);

    if (images.length === 0) {
        return (
            <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl bg-black/40 text-sm text-zinc-500">
                No images yet
            </div>
        );
    }

    return (
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black">
            {images.map((src, i) => (
                <img
                    key={src}
                    src={src}
                    alt={`${altPrefix} ${i + 1}`}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                        i === index ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                />
            ))}
            {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                    {images.map((src, i) => (
                        <span
                            key={src}
                            className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-[#e8ff47]' : 'bg-white/35'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
