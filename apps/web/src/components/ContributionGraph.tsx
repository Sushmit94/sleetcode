"use client";

import { HeatmapEntry } from "@solidity-judge/shared";

const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const LEVEL_COLORS = [
    "bg-slate-100",
    "bg-indigo-100",
    "bg-indigo-300",
    "bg-indigo-500",
    "bg-indigo-700",
];

function levelFor(count: number): number {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count <= 4) return 3;
    return 4;
}

export function ContributionGraph({ data }: { data: HeatmapEntry[] }) {
    if (data.length === 0) return null;

    // Left-pad so the grid aligns to Sunday-start weeks, GitHub/LeetCode-style.
    const firstDow = new Date(data[0].date + "T00:00:00Z").getUTCDay();
    const padded: (HeatmapEntry | null)[] = [
        ...Array.from({ length: firstDow }, () => null),
        ...data,
    ];

    const weeks: (HeatmapEntry | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
        weeks.push(padded.slice(i, i + 7));
    }

    const monthLabels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
        const firstReal = week.find((d) => d !== null);
        if (!firstReal) return;
        const month = new Date(firstReal.date + "T00:00:00Z").getUTCMonth();
        if (month !== lastMonth) {
            monthLabels.push({ weekIndex: i, label: MONTH_LABELS[month] });
            lastMonth = month;
        }
    });

    const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
    const totalActiveDays = data.filter((d) => d.count > 0).length;

    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
                <div className="flex gap-[3px] mb-1 pl-6">
                    {weeks.map((_, i) => {
                        const label = monthLabels.find((m) => m.weekIndex === i);
                        return (
                            <div key={i} className="w-[11px] shrink-0 relative">
                                {label && (
                                    <span className="absolute -top-0.5 left-0 whitespace-nowrap text-[10px] text-slate-400">
                                        {label.label}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex gap-[3px]">
                    <div className="flex flex-col gap-[3px] pr-1">
                        {dayLabels.map((l, i) => (
                            <div key={i} className="h-[11px] leading-[11px] text-[10px] text-slate-400">
                                {l}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-[3px]">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-[3px]">
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        title={
                                            day
                                                ? `${day.count} submission${day.count === 1 ? "" : "s"} on ${day.date}`
                                                : undefined
                                        }
                                        className={`w-[11px] h-[11px] rounded-sm ${
                                            day ? LEVEL_COLORS[levelFor(day.count)] : "bg-transparent"
                                        }`}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
                {totalActiveDays} active day{totalActiveDays === 1 ? "" : "s"} in the last year
            </p>
        </div>
    );
}
