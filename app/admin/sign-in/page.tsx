"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { LockKeyhole, Loader2 } from "lucide-react";
import { brand } from "../../../config/brand";

export default function AdminSignInPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const params = new URLSearchParams(window.location.search);
    const response = await fetch("/api/admin/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, next: params.get("next") || "/admin" })
    });
    const payload = await response.json() as { next?: string; error?: string };

    if (!response.ok) {
      setError(payload.error || "Incorrect password.");
      setLoading(false);
      return;
    }

    window.location.href = payload.next || "/admin";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-12 text-charcoal">
      <form onSubmit={signIn} className="corner-frame w-full max-w-md rounded-lg border border-pine/15 bg-white p-7 shadow-luxury">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-md border border-gold/50 bg-pine font-serif text-xl font-semibold text-gold">S</span>
          <span>
            <span className="block font-serif text-xl font-semibold leading-5 text-pine">{brand.shortName}</span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-charcoal/45">Admin Access</span>
          </span>
        </Link>
        <div className="editorial-rule mt-6" />
        <div className="mt-7 flex h-12 w-12 items-center justify-center rounded-md border border-gold/40 bg-cream">
          <LockKeyhole className="text-gold" size={22} />
        </div>
        <h1 className="mt-5 font-serif text-4xl font-semibold text-pine">Private admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-charcoal/65">Internal operating metrics are restricted. Enter the admin password to continue.</p>
        <label className="mt-6 block text-sm font-semibold text-pine">
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            className="mt-2 h-12 w-full rounded-md border border-pine/20 bg-cream px-3 text-sm outline-none transition focus:border-gold focus:bg-white"
          />
        </label>
        {error ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={!password || loading}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-pine px-5 text-sm font-bold text-white transition hover:bg-forest disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={17} /> : <LockKeyhole size={17} />}
          Sign in
        </button>
      </form>
    </main>
  );
}
