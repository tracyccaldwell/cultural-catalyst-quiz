export type Likert = 1 | 2 | 3 | 4 | 5;

export const LIKERT_LABELS = [
  "Strongly disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly agree",
] as const;

export type CatalystQuestion = { id: string; text: string };
export type LevelQuestion = { id: string; text: string; level: 1 | 2 | 3 | 4 | 5 };

// Part 1 — Cultural Catalyst dimension (6 questions, sum = 6–30)
export const CATALYST_QUESTIONS: CatalystQuestion[] = [
  { id: "c1", text: "I am actively creating new cultural norms in my industry or community." },
  { id: "c2", text: "I innovate in how things are done, said, or expressed in my field." },
  { id: "c3", text: "My work is deeply aligned with my life's purpose or mission." },
  { id: "c4", text: "There is a higher purpose behind my work — beyond income or recognition." },
  { id: "c5", text: "What I do is making the world measurably better." },
  { id: "c6", text: "I am a voice that challenges the status quo and invites others to think differently." },
];

// Part 2 — Maxwell's 5 Levels of Leadership (2 questions per level)
export const LEVEL_QUESTIONS: LevelQuestion[] = [
  // L1 Position — people follow because they have to
  { id: "l1a", level: 1, text: "People follow me primarily because of my title, role, or authority." },
  { id: "l1b", level: 1, text: "I rely on my position to get things done with my team." },
  // L2 Permission — people follow because they want to
  { id: "l2a", level: 2, text: "I have built genuine, trusting relationships with the people I lead." },
  { id: "l2b", level: 2, text: "People choose to follow me because they like and respect me as a person." },
  // L3 Production — people follow because of results
  { id: "l3a", level: 3, text: "I consistently produce meaningful results that others can see and rally around." },
  { id: "l3b", level: 3, text: "My team produces results because of the momentum I create." },
  // L4 People Development — people follow because of what I've done for them
  { id: "l4a", level: 4, text: "I actively invest in developing other leaders, not just followers." },
  { id: "l4b", level: 4, text: "People I've mentored are now leading their own teams or initiatives." },
  // L5 Pinnacle — people follow because of who I am and what I represent
  { id: "l5a", level: 5, text: "I am known and respected beyond my immediate organization for what I stand for." },
  { id: "l5b", level: 5, text: "I have raised up leaders who are themselves raising up other leaders." },
];

export type Archetype =
  | "emerging-leader"
  | "rising-catalyst"
  | "connected-catalyst"
  | "catalyst-in-action"
  | "catalyst-of-catalysts"
  | "cultural-catalyst";

export const ARCHETYPES: Record<
  Archetype,
  { index: number; name: string; tagline: string; description: string; growth: string }
