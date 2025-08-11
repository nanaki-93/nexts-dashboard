"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const LoginResponseSchema = z.object({
    accessToken: z.string().optional(), // or z.string() if always present
    refreshToken: z.string().optional(),
    user: z
        .object({
            id: z.string().or(z.number()),
            email: z.string().email().optional(),
            name: z.string().optional(),
            // add fields you expect
        })
        .optional(),
    // optionally include message, etc.
    message: z.string().optional(),
});

type LoginResponse = z.infer<typeof LoginResponseSchema>;

export default function CodeExchangeHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code) return;

        let cancelled = false;

        (async () => {
            setError(null);

            try {
                const res = await fetch("http://localhost:8080/api/v1/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // Include cookies if backend sets httpOnly session cookies
                    credentials: "include",
                    body: JSON.stringify({ code }),
                });

                // Try to parse JSON only when present
                const contentType = res.headers.get("content-type") || "";
                const maybeJson =
                    contentType.includes("application/json")
                        ? ((await res.json()) as unknown)
                        : null;

                if (!res.ok) {
                    const serverMessage =
                        (maybeJson && (maybeJson as any).message) || (await res.text());
                    setError(serverMessage || `Request failed with ${res.status}`);
                    return;
                }

                // Validate the shape to avoid runtime surprises
                const data = LoginResponseSchema.safeParse(maybeJson);
                if (!data.success) {
                    setError("Unexpected response from server");
                    return;
                }

                const payload: LoginResponse = data.data;

                // Prefer httpOnly cookie set by the server (with credentials: 'include').
                // If tokens are returned and you must store them client-side, do it carefully.
                if (payload.accessToken) {
                    // Note: localStorage is vulnerable to XSS; prefer httpOnly cookies.
                    localStorage.setItem("access_token", payload.accessToken);
                }
                if (payload.refreshToken) {
                    localStorage.setItem("refresh_token", payload.refreshToken);
                }

                // Optionally, cache minimal user info for UI
                if (payload.user) {
                    sessionStorage.setItem("current_user", JSON.stringify(payload.user));
                }

                if (!cancelled) {
                    router.push("/dashboard");
                }
            } catch (err) {
                if (!cancelled) {
                    setError("Network error. Please try again.");
                    // Optionally log err to your telemetry
                    // console.error(err);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [searchParams, router]);

    // Optionally render feedback (can be replaced with a toast)
    if (error) {
        // You can replace this with your UI alert component
        console.error("Login error:", error);
    }

    return null;
}
