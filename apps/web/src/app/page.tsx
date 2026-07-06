import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import {
    AlertIcon,
    ArrowRightIcon,
    BoltIcon,
    CoinsIcon,
    CubeIcon,
    HubIcon,
    LockIcon,
    PaletteIcon,
    ShieldIcon,
    WindowIcon,
} from "@/components/landing/icons";

type IconComponent = (props: { className?: string }) => React.JSX.Element;

interface Pathway {
    icon: IconComponent;
    iconBg: string;
    title: string;
    desc: string;
    badges?: { label: string; className: string }[];
    enrolled?: boolean;
    watermark: IconComponent | null;
}

const pathways: Pathway[] = [
    {
        icon: ShieldIcon,
        iconBg: "bg-indigo-100 text-indigo-600",
        title: "DeFi Security & Audit",
        desc: "Learn to identify complex vulnerabilities like reentrancy, sandwich attacks, and oracle manipulation through hands-on bug hunting.",
        badges: [
            { label: "12 Modules", className: "bg-slate-100 text-slate-600" },
            { label: "Advanced", className: "bg-emerald-100 text-emerald-700" },
        ],
        watermark: LockIcon,
    },
    {
        icon: BoltIcon,
        iconBg: "bg-emerald-100 text-emerald-600",
        title: "Gas Optimization",
        desc: "Master EVM assembly and storage patterns to build ultra-efficient protocols.",
        badges: [{ label: "Best Seller", className: "bg-indigo-100 text-indigo-700" }],
        watermark: CoinsIcon,
    },
    {
        icon: CubeIcon,
        iconBg: "bg-amber-100 text-amber-600",
        title: "NFT Architectures",
        desc: "Deploy scalable ERC721A and ERC1155 contracts with advanced on-chain logic.",
        badges: [{ label: "Beginner Friendly", className: "bg-blue-100 text-blue-700" }],
        watermark: PaletteIcon,
    },
    {
        icon: HubIcon,
        iconBg: "bg-violet-100 text-violet-600",
        title: "EVM Mechanics",
        desc: "Deep dive into the Ethereum Virtual Machine. Understanding opcodes, the stack, and memory management for truly professional code.",
        enrolled: true,
        watermark: null,
    },
];

interface ActivityEntry {
    user: string;
    action: string;
    target: string;
    tag: string;
    tagClassName: string;
    dotClassName: string;
    time: string;
}

const activityFeed: ActivityEntry[] = [
    {
        user: "0x7a3f…9c1b",
        action: "solved",
        target: "Reentrancy Guard",
        tag: "Hard",
        tagClassName: "text-rose-600",
        dotClassName: "bg-emerald-500",
        time: "2m ago",
    },
    {
        user: "audit_by_ana",
        action: "flagged a critical bug in",
        target: "Flash Loan Oracle",
        tag: "Critical",
        tagClassName: "text-rose-600",
        dotClassName: "bg-rose-500",
        time: "5m ago",
    },
    {
        user: "gas_wizard.eth",
        action: "optimized",
        target: "ERC721A Mint Loop",
        tag: "-38% gas",
        tagClassName: "text-indigo-600",
        dotClassName: "bg-indigo-500",
        time: "11m ago",
    },
    {
        user: "0x2b88…ef01",
        action: "solved",
        target: "Integer Overflow Check",
        tag: "Easy",
        tagClassName: "text-emerald-600",
        dotClassName: "bg-emerald-500",
        time: "18m ago",
    },
    {
        user: "0x9f14…22ac",
        action: "solved",
        target: "EVM Storage Collision",
        tag: "Medium",
        tagClassName: "text-amber-600",
        dotClassName: "bg-emerald-500",
        time: "26m ago",
    },
];