> = {
  "emerging-leader": {
    index: 0,
    name: "The Emerging Leader",
    tagline: "You're laying the foundation.",
    description:
      "You're stepping into leadership and beginning to discover what you're called to. Your work matters, and the seeds of a bigger purpose are already visible. Focus on building trust with the people closest to you — that's where catalytic leadership begins.",
    growth:
      "Next step: deepen relationships (Level 2 — Permission) so people follow you by choice, not obligation.",
  },
  "rising-catalyst": {
    index: 1,
    name: "The Rising Catalyst",
    tagline: "You're finding your voice.",
    description:
      "You sense your work has a higher purpose, and you're starting to challenge what 'normal' looks like in your space. Relationships are forming around you. Now is the time to translate vision into visible results that people can rally around.",
    growth:
      "Next step: produce results others can see (Level 3 — Production) to convert influence into momentum.",
  },
  "connected-catalyst": {
    index: 2,
    name: "The Connected Catalyst",
    tagline: "Your relationships are your runway.",
    description:
      "People follow you because they trust you. Your work is aligned with purpose, and you're recognized by those around you as someone who sees what others miss. The opportunity ahead is to multiply yourself by developing other leaders.",
    growth:
      "Next step: pour into emerging leaders (Level 4 — People Development) so your impact compounds.",
  },
  "catalyst-in-action": {
    index: 3,
    name: "The Catalyst in Action",
    tagline: "You're producing what others only talk about.",
    description:
      "You don't just imagine new norms — you build them. Your work delivers results and your purpose is unmistakable. The next horizon is to make your influence outlast you by developing leaders who can carry the mission further.",
    growth:
      "Next step: develop leaders who develop leaders (Level 4 → 5) so the movement scales beyond you.",
  },
  "catalyst-of-catalysts": {
    index: 4,
    name: "The Catalyst of Catalysts",
    tagline: "You multiply movements through people.",
    description:
      "You don't just lead — you raise leaders who raise leaders. Your work redefines what's possible in your industry, and others credit you with their own breakthroughs. You are one shift away from Pinnacle-level cultural impact.",
    growth:
      "Next step: steward a legacy and platform (Level 5 — Pinnacle) that reaches far beyond your current circle.",
  },
  "cultural-catalyst": {
    index: 5,
    name: "The Cultural Catalyst",
    tagline: "You are redefining normal.",
    description:
      "You operate at the intersection of purpose, production, and people. You've reshaped how your industry thinks, speaks, and acts — and you've raised up generations of leaders doing the same. Your work is your message, and your life is your mission.",
    growth:
      "Your call now: protect the work, mentor the next wave, and steward the cultural shift you've started.",
  },
};

export const ARCHETYPE_ORDER: Archetype[] = [
  "emerging-leader",
  "rising-catalyst",
  "connected-catalyst",
  "catalyst-in-action",
  "catalyst-of-catalysts",
  "cultural-catalyst",
];

export type Scores = {
  catalystScore: number; // 6–30
  leadershipLevel: 1 | 2 | 3 | 4 | 5;
  levelSubscores: Record<1 | 2 | 3 | 4 | 5, number>; // 2–10 each
};

export function scoreQuiz(
  catalystAnswers: Record<string, Likert>,
  levelAnswers: Record<string, Likert>,
): Scores {
  const catalystScore = CATALYST_QUESTIONS.reduce(
    (sum, q) => sum + (catalystAnswers[q.id] ?? 0),
    0,
  );

  const levelSubscores: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const q of LEVEL_QUESTIONS) {
    levelSubscores[q.level] += levelAnswers[q.id] ?? 0;
  }

  // Highest subscore wins; ties broken by higher level (Maxwell is cumulative)
  let leadershipLevel: 1 | 2 | 3 | 4 | 5 = 1;
  let best = -1;
  for (const lvl of [1, 2, 3, 4, 5] as const) {
    if (levelSubscores[lvl] >= best) {
      best = levelSubscores[lvl];
      leadershipLevel = lvl;
    }
  }

  return { catalystScore, leadershipLevel, levelSubscores };
}

export function resolveArchetype(scores: Scores): Archetype {
  const { catalystScore: c, leadershipLevel: l } = scores;
  // Rows: Catalyst score bands; Cols: leadership level groupings
  // 1–2 | 3 | 4 | 5
  const col = l <= 2 ? 0 : l === 3 ? 1 : l === 4 ? 2 : 3;
  let row: 0 | 1 | 2 | 3;
  if (c <= 12) row = 0;
  else if (c <= 18) row = 1;
  else if (c <= 24) row = 2;
  else row = 3;

  const matrix: Archetype[][] = [
    ["emerging-leader", "emerging-leader", "rising-catalyst", "rising-catalyst"],
    ["rising-catalyst", "connected-catalyst", "connected-catalyst", "catalyst-in-action"],
    ["connected-catalyst", "catalyst-in-action", "catalyst-in-action", "catalyst-of-catalysts"],
    ["catalyst-in-action", "catalyst-of-catalysts", "catalyst-of-catalysts", "cultural-catalyst"],
  ];

  return matrix[row][col];
}

export const LEVEL_NAMES: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Position",
  2: "Permission",
  3: "Production",
  4: "People Development",
  5: "Pinnacle",
};