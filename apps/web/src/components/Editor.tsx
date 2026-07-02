"use client";

import MonacoEditor from "@monaco-editor/react";
import { useRef, useState } from "react";

interface EditorProps {
    defaultCode: string;
    onSubmit: (code: string) => void;
    isSubmitting: boolean;
}

export function Editor({ defaultCode, onSubmit, isSubmitting }: EditorProps) {
    const codeRef = useRef(defaultCode);
    const [fontSize, setFontSize] = useState(14);

    return (
        <div className="flex flex-col h-full">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface text-xs text-gray-400">
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                    Solution.sol
                </span>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1">
                        Font
                        <select
                            className="bg-bg border border-border rounded px-1 py-0.5 text-xs ml-1"
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                        >
                            {[12, 13, 14, 16, 18].map((s) => (
                                <option key={s} value={s}>{s}px</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            {/* Monaco */}
            <div className="flex-1">
                <MonacoEditor
                    height="100%"
                    defaultLanguage="sol"
                    defaultValue={defaultCode}
                    theme="vs-dark"
                    options={{
                        fontSize,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        lineNumbers: "on",
                        lineNumbersMinChars: 3,
                        glyphMargin: false,
                        tabSize: 4,
                        wordWrap: "on",
                        padding: { top: 12 },
                        fontLigatures: true,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                    onChange={(val) => { codeRef.current = val ?? ""; }}
                    beforeMount={(monaco) => {
                        // Register Solidity as a language if not already
                        const langs = monaco.languages.getLanguages();
                        if (!langs.find((l) => l.id === "sol")) {
                            monaco.languages.register({ id: "sol", extensions: [".sol"] });
                            monaco.languages.setMonarchTokensProvider("sol", {
                                keywords: ["pragma", "solidity", "contract", "function", "returns", "public", "private",
                                    "external", "internal", "view", "pure", "payable", "memory", "storage", "calldata",
                                    "uint256", "uint", "int", "address", "bool", "bytes", "string", "mapping", "struct",
                                    "event", "emit", "require", "revert", "if", "else", "for", "while", "return", "new",
                                    "delete", "import", "is", "override", "virtual", "constructor", "modifier", "assembly"],
                                tokenizer: {
                                    root: [
                                        [/[a-zA-Z_]\w*/, { cases: { "@keywords": "keyword", "@default": "identifier" } }],
                                        [/\/\/.*$/, "comment"],
                                        [/\/\*/, "comment", "@comment"],
                                        [/".*?"/, "string"],
                                        [/\d+/, "number"],
                                    ],
                                    comment: [
                                        [/\*\//, "comment", "@pop"],
                                        [/./, "comment"],
                                    ],
                                },
                            });
                        }
                    }}
                />
            </div>

            {/* Submit bar */}
            <div className="flex items-center gap-3 px-4 py-2 border-t border-border bg-surface">
                <button
                    onClick={() => onSubmit(codeRef.current)}
                    disabled={isSubmitting}
                    className="px-5 py-1.5 rounded text-sm font-medium bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? "Running tests…" : "Submit"}
                </button>
                <span className="text-xs text-gray-500">
                    Runs <code className="text-gray-300">forge test</code> against hidden test cases
                </span>
            </div>
        </div>
    );
}
