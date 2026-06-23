import Link from "next/link";

export function Navbar() {
  return (
    <nav className="h-12 border-b border-border bg-surface flex items-center px-4 gap-4">
      <Link href="/" className="text-accent font-semibold text-sm tracking-tight">
        ⬡ SolidityJudge
      </Link>
      <span className="text-xs text-gray-500">Practice smart contracts with real Foundry tests</span>
    </nav>
  );
}