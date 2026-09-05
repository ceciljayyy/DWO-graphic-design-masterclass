type NetworkLogoProps = {
    className?: string;
};

export function MtnLogo({ className = 'h-10 w-10' }: NetworkLogoProps) {
    return (
        <svg className={`rounded-lg ${className}`} viewBox="0 0 40 40" aria-hidden="true">
            <rect width="40" height="40" rx="10" fill="#FFCC00" />
            <text
                x="20"
                y="25"
                textAnchor="middle"
                fontFamily="Arial Black, Arial, sans-serif"
                fontSize="11"
                fontWeight="900"
                fill="#000000"
            >
                MTN
            </text>
        </svg>
    );
}

export function TelecelLogo({ className = 'h-10 w-10' }: NetworkLogoProps) {
    return (
        <img
            src="/images/networks/telecel.jpg"
            alt="Telecel"
            className={`rounded-lg object-cover ${className}`}
        />
    );
}

export function AirtelTigoLogo({ className = 'h-10 w-10' }: NetworkLogoProps) {
    return (
        <img
            src="/images/networks/airteltigo.png"
            alt="AT (AirtelTigo)"
            className={`rounded-lg object-cover ${className}`}
        />
    );
}
