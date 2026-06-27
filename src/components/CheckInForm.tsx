"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Card } from "./Card";

type CheckInFormProps = {
  mode?: "checkin" | "change";
  currentMoodLabel?: string;
  currentRoomName?: string;
};

export function CheckInForm({
  mode = "checkin",
  currentMoodLabel,
  currentRoomName,
}: CheckInFormProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isChange = mode === "change";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, changeMood: isChange }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Check-in failed");
      return;
    }

    router.push(`/room/${data.room.id}`);
    router.refresh();
  }

  return (
    <Card title={isChange ? "Update your mood" : "Daily mood check-in"}>
      {isChange ? (
        <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
          <p className="text-sm text-amber-200">
            You&apos;re currently in <strong>{currentRoomName}</strong> ({currentMoodLabel}).
          </p>
          <p className="mt-1 text-xs text-amber-200/70">
            Updating your mood will leave this room and match you with people feeling your new mood.
            Your posts here stay until the room expires.
          </p>
        </div>
      ) : (
        <p className="mb-4 text-sm text-slate-300">
          Right now, in your own words — how are you feeling?
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isChange
              ? "e.g. I was stressed earlier but now I feel calmer and hopeful..."
              : "e.g. Anxious about tomorrow… or share a funny school memory from the old days"
          }
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          required
          minLength={3}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading || text.length < 3}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-white disabled:opacity-50 ${
            isChange
              ? "bg-gradient-to-r from-amber-600 to-violet-600"
              : "bg-gradient-to-r from-violet-600 to-pink-600"
          }`}
        >
          {loading ? (
            "Reading your mood..."
          ) : isChange ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Update mood & join new room
            </>
          ) : (
            "Check in & find my room"
          )}
        </button>
      </form>
    </Card>
  );
}
