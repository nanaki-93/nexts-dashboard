
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CodeExchangeHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) return;

        (async () => {
            try {
                const res = await fetch("http://localhost:8080/api/v1/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });

                if (res.ok) {
                    router.push("/dashboard");
                } else {
                    // Optional: handle error or display a message
                    console.error("Code exchange failed:", await res.text());
                }
            } catch (err) {
                console.error("Request error:", err);
            }
        })();
    }, [searchParams, router]);

    return null;
}
