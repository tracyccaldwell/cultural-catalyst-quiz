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
export type FilterQuestion = { id: string; text: string };

// Pre-filter — are they in a leadership role/influence at all?
export const FILTER_QUESTION: FilterQuestion = {
  id: "f1",
  text: "I currently lead or influence others in some capacity — formally (a team, org, or role) or informally (a community, peer group, or sphere of influence).",
};

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
  { id: "l4a", level: 4, text: "I spend significant time and energy developing other leaders — not just managing followers." },
  { id: "l4b", level: 4, text: "There are people I have personally mentored who are now leading their own teams or initiatives." },
  // L5 Pinnacle — people follow because of who I am and what I represent
  { id: "l5a", level: 5, text: "I am sought out and respected far beyond my own organization for what I stand for and have built." },
  { id: "l5b", level: 5, text: "The leaders I've developed are now developing other leaders — my influence is compounding through generations." },
];

export type Archetype =
  | "emerging-leader"
  | "essential-leader"
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
    tagline: "You are at the starting line.",
    description:
      "You are not yet in a position — formal or informal — where others are looking to you for direction. That is not a deficiency; it is a doorway. Every leader starts here, and the work you do now to clarify who you are and what you stand for will shape the influence you carry later.",
    growth:
      "Your next growth edge is positioning yourself to lead. Begin by asking: who do I want to serve, and what do I want to be known for? Volunteer for ownership on small projects. Build a track record of being trustworthy with little before you are trusted with much. Identify one leader whose influence you admire and study how they earned it.",
  },
  "essential-leader": {
    index: 0.5,
    name: "The Essential Leader",
    tagline: "Your excellence is the foundation everything else is built on.",
    description:
      "People count on you because you deliver. Your work is precise, your presence is steadying, and the vision moves forward because of how you show up. The leaders and organizations you support are better because you are in them.",
    growth:
      "You are already doing the work of leadership. Your next edge is the question forming underneath it all: When you imagine the culture you want to live in, what is missing right now? What is the change you keep seeing that nobody around you seems to be making? What would you build if the only thing stopping you was the decision to start?",
  },
  "rising-catalyst": {
    index: 1,
    name: "The Rising Catalyst",
    tagline: "You're finding your voice.",
    description:
      "You sense your work has a higher purpose, and you're starting to challenge what 'normal' looks like in your space. Relationships are forming around you. Now is the time to translate vision into visible results that people can rally around.",
    growth:
      "Right now, people may follow you because of your title or proximity, not yet because of trust earned. Your next growth edge is relational: build genuine permission with the people closest to you. Ask each person what they need most from a leader. Give credit publicly, take responsibility privately. Schedule one meeting this week that is about connecting, not directing — trust is the runway every other level is built on.",
  },
  "connected-catalyst": {
    index: 2,
    name: "The Connected Catalyst",
    tagline: "Your relationships are your runway.",
    description:
      "People follow you because they trust you. Your work is aligned with purpose, and you're recognized by those around you as someone who sees what others miss. The opportunity ahead is to multiply yourself by developing other leaders.",
    growth:
      "You have earned permission — people follow you because they want to. Your next growth edge is production: turn that goodwill into results the team can rally around. Define your three most important outcomes for this quarter. Build the systems and remove the roadblocks that let your people win. Celebrate the wins publicly and name who made them possible — credibility compounds when momentum is shared.",
  },
  "catalyst-in-action": {
    index: 3,
    name: "The Catalyst in Action",
    tagline: "You're producing what others only talk about.",
    description:
      "You don't just imagine new norms — you build them. Your work delivers results and your purpose is unmistakable. The next horizon is to make your influence outlast you by developing leaders who can carry the mission further.",
    growth:
      "You produce what others only talk about. Your next growth edge is multiplication: stop trying to do more yourself and start pouring into other leaders. Identify a task only you currently do and delegate it to grow someone else. Pick 2–3 people with capacity, invest in them weekly, and measure your success by their growth — not just your output.",
  },
  "catalyst-of-catalysts": {
    index: 4,
    name: "The Catalyst of Catalysts",
    tagline: "You multiply movements through people.",
    description:
      "You don't just lead — you raise leaders who raise leaders. Your work redefines what's possible in your industry, and others credit you with their own breakthroughs. You are one shift away from Pinnacle-level cultural impact.",
    growth:
      "You are already multiplying movements through people. Your next growth edge is legacy: making sure the leaders you have developed are themselves developing leaders. Mentor the mentors. Build systems that sustain leadership beyond your presence. Stay teachable — the higher the influence climbs, the easier it is to coast or believe your own press. Decisions you make today should still serve people you will never personally meet.",
  },
  "cultural-catalyst": {
    index: 5,
    name: "The Cultural Catalyst",
    tagline: "You are redefining normal.",
    description:
      "You operate at the intersection of purpose, production, and people. You've reshaped how your industry thinks, speaks, and acts — and you've raised up generations of leaders doing the same. Your work is your message, and your life is your mission.",
    growth:
      "You are redefining normal. Your work now is stewardship: protect what you have built from drift, mentor the next wave of catalysts personally, and steward the cultural shift you have started so it deepens rather than dilutes over time. Stay grounded by staying teachable — your legacy is not your title, it is the influence that outlasts you.",
  },
};

