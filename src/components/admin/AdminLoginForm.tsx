"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as {
        success: boolean;
        error?: { message?: string };
      };

      if (!response.ok || !payload.success) {
        setError(payload.error?.message || "Invalid email or password.");
        setIsSubmitting(false);
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
      <div>
        <label htmlFor="admin-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-sm border border-border bg-background px-4 py-3 text-base outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </div>

      <div>
        <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 min-h-12 w-full rounded-sm border border-border bg-background px-4 py-3 text-base outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="min-h-12 w-full">
        {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
      </Button>
    </form>
  );
}
