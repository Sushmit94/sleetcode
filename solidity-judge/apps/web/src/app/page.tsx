"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { getProblems } from "@/lib/api";
import { Problem } from "@solidity-judge/shared";

const diffColor: Record<string, string> = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
};

export default function Home() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [filter, setFilter] = useState<string>("All");

    useEffect(() => {
        getProblems().then(setProblems);
    }, []);

    const difficulties = ["All", "Easy", "Medium", "Hard"];
    const filtered =
        filter === "All" ? problems : problems.filter((p) => p.difficulty === filter);

    return (
        <div className= "min-h-screen bg-bg text-white flex flex-col" >
        <Navbar />

        < main className = "max-w-4xl mx-auto w-full px-4 py-8" >
            <div className="mb-6" >
                <h2 className="text-xl font-semibold mb-1" > Problems </h2>
                    < p className = "text-sm text-gray-400" >
                        Write Solidity contracts.Your code is compiled and tested with{ " "}
                        < span className = "text-accent" > Foundry </span> in an isolated sandbox.
                            </p>
                            </div>

    {/* Filter tabs */ }
    <div className="flex gap-1 mb-5" >
    {
        difficulties.map((d) => (
            <button
              key= { d }
              onClick = {() => setFilter(d)}
    className = {`px-3 py-1 rounded text-sm transition-colors ${filter === d
        ? "bg-accent/20 text-accent border border-accent/30"
        : "text-gray-400 hover:text-white border border-transparent"
        }`
}
            >
    { d }
    </button>
          ))}
</div>

{/* Problem table */ }
<div className="rounded-lg border border-border overflow-hidden" >
    <table className="w-full text-sm" >
        <thead>
        <tr className="bg-surface text-gray-400 text-xs uppercase tracking-wider" >
            <th className="text-left px-4 py-3 w-8" ># </th>
                < th className = "text-left px-4 py-3" > Title </th>
                    < th className = "text-left px-4 py-3" > Difficulty </th>
                        < th className = "text-left px-4 py-3" > Tags </th>
                            < th className = "text-right px-4 py-3" > Acceptance </th>
                                </tr>
                                </thead>
                                <tbody>
{
    filtered.map((p, i) => (
        <tr
                  key= { p.id }
                  className = "border-t border-border hover:bg-surface/60 transition-colors"
        >
        <td className="px-4 py-3 text-gray-500" > { i + 1} </td>
            < td className = "px-4 py-3" >
                <Link
                      href={ `/problems/${p.slug}` }
className = "text-white hover:text-accent transition-colors font-medium"
    >
    { p.title }
    </Link>
    </td>
    < td className = {`px-4 py-3 ${diffColor[p.difficulty]}`}>
        { p.difficulty }
        </td>
        < td className = "px-4 py-3" >
            <div className="flex gap-1 flex-wrap" >
            {
                p.tags.map((t) => (
                    <span
                          key= { t }
                          className = "px-1.5 py-0.5 rounded text-xs bg-bg border border-border text-gray-400"
                    >
                    { t }
                    </span>
                ))
            }
                </div>
                </td>
                < td className = "px-4 py-3 text-right text-gray-400" >
                    { p.acceptanceRate > 0 ? `${p.acceptanceRate.toFixed(0)}%` : "—" }
                    </td>
                    </tr>
              ))}
{
    filtered.length === 0 && (
        <tr>
        <td colSpan={ 5 } className = "px-4 py-8 text-center text-gray-500" >
            No problems found.
                  </td>
                </tr>
              )
}
</tbody>
    </table>
    </div>
    </main>
    </div>
  );
}