function VulnerableVaultCard() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="mx-auto text-xs text-slate-400 font-mono">VulnerableVault.sol</span>
            </div>
            <pre className="text-[13px] leading-6 font-mono px-5 py-5 overflow-x-auto text-slate-800">
                <code>
                    <span className="text-violet-600">pragma</span> solidity{" "}
                    <span className="text-emerald-600">^0.8.0</span>;{"\n"}
                    <span className="text-violet-600">contract</span>{" "}
                    <span className="text-blue-600">VulnerableVault</span> {"{"}
                    {"\n"}
                    {"  "}
                    <span className="text-slate-400 italic">
                        // BUG: Reentrancy vulnerability in withdrawal logic
                    </span>
                    {"\n"}
                    {"  "}
                    <span className="text-violet-600">mapping</span>(
                    <span className="text-blue-600">address</span> =&gt;{" "}
                    <span className="text-blue-600">uint256</span>) <span className="text-violet-600">public</span>{" "}
                    balances;{"\n"}
                    {"  "}
                    <span className="text-violet-600">function</span> withdraw(
                    <span className="text-blue-600">uint256</span> _amount){" "}
                    <span className="text-violet-600">public</span> {"{"}
                    {"\n"}
                    {"    "}
                    <span className="text-violet-600">require</span>(balances[msg.sender] {">="} _amount);
                    {"\n\n"}
                    {"    "}(<span className="text-blue-600">bool</span> success, ) = msg.sender.call{"{"}value:
                    _amount{"}"}(<span className="text-emerald-600">""</span>);{"\n"}
                    {"    "}
                    <span className="text-violet-600">require</span>(success);{"\n\n"}
                    {"    "}
                    <span className="text-slate-400 italic">// STATE CHANGE AFTER EXTERNAL CALL</span>
                    {"\n"}
                    {"    "}balances[msg.sender] -= _amount;{"\n"}
                    {"  "}
                    {"}"}
                    {"\n"}
                    {"}"}
                </code>
            </pre>
            <div className="flex justify-end px-5 pb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full">
                    <AlertIcon className="w-3.5 h-3.5" />
                    CRITICAL VULNERABILITY DETECTED
                </span>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            <LandingNavbar />

            <main>
                {/* Hero */}
                <section
                    className="relative overflow-hidden px-6 pt-16 pb-20"
                    style={{
                        backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
                        backgroundSize: "22px 22px",
                        backgroundColor: "#fafbff",
                    }}
                >
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                LIVE: Mainnet Bug Hunt #42
                            </span>

                            <h1 className="text-5xl font-extrabold tracking-tight mb-5">
                                Master the
                                <br />
                                <span className="text-indigo-600">Ethereum</span> Stack.
                            </h1>

                            <p className="text-slate-500 text-lg mb-8 max-w-lg">
                                Accelerate your Web3 engineering career with professional-grade Solidity
                                challenges. Audit, optimize, and deploy secure smart contracts in an elite
                                developer environment.
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    href="/problems"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                                >
                                    Start Coding
                                    <WindowIcon className="w-4 h-4" />
                                </Link>
                                <a
                                    href="#"
                                    className="inline-flex items-center px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Explore Bug Hunts
                                </a>
                            </div>
                        </div>

                        <VulnerableVaultCard />
                    </div>
                </section>

                {/* Pathways to Mastery */}
                <section className="px-6 py-20">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Pathways to Mastery</h2>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {pathways.map((p) => (
                                <div
                                    key={p.title}
                                    className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50/40 p-7"
                                >
                                    {p.watermark && (
                                        <p.watermark className="pointer-events-none absolute -right-4 -bottom-4 w-28 h-28 text-slate-900/5" />
                                    )}

                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${p.iconBg}`}>
                                        <p.icon className="w-[22px] h-[22px]" />
                                    </div>

                                    <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                                    <p className="text-sm text-slate-500 mb-5 max-w-md relative z-10">{p.desc}</p>

                                    {p.badges && (
                                        <div className="flex gap-2 relative z-10">
                                            {p.badges.map((b) => (
                                                <span
                                                    key={b.label}
                                                    className={`text-xs font-medium px-2.5 py-1 rounded-md ${b.className}`}
                                                >
                                                    {b.label}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {p.enrolled && (
                                        <div className="flex items-center gap-3 relative z-10">
                                            <div className="flex -space-x-2">
                                                <span className="w-7 h-7 rounded-full bg-slate-800 border-2 border-white" />
                                                <span className="w-7 h-7 rounded-full bg-slate-400 border-2 border-white" />
                                            </div>
                                            <span className="text-xs font-medium text-indigo-600">+4k</span>
                                            <span className="text-xs text-slate-500">Engineers enrolled this month</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Live Activity */}
                <section id="activity" className="px-6 py-20 bg-indigo-50/50">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Live on the Network</h2>
                                <p className="text-sm text-slate-500">
                                    Real submissions from engineers hunting bugs right now.
                                </p>
                            </div>
                            <a
                                href="/problems"
                                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                Join the Hunt
                                <ArrowRightIcon className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
                                <span className="w-3 h-3 rounded-full bg-red-400" />
                                <span className="w-3 h-3 rounded-full bg-amber-400" />
                                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                                <span className="mx-auto text-xs text-slate-400 font-mono">live-feed.log</span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    LIVE
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 font-mono text-sm">
                                {activityFeed.map((entry, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                                    >
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${entry.dotClassName}`} />
                                        <span className="text-slate-500 w-28 shrink-0 truncate">{entry.user}</span>
                                        <span className="text-slate-400 hidden sm:inline shrink-0">{entry.action}</span>
                                        <span className="text-slate-800 font-medium truncate">{entry.target}</span>
                                        <span className={`ml-auto text-xs font-medium shrink-0 ${entry.tagClassName}`}>
                                            {entry.tag}
                                        </span>
                                        <span className="text-slate-400 text-xs w-14 shrink-0 text-right">
                                            {entry.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 py-24 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Ready to secure the future?</h2>
                        <p className="text-slate-500 mb-8">
                            Join 15,000+ developers shipping production-ready smart contracts every day.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/signup"
                                className="px-6 py-3 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
                            >
                                Create Free Account
                            </Link>
                            <a
                                href="#"
                                className="px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
                            >
                                Join Discord Community
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}
