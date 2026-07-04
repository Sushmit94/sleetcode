export function ShieldIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M12 3l7 3v5c0 4.5-3 8.2-7 9.5-4-1.3-7-5-7-9.5V6l7-3z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="11" r="1.6" fill="currentColor" />
            <path d="M12 12.5v2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
    );
}

export function BoltIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
    );
}

export function CubeIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path d="M4 7.5 12 12l8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}

export function HubIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="2.3" fill="currentColor" />
            <circle cx="5" cy="6" r="1.8" fill="currentColor" />
            <circle cx="19" cy="6" r="1.8" fill="currentColor" />
            <circle cx="5" cy="18" r="1.8" fill="currentColor" />
            <circle cx="19" cy="18" r="1.8" fill="currentColor" />
            <path
                d="M6.3 7.3 10.2 10.6M17.7 7.3 13.8 10.6M6.3 16.7 10.2 13.4M17.7 16.7 13.8 13.4"
                stroke="currentColor"
                strokeWidth="1.4"
            />
        </svg>
    );
}

export function LockIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
        </svg>
    );
}

export function CoinsIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <ellipse cx="9" cy="7" rx="6" ry="3" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 11v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx="17" cy="13" rx="4" ry="2.2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
    );
}

export function PaletteIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M12 3a9 8 0 1 0 0 16c1.4 0 2-1 2-1.8 0-.5-.3-.9-.3-1.4 0-.9.7-1.3 1.6-1.3H17c2.2 0 4-1.6 4-4.2C21 6 17 3 12 3z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" />
            <circle cx="10.5" cy="7" r="1.2" fill="currentColor" />
            <circle cx="15" cy="8" r="1.2" fill="currentColor" />
        </svg>
    );
}

export function ArrowRightIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" className={className}>
            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function WindowIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 20 20" fill="none" className={className}>
            <rect x="3" y="4" width="14" height="12" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 7.5h14" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

export function AlertIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
            <path d="M10 2 1.5 17h17L10 2z" opacity="0.15" />
            <path d="M10 8v4.2M10 14.4v.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M10 2 1.5 17h17L10 2z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round" />
        </svg>
    );
}
