"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, LogOut, Wallet, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

type NavbarProps = {
  user?: {
    displayName: string;
    moodCoins: number;
  } | null;
};

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500">
            <Heart className="h-4 w-4 text-white" fill="white" />
          </div>
          <span className="text-lg font-semibold text-white">MoodCast</span>
        </Link>

        {user ? (
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/dashboard"
              className={cn(
                "text-sm text-slate-300 hover:text-white",
                pathname === "/dashboard" && "text-white font-medium"
              )}
            >
              Home
            </Link>
            <Link
              href="/feed"
              className={cn(
                "flex items-center gap-1 text-sm text-slate-300 hover:text-white",
                pathname === "/feed" && "text-white font-medium"
              )}
            >
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">Feed</span>
            </Link>
            <Link
              href="/wallet"
              className={cn(
                "flex items-center gap-1 text-sm text-slate-300 hover:text-white",
                pathname === "/wallet" && "text-white font-medium"
              )}
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">{user.moodCoins} coins</span>
            </Link>
            <span className="hidden text-sm text-slate-400 sm:inline">
              Hi, {user.displayName}
            </span>
            <button
              onClick={logout}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        ) : (
          <nav className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-4 py-2 text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
