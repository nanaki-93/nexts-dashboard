// TypeScript React
"use client";

import React from "react";
import {redirectToSpotifyAuthorize} from '@/app/lib/utils';

export function SpotifyLoginButton() {
    return (
        <button
            onClick={redirectToSpotifyAuthorize}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-500"
        >
            Continue with Spotify
        </button>
    );
}
