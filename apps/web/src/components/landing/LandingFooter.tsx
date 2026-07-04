export function LandingFooter() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                    <div className="text-indigo-600 font-bold text-lg">SolidityCode</div>
                    <p className="text-xs text-slate-400 mt-1">
                        © 2026 SolidityCode. Precise. Secure. Decentralized.
                    </p>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500">
                    <a href="#" className="hover:text-slate-900 transition-colors">
                        Documentation
                    </a>
                    <a href="#" className="hover:text-slate-900 transition-colors">
                        Discord
                    </a>
                    <a href="#" className="hover:text-slate-900 transition-colors">
                        Github
                    </a>
                    <a href="#" className="hover:text-slate-900 transition-colors">
                        Status
                    </a>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Change language"
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                            <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
                            <path
                                d="M2.5 10h15M10 2.5c2 2.2 3 4.8 3 7.5s-1 5.3-3 7.5c-2-2.2-3-4.8-3-7.5s1-5.3 3-7.5z"
                                stroke="currentColor"
                                strokeWidth="1.4"
                            />
                        </svg>
                    </button>
                    <button
                        type="button"
                        aria-label="Toggle dark mode"
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M10 2a8 8 0 1 0 8 9.5A6.5 6.5 0 0 1 10 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    );
}
