"use client";

import { useState } from "react";
import { CheckInForm } from "./CheckInForm";

type ChangeMoodSectionProps = {
  currentMoodLabel: string;
  currentRoomName: string;
};

export function ChangeMoodSection({
  currentMoodLabel,
  currentRoomName,
}: ChangeMoodSectionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full rounded-2xl border border-dashed border-white/20 bg-white/5 px-5 py-4 text-left transition hover:border-violet-500/40 hover:bg-white/[0.07]"
      >
        <p className="text-sm font-medium text-white">My mood has changed</p>
        <p className="mt-1 text-xs text-slate-400">
          Feeling different? Update your mood and join a new room.
        </p>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <CheckInForm
        mode="change"
        currentMoodLabel={currentMoodLabel}
        currentRoomName={currentRoomName}
      />
      <button
        onClick={() => setExpanded(false)}
        className="text-xs text-slate-500 hover:text-slate-300"
      >
        Cancel
      </button>
    </div>
  );
}