export const ARCHETYPE_ORDER: Archetype[] = [
  "emerging-leader",
  "essential-leader",
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
  leadershipFilter: Likert; // 1–5
};

export function scoreQuiz(
  catalystAnswers: Record<string, Likert>,
  levelAnswers: Record<string, Likert>,
  filterAnswer: Likert,
): Scores {
  const catalystScore = CATALYST_QUESTIONS.reduce(
    (sum, q) => sum + (catalystAnswers[q.id] ?? 0),
    0,
  );

  const levelSubscores: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const q of LEVEL_QUESTIONS) {
    levelSubscores[q.level] += levelAnswers[q.id] ?? 0;
  }

  // Maxwell's 5 Levels are cumulative — you operate at the HIGHEST level you've
  // genuinely demonstrated, not the one with the largest raw score. A leader
  // who clearly develops other leaders (L4) is a Level 4 leader even if they
  // also still strongly agree they have a position (L1).
  // Threshold: average answer of 3.5+ on both questions for that level (sum ≥ 7 out of 10).
  const QUALIFY = 7;
  let leadershipLevel: 1 | 2 | 3 | 4 | 5 = 1;
  for (const lvl of [5, 4, 3, 2] as const) {
    if (levelSubscores[lvl] >= QUALIFY) {
      leadershipLevel = lvl;
      break;
    }
  }

  return { catalystScore, leadershipLevel, levelSubscores, leadershipFilter: filterAnswer };
}

export function resolveArchetype(scores: Scores): Archetype {
  const { catalystScore: c, leadershipLevel: l, leadershipFilter: f } = scores;

  // Filter gate: if they are not in any leadership role/influence, they are
  // an Emerging Leader regardless of other scores.
  if (f <= 2) return "emerging-leader";

  // If they are leading but not yet operating as a cultural catalyst (their
  // catalyst alignment is below "agree" on average), they are an Essential
  // Leader regardless of how high their leadership level is. Catalyst
  // identity must be earned through the Part 1 questions, not inherited from
  // strong leadership scores.
  // Threshold: average answer of 3.5+ across 6 catalyst questions (sum ≥ 21/30).
  if (c < 21) return "essential-leader";

  // Rows: Catalyst score bands; Cols: leadership level groupings
  // 1–2 | 3 | 4 | 5
  const col = l <= 2 ? 0 : l === 3 ? 1 : l === 4 ? 2 : 3;
  let row: 0 | 1 | 2 | 3;
  if (c <= 24) row = 1;
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