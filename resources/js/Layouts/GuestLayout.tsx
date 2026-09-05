import BrandLogo from '@/Components/BrandLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="dwo-page flex flex-col items-center px-4 pb-10 pt-6 sm:justify-center sm:px-6 sm:pt-0">
            <div className="mb-4 flex w-full max-w-md items-center justify-between">
                <Link href="/" className="dwo-display text-2xl tracking-[0.06em]">
                    DWO
                </Link>
                <ThemeToggle />
            </div>
            <div>
                <Link href="/">
                    <BrandLogo className="h-16 max-w-[5rem] sm:h-20 sm:max-w-[6rem]" />
                </Link>
            </div>

            <div className="dwo-glass-panel mt-6 w-full max-w-md overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
                {children}
            </div>
        </div>
    );
}
