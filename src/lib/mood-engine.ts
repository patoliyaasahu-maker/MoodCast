export const MOOD_CATEGORIES = [
  { label: "Stressed", keywords: ["stress", "stressed", "pressure", "overwhelmed", "burnout", "deadline", "exam", "workload"] },
  { label: "Anxious", keywords: ["anxious", "anxiety", "worried", "nervous", "panic", "fear", "scared", "uneasy"] },
  { label: "Sad", keywords: ["sad", "down", "depressed", "lonely", "alone", "cry", "crying", "heartbroken", "grief"] },
  { label: "Angry", keywords: ["angry", "mad", "furious", "frustrated", "annoyed", "irritated", "rage"] },
  { label: "Happy", keywords: ["happy", "joy", "excited", "grateful", "blessed", "good", "great", "amazing", "wonderful"] },
  { label: "Tired", keywords: ["tired", "exhausted", "sleepy", "drained", "fatigue", "burnt", "insomnia", "can't sleep"] },
  { label: "Confused", keywords: ["confused", "lost", "unsure", "uncertain", "don't know", "stuck", "conflicted"] },
  { label: "Hopeful", keywords: ["hopeful", "optimistic", "better", "healing", "moving on", "progress", "motivated"] },
  {
    label: "Stories",
    keywords: [
      "story",
      "stories",
      "school",
      "schooling",
      "childhood",
      "remember",
      "back in the day",
      "old days",
      "classroom",
      "teacher",
      "classmates",
      "recess",
      "tiffin",
      "assembly",
      "exam hall",
      "college days",
      "campus",
    ],
  },
  {
    label: "Work",
    keywords: [
      "office",
      "manager",
      "boss",
      "workplace",
      "colleague",
      "corporate",
      "release",
      "sprint",
      "deadline",
      "overtime",
      "politics",
      "promotion",
      "appraisal",
      "meeting",
      "micromanage",
      "workload",
      "burnout",
      "9 to 5",
      "wfh",
      "hybrid",
    ],
  },
] as const;

export type MoodAnalysis = {
  label: string;
  score: number;
  matchedKeywords: string[];
};

export function analyzeMood(text: string): MoodAnalysis {
  const normalized = text.toLowerCase();
  let best = { label: "Reflective", score: 0.3, matchedKeywords: [] as string[] };

  for (const category of MOOD_CATEGORIES) {
    const matched = category.keywords.filter((kw) => normalized.includes(kw));
    const score = matched.length > 0 ? Math.min(0.95, 0.4 + matched.length * 0.15) : 0;
    if (score > best.score) {
      best = { label: category.label, score, matchedKeywords: matched };
    }
  }

  if (best.score === 0.3 && text.trim().length > 20) {
    best.score = 0.45;
  }

  return best;
}

export function generateRoomName(moodLabel: string): string {
  const hour = new Date().getHours();

  if (moodLabel === "Stories") {
    const themes = ["Campus Tales", "School Days", "Memory Lane", "Backbench"];
    return `${themes[hour % themes.length]} Room`;
  }

  if (moodLabel === "Work") {
    const themes = ["Office Vent", "Release Week", "Manager Tales", "Standup Survivors"];
    return `${themes[hour % themes.length]} Room`;
  }

  const adjectives = ["Quiet", "Warm", "Open", "Safe", "Gentle", "Calm"];
  const adj = adjectives[hour % adjectives.length];
  return `${adj} ${moodLabel} Room`;
}
