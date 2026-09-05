import ThemeToggle from '@/Components/ThemeToggle';

/** Fixed top-right control so theme works on every route (home, register, payments, admin). */
export default function GlobalThemeToggle() {
    return (
        <div className="pointer-events-none fixed right-3 top-3 z-[200] sm:right-5 sm:top-4">
            <div className="pointer-events-auto">
                <ThemeToggle />
            </div>
        </div>
    );
}
