"use client";

import { useState } from "react";

export default function CopyButton({
    text,
}: {
    text: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="rounded-md ml-1 text-sm font-semibold transition duration-300 hover:bg-gray-100"
        >
            {copied ? (
                <i className="fa-solid fa-check"></i>
            ) : (
                <i className="fa-regular fa-copy"></i>
            )}
        </button>
    );
}