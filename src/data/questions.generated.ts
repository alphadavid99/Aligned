// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source of truth: data/questions.json + data/decks.json.
// Regenerate with: npm run build:questions   (see CLAUDE.md §9)

export type QuestionType = "scale" | "mc" | "rank" | "open";

export interface Question {
  id: string;
  q: string;
  type: QuestionType;
  /** 1–5 internal sort key + weight. Never rendered as a number (brief 2 §A3). */
  depth: number;
  ref?: string;
  note?: string;
  /** Supports the predict-your-partner scoring layer. */
  guessable?: boolean;
  /** Scores as fully aligned even when answers differ (purple "Complementary"). */
  complement?: boolean;
  /** Offers a first-class, unscored "Not yet" answer (brief §7). */
  notYet?: boolean;
  /** Part of the fixed Core scoring instrument (brief 2 §C). */
  core?: boolean;
  /** Reserved: conditional display (brief 2 §A3). */
  showIf?: string;
  /** Reserved: id of a complementary question (brief 2 §A3). */
  complementary?: string;
  /** Options for mc / rank questions. */
  opts?: string[];
  /** Scale endpoint labels (type === "scale"). */
  lo?: string;
  hi?: string;
}

export interface Deck {
  name: string;
  color: string;
  icon: string;
  /** A7 onboarding hook — a real question from inside, resolved at build time. */
  hook?: { id: string; q: string };
  questions: Question[];
}

/** Category slugs in display order. */
export const ORDER: string[] = [
  "in-the-home",
  "finances-money",
  "faith-worship-practice",
  "roles-responsibilities",
  "theology-beliefs",
  "dreams-future",
  "family-children",
  "parenting-style",
  "intimacy-physical",
  "conflict-communication",
  "in-laws-extended-family",
  "fun-icebreakers",
  "deal-breakers",
  "health-lifestyle",
  "past-baggage",
  "career-ambition",
  "character-self-awareness",
  "us-compatibility",
  "values-convictions",
  "faithfulness-loyalty",
  "where-we-are-now"
];

/** All decks keyed by slug. */
export const DECKS: Record<string, Deck> = {
  "in-the-home": {
    "name": "Home",
    "color": "#B0865E",
    "icon": "home",
    "hook": {
      "id": "HOME-006",
      "q": "How tidy do you need our home to be?"
    },
    "questions": [
      {
        "id": "HOME-001",
        "q": "Who does most of the cooking in your home?",
        "type": "mc",
        "depth": 1,
        "note": "Surfaces day-to-day domestic expectations early — a common silent assumption.",
        "guessable": true,
        "opts": [
          "Mostly him",
          "Mostly her",
          "Both equally",
          "We share by meal or day"
        ]
      },
      {
        "id": "HOME-002",
        "q": "Who would own most of the household chores?",
        "type": "mc",
        "depth": 1,
        "note": "Extends the cooking question to the whole chore map.",
        "guessable": true,
        "opts": [
          "Mostly him",
          "Mostly her",
          "Split evenly",
          "We'll trade off"
        ]
      },
      {
        "id": "HOME-003",
        "q": "How do you feel about pets at home - and are you more of a dog or a cat person?",
        "type": "mc",
        "depth": 1,
        "note": "Light but real expectation about pets at home.",
        "guessable": true,
        "opts": [
          "Dogs",
          "Cats",
          "Both",
          "Neither",
          "Depends on the pet"
        ]
      },
      {
        "id": "HOME-006",
        "q": "How tidy do you need our home to be?",
        "type": "scale",
        "depth": 1,
        "note": "Cleanliness standards — a classic daily-friction gap.",
        "guessable": true,
        "lo": "Relaxed about mess",
        "hi": "Everything in its place"
      },
      {
        "id": "HOME-008",
        "q": "Who should handle home repairs and maintenance?",
        "type": "mc",
        "depth": 1,
        "note": "Division of labour for upkeep, distinct from cooking/chores.",
        "guessable": true,
        "opts": [
          "Mostly him",
          "Mostly her",
          "Both of us",
          "We'd hire it out"
        ]
      },
      {
        "id": "HOME-010",
        "q": "Should we go to bed at the same time?",
        "type": "mc",
        "depth": 1,
        "note": "A concrete togetherness ritual with real friction behind it. Pairs with HEALTH-009 (night owl vs early bird) — the gap between a lark and an owl who both want a shared bedtime is a nightly negotiation.",
        "guessable": true,
        "opts": [
          "Always, if we can",
          "Usually",
          "Whenever each of us is tired",
          "It really doesn't matter"
        ]
      },
      {
        "id": "HOME-004",
        "q": "Where do you picture us putting down roots - city, suburbs, or somewhere quieter?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces where each pictures building a home.",
        "guessable": true,
        "opts": [
          "City",
          "Suburbs",
          "Rural / small town",
          "Open to wherever"
        ]
      },
      {
        "id": "HOME-005",
        "q": "How open and hospitable do you want our home to be to others?",
        "type": "scale",
        "depth": 2,
        "ref": "Romans 12:13",
        "note": "The hospitality theme as a home-culture value; HOME was a thin category.",
        "guessable": true,
        "lo": "Our home is our private space",
        "hi": "Always open to others"
      },
      {
        "id": "HOME-007",
        "q": "How important is it to you to own a home rather than rent?",
        "type": "scale",
        "depth": 2,
        "note": "A practical housing value with real financial weight.",
        "guessable": true,
        "lo": "Renting is fine",
        "hi": "Owning matters a lot"
      },
      {
        "id": "HOME-009",
        "q": "How important is having some space at home that's just yours?",
        "type": "scale",
        "depth": 2,
        "note": "Personal-space needs within a shared home.",
        "guessable": true,
        "lo": "Sharing everything is fine",
        "hi": "I need my own space"
      },
      {
        "id": "HOME-011",
        "q": "Which of these should we do together, no matter how busy we get?",
        "type": "mc",
        "depth": 2,
        "ref": "Acts 2:46",
        "note": "Makes the togetherness norm concrete — which ritual is non-negotiable, rather than an abstract rating of how much time couples should share. HOME was a thin category.",
        "guessable": true,
        "opts": [
          "Evening meals",
          "Mornings",
          "Bedtime",
          "Church on Sunday",
          "None of these are essential"
        ]
      }
    ]
  },
  "finances-money": {
    "name": "Money",
    "color": "#5E7A4E",
    "icon": "coin",
    "hook": {
      "id": "FIN-009",
      "q": "Be honest - are you more of a saver or a spender?"
    },
    "questions": [
      {
        "id": "FIN-009",
        "q": "Be honest - are you more of a saver or a spender?",
        "type": "scale",
        "depth": 1,
        "note": "A quick, gamified read on money temperament.",
        "guessable": true,
        "core": true,
        "lo": "Saver to the bone",
        "hi": "Spender at heart"
      },
      {
        "id": "FIN-001",
        "q": "Should a married couple combine their finances fully, keep them separate, or a mix?",
        "type": "mc",
        "depth": 3,
        "note": "Money is a leading source of marital conflict — better named now than discovered later.",
        "guessable": true,
        "core": true,
        "opts": [
          "Fully combined",
          "Fully separate",
          "Mix of joint and personal"
        ]
      },
      {
        "id": "FIN-002",
        "q": "How do you feel about debt?",
        "type": "scale",
        "depth": 3,
        "ref": "Romans 13:8",
        "note": "Brings financial baggage into the open early.",
        "guessable": true,
        "core": true,
        "lo": "Avoid debt entirely",
        "hi": "Comfortable carrying it"
      },
      {
        "id": "FIN-003",
        "q": "How financially open should we be with each other?",
        "type": "scale",
        "depth": 3,
        "note": "Opens the door to financial transparency.",
        "guessable": true,
        "core": true,
        "lo": "Keep some things private",
        "hi": "Fully transparent"
      },
      {
        "id": "FIN-004",
        "q": "How disciplined are you with a monthly budget?",
        "type": "scale",
        "depth": 3,
        "note": "Surfaces day-to-day money habits and rhythm.",
        "guessable": true,
        "lo": "Loose with budgeting",
        "hi": "Track every dollar"
      },
      {
        "id": "FIN-005",
        "q": "How should we manage money day to day?",
        "type": "mc",
        "depth": 3,
        "note": "Surfaces the shared vision for budgeting as a couple.",
        "guessable": true,
        "opts": [
          "One shared budget we both follow",
          "Mostly one of us manages it",
          "Loose, no strict budget",
          "Still figuring it out"
        ]
      },
      {
        "id": "FIN-006",
        "q": "How much do you prioritise saving for the long term?",
        "type": "scale",
        "depth": 3,
        "note": "Surfaces long-term financial planning habits.",
        "guessable": true,
        "lo": "Live for today",
        "hi": "Save aggressively for the future"
      },
      {
        "id": "FIN-008",
        "q": "Beyond any children, who should our will provide for?",
        "type": "mc",
        "depth": 3,
        "note": "Surfaces estate and inheritance intentions.",
        "guessable": true,
        "opts": [
          "Just us and our kids",
          "Extended family too",
          "Church or charity too",
          "Haven't thought about it"
        ]
      },
      {
        "id": "FIN-010",
        "q": "How important is it that we agree on money?",
        "type": "scale",
        "depth": 3,
        "note": "Weights money gaps in the agreement score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "FIN-011",
        "q": "When you're stressed, how often do you spend or shop to feel better?",
        "type": "scale",
        "depth": 3,
        "note": "The 'retail therapy' flag in neutral, self-rated terms.",
        "guessable": true,
        "lo": "Never",
        "hi": "Very often"
      },
      {
        "id": "FIN-012",
        "q": "If we had money left over each month, where should most of it go?",
        "type": "rank",
        "depth": 3,
        "note": "Surfaces the holiness-vs-happiness pull through where surplus flows.",
        "opts": [
          "Giving or serving",
          "Saving for the future",
          "Experiences and travel",
          "Things we enjoy now"
        ]
      },
      {
        "id": "FIN-013",
        "q": "How much debt are you bringing into the relationship?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 22:7",
        "note": "A debt disclosure as buckets — distance, not a private number.",
        "guessable": true,
        "core": true,
        "opts": [
          "None",
          "A small amount",
          "A moderate amount",
          "A significant amount"
        ]
      },
      {
        "id": "FIN-014",
        "q": "How would you rate your credit?",
        "type": "mc",
        "depth": 3,
        "note": "Practical financial-health disclosure; guessable and scoreable.",
        "guessable": true,
        "opts": [
          "Excellent",
          "Good",
          "Fair",
          "Poor",
          "Not sure"
        ]
      },
      {
        "id": "FIN-015",
        "q": "Should we pay off major debt before having children?",
        "type": "scale",
        "depth": 3,
        "note": "A concrete sequencing decision raised in the worksheet exercise.",
        "guessable": true,
        "lo": "Not a priority",
        "hi": "Essential to clear it first"
      },
      {
        "id": "FIN-016",
        "q": "How do you see the things you own?",
        "type": "mc",
        "depth": 3,
        "ref": "1 Peter 4:10",
        "note": "Surfaces stewardship theology behind money and possessions.",
        "guessable": true,
        "core": true,
        "opts": [
          "Mine to enjoy as I like",
          "Mostly mine, with some giving",
          "God's, and I'm just the manager",
          "Haven't really thought about it"
        ]
      },
      {
        "id": "FIN-017",
        "q": "How important is it to you that we have a financial safety net for emergencies?",
        "type": "scale",
        "depth": 3,
        "ref": "Proverbs 21:20",
        "note": "Crisis-resilience mindset, distinct from long-term saving (FIN-006).",
        "guessable": true,
        "lo": "We'll manage problems as they come",
        "hi": "I want a solid emergency cushion"
      },
      {
        "id": "FIN-007",
        "q": "How do you feel about a prenuptial agreement?",
        "type": "mc",
        "depth": 4,
        "note": "Surfaces views on a prenuptial agreement candidly.",
        "guessable": true,
        "opts": [
          "Want one",
          "Open to one",
          "Prefer not",
          "Strongly against"
        ]
      }
    ]
  },
  "faith-worship-practice": {
    "name": "Faith",
    "color": "#682D5C",
    "icon": "faith",
    "hook": {
      "id": "FAITH-019",
      "q": "When your time with God and time with your partner compete for the same hour, which usually wins?"
    },
    "questions": [
      {
        "id": "FAITH-001",
        "q": "How essential is praying together as a couple to you?",
        "type": "scale",
        "depth": 1,
        "ref": "1 Thessalonians 5:17",
        "note": "Reveals expectations about a shared spiritual rhythm.",
        "guessable": true,
        "core": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-007",
        "q": "How involved do you want to be in church community and small groups?",
        "type": "scale",
        "depth": 1,
        "ref": "Hebrews 10:25",
        "note": "Surfaces expectations about church community and studying together.",
        "guessable": true,
        "lo": "Rarely involved",
        "hi": "Highly involved"
      },
      {
        "id": "FAITH-010",
        "q": "What's been your best experience with church - and your worst? How involved do you want to be?",
        "type": "open",
        "depth": 1,
        "note": "Surfaces church hopes and hurts."
      },
      {
        "id": "FAITH-012",
        "q": "If you could ask God one question, what would it be?",
        "type": "open",
        "depth": 1,
        "note": "A gentle window into each person's faith wrestlings."
      },
      {
        "id": "FAITH-020",
        "q": "What rhythm of personal Bible reading do you hope to keep?",
        "type": "mc",
        "depth": 1,
        "ref": "Psalm 1:2",
        "note": "A target rhythm both pick; the gap is an expectation mismatch, not an audit.",
        "guessable": true,
        "opts": [
          "Daily",
          "Most days",
          "Weekly",
          "Occasionally"
        ]
      },
      {
        "id": "FAITH-032",
        "q": "How do you most want to serve in a church?",
        "type": "mc",
        "depth": 1,
        "note": "A light compare-and-guess on how each prefers to serve.",
        "guessable": true,
        "opts": [
          "Teaching or leading",
          "Hospitality and people",
          "Behind the scenes",
          "Outreach and mission",
          "Not a priority for me"
        ]
      },
      {
        "id": "FAITH-002",
        "q": "How central is your faith to your everyday life?",
        "type": "scale",
        "depth": 2,
        "ref": "1 Peter 3:15",
        "note": "Surfaces the foundation each person's faith is built on, in their own words.",
        "guessable": true,
        "core": true,
        "lo": "A background part of life",
        "hi": "It centres everything"
      },
      {
        "id": "FAITH-003",
        "q": "How committed are you to regular giving or tithing?",
        "type": "scale",
        "depth": 2,
        "ref": "2 Corinthians 9:7",
        "note": "Surfaces convictions about giving without turning it into a numbers test.",
        "guessable": true,
        "lo": "Not a priority",
        "hi": "A firm commitment"
      },
      {
        "id": "FAITH-004",
        "q": "How often would you want us to pray together?",
        "type": "mc",
        "depth": 2,
        "ref": "Matthew 18:20",
        "note": "Explores what a shared prayer rhythm looks like day to day.",
        "guessable": true,
        "opts": [
          "Daily",
          "A few times a week",
          "Now and then",
          "I'd rather pray privately"
        ]
      },
      {
        "id": "FAITH-005",
        "q": "How open should we be with each other about our spiritual lives?",
        "type": "scale",
        "depth": 2,
        "ref": "James 5:16",
        "note": "Surfaces how transparent and accountable each wants to be spiritually.",
        "guessable": true,
        "lo": "Keep faith private",
        "hi": "Fully open and accountable"
      },
      {
        "id": "FAITH-006",
        "q": "When our faith differs, how should we handle it?",
        "type": "mc",
        "depth": 2,
        "ref": "Romans 14:1",
        "note": "Surfaces how the couple will navigate faith differences without division.",
        "guessable": true,
        "opts": [
          "We need to agree",
          "Talk it through till we agree",
          "Respect our differences",
          "Avoid the topic"
        ]
      },
      {
        "id": "FAITH-008",
        "q": "How much should we shape each other's spiritual growth?",
        "type": "scale",
        "depth": 2,
        "ref": "1 Thessalonians 5:11",
        "note": "Explores how each will help the other grow spiritually.",
        "guessable": true,
        "lo": "Faith is personal",
        "hi": "We should actively grow each other's"
      },
      {
        "id": "FAITH-009",
        "q": "How willing are you to live against the cultural grain for your faith?",
        "type": "scale",
        "depth": 2,
        "ref": "Romans 12:2",
        "note": "Surfaces willingness to live out convictions against the grain.",
        "guessable": true,
        "lo": "Blend in with the culture",
        "hi": "Stand apart for our convictions"
      },
      {
        "id": "FAITH-011",
        "q": "What has God taught you through the hard stretches - failure, waiting, loss, disappointment?",
        "type": "open",
        "depth": 2,
        "ref": "Romans 5:3-4",
        "note": "Surfaces faith shaped in difficulty."
      },
      {
        "id": "FAITH-013",
        "q": "Rank what marriage is ultimately for.",
        "type": "rank",
        "depth": 2,
        "note": "Surfaces the deeper purpose each sees in marriage.",
        "opts": [
          "Companionship",
          "Raising a family",
          "Faith and serving God",
          "Growing each other",
          "Love and romance"
        ]
      },
      {
        "id": "FAITH-014",
        "q": "How important is it that we share the same faith convictions?",
        "type": "scale",
        "depth": 2,
        "note": "Weights how much faith gaps should count in the alignment score.",
        "guessable": true,
        "core": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "FAITH-015",
        "q": "How important is having a personal prayer life to you?",
        "type": "scale",
        "depth": 2,
        "ref": "Matthew 6:6",
        "note": "Splits personal prayer from praying-together (FAITH-001) so each scores on its own.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-016",
        "q": "How important is it that your partner keeps a personal prayer life of their own, apart from you?",
        "type": "scale",
        "depth": 2,
        "note": "Measures the expectation that a partner owns their own spiritual disciplines.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-017",
        "q": "Should we pray together before making big decisions?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 3:5-6",
        "note": "Surfaces whether prayer is woven into how the couple decides things.",
        "guessable": true,
        "lo": "Rarely",
        "hi": "Always"
      },
      {
        "id": "FAITH-021",
        "q": "How important is regularly studying the Bible together as a couple?",
        "type": "scale",
        "depth": 2,
        "note": "Distinct from church involvement (FAITH-007) — this is the two of you.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-022",
        "q": "Our relationship should actively draw us both closer to God, not just leave our faith untouched.",
        "type": "scale",
        "depth": 2,
        "note": "The summing-up green flag, framed as a conviction both rate for agreement.",
        "guessable": true,
        "lo": "Strongly disagree",
        "hi": "Strongly agree"
      },
      {
        "id": "FAITH-024",
        "q": "How important is it to you that your partner is born again, with a personal conversion?",
        "type": "scale",
        "depth": 2,
        "ref": "John 3:3",
        "note": "Turns the 'are you born again' testimony question into a shared value both rate.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-025",
        "q": "How sure are you of your own salvation?",
        "type": "scale",
        "depth": 2,
        "ref": "1 John 5:13",
        "note": "Surfaces assurance of faith without an open-ended testimony.",
        "guessable": true,
        "lo": "Still questioning",
        "hi": "Fully assured"
      },
      {
        "id": "FAITH-026",
        "q": "If we come from different churches, how should we decide where to attend together?",
        "type": "mc",
        "depth": 2,
        "note": "The 'where are we going to church' question as distinct positions.",
        "guessable": true,
        "opts": [
          "We go to mine",
          "We go to yours",
          "We find a new one together",
          "We're fine attending separately"
        ]
      },
      {
        "id": "FAITH-027",
        "q": "How would you rate the current state of your walk with God?",
        "type": "scale",
        "depth": 2,
        "ref": "Philippians 3:12",
        "note": "Current-state self-assessment, distinct from how central faith is (FAITH-002).",
        "guessable": true,
        "lo": "In a dry season",
        "hi": "Thriving"
      },
      {
        "id": "FAITH-028",
        "q": "How much does Scripture shape your day-to-day decisions?",
        "type": "scale",
        "depth": 2,
        "ref": "Psalm 119:105",
        "note": "Converts 'does the Bible shape your decisions' into a scoreable measure.",
        "guessable": true,
        "lo": "Rarely a factor",
        "hi": "It guides my decisions"
      },
      {
        "id": "FAITH-029",
        "q": "When you read Scripture that challenges your own thinking or desires, what's your usual response?",
        "type": "mc",
        "depth": 2,
        "ref": "James 1:22",
        "note": "Surfaces posture toward biblical authority — a real, often-hidden divider.",
        "guessable": true,
        "core": true,
        "opts": [
          "I adjust my view to fit Scripture",
          "I wrestle, but usually submit",
          "I look for another interpretation",
          "I follow my own conviction"
        ]
      },
      {
        "id": "FAITH-031",
        "q": "How important is it to you that we actively serve in a church, not just attend?",
        "type": "scale",
        "depth": 2,
        "ref": "Galatians 5:13",
        "note": "Distinct from involvement level (FAITH-007) — this is contributing vs consuming.",
        "guessable": true,
        "lo": "Attending is enough",
        "hi": "Serving really matters"
      },
      {
        "id": "FAITH-033",
        "q": "How open are you to being mentored and corrected by mature believers?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 19:20",
        "note": "The mentorship/teachability axis, distinct from feedback style (SELF-009).",
        "guessable": true,
        "lo": "I'd rather figure things out myself",
        "hi": "I welcome it"
      },
      {
        "id": "FAITH-034",
        "q": "How central should faith be in the daily life of our home?",
        "type": "scale",
        "depth": 2,
        "ref": "Psalm 127:1",
        "note": "Household faith culture, distinct from personal faith centrality (FAITH-002).",
        "guessable": true,
        "lo": "A private, personal matter",
        "hi": "The center of our home"
      },
      {
        "id": "FAITH-035",
        "q": "Do you own your spiritual growth, or would you lean on your partner to lead you?",
        "type": "scale",
        "depth": 2,
        "ref": "Philippians 2:12",
        "note": "Spiritual ownership vs dependence, distinct from active-growth effort (SELF-020).",
        "guessable": true,
        "lo": "I own my own growth",
        "hi": "I'd lean on my partner to lead me"
      },
      {
        "id": "FAITH-018",
        "q": "How important is it that your partner's relationship with God comes before their relationship with you?",
        "type": "scale",
        "depth": 4,
        "ref": "Matthew 6:33",
        "note": "The core 'loves Christ first' value, asked as a shared expectation both rate.",
        "guessable": true,
        "core": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-019",
        "q": "When your time with God and time with your partner compete for the same hour, which usually wins?",
        "type": "scale",
        "depth": 4,
        "note": "Spectrum framing of the same value as a behaviour, not just an ideal.",
        "guessable": true,
        "lo": "The relationship usually wins",
        "hi": "God always comes first"
      },
      {
        "id": "FAITH-023",
        "q": "Who should take the lead in prayer and spiritual life in the home?",
        "type": "mc",
        "depth": 4,
        "ref": "Joshua 24:15",
        "note": "Lands directly on a gender-roles conviction; surfaces the position rather than hedging it.",
        "guessable": true,
        "opts": [
          "The husband",
          "The wife",
          "Whoever feels led in the moment",
          "We take turns",
          "Always together, no one leads"
        ]
      },
      {
        "id": "FAITH-030",
        "q": "When you sin, what's your instinct?",
        "type": "mc",
        "depth": 4,
        "ref": "1 John 1:9",
        "note": "The 'do you hide sin or live in repentance' question, made scoreable.",
        "guessable": true,
        "opts": [
          "Confess and seek accountability",
          "Tell God privately and move on",
          "Try to fix it on my own",
          "I tend to hide it"
        ]
      }
    ]
  },
  "roles-responsibilities": {
    "name": "Roles",
    "color": "#6E7A8A",
    "icon": "compass",
    "hook": {
      "id": "ROLE-011",
      "q": "Bins, spiders and the car — whose job?"
    },
    "questions": [
      {
        "id": "ROLE-011",
        "q": "Bins, spiders and the car — whose job?",
        "type": "mc",
        "depth": 1,
        "note": "Roles opens with headship theology. This opens it with spiders. Same deck, and the answers to both are more related than anyone admits.",
        "guessable": true,
        "core": true,
        "opts": [
          "Him",
          "Her",
          "Whoever's nearest",
          "We'd argue about every one of them"
        ]
      },
      {
        "id": "ROLE-012",
        "q": "Who's quicker at making a decision?",
        "type": "mc",
        "depth": 1,
        "note": "Light HHB entry that sits directly upstream of the tiebreak question later in the deck.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "About the same",
          "Neither of us — it's painful"
        ]
      },
      {
        "id": "ROLE-001",
        "q": "How do you see roles and leadership working in a marriage?",
        "type": "mc",
        "depth": 3,
        "ref": "Ephesians 5:21-33",
        "note": "Theology varies widely by tradition — keep it open. Surface, don't settle.",
        "guessable": true,
        "core": true,
        "opts": [
          "Husband leads, wife supports",
          "Mutual submission, equal partners",
          "No fixed roles",
          "Still working it out"
        ]
      },
      {
        "id": "ROLE-002",
        "q": "How do you imagine balancing work and home - would either of us want to stay home, especially with kids?",
        "type": "mc",
        "depth": 3,
        "note": "Surfaces expectations about working vs. staying home, especially with children.",
        "guessable": true,
        "opts": [
          "One of us stays home",
          "Both of us work",
          "Depends on the season of life"
        ]
      },
      {
        "id": "ROLE-003",
        "q": "How important is it that we agree on marriage roles and responsibilities?",
        "type": "scale",
        "depth": 3,
        "note": "Weights roles gaps in the alignment score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "ROLE-004",
        "q": "How important is it to you that the husband is the primary financial provider?",
        "type": "scale",
        "depth": 3,
        "ref": "1 Timothy 5:8",
        "note": "The provision question as a pointed values split, not folded into general roles.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "ROLE-009",
        "q": "What principle should divide the chores?",
        "type": "mc",
        "depth": 3,
        "note": "HOME-002 asks who ends up doing them. This asks the rule behind it, and 'along traditional lines' is a position worth stating plainly rather than discovering.",
        "guessable": true,
        "opts": [
          "Split evenly down the middle",
          "Whoever's better at each thing",
          "Whoever has more time that week",
          "Along fairly traditional lines"
        ]
      },
      {
        "id": "ROLE-010",
        "q": "Who should handle the money day to day?",
        "type": "mc",
        "depth": 3,
        "note": "FIN-005 offers 'mostly one of us manages it' without ever asking which one. Uses the HHB shape to close that gap.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us together",
          "Whoever's better with numbers"
        ]
      },
      {
        "id": "ROLE-005",
        "q": "How literally do you take 'the husband is the head of the home'?",
        "type": "scale",
        "depth": 4,
        "note": "Adds scoring resolution to the headship/submission axis beyond ROLE-001's categories.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "lo": "Symbolic, we share leadership",
        "hi": "Literal male headship"
      },
      {
        "id": "ROLE-006",
        "q": "When we can't agree, who makes the final call?",
        "type": "mc",
        "depth": 4,
        "ref": "Ephesians 5:21",
        "note": "The tiebreak. ROLE-001 asks the philosophy of leadership and ROLE-005 asks how literally you take headship — neither asks what actually happens at the moment of deadlock, which is the only time it matters.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "The husband",
          "The wife",
          "Whoever cares more about it",
          "Whoever knows more about it",
          "Nothing happens until we both agree"
        ]
      },
      {
        "id": "ROLE-007",
        "q": "If the wife earned significantly more, how would that sit with you?",
        "type": "mc",
        "depth": 4,
        "ref": "1 Timothy 5:8",
        "note": "ROLE-004 rates the provider ideal in the abstract. This makes it concrete and refuses to hedge — 'fine, but I'd notice' is the honest middle most people actually occupy.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Completely fine",
          "Fine, though I'd notice it",
          "It would be uncomfortable",
          "It would be a real problem for me"
        ]
      },
      {
        "id": "ROLE-008",
        "q": "If one of us had to step back from work for the family, who?",
        "type": "mc",
        "depth": 4,
        "note": "ROLE-002 asks the pattern (one stays home, both work, depends on the season). It never asks which of you. That's the whole question.",
        "guessable": true,
        "opts": [
          "Me",
          "You",
          "Whoever's earning less at the time",
          "We'd both go part-time",
          "Neither — we'd find another way"
        ]
      }
    ]
  },
  "theology-beliefs": {
    "name": "Theology",
    "color": "#7C4B72",
    "icon": "book",
    "questions": [
      {
        "id": "THEO-011",
        "q": "How much do you actually enjoy talking theology?",
        "type": "scale",
        "depth": 1,
        "note": "A perfect on-ramp: light to answer, and genuinely one of the more useful things in the deck. A couple where one loves it and one dreads it has found something before question two asks about women preaching.",
        "guessable": true,
        "core": true,
        "lo": "Really not my thing",
        "hi": "I could go all night"
      },
      {
        "id": "THEO-012",
        "q": "Where did your theology mostly come from?",
        "type": "mc",
        "depth": 1,
        "note": "Provenance before positions. Easy to answer and it reframes every disagreement further down the deck as inherited rather than personal.",
        "guessable": true,
        "opts": [
          "The church I grew up in",
          "A church I chose as an adult",
          "Books and study",
          "Podcasts and online",
          "Still working that out"
        ]
      },
      {
        "id": "THEO-001",
        "q": "Do you believe a woman can preach or pastor in a church?",
        "type": "mc",
        "depth": 3,
        "ref": "Galatians 3:28",
        "note": "A classic dividing line — the goal is to talk it through, not to score who is 'right'.",
        "guessable": true,
        "opts": [
          "Yes",
          "No",
          "Depends on the role",
          "Still working it out"
        ]
      },
      {
        "id": "THEO-002",
        "q": "Theologically, where do you land?",
        "type": "scale",
        "depth": 3,
        "note": "Surfaces overall theological and social posture without forcing a label.",
        "guessable": true,
        "core": true,
        "lo": "Traditional / conservative",
        "hi": "Progressive"
      },
      {
        "id": "THEO-008",
        "q": "How important is it that we share the same denomination or church tradition?",
        "type": "scale",
        "depth": 3,
        "note": "The Presbyterian-marries-Baptist clash as a shared value.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Very important"
      },
      {
        "id": "THEO-010",
        "q": "Rank which theological issues matter most for us to agree on.",
        "type": "rank",
        "depth": 3,
        "note": "A granular doctrine-priority rank, beyond the binary importance weightings.",
        "opts": [
          "Baptism (infant vs believer)",
          "End times",
          "Spiritual gifts",
          "Women in ministry",
          "Worship style",
          "Predestination vs free will"
        ]
      },
      {
        "id": "THEO-003",
        "q": "Can salvation be lost?",
        "type": "mc",
        "depth": 5,
        "note": "A classic dividing line - talk it through, don't settle who's right.",
        "guessable": true,
        "opts": [
          "No - once saved, always saved",
          "Yes, it can be lost",
          "Not sure",
          "Doesn't matter much to me"
        ]
      },
      {
        "id": "THEO-004",
        "q": "Can believers be affected by spiritual oppression?",
        "type": "mc",
        "depth": 5,
        "note": "Surfaces beliefs about the spiritual realm that vary widely by tradition.",
        "guessable": true,
        "opts": [
          "Yes",
          "No",
          "Unsure"
        ]
      },
      {
        "id": "THEO-005",
        "q": "How do you view spiritual gifts like tongues?",
        "type": "mc",
        "depth": 5,
        "note": "A continuationist/cessationist difference worth naming gently.",
        "guessable": true,
        "opts": [
          "For today",
          "Not for today",
          "Unsure",
          "Not important to me"
        ]
      },
      {
        "id": "THEO-006",
        "q": "Where do you land on the end times?",
        "type": "mc",
        "depth": 5,
        "note": "Eschatology varies by tradition - keep it curious, not combative.",
        "guessable": true,
        "opts": [
          "Pre-tribulation rapture",
          "A different rapture view",
          "Symbolic, not literal",
          "Haven't settled it"
        ]
      },
      {
        "id": "THEO-007",
        "q": "Politically, where do you land?",
        "type": "scale",
        "depth": 5,
        "note": "Surfaces political alignment without taking sides.",
        "guessable": true,
        "lo": "Conservative",
        "hi": "Progressive"
      },
      {
        "id": "THEO-009",
        "q": "Should our children be baptized as infants, or wait until they choose for themselves?",
        "type": "mc",
        "depth": 5,
        "note": "The exact infant-baptism landmine the transcript names; a real divider.",
        "guessable": true,
        "opts": [
          "Baptize as infants",
          "Dedicate now, baptize when they choose",
          "Wait until they can decide",
          "Unsure"
        ]
      }
    ]
  },
  "dreams-future": {
    "name": "The Future",
    "color": "#9C4A6E",
    "icon": "star",
    "questions": [
      {
        "id": "DREAM-002",
        "q": "How often would you love for us to travel in a typical year?",
        "type": "mc",
        "depth": 1,
        "note": "Light look at how much adventure each wants in the shared future.",
        "guessable": true,
        "opts": [
          "Rarely",
          "1-2 times a year",
          "3-4 times a year",
          "As often as we can"
        ]
      },
      {
        "id": "DREAM-006",
        "q": "Finish this a few times: 'If we marry, I would love for us to...'",
        "type": "open",
        "depth": 1,
        "note": "A dreaming game that reveals hopes for married life."
      },
      {
        "id": "DREAM-001",
        "q": "How clear is your sense of life purpose?",
        "type": "scale",
        "depth": 2,
        "ref": "Jeremiah 29:11",
        "note": "Surfaces each person's sense of calling and direction.",
        "guessable": true,
        "lo": "Still searching",
        "hi": "Very clear"
      },
      {
        "id": "DREAM-003",
        "q": "What does retirement look like to you?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces the long-view picture of life together.",
        "guessable": true,
        "opts": [
          "Rest and simplicity",
          "Travel and adventure",
          "Keep working or serving",
          "No clear picture yet"
        ]
      },
      {
        "id": "DREAM-004",
        "q": "How much do you want our marriage to resemble your parents'?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces inherited marriage patterns to carry forward or leave behind.",
        "guessable": true,
        "lo": "Very different from my parents'",
        "hi": "Much like my parents'"
      },
      {
        "id": "DREAM-005",
        "q": "Ten years out, where do you want to be - in your heart, your faith, and your finances?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces a whole-life growth vision."
      },
      {
        "id": "DREAM-007",
        "q": "If we could only have one, which?",
        "type": "mc",
        "depth": 3,
        "ref": "Matthew 6:33",
        "note": "A forced choice between four goods. Comfort versus significance is the trade-off most Christian couples assume they agree on and often don't.",
        "guessable": true,
        "opts": [
          "A comfortable life",
          "An adventurous life",
          "A significant life",
          "A quiet life"
        ]
      },
      {
        "id": "DREAM-008",
        "q": "Where do you want to be living in ten years?",
        "type": "mc",
        "depth": 3,
        "note": "HOME-004 asks city, suburbs or countryside. This is the bigger geography, and it decides things HOME-004 can't.",
        "guessable": true,
        "opts": [
          "Right where we are",
          "Same country, somewhere new",
          "Abroad",
          "Wherever life takes us"
        ]
      },
      {
        "id": "DREAM-010",
        "q": "How much risk do you want our life to have?",
        "type": "scale",
        "depth": 3,
        "note": "CAREER-008 covers career risk specifically. This is the whole life — money, moving, starting things — and it's the appetite underneath all of them.",
        "guessable": true,
        "lo": "Steady and predictable",
        "hi": "Adventurous, even when it's unstable"
      },
      {
        "id": "DREAM-011",
        "q": "How important is it that we build something together, rather than just alongside each other?",
        "type": "scale",
        "depth": 3,
        "note": "Joint purpose, distinct from US-039 (how involved in community we are) and DREAM-001 (personal sense of calling). Two people with clear separate callings can still have no shared one.",
        "guessable": true,
        "lo": "Our own paths are fine",
        "hi": "We need a shared purpose"
      },
      {
        "id": "DREAM-012",
        "q": "Rank what you'd want people to say about our marriage in thirty years.",
        "type": "rank",
        "depth": 3,
        "note": "Converts the open-ended legacy prompt into two lists worth comparing. What each puts last is more revealing than what they put first.",
        "opts": [
          "That we lasted",
          "That we were kind to each other",
          "That we served God with it",
          "That we were fun to be around",
          "That we genuinely loved each other",
          "That we raised good people"
        ]
      },
      {
        "id": "DREAM-009",
        "q": "Would you want to live abroad or do mission work at some point?",
        "type": "mc",
        "depth": 4,
        "ref": "Matthew 28:19",
        "note": "Entirely absent from the bank and unusually live for this audience. A yes and a no here is a marriage-shaping gap.",
        "guessable": true,
        "opts": [
          "Yes, definitely",
          "Open to it",
          "Probably not",
          "No"
        ]
      }
    ]
  },
  "family-children": {
    "name": "Children",
    "color": "#88A06A",
    "icon": "family",
    "questions": [
      {
        "id": "FAM-011",
        "q": "Be honest — how much do you actually like other people's kids?",
        "type": "scale",
        "depth": 1,
        "note": "A warm, low-stakes entry to a deck that currently opens with 'how many children would you hope for'. Also quietly predictive.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "lo": "Not really my thing",
        "hi": "I love them"
      },
      {
        "id": "FAM-012",
        "q": "Baby names — are you the one with a list already?",
        "type": "mc",
        "depth": 1,
        "note": "Playful, and it surfaces how concretely each person has actually imagined this.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "I've had a list for years",
          "A couple of ideas",
          "Never thought about it",
          "We would definitely argue about this"
        ]
      },
      {
        "id": "FAM-001",
        "q": "How many children would you hope for?",
        "type": "mc",
        "depth": 2,
        "ref": "Psalm 127:3-5",
        "note": "Aligns hopes for family size and timing early.",
        "guessable": true,
        "core": true,
        "opts": [
          "None",
          "1-2",
          "3-4",
          "5+",
          "Open / unsure"
        ]
      },
      {
        "id": "FAM-003",
        "q": "How open are you to adoption?",
        "type": "scale",
        "depth": 2,
        "ref": "Ephesians 1:5",
        "note": "Explores openness to adoption as a path to family.",
        "guessable": true,
        "notYet": true,
        "lo": "Eager to adopt",
        "hi": "Prefer not to"
      },
      {
        "id": "FAM-004",
        "q": "How important is it that we agree on children and parenting?",
        "type": "scale",
        "depth": 2,
        "note": "Weights family/parenting gaps in the alignment score.",
        "guessable": true,
        "notYet": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "FAM-005",
        "q": "How soon after marriage would you want to start trying for children?",
        "type": "mc",
        "depth": 2,
        "note": "Splits timing off from family-size (FAM-001) so each scores separately.",
        "guessable": true,
        "opts": [
          "Right away",
          "Within the first year or two",
          "After several years",
          "We'll see how it goes"
        ]
      },
      {
        "id": "FAM-006",
        "q": "How important is it to you to have biological children specifically?",
        "type": "scale",
        "depth": 2,
        "note": "Distinct from openness to adoption (FAM-003).",
        "guessable": true,
        "notYet": true,
        "lo": "Any path to family is equal",
        "hi": "Biological children matter a lot"
      },
      {
        "id": "FAM-007",
        "q": "How important is it that our children grow up close to extended family?",
        "type": "scale",
        "depth": 2,
        "note": "A family-geography value couples often assume.",
        "guessable": true,
        "notYet": true,
        "lo": "Wherever life takes us",
        "hi": "Near family really matters"
      },
      {
        "id": "FAM-009",
        "q": "How important is it to raise our children in the faith?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 22:6",
        "note": "Faith-transmission priority, distinct from responding to a child's doubt (PAR-003).",
        "guessable": true,
        "notYet": true,
        "core": true,
        "lo": "Let them choose freely",
        "hi": "Essential to raise them in it"
      },
      {
        "id": "FAM-010",
        "q": "How involved should grandparents be in raising our children?",
        "type": "scale",
        "depth": 2,
        "note": "Grandparent involvement in childrearing specifically.",
        "guessable": true,
        "notYet": true,
        "lo": "Minimal, we parent",
        "hi": "Very involved"
      },
      {
        "id": "FAM-002",
        "q": "If we faced fertility struggles, how open are you to reproductive medicine?",
        "type": "mc",
        "depth": 4,
        "note": "Surfaces values around fertility treatment before the pressure of facing it.",
        "guessable": true,
        "opts": [
          "Fully open to treatment",
          "Some methods only",
          "Prefer to accept what comes",
          "Unsure"
        ]
      },
      {
        "id": "FAM-008",
        "q": "If we disagreed about having more children, how should we handle it?",
        "type": "mc",
        "depth": 4,
        "note": "Surfaces the decision rule for a high-stakes disagreement.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "Keep talking until we agree",
          "Defer to whoever feels strongest",
          "The one who wants fewer decides",
          "We'd seek outside help"
        ]
      }
    ]
  },
  "parenting-style": {
    "name": "Parenting",
    "color": "#88A06A",
    "icon": "family",
    "questions": [
      {
        "id": "PAR-008",
        "q": "Be honest — would you be the fun parent or the strict one?",
        "type": "mc",
        "depth": 1,
        "note": "PAR-004 is the serious version of this on a scale. This is the version people answer honestly, and it opens a deck that currently starts with a six-item ranking.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "The fun one",
          "The strict one",
          "Somewhere in the middle",
          "Depends entirely on the day"
        ]
      },
      {
        "id": "PAR-009",
        "q": "Who's more likely to spoil them?",
        "type": "mc",
        "depth": 1,
        "note": "HHB warm-up. Plays as a laugh, sits on the same axis as the discipline questions further down the deck.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, hopeless",
          "Neither of us"
        ]
      },
      {
        "id": "PAR-001",
        "q": "Rank what matters most in raising children.",
        "type": "rank",
        "depth": 2,
        "ref": "Proverbs 22:6",
        "note": "Surfaces core parenting philosophy and values.",
        "notYet": true,
        "opts": [
          "Faith",
          "Discipline",
          "Independence",
          "Kindness",
          "Education",
          "Emotional security"
        ]
      },
      {
        "id": "PAR-002",
        "q": "How much would you parent the way you were raised?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces what each would keep or change from their own upbringing.",
        "guessable": true,
        "notYet": true,
        "lo": "Very differently from how I was raised",
        "hi": "Much the same"
      },
      {
        "id": "PAR-004",
        "q": "Where does your discipline style fall?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces discipline philosophy and inherited patterns.",
        "guessable": true,
        "notYet": true,
        "lo": "Firm and structured",
        "hi": "Gentle and relational"
      },
      {
        "id": "PAR-005",
        "q": "How do you feel about spanking as a form of discipline?",
        "type": "mc",
        "depth": 2,
        "ref": "Proverbs 13:24",
        "note": "Names a real discipline split directly instead of folding it into PAR-004.",
        "guessable": true,
        "core": true,
        "opts": [
          "For it",
          "In some situations",
          "Against it",
          "Unsure"
        ]
      },
      {
        "id": "PAR-006",
        "q": "How would you want to educate our children?",
        "type": "mc",
        "depth": 2,
        "ref": "Deuteronomy 6:7",
        "note": "A concrete schooling decision couples often discover they differ on.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Homeschool",
          "Christian or faith-based school",
          "Public school",
          "Whatever suits each child"
        ]
      },
      {
        "id": "PAR-007",
        "q": "How set apart from mainstream culture do you want to raise our children?",
        "type": "scale",
        "depth": 2,
        "note": "The counterculture flag (Halloween, media, etc.) aimed at parenting.",
        "guessable": true,
        "notYet": true,
        "lo": "Fully part of the culture",
        "hi": "Deliberately set apart"
      },
      {
        "id": "PAR-003",
        "q": "If a child questions their faith, how should we respond?",
        "type": "mc",
        "depth": 4,
        "ref": "Deuteronomy 6:6-7",
        "note": "Explores how they'd respond if a child questions their faith.",
        "guessable": true,
        "opts": [
          "Gently guide them back",
          "Let them explore freely",
          "Step in with concern",
          "Trust the foundation we laid"
        ]
      }
    ]
  },
  "intimacy-physical": {
    "name": "Intimacy",
    "color": "#A8554E",
    "icon": "heart",
    "hook": {
      "id": "INT-019",
      "q": "How much does feeling emotionally close affect wanting to be physically close?"
    },
    "questions": [
      {
        "id": "INT-012",
        "q": "How important is everyday affection and playfulness to you?",
        "type": "scale",
        "depth": 1,
        "ref": "Song of Solomon 2:4",
        "note": "The 'delight and enjoyment' theme as a non-sexual affection need.",
        "guessable": true,
        "core": true,
        "lo": "Not a big need",
        "hi": "Very important"
      },
      {
        "id": "INT-003",
        "q": "How much does physical attraction factor into a relationship for you?",
        "type": "scale",
        "depth": 3,
        "note": "Names honestly how much physical attraction factors in.",
        "guessable": true,
        "core": true,
        "lo": "Not much",
        "hi": "Very much"
      },
      {
        "id": "INT-016",
        "q": "Which matters more to a marriage?",
        "type": "scale",
        "depth": 3,
        "note": "Relative priority, distinct from the dependency question (does closeness drive desire). Follows the THEO-002 pattern of a spectrum between two honest poles.",
        "guessable": true,
        "lo": "The physical connection",
        "hi": "The emotional connection"
      },
      {
        "id": "INT-022",
        "q": "Who should take the lead in initiating physical affection in marriage?",
        "type": "mc",
        "depth": 3,
        "ref": "1 Corinthians 7:3-4",
        "note": "Lands the initiation question on the gender-roles axis directly, matching how FAITH-023 and ROLE-004 handle headship and provision.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "The husband",
          "The wife",
          "Whoever feels like it",
          "Both, equally",
          "We'd have to find our rhythm"
        ]
      },
      {
        "id": "INT-019",
        "q": "How much does feeling emotionally close affect wanting to be physically close?",
        "type": "scale",
        "depth": 4,
        "note": "The classic marriage friction — one partner needs closeness to want intimacy, the other uses intimacy to get closeness. A gap here is real misalignment, not complementary.",
        "guessable": true,
        "core": true,
        "lo": "They're separate for me",
        "hi": "I need to feel close first"
      },
      {
        "id": "INT-001",
        "q": "How important is physical intimacy to you in marriage?",
        "type": "scale",
        "depth": 5,
        "ref": "1 Corinthians 7:3-5",
        "note": "Opens honest conversation about physical intimacy and expectations.",
        "guessable": true,
        "core": true,
        "lo": "A low priority",
        "hi": "Very important"
      },
      {
        "id": "INT-002",
        "q": "What should our physical boundaries be before marriage?",
        "type": "mc",
        "depth": 5,
        "ref": "1 Thessalonians 4:3-4",
        "note": "Surfaces convictions and boundaries around physical intimacy now.",
        "guessable": true,
        "opts": [
          "Save all physical intimacy for marriage",
          "Some affection with clear limits",
          "Comfortable being physically close",
          "Still discussing"
        ]
      },
      {
        "id": "INT-005",
        "q": "How comfortable are you talking openly about sex?",
        "type": "scale",
        "depth": 5,
        "note": "Opens honest, judgment-free talk about intimacy and expectations.",
        "guessable": true,
        "lo": "Very uncomfortable",
        "hi": "Very comfortable"
      },
      {
        "id": "INT-007",
        "q": "How important is it that we agree on physical intimacy?",
        "type": "scale",
        "depth": 5,
        "note": "Weights intimacy gaps in the agreement score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "INT-008",
        "q": "How important is it to you that your partner saved, or is saving, sex for marriage?",
        "type": "scale",
        "depth": 5,
        "ref": "Hebrews 13:4",
        "note": "The 'body count' concern as a value both rate, not a number to extract.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "INT-009",
        "q": "What's your view on sex before marriage?",
        "type": "mc",
        "depth": 5,
        "note": "The conviction itself, distinct from the boundaries question (INT-002).",
        "guessable": true,
        "opts": [
          "Should be saved for marriage, no exceptions",
          "Ideal, but grace for the past",
          "A personal choice",
          "Not a moral issue to me"
        ]
      },
      {
        "id": "INT-010",
        "q": "How open are you to fully sharing your sexual history before marriage?",
        "type": "scale",
        "depth": 5,
        "note": "Surfaces disclosure comfort; left non-guessable as too sensitive to gamify.",
        "lo": "I'd rather keep my past private",
        "hi": "Fully open about it"
      },
      {
        "id": "INT-013",
        "q": "Can you fully know someone you've never slept with?",
        "type": "mc",
        "depth": 5,
        "ref": "Genesis 2:24",
        "note": "The secular premise this whole app is built against, named out loud. A couple who waits is marrying on incomplete information and usually isn't allowed to say so. Surfacing it is the point.",
        "guessable": true,
        "opts": [
          "Yes — sex tells you nothing you couldn't learn another way",
          "Mostly, but there'd be a gap",
          "No — it's a real unknown until then",
          "I'd rather not think about it that way"
        ]
      },
      {
        "id": "INT-014",
        "q": "How much of a risk is it to marry someone before knowing whether you're physically compatible?",
        "type": "scale",
        "depth": 5,
        "note": "The honest anxiety underneath the conviction. Someone can hold the conviction firmly and still rate this high — that combination is worth a conversation, not a score.",
        "guessable": true,
        "lo": "No risk — it works itself out",
        "hi": "A real risk I think about"
      },
      {
        "id": "INT-015",
        "q": "If we found after marriage that we want very different things physically, what would you expect?",
        "type": "mc",
        "depth": 5,
        "ref": "1 Corinthians 7:3-5",
        "note": "Converts the abstract risk into a plan. The gap between 'we'd work it out' and 'serious problem' is the whole conversation.",
        "guessable": true,
        "opts": [
          "We'd work it out over time",
          "We'd seek counsel or help",
          "It'd be a serious problem for us",
          "I haven't thought about it"
        ]
      },
      {
        "id": "INT-017",
        "q": "In marriage, would you be comfortable being physically close when we're upset with each other?",
        "type": "mc",
        "depth": 5,
        "ref": "Ephesians 4:26",
        "note": "Sex-and-conflict interaction. The bank covers pre-marriage boundaries exhaustively but nothing about how intimacy behaves inside a marriage. A real and common split.",
        "guessable": true,
        "opts": [
          "Yes — it would help us reconnect",
          "No — I'd need it resolved first",
          "Depends how big the issue is",
          "I'm not sure"
        ]
      },
      {
        "id": "INT-018",
        "q": "Is it ever okay to hold back physical affection to make a point?",
        "type": "mc",
        "depth": 5,
        "ref": "1 Corinthians 7:5",
        "note": "Names withholding intimacy as leverage directly rather than hedging it. Distinct from INT-011 (temptation protocol) and INT-001 (importance).",
        "guessable": true,
        "opts": [
          "Never",
          "Only if I'm genuinely hurt",
          "Sometimes, yes",
          "It's a fair response"
        ]
      },
      {
        "id": "INT-020",
        "q": "How much would our physical intimacy tell you about how our marriage is doing?",
        "type": "scale",
        "depth": 5,
        "note": "Sex as barometer, distinct from INT-001 (how important intimacy is). Someone can rate intimacy highly without reading the marriage through it.",
        "guessable": true,
        "notYet": true,
        "lo": "It wouldn't be a signal for me",
        "hi": "It'd be the clearest signal there is"
      },
      {
        "id": "INT-021",
        "q": "If our physical intimacy went through a dry season, what would your first thought be?",
        "type": "mc",
        "depth": 5,
        "note": "Surfaces the interpretation each brings to a low season before it happens — the interpretation is usually what does the damage, not the season.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Something's wrong between us",
          "It's just a busy season",
          "I'd feel rejected",
          "I'd want to talk about it straight away"
        ]
      }
    ]
  },
  "conflict-communication": {
    "name": "Conflict",
    "color": "#B06A5E",
    "icon": "chat",
    "hook": {
      "id": "CONF-021",
      "q": "When someone interrupts you, how do you usually react?"
    },
    "questions": [
      {
        "id": "CONF-001",
        "q": "How do you most naturally give and receive love?",
        "type": "mc",
        "depth": 1,
        "note": "Helps each name how they best give and receive love.",
        "guessable": true,
        "opts": [
          "Words of affirmation",
          "Quality time",
          "Acts of service",
          "Gifts",
          "Physical touch"
        ]
      },
      {
        "id": "CONF-009",
        "q": "Rank these from most to least how you give and receive love.",
        "type": "rank",
        "depth": 1,
        "note": "Surfaces what makes each feel most loved.",
        "core": true,
        "opts": [
          "Words of affirmation",
          "Quality time",
          "Acts of service",
          "Gifts",
          "Physical touch"
        ]
      },
      {
        "id": "CONF-020",
        "q": "How much daily contact do you need to feel connected?",
        "type": "mc",
        "depth": 1,
        "note": "Communication cadence — a real gap the bank only covered for style, not frequency.",
        "guessable": true,
        "opts": [
          "Constant throughout the day",
          "A few check-ins",
          "Once a day is plenty",
          "We don't need daily contact"
        ]
      },
      {
        "id": "CONF-002",
        "q": "How soon do you like to resolve conflict?",
        "type": "scale",
        "depth": 2,
        "ref": "James 1:19",
        "note": "Surfaces conflict styles before they collide.",
        "guessable": true,
        "core": true,
        "lo": "I need space first",
        "hi": "Address it right away"
      },
      {
        "id": "CONF-003",
        "q": "Rank how you react under stress, most like you first.",
        "type": "rank",
        "depth": 2,
        "ref": "Philippians 4:6-7",
        "note": "Surfaces coping styles so partners can support each other under pressure.",
        "opts": [
          "Withdraw and go quiet",
          "Talk it out",
          "Power through alone",
          "Get irritable"
        ]
      },
      {
        "id": "CONF-004",
        "q": "How anxious do you feel about marriage?",
        "type": "scale",
        "depth": 2,
        "note": "Invites honesty about fears and the hard parts of marriage.",
        "guessable": true,
        "lo": "Completely at ease",
        "hi": "Quite anxious"
      },
      {
        "id": "CONF-008",
        "q": "Rank what makes you feel most respected.",
        "type": "rank",
        "depth": 2,
        "note": "Surfaces what respect concretely looks like for each.",
        "opts": [
          "Being heard",
          "Loyalty",
          "Honesty",
          "Support in public",
          "My independence"
        ]
      },
      {
        "id": "CONF-011",
        "q": "Rank these communication styles from most to least like you.",
        "type": "rank",
        "depth": 2,
        "note": "Surfaces talk-style differences before they trip us up.",
        "opts": [
          "Direct and to the point",
          "Detailed processor",
          "Quiet and internal",
          "Expressive and talkative"
        ]
      },
      {
        "id": "CONF-012",
        "q": "When you need to raise a problem, how do you prefer to do it?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces how concerns and complaints get raised.",
        "guessable": true,
        "opts": [
          "Address it right away",
          "Wait for the right moment",
          "Write or text it",
          "Avoid it until it builds up"
        ]
      },
      {
        "id": "CONF-013",
        "q": "In the heat of conflict, which is your reflex?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces default conflict mode.",
        "guessable": true,
        "core": true,
        "opts": [
          "Give in",
          "Withdraw",
          "Push to win",
          "Compromise",
          "Work it through"
        ]
      },
      {
        "id": "CONF-014",
        "q": "How well do you handle hearing 'no' from a partner?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces respect for boundaries and limits.",
        "guessable": true,
        "lo": "I struggle with it",
        "hi": "I take it easily"
      },
      {
        "id": "CONF-016",
        "q": "How much conflict feels normal and healthy in a relationship to you?",
        "type": "scale",
        "depth": 2,
        "note": "Catches the chaos-tolerance gap before it collides.",
        "guessable": true,
        "lo": "Almost none",
        "hi": "Frequent is normal"
      },
      {
        "id": "CONF-017",
        "q": "How calm or high-energy do you want our home environment to feel?",
        "type": "scale",
        "depth": 2,
        "note": "The peace-vs-chaos flag, framed as a shared preference.",
        "guessable": true,
        "lo": "Calm and quiet",
        "hi": "Lively and high-energy"
      },
      {
        "id": "CONF-018",
        "q": "How quick is your temper?",
        "type": "scale",
        "depth": 2,
        "note": "Names the anger red flag directly as a self-rating, distinct from conflict style.",
        "guessable": true,
        "core": true,
        "lo": "Very slow to anger",
        "hi": "Quick-tempered"
      },
      {
        "id": "CONF-019",
        "q": "In a disagreement, how much does being proven right matter to you?",
        "type": "scale",
        "depth": 2,
        "ref": "Philippians 2:3",
        "note": "The 'unity over being right' value, distinct from conflict reflex (CONF-013).",
        "guessable": true,
        "lo": "I'd rather keep the peace",
        "hi": "Being right matters to me"
      },
      {
        "id": "CONF-021",
        "q": "When someone interrupts you, how do you usually react?",
        "type": "mc",
        "depth": 2,
        "ref": "James 1:19",
        "note": "A concrete tell for patience and listening, framed behaviourally.",
        "guessable": true,
        "opts": [
          "Let it go",
          "Wait, then carry on",
          "Get quietly annoyed",
          "Talk over them right back"
        ]
      },
      {
        "id": "CONF-022",
        "q": "When conflict happens, how readily do you take responsibility for your part?",
        "type": "scale",
        "depth": 2,
        "ref": "Matthew 7:5",
        "note": "The ownership-vs-victim axis, distinct from conflict reflex (CONF-013).",
        "guessable": true,
        "core": true,
        "lo": "I usually feel wronged",
        "hi": "I quickly own my part"
      },
      {
        "id": "CONF-023",
        "q": "How okay is it to talk through our relationship problems with friends or family?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 11:13",
        "note": "The 'Lord first, don't vent to others' theme as a marital-discretion axis.",
        "guessable": true,
        "lo": "Keep it strictly between us",
        "hi": "Fine to talk it through with others"
      },
      {
        "id": "CONF-024",
        "q": "How gentle or blunt is your way of speaking, especially when frustrated?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 15:1",
        "note": "The 'softer answer' theme — verbal harshness, distinct from temper (CONF-018).",
        "guessable": true,
        "lo": "Very gentle",
        "hi": "Very blunt"
      },
      {
        "id": "CONF-025",
        "q": "How important is it to protect regular one-on-one time, no matter how busy we get?",
        "type": "scale",
        "depth": 2,
        "note": "The 'ships passing in the night' theme; quality-time intentionality vs contact frequency (CONF-020).",
        "guessable": true,
        "lo": "We'll connect when we connect",
        "hi": "We must guard dedicated time"
      },
      {
        "id": "CONF-026",
        "q": "When we argue, is it fair to bring up past mistakes?",
        "type": "mc",
        "depth": 2,
        "ref": "1 Corinthians 13:5",
        "note": "The 'mental scorecard' theme as a conflict-style value (kitchen-sinking).",
        "guessable": true,
        "opts": [
          "No, stay on the current issue",
          "Only if directly relevant",
          "Sometimes, patterns matter",
          "Yes, the past is fair game"
        ]
      },
      {
        "id": "CONF-027",
        "q": "How important is it that we point out each other's blind spots?",
        "type": "scale",
        "depth": 2,
        "ref": "Ephesians 4:15",
        "note": "The blind-spot value as intensity — should we name what the other can't see?",
        "guessable": true,
        "lo": "Better to let things be",
        "hi": "Very important"
      },
      {
        "id": "CONF-028",
        "q": "Should partners point out each other's blind spots?",
        "type": "mc",
        "depth": 2,
        "note": "The blind-spot value as approach — pairs with the SCALE on intensity.",
        "guessable": true,
        "opts": [
          "Always, lovingly",
          "Only the big ones",
          "Only when asked",
          "Better to let it be"
        ]
      },
      {
        "id": "CONF-029",
        "q": "Rank what you most need after a fight.",
        "type": "rank",
        "depth": 3,
        "ref": "Ephesians 4:32",
        "note": "The bank covers conflict style, timing, reflex and ownership — and nothing at all about repair. What each person needs afterward is what actually decides whether arguments cost a marriage anything.",
        "core": true,
        "opts": [
          "Space",
          "Reassurance that we're okay",
          "To feel heard",
          "An apology",
          "To move on quickly",
          "To be physically close again"
        ]
      },
      {
        "id": "CONF-030",
        "q": "Should partners tell each other everything they feel?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 29:11",
        "note": "Transparency of feelings, distinct from CONF-015 which is privacy of facts and life. Someone can want total factual openness and still think unfiltered feelings are corrosive.",
        "guessable": true,
        "opts": [
          "Yes — everything",
          "Most things, once I've made sense of them",
          "Only what affects us",
          "Some feelings are better kept to myself"
        ]
      },
      {
        "id": "CONF-031",
        "q": "Is it better to say a feeling as it comes, or work out what it means first?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 15:28",
        "note": "The norm half of a self/norm pair with the SELF latency question. The tell is when someone's belief about what partners should do contradicts what they actually need.",
        "guessable": true,
        "opts": [
          "Say it as it comes",
          "Work it out on my own first",
          "Say it as it comes and work it out together",
          "Depends on the feeling"
        ]
      },
      {
        "id": "CONF-032",
        "q": "When I go quiet to process something on my own, how does that land for you?",
        "type": "mc",
        "depth": 3,
        "note": "The reception side of a processing style. The bank asks how each person behaves (CONF-003, SELF-017) but never how their partner's behaviour lands on them.",
        "guessable": true,
        "core": true,
        "opts": [
          "Fine — I'd give you space",
          "I'd worry something was wrong",
          "I'd feel shut out",
          "I'd keep asking until you talked"
        ]
      },
      {
        "id": "CONF-033",
        "q": "How do hard conversations become safe for you?",
        "type": "mc",
        "depth": 3,
        "note": "A genuine chicken-and-egg about disclosure sequencing. Distinct from SELF-001 (how easily you open up) — this is what has to be true first.",
        "guessable": true,
        "opts": [
          "We get close first, then we can talk about hard things",
          "Talking about hard things is what makes us close",
          "A bit of both, in step",
          "Depends entirely on the topic"
        ]
      },
      {
        "id": "CONF-034",
        "q": "Does every problem between us need to be talked through?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 19:11",
        "note": "The inversion of the talk-it-out norm. CONF-002/012/013 all assume the conversation happens and ask about timing and style; this asks whether it should happen at all.",
        "guessable": true,
        "opts": [
          "Yes, always",
          "Most, but some can be let go",
          "Only the big ones",
          "Some things are better left alone"
        ]
      },
      {
        "id": "CONF-036",
        "q": "How readily would you ask me for help?",
        "type": "scale",
        "depth": 3,
        "ref": "Galatians 6:2",
        "note": "SELF-023 lists prayer, Scripture, counsel and own judgment as what you lean on — but never the partner. This fills that gap.",
        "guessable": true,
        "lo": "I'd rather work it out myself",
        "hi": "I'd ask straight away"
      },
      {
        "id": "CONF-037",
        "q": "When I make plans with friends, should you be invited by default?",
        "type": "mc",
        "depth": 3,
        "note": "Everyday default inclusion, distinct from CONF-007 (solo trips, a big event) and US-030 (whether you get along with them).",
        "guessable": true,
        "opts": [
          "Yes, always",
          "Usually, unless there's a reason",
          "No — separate friendships are healthy",
          "Depends on the friends"
        ]
      },
      {
        "id": "CONF-015",
        "q": "How much privacy is healthy in a marriage?",
        "type": "scale",
        "depth": 4,
        "note": "Surfaces transparency vs privacy expectations.",
        "guessable": true,
        "lo": "Total transparency",
        "hi": "Plenty can stay private"
      },
      {
        "id": "CONF-035",
        "q": "Which of these feels most okay to keep to yourself in marriage?",
        "type": "mc",
        "depth": 4,
        "note": "Makes CONF-015's abstract privacy scale concrete. The reveal is which specific thing each names — far more useful than a number.",
        "guessable": true,
        "core": true,
        "opts": [
          "Nothing — full openness",
          "My private thoughts and prayers",
          "My past",
          "My friendships and conversations",
          "My money"
        ]
      }
    ]
  },
  "in-laws-extended-family": {
    "name": "In-Laws",
    "color": "#9C7A4A",
    "icon": "family",
    "hook": {
      "id": "INLAW-013",
      "q": "What do you call your partner's parents?"
    },
    "questions": [
      {
        "id": "INLAW-013",
        "q": "What do you call your partner's parents?",
        "type": "mc",
        "depth": 1,
        "note": "The best warm-up in the batch. Funny, instant, and a genuinely accurate read on how close that relationship already is.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "opts": [
          "First names",
          "Mr and Mrs",
          "Mum and Dad",
          "I avoid calling them anything at all"
        ]
      },
      {
        "id": "INLAW-014",
        "q": "How are you at family small talk?",
        "type": "scale",
        "depth": 1,
        "note": "Light entry to a deck that opens on boundary-setting. Predicts a lot of Christmases.",
        "guessable": true,
        "lo": "I'd rather hide in the kitchen",
        "hi": "I genuinely love it"
      },
      {
        "id": "INLAW-001",
        "q": "How firm should our boundaries with extended family be?",
        "type": "scale",
        "depth": 2,
        "ref": "Genesis 2:24",
        "note": "Surfaces boundaries with extended family before tensions arise.",
        "guessable": true,
        "core": true,
        "lo": "Keep family very involved",
        "hi": "Firm boundaries"
      },
      {
        "id": "INLAW-002",
        "q": "How should we handle holidays between both families?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces holiday and family-time expectations.",
        "guessable": true,
        "opts": [
          "Alternate fairly each year",
          "Mostly all together",
          "Start our own traditions",
          "Play it by ear"
        ]
      },
      {
        "id": "INLAW-005",
        "q": "How important is it to you that both our families support our relationship?",
        "type": "scale",
        "depth": 2,
        "note": "The 'both families are at peace' flag as a shared value.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "INLAW-006",
        "q": "How much do your parents influence your decisions?",
        "type": "scale",
        "depth": 2,
        "note": "Parental-influence level, distinct from leave-and-cleave (INLAW-004); thin category.",
        "guessable": true,
        "lo": "I decide independently",
        "hi": "I lean on them heavily"
      },
      {
        "id": "INLAW-007",
        "q": "As a couple, how much should we make big decisions on our own versus with our parents' input?",
        "type": "scale",
        "depth": 2,
        "note": "The couple's stance on parental input, distinct from how much parents influence you (INLAW-006).",
        "guessable": true,
        "lo": "On our own",
        "hi": "With our parents' input"
      },
      {
        "id": "INLAW-010",
        "q": "How often should we see each set of parents?",
        "type": "mc",
        "depth": 3,
        "note": "INLAW-001 rates boundary firmness on a scale. This is the actual number, which is what people argue about.",
        "guessable": true,
        "opts": [
          "Weekly or more",
          "Monthly",
          "A few times a year",
          "As little as we can manage"
        ]
      },
      {
        "id": "INLAW-011",
        "q": "Should our parents have a key to our home?",
        "type": "mc",
        "depth": 3,
        "note": "A small, concrete, slightly funny question that settles the boundary argument faster than the abstract version ever will.",
        "guessable": true,
        "opts": [
          "Yes, of course",
          "Only for emergencies",
          "No",
          "We'd need to talk about that one"
        ]
      },
      {
        "id": "INLAW-012",
        "q": "How close should we live to family?",
        "type": "mc",
        "depth": 3,
        "note": "FAM-007 rates how much it matters that children grow up near extended family. This is about the two of you, and it's a decision rather than a value.",
        "guessable": true,
        "opts": [
          "Same town",
          "Within an hour",
          "Same country is close enough",
          "Distance doesn't matter to me"
        ]
      },
      {
        "id": "INLAW-003",
        "q": "How should we approach caring for aging parents?",
        "type": "mc",
        "depth": 4,
        "ref": "1 Timothy 5:8",
        "note": "Surfaces expectations about caring for aging parents.",
        "guessable": true,
        "opts": [
          "They live with us if needed",
          "We support but keep separate homes",
          "Shared with siblings",
          "Haven't thought about it"
        ]
      },
      {
        "id": "INLAW-004",
        "q": "How ready are you to put your spouse before your parents?",
        "type": "scale",
        "depth": 4,
        "note": "Surfaces 'leave and cleave' and healthy independence.",
        "guessable": true,
        "notYet": true,
        "core": true,
        "lo": "It would be hard",
        "hi": "Fully ready"
      },
      {
        "id": "INLAW-008",
        "q": "If your family disrespected me, what would you do?",
        "type": "mc",
        "depth": 4,
        "ref": "Genesis 2:24",
        "note": "The defence question. INLAW-004 asks readiness to put a spouse before parents in principle; this is the moment that principle gets tested, and the honest fourth option is the one people recognise.",
        "guessable": true,
        "core": true,
        "opts": [
          "Address it with them immediately",
          "Talk to you first, then decide",
          "Let it go to keep the peace",
          "I'd struggle to say anything"
        ]
      },
      {
        "id": "INLAW-009",
        "q": "How much financial help from family is okay?",
        "type": "mc",
        "depth": 4,
        "note": "Completely missing from a bank with 17 finance questions. Family money carries family expectations, and couples discover the exchange rate afterwards.",
        "guessable": true,
        "opts": [
          "None — we stand on our own",
          "Gifts are fine",
          "Help in a genuine crisis",
          "Whatever they're willing to offer"
        ]
      }
    ]
  },
  "fun-icebreakers": {
    "name": "Fun",
    "color": "#E0A93C",
    "icon": "star",
    "hook": {
      "id": "FUN-011",
      "q": "Who's more likely to fall asleep during the sermon?"
    },
    "questions": [
      {
        "id": "FUN-010",
        "q": "Who's more likely to be running late?",
        "type": "mc",
        "depth": 1,
        "note": "Light, concrete, and the source of more real friction than most couples admit before living together.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-008",
        "q": "Who's more likely to cry at a film?",
        "type": "mc",
        "depth": 1,
        "note": "A pure warm-up. Costs nothing, wrong answers are charming, and it teaches the guess mechanic before anything is at stake.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-023",
        "q": "Who's more likely to overthink a text?",
        "type": "mc",
        "depth": 1,
        "note": "Warm-up hook — modern and instantly relatable; universal options.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-009",
        "q": "Who's more likely to apologise first after a row?",
        "type": "mc",
        "depth": 1,
        "note": "Plays as a laugh and lands as a finding. If both say the same name, that person is doing the repair work — and now they've both seen it.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-011",
        "q": "Who's more likely to fall asleep during the sermon?",
        "type": "mc",
        "depth": 1,
        "note": "Faith-culture humour that only works inside the niche. This is the kind of question a secular competitor structurally cannot write.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-002",
        "q": "What's your ideal way to spend a free day?",
        "type": "mc",
        "depth": 1,
        "note": "Light look at how each likes to spend time and where it overlaps.",
        "guessable": true,
        "opts": [
          "Out adventuring",
          "Cozy at home",
          "With friends",
          "Tackling projects"
        ]
      },
      {
        "id": "FUN-003",
        "q": "Of all the things I love doing, which would you secretly rather sit out?",
        "type": "mc",
        "depth": 1,
        "note": "Clears the air on shared vs solo activities, honestly.",
        "guessable": true,
        "opts": [
          "Your hobbies",
          "Big group things",
          "Church events",
          "Family visits",
          "Nothing — I'm in for all of it"
        ]
      },
      {
        "id": "FUN-004",
        "q": "A perfect evening in together looks like…",
        "type": "mc",
        "depth": 1,
        "note": "A warm opener about how each likes to spend time together — reframed from a TV-pick question that set a slightly disengaged tone for a couples app.",
        "guessable": true,
        "opts": [
          "A film under a blanket",
          "Cooking something together",
          "Same room, both doing our own thing",
          "Talking for hours",
          "Friends round"
        ]
      },
      {
        "id": "FUN-005",
        "q": "Surprise inheritance, money's no object. What actually happens?",
        "type": "mc",
        "depth": 1,
        "note": "A fun hypothetical that quietly surfaces values.",
        "guessable": true,
        "opts": [
          "We quit and travel",
          "Buy a house outright",
          "Give a big chunk away",
          "Barely change anything",
          "Start something of our own"
        ]
      },
      {
        "id": "FUN-006",
        "q": "How much of your free time do you want to spend on your own hobbies versus together?",
        "type": "scale",
        "depth": 1,
        "note": "Leisure allocation, distinct from solitude-to-recharge (SELF-013).",
        "guessable": true,
        "lo": "Mostly together",
        "hi": "Lots of independent time"
      },
      {
        "id": "FUN-001",
        "q": "When it comes to food, what are you?",
        "type": "mc",
        "depth": 1,
        "note": "Reframed from a pick-a-cuisine question (too limiting — the options excluded whole tastes). Now captures the underlying value: your disposition toward food, which is what actually aligns.",
        "guessable": true,
        "opts": [
          "Adventurous — I'll try anything",
          "Give me my comfort favourites",
          "Health comes first",
          "Quick and easy — food's just fuel",
          "A proper foodie — I live for it"
        ]
      },
      {
        "id": "FUN-007",
        "q": "You've got a free evening and I'm busy. What's your instinct?",
        "type": "mc",
        "depth": 1,
        "note": "A light, behavioural read on independence that lands the same construct as the solitude scales without asking anyone to rate themselves.",
        "guessable": true,
        "opts": [
          "Go do something on my own",
          "Save it for when we're both free",
          "Call a friend",
          "Stay in and rest"
        ]
      },
      {
        "id": "FUN-016",
        "q": "Who gets the remote?",
        "type": "mc",
        "depth": 1,
        "note": "Replaces the open-ended half of FUN-004 with something that actually plays.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-017",
        "q": "Pick our holiday.",
        "type": "mc",
        "depth": 1,
        "note": "A fast, high-agreement-value preference with zero threat. Good early filler that still produces a real reveal.",
        "guessable": true,
        "opts": [
          "Beach and absolutely nothing",
          "A city, museums and food",
          "Mountains and walking",
          "Somewhere neither of us has been",
          "All-inclusive, no decisions"
        ]
      },
      {
        "id": "FUN-020",
        "q": "Be honest — how good a cook are you?",
        "type": "mc",
        "depth": 1,
        "note": "Pairs with HOME-001. Someone can say 'we'd share the cooking' and also admit they can't cook, and the collision of those two answers is the joke and the point.",
        "guessable": true,
        "opts": [
          "Genuinely good",
          "Perfectly fine",
          "Depends entirely on the recipe",
          "I'd be relying on you"
        ]
      },
      {
        "id": "FUN-022",
        "q": "Sunday afternoon, nothing planned. What's the dream?",
        "type": "mc",
        "depth": 1,
        "note": "Distinct from FUN-002 (a whole free day) — this is the specific dead hour every couple has to negotiate every week.",
        "guessable": true,
        "opts": [
          "A nap",
          "Out for a walk",
          "See friends",
          "A project at home",
          "Whatever you fancy"
        ]
      },
      {
        "id": "FUN-012",
        "q": "Who's more likely to pray out loud first?",
        "type": "mc",
        "depth": 2,
        "note": "Funny on the surface, and quietly the same axis as FAITH-023 (who leads spiritually) — asked in a way nobody gets defensive about.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-013",
        "q": "Who's more likely to spend a couple of hundred without mentioning it?",
        "type": "mc",
        "depth": 2,
        "note": "The money-secrecy question wearing a party hat. Pairs with FIN-003 (financial openness) and gets a more honest answer than it does.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-014",
        "q": "Who's more likely to hold a grudge?",
        "type": "mc",
        "depth": 2,
        "note": "Reads as banter, sits directly on SELF-012 (how easily do you forgive). If they disagree about the answer, that's the conversation.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-015",
        "q": "Who's more likely to start the argument?",
        "type": "mc",
        "depth": 2,
        "note": "The last of the light-but-loaded set. Both naming the same person is useful; naming each other is more useful.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "Both of us, equally",
          "Neither of us"
        ]
      },
      {
        "id": "FUN-018",
        "q": "What's the most annoying thing you could do that I'd have to live with?",
        "type": "mc",
        "depth": 2,
        "note": "Self-deprecating, funny, and genuinely predictive of daily friction. Asks for a flaw in a frame where naming one is the fun part.",
        "guessable": true,
        "opts": [
          "Leaving things everywhere",
          "Always running late",
          "Talking through films",
          "Snoring",
          "Being on my phone too much"
        ]
      },
      {
        "id": "FUN-019",
        "q": "Which is worse in a partner?",
        "type": "mc",
        "depth": 2,
        "note": "A forced choice with no safe option, which is what makes it play. Quietly ranks four real complaints.",
        "guessable": true,
        "opts": [
          "Never listening",
          "Never apologising",
          "Never planning anything",
          "Never relaxing"
        ]
      },
      {
        "id": "FUN-021",
        "q": "Which of these would you actually want at our wedding?",
        "type": "mc",
        "depth": 2,
        "note": "Fun on its face, a real logistical and family fault line underneath, and it sits naturally next to the In-Laws deck.",
        "guessable": true,
        "opts": [
          "Big church, everyone we know",
          "Small and intimate",
          "Abroad, just us",
          "I honestly have no idea"
        ]
      }
    ]
  },
  "deal-breakers": {
    "name": "Deal-breakers",
    "color": "#B0504E",
    "icon": "shield",
    "hook": {
      "id": "DEAL-021",
      "q": "Have you ever stayed in a relationship past a line you'd set for yourself?"
    },
    "questions": [
      {
        "id": "DEAL-022",
        "q": "Which of these could you honestly never live with?",
        "type": "mc",
        "depth": 1,
        "note": "Deal-breakers currently opens by asking you to rank what would end you. This is a door instead of a cliff — a joke deal-breaker that is still, truthfully, on topic.",
        "guessable": true,
        "opts": [
          "Bad breath",
          "Terrible taste in music",
          "Always running late",
          "Loud chewing",
          "None of these actually matter"
        ]
      },
      {
        "id": "DEAL-023",
        "q": "Be honest — how picky are you?",
        "type": "scale",
        "depth": 1,
        "note": "Self-rated fussiness as the on-ramp. Light, and it usefully frames every heavier question in the deck that follows.",
        "guessable": true,
        "core": true,
        "lo": "Pretty easy-going",
        "hi": "I've got a long list"
      },
      {
        "id": "DEAL-003",
        "q": "What's the one thing about you you'd never change for anyone?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces core, unchangeable values.",
        "guessable": true,
        "opts": [
          "My faith",
          "My independence",
          "My honesty, even when it costs me",
          "My ambition",
          "How close I am to my family"
        ]
      },
      {
        "id": "DEAL-013",
        "q": "If you found out I'd hidden significant debt from you, what would that be?",
        "type": "mc",
        "depth": 4,
        "ref": "Ephesians 4:25",
        "note": "FIN-013 asks people to disclose their debt. This asks what happens if they didn't — and the framing puts the weight on the concealment rather than the number, which is where it belongs.",
        "guessable": true,
        "core": true,
        "opts": [
          "A deal-breaker — it's the hiding, not the money",
          "A serious problem, but we'd work through it",
          "Frustrating, but survivable",
          "Not really a big deal"
        ]
      },
      {
        "id": "DEAL-018",
        "q": "If our marriage was in real trouble and one of us refused counselling, what then?",
        "type": "mc",
        "depth": 4,
        "note": "US-013 asks whether you're open to counselling. This asks what happens when the other person isn't — which is the actual scenario, since the partner who needs it most is usually the one refusing.",
        "guessable": true,
        "opts": [
          "I'd go on my own",
          "I'd bring in our pastor or mentors",
          "I'd push until you came",
          "I'd probably give up"
        ]
      },
      {
        "id": "DEAL-001",
        "q": "Rank these from most to least of a deal-breaker for you.",
        "type": "rank",
        "depth": 5,
        "note": "Names genuine non-negotiables out loud.",
        "core": true,
        "opts": [
          "Dishonesty",
          "Disrespect",
          "A different faith",
          "Addiction",
          "Unfaithfulness",
          "Laziness"
        ]
      },
      {
        "id": "DEAL-002",
        "q": "Rank your must-haves in a spouse, most important first.",
        "type": "rank",
        "depth": 5,
        "note": "Names non-negotiables on both sides.",
        "opts": [
          "Faith",
          "Kindness",
          "Ambition",
          "Humour",
          "Loyalty",
          "Attraction",
          "Shared goals"
        ]
      },
      {
        "id": "DEAL-004",
        "q": "Could you marry someone who doesn't share your faith?",
        "type": "mc",
        "depth": 5,
        "ref": "2 Corinthians 6:14",
        "note": "The interfaith deal-breaker as a direct position, not just a rank item.",
        "guessable": true,
        "opts": [
          "No, never",
          "Only if they were open to it",
          "Yes, if we respected each other",
          "Faith isn't essential to me"
        ]
      },
      {
        "id": "DEAL-005",
        "q": "Could you stay with someone who became unfaithful?",
        "type": "mc",
        "depth": 5,
        "note": "Surfaces where each lands on infidelity before it's ever tested.",
        "guessable": true,
        "core": true,
        "opts": [
          "No, that's the end",
          "I'd try to work through it",
          "It would depend on the circumstances",
          "I'd forgive and rebuild"
        ]
      },
      {
        "id": "DEAL-006",
        "q": "How much would a serious addiction be a deal-breaker for you?",
        "type": "scale",
        "depth": 5,
        "note": "Names the addiction line directly.",
        "guessable": true,
        "lo": "I could work through it",
        "hi": "An absolute deal-breaker"
      },
      {
        "id": "DEAL-007",
        "q": "Could you marry someone who never wants children, when you do?",
        "type": "mc",
        "depth": 5,
        "note": "The kids mismatch as a deal-breaker, distinct from family-size (FAM-001).",
        "guessable": true,
        "opts": [
          "No, it's a deal-breaker",
          "We'd have to find a compromise",
          "I could let it go",
          "I'm flexible on kids"
        ]
      },
      {
        "id": "DEAL-008",
        "q": "Would a criminal record be a deal-breaker for you?",
        "type": "mc",
        "depth": 5,
        "note": "A concrete past-history deal-breaker.",
        "guessable": true,
        "opts": [
          "Yes, any kind",
          "It depends what it was",
          "Only violent crimes",
          "No, people can change"
        ]
      },
      {
        "id": "DEAL-009",
        "q": "Could you marry someone your family strongly disapproved of?",
        "type": "mc",
        "depth": 5,
        "note": "Family approval as a make-or-break, distinct from family-support (INLAW-005).",
        "guessable": true,
        "opts": [
          "No",
          "I'd hesitate a lot",
          "Yes, if I was sure",
          "My family's view wouldn't decide it"
        ]
      },
      {
        "id": "DEAL-010",
        "q": "If I walked away from my faith after we married, what would you do?",
        "type": "mc",
        "depth": 5,
        "ref": "1 Corinthians 7:12-14",
        "note": "The single biggest hole in the bank. DEAL-004 asks whether you'd marry an unbeliever; it never asks what happens if you marry a believer who stops being one. For this audience that is the most common catastrophe there is, and almost no couple discusses it because it feels like inviting it.",
        "guessable": true,
        "opts": [
          "It would change everything between us",
          "I'd stay, and pray you back",
          "We'd find a way to live with it",
          "It wouldn't change how I feel about us"
        ]
      },
      {
        "id": "DEAL-011",
        "q": "If a marriage became physically abusive, what should happen?",
        "type": "mc",
        "depth": 5,
        "note": "Abuse currently appears exactly once in the entire bank, buried as one option inside VAL-004's divorce list. The options here include positions the app does not endorse — that is the point. A person deserves to know before the wedding whether their partner believes leaving is ever permitted.",
        "guessable": true,
        "core": true,
        "opts": [
          "Leave immediately, no question",
          "Leave, and consider reconciliation only after real, proven change",
          "Separate, and bring the church in",
          "Stay and work through it"
        ]
      },
      {
        "id": "DEAL-012",
        "q": "How would you know if a relationship had become controlling?",
        "type": "mc",
        "depth": 5,
        "note": "Coercive control is invisible from the inside, and 'I'm not sure I'd know' is an honest and protective answer. Distinct from SELF-006 (need for control) — that's a trait, this is recognition.",
        "guessable": true,
        "opts": [
          "If I felt afraid to disagree",
          "If I stopped seeing my friends",
          "If I had to explain every purchase",
          "If I was told it was all for my own good",
          "Honestly, I'm not sure I'd know"
        ]
      },
      {
        "id": "DEAL-014",
        "q": "If something serious from my past surfaced years into our marriage, what would matter most to you?",
        "type": "mc",
        "depth": 5,
        "note": "Pairs directly with PAST-002, which asks people to disclose. This asks what the reaction would be — and the reaction is what determines whether the disclosure ever happens at all.",
        "guessable": true,
        "opts": [
          "That you told me yourself, even years late",
          "What it actually was",
          "Why you kept it from me",
          "Nothing — the hiding would be the end of it"
        ]
      },
      {
        "id": "DEAL-015",
        "q": "If one of us developed a serious long-term illness, what's your honest expectation of yourself?",
        "type": "mc",
        "depth": 5,
        "note": "In sickness and in health, asked before it's a vow. Framed as self-assessment rather than 'would you leave' — nobody answers that one honestly, and everyone answers this one.",
        "guessable": true,
        "opts": [
          "I'd carry it without question",
          "I'd struggle, but I'd stay",
          "I honestly don't know how I'd cope",
          "I'd need a lot of support to manage it"
        ]
      },
      {
        "id": "DEAL-016",
        "q": "If we found we could never have children, what would that mean for us?",
        "type": "mc",
        "depth": 5,
        "note": "FAM-002 covers openness to fertility treatment. This is the outcome that treatment doesn't fix, and the last option is one people think and never say.",
        "guessable": true,
        "opts": [
          "We'd grieve and build a different life",
          "We'd pursue every option there is",
          "We'd adopt or foster",
          "I think it would really damage us"
        ]
      },
      {
        "id": "DEAL-017",
        "q": "If you changed your mind about wanting children after we married, what would you expect of me?",
        "type": "mc",
        "depth": 5,
        "note": "DEAL-007 handles the mismatch you know about before the wedding. This is the one that appears afterwards, which is both more common and far more destructive.",
        "guessable": true,
        "opts": [
          "To grieve it with me and accept it",
          "To keep talking until we found a way",
          "To hold me to what we agreed",
          "I can't imagine changing my mind"
        ]
      },
      {
        "id": "DEAL-019",
        "q": "If I changed a lot physically over the years, how honest can you be about what that would do?",
        "type": "scale",
        "depth": 5,
        "note": "INT-003 rates how much attraction matters now. This asks whether it's durable, which is the uncomfortable half and the half that gets tested by every pregnancy, illness and decade.",
        "guessable": true,
        "lo": "It genuinely wouldn't change anything",
        "hi": "I'd struggle with it"
      },
      {
        "id": "DEAL-020",
        "q": "Rank these from easiest to hardest to recover from.",
        "type": "rank",
        "depth": 5,
        "note": "DEAL-001 ranks what would end things. This assumes you stay and ranks the cost of staying — a different question, and the order reveals what each person quietly thinks a marriage can absorb.",
        "opts": [
          "An affair",
          "A serious lie about money",
          "Losing their faith",
          "A long depression",
          "Their family turning on us",
          "Slowly growing apart"
        ]
      },
      {
        "id": "DEAL-021",
        "q": "Have you ever stayed in a relationship past a line you'd set for yourself?",
        "type": "mc",
        "depth": 5,
        "note": "Replaces the 'would you actually leave' version, which had 'I'd try everything first' as an option — that is 'it depends' wearing a suit, and most people would pick it. Same intent (are your deal-breakers real?) asked about the past, where people are reliable, instead of the future, where they aren't. The last option pairs with NOW-001.",
        "guessable": true,
        "core": true,
        "opts": [
          "No — I've always held the line",
          "Yes, once",
          "Yes, more than once",
          "I've never had my lines tested"
        ]
      }
    ]
  },
  "health-lifestyle": {
    "name": "Health",
    "color": "#7E9A5E",
    "icon": "leaf",
    "questions": [
      {
        "id": "HEALTH-001",
        "q": "Where do your eating habits fall?",
        "type": "scale",
        "depth": 1,
        "note": "Surfaces daily food and lifestyle compatibility.",
        "guessable": true,
        "lo": "Very health-focused",
        "hi": "Whatever tastes good"
      },
      {
        "id": "HEALTH-002",
        "q": "How often do you like to see friends - what's your ideal social rhythm?",
        "type": "mc",
        "depth": 1,
        "note": "Surfaces how social or homebound each likes to be.",
        "guessable": true,
        "opts": [
          "Rarely",
          "A few times a month",
          "Weekly",
          "Several times a week"
        ]
      },
      {
        "id": "HEALTH-003",
        "q": "How do you feel about tattoos?",
        "type": "scale",
        "depth": 1,
        "note": "Light values check on body and appearance.",
        "guessable": true,
        "lo": "Against them",
        "hi": "Love them"
      },
      {
        "id": "HEALTH-008",
        "q": "How much of your day goes to screens and your phone, and how would that flex in a marriage?",
        "type": "mc",
        "depth": 1,
        "note": "Surfaces digital habits.",
        "guessable": true,
        "opts": [
          "Barely any",
          "A moderate amount",
          "A lot - it's my work",
          "More than I'd like"
        ]
      },
      {
        "id": "HEALTH-009",
        "q": "Are you a night owl or an early bird?",
        "type": "scale",
        "depth": 1,
        "note": "A light but real daily-rhythm compatibility check that was missing.",
        "guessable": true,
        "core": true,
        "lo": "Early bird",
        "hi": "Night owl"
      },
      {
        "id": "HEALTH-010",
        "q": "How much do you prioritise personal grooming and self-care?",
        "type": "scale",
        "depth": 1,
        "note": "A real domestic-friction axis (differing standards) that was missing.",
        "guessable": true,
        "lo": "Low-maintenance",
        "hi": "Very particular about it"
      },
      {
        "id": "HEALTH-004",
        "q": "What's your relationship with alcohol, and what would you want it to look like in our home?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces habits and convictions around alcohol.",
        "guessable": true,
        "core": true,
        "opts": [
          "I don't drink",
          "Occasionally / socially",
          "Regularly",
          "I'd prefer an alcohol-free home"
        ]
      },
      {
        "id": "HEALTH-007",
        "q": "When you're sick, how do you most want to be treated?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces caregiving needs and instincts.",
        "guessable": true,
        "opts": [
          "Left alone to rest",
          "Cared for and fussed over",
          "Checked on lightly",
          "Kept company and distracted"
        ]
      },
      {
        "id": "HEALTH-005",
        "q": "If you were filling out a health history with me, what should I know - past and present?",
        "type": "open",
        "depth": 4,
        "note": "A gentle prompt for important health disclosure."
      },
      {
        "id": "HEALTH-006",
        "q": "What's your history and current relationship with alcohol or other substances?",
        "type": "open",
        "depth": 4,
        "note": "Surfaces substance history honestly and without shame."
      }
    ]
  },
  "past-baggage": {
    "name": "The Past",
    "color": "#7E6A78",
    "icon": "leaf",
    "questions": [
      {
        "id": "PAST-004",
        "q": "How much 'baggage' are you bringing - and what size does it pack into?",
        "type": "mc",
        "depth": 1,
        "note": "A light way into a real talk about what each carries.",
        "guessable": true,
        "opts": [
          "A briefcase",
          "A carry-on",
          "A full suitcase",
          "A steamer trunk"
        ]
      },
      {
        "id": "PAST-003",
        "q": "What have your past relationships taught you that'll make you a better partner now?",
        "type": "open",
        "depth": 3,
        "note": "Surfaces growth (vs blame) from previous relationships."
      },
      {
        "id": "PAST-006",
        "q": "Pick a few words for your relationship with each of your parents - and tell me the story behind them.",
        "type": "open",
        "depth": 3,
        "note": "Surfaces family-of-origin bonds."
      },
      {
        "id": "PAST-008",
        "q": "What was the home you grew up in like?",
        "type": "mc",
        "depth": 3,
        "note": "Surfaces the formative family environment.",
        "guessable": true,
        "opts": [
          "Warm and stable",
          "Strict",
          "Chaotic or tense",
          "Distant"
        ]
      },
      {
        "id": "PAST-010",
        "q": "What are a few memories from childhood that still shape you today?",
        "type": "open",
        "depth": 3,
        "note": "Surfaces formative early experiences."
      },
      {
        "id": "PAST-011",
        "q": "Have you worked through your past issues with a mentor, counselor, or in discipleship?",
        "type": "mc",
        "depth": 3,
        "note": "The 'have you done the work before engagement' question, made scoreable.",
        "guessable": true,
        "opts": [
          "Yes, ongoing",
          "Yes, in the past",
          "No, but I'm open to it",
          "No"
        ]
      },
      {
        "id": "PAST-001",
        "q": "Is there anything from your past you're still working through or healing from?",
        "type": "open",
        "depth": 4,
        "ref": "Psalm 147:3",
        "note": "Invites gentle honesty about wounds still being worked through."
      },
      {
        "id": "PAST-002",
        "q": "Is there anyone in our circle you've had more than a friendship with that I should know about?",
        "type": "open",
        "depth": 4,
        "note": "Invites honest disclosure about past or present entanglements."
      },
      {
        "id": "PAST-007",
        "q": "Is there anything you wish you could say to your parents that you never have?",
        "type": "open",
        "depth": 4,
        "note": "Surfaces unfinished business with parents."
      },
      {
        "id": "PAST-009",
        "q": "What's been the lowest point you've walked through, and how did you come out of it?",
        "type": "open",
        "depth": 4,
        "ref": "Psalm 34:18",
        "note": "Surfaces resilience and tender spots."
      }
    ]
  },
  "career-ambition": {
    "name": "Work",
    "color": "#C28A3A",
    "icon": "star",
    "questions": [
      {
        "id": "CAREER-010",
        "q": "At what age would you like to be able to retire or slow down?",
        "type": "mc",
        "depth": 1,
        "note": "Retirement timing, distinct from the retirement-vision question (DREAM-003).",
        "guessable": true,
        "opts": [
          "Mid-50s or earlier",
          "Around 60",
          "Mid-60s",
          "I'd work as long as I can"
        ]
      },
      {
        "id": "CAREER-001",
        "q": "How central is career ambition to you?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 16:3",
        "note": "Surfaces ambitions and how careers fit the shared future.",
        "guessable": true,
        "lo": "A job is just for living",
        "hi": "Career is central to me"
      },
      {
        "id": "CAREER-002",
        "q": "Walk me through the jobs you've held - what you loved, what you didn't, and what it says about your work life.",
        "type": "open",
        "depth": 2,
        "note": "Surfaces work patterns and stability."
      },
      {
        "id": "CAREER-003",
        "q": "How willing are you to relocate for a job opportunity?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces mobility vs rootedness, a common career-stage clash.",
        "guessable": true,
        "lo": "I want to put down roots",
        "hi": "Very willing to move"
      },
      {
        "id": "CAREER-005",
        "q": "How many hours a week is too many to spend on work?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces workaholism tolerance.",
        "guessable": true,
        "opts": [
          "Under 40",
          "40-50",
          "50-60",
          "Whatever the job needs"
        ]
      },
      {
        "id": "CAREER-006",
        "q": "How important is it that your work feels meaningful, versus just paying well?",
        "type": "scale",
        "depth": 2,
        "note": "Money vs calling in how each picks work.",
        "guessable": true,
        "lo": "Paying well is enough",
        "hi": "It must feel meaningful"
      },
      {
        "id": "CAREER-007",
        "q": "Would you take a pay cut for a better lifestyle or more time together?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces the income-vs-time trade-off.",
        "guessable": true,
        "lo": "I'd hold out for the income",
        "hi": "Gladly, for a better life"
      },
      {
        "id": "CAREER-008",
        "q": "How do you feel about one of us taking a big career risk, like starting a business?",
        "type": "scale",
        "depth": 2,
        "note": "Career risk appetite as a couple.",
        "guessable": true,
        "lo": "I prefer stability",
        "hi": "I'm all for bold risks"
      },
      {
        "id": "CAREER-009",
        "q": "When work and family time conflict, which should usually win?",
        "type": "scale",
        "depth": 2,
        "note": "A specific work-life boundary, distinct from the priorities rank (US-032).",
        "guessable": true,
        "lo": "Family almost always wins",
        "hi": "Work has to come first sometimes"
      },
      {
        "id": "CAREER-004",
        "q": "If our careers ever conflict, whose should take priority?",
        "type": "mc",
        "depth": 4,
        "note": "A pointed career + gender-roles question; distinct positions.",
        "guessable": true,
        "opts": [
          "The husband's",
          "The wife's",
          "Whoever earns more",
          "Whoever is more passionate about theirs",
          "We'd decide case by case"
        ]
      }
    ]
  },
  "character-self-awareness": {
    "name": "Character",
    "color": "#5E8074",
    "icon": "star",
    "hook": {
      "id": "SELF-019",
      "q": "How do you feel about small 'white lies'?"
    },
    "questions": [
      {
        "id": "SELF-013",
        "q": "How much alone time do you need to feel like yourself again?",
        "type": "scale",
        "depth": 1,
        "note": "Surfaces introvert/extrovert rhythm.",
        "guessable": true,
        "core": true,
        "lo": "I recharge around people",
        "hi": "I need lots of solitude"
      },
      {
        "id": "SELF-001",
        "q": "How easily do you open up to someone?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces how safe each feels being truly known.",
        "guessable": true,
        "lo": "Guarded",
        "hi": "Very open"
      },
      {
        "id": "SELF-002",
        "q": "If you had to describe who you really are to someone who'd never met you, what would you say?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces identity and self-understanding."
      },
      {
        "id": "SELF-004",
        "q": "How easily do you express your emotions?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces emotional vocabulary and openness.",
        "guessable": true,
        "lo": "They stay locked inside",
        "hi": "I express them easily"
      },
      {
        "id": "SELF-005",
        "q": "What are a couple of habits you're glad you have, and a couple you'd love to shake?",
        "type": "open",
        "depth": 2,
        "note": "Light self-awareness about daily patterns."
      },
      {
        "id": "SELF-008",
        "q": "Rank what gives your life the most meaning.",
        "type": "rank",
        "depth": 2,
        "note": "Surfaces what truly fulfills each person.",
        "opts": [
          "Faith",
          "Family",
          "Work",
          "Friends",
          "Personal growth",
          "Serving others"
        ]
      },
      {
        "id": "SELF-009",
        "q": "When someone gives you honest feedback, how do you usually take it?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces openness to correction.",
        "guessable": true,
        "core": true,
        "opts": [
          "Welcome it",
          "Hear it but bristle",
          "Get defensive",
          "Depends who it's from"
        ]
      },
      {
        "id": "SELF-010",
        "q": "What kind of people do you click with instantly, and what kind do you find hard work?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces relational style and patience."
      },
      {
        "id": "SELF-011",
        "q": "Who has shaped who you are the most, and in what way?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces formative influences."
      },
      {
        "id": "SELF-014",
        "q": "Which character traits come naturally to you - patience, kindness, self-control, gentleness - and which take real effort?",
        "type": "open",
        "depth": 2,
        "ref": "Galatians 5:22-23",
        "note": "A gentle, honest character self-check."
      },
      {
        "id": "SELF-015",
        "q": "If you could change one thing about yourself, what would it be?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces self-awareness and desire to grow."
      },
      {
        "id": "SELF-016",
        "q": "If I asked your parents what I should really know about you, what would they say?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces self-awareness through others' eyes."
      },
      {
        "id": "SELF-017",
        "q": "When life gets hard, how do you most often cope?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces default coping style; pairs with the spending question.",
        "guessable": true,
        "opts": [
          "Prayer or Scripture",
          "Talking it out with someone",
          "Staying active or exercising",
          "Treating myself or shopping",
          "Going quiet and withdrawing"
        ]
      },
      {
        "id": "SELF-018",
        "q": "How much do you take initiative rather than waiting to be led?",
        "type": "scale",
        "depth": 2,
        "note": "The passivity red flag as a self-awareness measure.",
        "guessable": true,
        "lo": "I tend to wait and follow",
        "hi": "I take charge and initiate"
      },
      {
        "id": "SELF-019",
        "q": "How do you feel about small 'white lies'?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces the integrity threshold without inviting self-flattery.",
        "guessable": true,
        "core": true,
        "opts": [
          "Never okay",
          "Okay to spare feelings",
          "Fine in small doses",
          "No big deal"
        ]
      },
      {
        "id": "SELF-020",
        "q": "How actively are you working on your own growth and character right now?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces present-tense sanctification effort the hosts press on.",
        "guessable": true,
        "lo": "Not focused on it",
        "hi": "Actively working on myself"
      },
      {
        "id": "SELF-021",
        "q": "How comfortable are you being held accountable for your weaknesses?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 28:13",
        "note": "The 'live confessionally' trait as a scoreable comfort level.",
        "guessable": true,
        "lo": "I'd rather handle them privately",
        "hi": "I want people holding me accountable"
      },
      {
        "id": "SELF-022",
        "q": "How well do you manage your time and responsibilities?",
        "type": "scale",
        "depth": 2,
        "ref": "Ephesians 5:16",
        "note": "Stewardship of time, distinct from money discipline (FIN-004).",
        "guessable": true,
        "lo": "Often disorganized",
        "hi": "Very organized and on top of it"
      },
      {
        "id": "SELF-023",
        "q": "When making a big decision, what do you lean on most?",
        "type": "rank",
        "depth": 2,
        "ref": "James 1:5",
        "note": "Turns 'how do you decide' into a compare-your-lists ranking.",
        "opts": [
          "Prayer",
          "Scripture",
          "Wise counsel",
          "My own judgment",
          "Research and logic"
        ]
      },
      {
        "id": "SELF-024",
        "q": "How much do your friends influence your choices and direction?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 13:20",
        "note": "Surfaces susceptibility to peer influence as a self-aware measure.",
        "guessable": true,
        "lo": "Very little",
        "hi": "A great deal"
      },
      {
        "id": "SELF-025",
        "q": "How do you handle gossip in everyday conversation?",
        "type": "mc",
        "depth": 2,
        "ref": "Proverbs 16:28",
        "note": "Surfaces speech integrity directly as distinct positions.",
        "guessable": true,
        "opts": [
          "I steer away from it",
          "I listen but don't spread it",
          "I join in sometimes",
          "I enjoy a good bit of gossip"
        ]
      },
      {
        "id": "SELF-026",
        "q": "Do you act the same around everyone, or differently depending on who's watching?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 10:9",
        "note": "Consistency of character in public vs private — a real character tell.",
        "guessable": true,
        "core": true,
        "lo": "I'm the same with everyone",
        "hi": "I adapt a lot to who I'm with"
      },
      {
        "id": "SELF-027",
        "q": "When your feelings and your convictions clash, which usually wins?",
        "type": "scale",
        "depth": 2,
        "ref": "Proverbs 3:5",
        "note": "Head-vs-heart axis; broader than the biblical-authority question (FAITH-029).",
        "guessable": true,
        "lo": "My feelings usually win",
        "hi": "My convictions usually win"
      },
      {
        "id": "SELF-029",
        "q": "When an everyday problem hits, who do you go to first?",
        "type": "mc",
        "depth": 2,
        "ref": "Proverbs 15:22",
        "note": "SELF-023 covers big decisions and omits the partner entirely. This is the daily instinct, and includes them.",
        "guessable": true,
        "opts": [
          "I work it out myself",
          "My partner",
          "A parent",
          "A friend or mentor",
          "I pray about it first"
        ]
      },
      {
        "id": "SELF-028",
        "q": "How much do you need to be alone with a feeling before you can talk about it?",
        "type": "scale",
        "depth": 3,
        "note": "Latency, not ease. SELF-004 measures how easily emotions come out; someone can be expressive and still need two days first. The gap between partners here causes the 'why won't you just talk to me' fight.",
        "guessable": true,
        "lo": "I can talk about it as it happens",
        "hi": "I need time alone first"
      },
      {
        "id": "SELF-003",
        "q": "Give five reasons someone would love sharing life with you - and three reasons they might find it hard.",
        "type": "open",
        "depth": 4,
        "note": "Tests self-honesty; the 'hard' three matter most."
      },
      {
        "id": "SELF-006",
        "q": "How much do you need to feel in control?",
        "type": "scale",
        "depth": 4,
        "note": "Surfaces control and flexibility.",
        "guessable": true,
        "lo": "Easygoing, happy to go with the flow",
        "hi": "I need to be in control"
      },
      {
        "id": "SELF-007",
        "q": "What are your biggest fears in life right now?",
        "type": "open",
        "depth": 4,
        "note": "Surfaces fears beyond the relationship itself."
      },
      {
        "id": "SELF-012",
        "q": "How easily do you forgive?",
        "type": "scale",
        "depth": 4,
        "ref": "Colossians 3:13",
        "note": "Surfaces whether grudges linger or release.",
        "guessable": true,
        "core": true,
        "lo": "I hold on a long time",
        "hi": "I forgive quickly"
      }
    ]
  },
  "us-compatibility": {
    "name": "Us",
    "color": "#9C4A6E",
    "icon": "heart",
    "hook": {
      "id": "US-024",
      "q": "How much are you counting on me changing after we marry?"
    },
    "questions": [
      {
        "id": "US-008",
        "q": "What about me makes you proud?",
        "type": "open",
        "depth": 1,
        "note": "An affirming prompt that builds each other up."
      },
      {
        "id": "US-010",
        "q": "Whose marriage do you admire, and what do they do that you'd want for us?",
        "type": "open",
        "depth": 1,
        "note": "Surfaces role models for a healthy marriage."
      },
      {
        "id": "US-014",
        "q": "Where did most of what you believe about marriage come from?",
        "type": "mc",
        "depth": 1,
        "note": "Surfaces the source of marriage assumptions.",
        "guessable": true,
        "core": true,
        "opts": [
          "My parents",
          "Friends",
          "Church",
          "Books or media",
          "Mostly figuring it out"
        ]
      },
      {
        "id": "US-034",
        "q": "Should this season be more about having fun or seriously evaluating our future?",
        "type": "scale",
        "depth": 1,
        "note": "Surfaces approach to dating; catches the over-spiritualizing-it trap.",
        "guessable": true,
        "lo": "Mostly enjoy it",
        "hi": "Seriously evaluate it"
      },
      {
        "id": "US-050",
        "q": "How much of your enjoyment of something comes from having someone to share it with?",
        "type": "scale",
        "depth": 1,
        "note": "Enjoyment amplification, distinct from FUN-006 (how free time gets allocated) and SELF-013 (solitude to recharge). This is whether company is what makes it good.",
        "guessable": true,
        "lo": "I enjoy things just as much alone",
        "hi": "Everything's better shared"
      },
      {
        "id": "US-001",
        "q": "What does being 'compatible' actually mean to you?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces each person's working definition of fit."
      },
      {
        "id": "US-003",
        "q": "Name three ways we're alike and three ways we're different - which differences do you actually treasure?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces how differences are held."
      },
      {
        "id": "US-005",
        "q": "Forget 'perfect' - paint me your picture of a realistic, great marriage.",
        "type": "open",
        "depth": 2,
        "note": "Surfaces marriage expectations grounded in reality."
      },
      {
        "id": "US-006",
        "q": "Rank what makes a marriage last, most important first.",
        "type": "rank",
        "depth": 2,
        "note": "Surfaces priorities; compare the two rankings.",
        "core": true,
        "opts": [
          "Communication",
          "Commitment",
          "Shared faith",
          "Trust",
          "Friendship",
          "Intimacy",
          "Shared goals"
        ]
      },
      {
        "id": "US-009",
        "q": "How would you keep romance alive over the long haul?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces intentionality about romance."
      },
      {
        "id": "US-013",
        "q": "How open are you to premarital counseling now, and marriage counseling later if we needed it?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces openness to outside help.",
        "guessable": true,
        "opts": [
          "Definitely",
          "If we needed it",
          "I'd be hesitant",
          "Not sure"
        ]
      },
      {
        "id": "US-017",
        "q": "What do you picture for the future of us?",
        "type": "open",
        "depth": 2,
        "note": "Surfaces shared vision and direction."
      },
      {
        "id": "US-027",
        "q": "Rank the markers of readiness for marriage, most important first.",
        "type": "rank",
        "depth": 2,
        "ref": "Luke 14:28",
        "note": "Turns 'what markers of maturity matter' into a compare-your-lists ranking.",
        "opts": [
          "Spiritual maturity",
          "Emotional health",
          "Financial stability",
          "Conflict-resolution skills",
          "Living independently",
          "Career direction"
        ]
      },
      {
        "id": "US-029",
        "q": "How do you feel about the pace our relationship is moving?",
        "type": "scale",
        "depth": 2,
        "ref": "Ecclesiastes 3:1",
        "note": "Surfaces a pace mismatch directly; gap between answers is the signal.",
        "guessable": true,
        "lo": "Too slow for me",
        "hi": "Too fast for me  (3 = just right)"
      },
      {
        "id": "US-030",
        "q": "How important is it to you that I get along with your closest friends?",
        "type": "scale",
        "depth": 2,
        "note": "A practical compatibility check the friendship section raises.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "US-031",
        "q": "Once you knew it was right, how soon would you want to get married?",
        "type": "mc",
        "depth": 2,
        "note": "Engagement-to-marriage timeline, distinct from readiness markers (US-027).",
        "guessable": true,
        "opts": [
          "Within a year",
          "One to two years",
          "Two years or more",
          "No rush at all"
        ]
      },
      {
        "id": "US-033",
        "q": "What's your goal for this season of dating?",
        "type": "mc",
        "depth": 2,
        "note": "Surfaces dating intent/seriousness — the 'are we on the same page' question.",
        "guessable": true,
        "opts": [
          "Heading toward marriage",
          "Seeing if we're compatible",
          "Enjoying it for now",
          "Not sure yet"
        ]
      },
      {
        "id": "US-035",
        "q": "How important is it that your spouse is also your best friend?",
        "type": "scale",
        "depth": 2,
        "ref": "Song of Solomon 5:16",
        "note": "The friendship-vs-romance value behind 'enjoy time together in non-romantic settings'.",
        "guessable": true,
        "core": true,
        "lo": "Romance matters more to me",
        "hi": "Best friends first"
      },
      {
        "id": "US-039",
        "q": "As a couple, how involved in community do you want to be?",
        "type": "scale",
        "depth": 2,
        "note": "Couple-level community orientation, distinct from individual social rhythm (HEALTH-002).",
        "guessable": true,
        "lo": "Mostly just us",
        "hi": "Deeply involved in community"
      },
      {
        "id": "US-048",
        "q": "How clear are you on what you're looking for in a spouse?",
        "type": "scale",
        "depth": 2,
        "note": "Confidence rather than content. DEAL-002 asks what the must-haves are; this asks whether the person actually knows.",
        "guessable": true,
        "lo": "Still working it out",
        "hi": "I know exactly"
      },
      {
        "id": "US-002",
        "q": "What tells you that what we have is really love and not just strong feelings?",
        "type": "open",
        "depth": 3,
        "note": "Surfaces how each distinguishes love from infatuation."
      },
      {
        "id": "US-004",
        "q": "What would marriage give you that staying single wouldn't?",
        "type": "open",
        "depth": 3,
        "note": "Surfaces the 'why marriage' for each."
      },
      {
        "id": "US-015",
        "q": "In marriage, what would you want us to lean on each other for - and what would you keep as your own?",
        "type": "open",
        "depth": 3,
        "note": "Surfaces healthy interdependence and boundaries."
      },
      {
        "id": "US-016",
        "q": "What's something you've always wanted to ask me but never have?",
        "type": "open",
        "depth": 3,
        "note": "A trust-builder that opens hidden doors."
      },
      {
        "id": "US-019",
        "q": "Whose blessing on our relationship matters most to you?",
        "type": "rank",
        "depth": 3,
        "ref": "Proverbs 15:22",
        "note": "The wise-counsel flag; compare whose voices each weights heaviest.",
        "opts": [
          "Our parents",
          "A pastor or mentor",
          "Close friends",
          "Our small group or church"
        ]
      },
      {
        "id": "US-020",
        "q": "How much should wise counsel from people we trust shape our biggest decisions?",
        "type": "scale",
        "depth": 3,
        "ref": "Proverbs 11:14",
        "note": "Echo-chamber vs real discernment, as a shared posture.",
        "guessable": true,
        "lo": "We decide on our own",
        "hi": "It shapes us heavily"
      },
      {
        "id": "US-021",
        "q": "In choosing a life partner, what matters more to you?",
        "type": "scale",
        "depth": 3,
        "ref": "Amos 3:3",
        "note": "The 'clarity over chemistry' principle as a value both rate.",
        "guessable": true,
        "core": true,
        "lo": "Chemistry and connection",
        "hi": "Clarity and shared direction"
      },
      {
        "id": "US-022",
        "q": "How much should a couple agree on the big things before marrying, rather than working it out later?",
        "type": "scale",
        "depth": 3,
        "note": "Surfaces how much pre-marriage alignment each thinks is needed.",
        "guessable": true,
        "lo": "Work most of it out later",
        "hi": "Agree on the big things first"
      },
      {
        "id": "US-023",
        "q": "How much do you believe a person's habits and character can change after marriage?",
        "type": "scale",
        "depth": 3,
        "note": "The 'fixer-upper' belief — general view, pairs with the personal one below.",
        "guessable": true,
        "core": true,
        "lo": "People rarely change",
        "hi": "People can change a lot"
      },
      {
        "id": "US-025",
        "q": "Do you think marriage will improve our current problems, or mostly reveal them?",
        "type": "scale",
        "depth": 3,
        "note": "Surfaces an idealistic vs realistic view of what marriage does.",
        "guessable": true,
        "lo": "Marriage will help fix things",
        "hi": "Marriage mainly reveals what's already there"
      },
      {
        "id": "US-026",
        "q": "When hard seasons hit, how do you expect we'll get through them?",
        "type": "mc",
        "depth": 3,
        "ref": "James 1:2-4",
        "note": "Surfaces the couple's expected coping mode for trials.",
        "guessable": true,
        "opts": [
          "Lean on God together",
          "Lean mainly on each other",
          "Push through practically",
          "Seek outside help and counsel"
        ]
      },
      {
        "id": "US-032",
        "q": "Rank what should come first in our life together.",
        "type": "rank",
        "depth": 3,
        "ref": "Matthew 6:33",
        "note": "Surfaces ordering of life priorities; the 'marriage as first ministry' theme.",
        "core": true,
        "opts": [
          "God",
          "Each other",
          "Our children",
          "Work and career",
          "Extended family",
          "Ministry and serving"
        ]
      },
      {
        "id": "US-036",
        "q": "Early in a relationship, how much do you guard your heart versus give it fully?",
        "type": "scale",
        "depth": 3,
        "ref": "Proverbs 4:23",
        "note": "Emotional investment pace, distinct from relationship-progression pace (US-029).",
        "guessable": true,
        "lo": "I guard it carefully",
        "hi": "I give my heart fully and fast"
      },
      {
        "id": "US-037",
        "q": "How open are you to people close to us questioning our relationship?",
        "type": "scale",
        "depth": 3,
        "ref": "Proverbs 27:6",
        "note": "Openness to scrutiny of the relationship itself — the isolation red flag.",
        "guessable": true,
        "lo": "I'd rather they stayed out of it",
        "hi": "I welcome their honest questions"
      },
      {
        "id": "US-038",
        "q": "How much should partners push each other to grow, versus accept each other as they are?",
        "type": "scale",
        "depth": 3,
        "ref": "Proverbs 27:17",
        "note": "The growth-pushing tension behind 'support each other's growth without pressure'; broader than the spiritual version (FAITH-008).",
        "guessable": true,
        "lo": "Accept each other as we are",
        "hi": "Actively push each other to grow"
      },
      {
        "id": "US-040",
        "q": "How readily would you give up a hobby or commitment if it was hurting our relationship?",
        "type": "scale",
        "depth": 3,
        "ref": "Philippians 2:4",
        "note": "Willingness to sacrifice outside commitments, distinct from ranking priorities (US-032).",
        "guessable": true,
        "lo": "I'd be reluctant",
        "hi": "Readily"
      },
      {
        "id": "US-043",
        "q": "How much room does your life have right now for this to grow?",
        "type": "scale",
        "depth": 3,
        "note": "Present-tense capacity. US-033 asks intent; nothing in the bank asks whether the person actually has the bandwidth to act on it.",
        "guessable": true,
        "lo": "I'm stretched thin",
        "hi": "Plenty of room"
      },
      {
        "id": "US-047",
        "q": "How long does it take to really know someone?",
        "type": "mc",
        "depth": 3,
        "note": "The epistemics of knowing a person, distinct from relationship pace (US-029) and emotional pace (US-036). Two people who differ here will disagree about engagement timing without knowing why.",
        "guessable": true,
        "opts": [
          "A few months",
          "About a year",
          "Two years or more",
          "You never fully do"
        ]
      },
      {
        "id": "US-007",
        "q": "How confident are you that we'd go the distance?",
        "type": "scale",
        "depth": 4,
        "note": "Surfaces commitment and realism about lasting.",
        "guessable": true,
        "lo": "Some real doubts",
        "hi": "Completely confident"
      },
      {
        "id": "US-012",
        "q": "What life experiences would you hope your future spouse had had - and which would you hope they hadn't?",
        "type": "open",
        "depth": 4,
        "note": "Surfaces expectations about a partner's history."
      },
      {
        "id": "US-018",
        "q": "How much do you feel you give up of yourself to be in this relationship?",
        "type": "scale",
        "depth": 4,
        "note": "Surfaces the give-and-take balance honestly.",
        "guessable": true,
        "lo": "Very little",
        "hi": "A great deal"
      },
      {
        "id": "US-028",
        "q": "Do you see marriage more as a covenant or a contract?",
        "type": "mc",
        "depth": 4,
        "ref": "Malachi 2:14",
        "note": "The 'covenant, not box-checking' question; surfaces permanence theology.",
        "guessable": true,
        "core": true,
        "opts": [
          "A sacred covenant before God",
          "A lifelong commitment",
          "A partnership that can end if needed",
          "Not sure"
        ]
      },
      {
        "id": "US-041",
        "q": "Rank what you'd find hardest to give up for a marriage.",
        "type": "rank",
        "depth": 4,
        "note": "US-040 asks how readily you'd drop a hobby that was hurting us. This ranks everything that's actually on the table, and the order is far more revealing than any single willingness rating.",
        "opts": [
          "Time on my own",
          "My friendships",
          "My career plans",
          "My hobbies",
          "Making decisions on my own",
          "My money being mine"
        ]
      },
      {
        "id": "US-042",
        "q": "Rank where your emotional energy actually goes right now.",
        "type": "rank",
        "depth": 4,
        "note": "US-032 ranks what should come first — the ideal. This ranks what is. The gap between a person's two answers is the honest conversation, and 'just keeping myself going' is the option that makes it possible to admit.",
        "opts": [
          "Work",
          "Family",
          "Friends",
          "Church or ministry",
          "This relationship",
          "Just keeping myself going"
        ]
      },
      {
        "id": "US-044",
        "q": "If your life is too full right now, what would you actually cut to make room for us?",
        "type": "mc",
        "depth": 4,
        "ref": "Philippians 2:4",
        "note": "Turns a vague 'I'd prioritise you' into a real trade-off. Naming ministry as a competing good is deliberate — it's the hardest option to pick and the most revealing.",
        "guessable": true,
        "opts": [
          "Work hours",
          "Time with friends",
          "Ministry or serving",
          "Hobbies and downtime",
          "Nothing — I'd find the time somewhere"
        ]
      },
      {
        "id": "US-045",
        "q": "Which is harder for you to give right now?",
        "type": "mc",
        "depth": 4,
        "note": "Time and energy are different scarcities and the bank conflates them. Someone with a free diary and nothing left in the tank is the harder case, and the one nobody names.",
        "guessable": true,
        "opts": [
          "Time",
          "Emotional energy",
          "Neither — I have both",
          "Both are stretched"
        ]
      },
      {
        "id": "US-046",
        "q": "Wanting to invest in us, and being able to right now — which is truer for you?",
        "type": "mc",
        "depth": 4,
        "note": "The desire-versus-capacity gap named directly. Option three is the one that surfaces a conversation nothing else in the bank reaches.",
        "guessable": true,
        "opts": [
          "I want to and I can",
          "I want to but life is full",
          "I have the time but I'm holding back",
          "Neither, right now"
        ]
      },
      {
        "id": "US-049",
        "q": "Has what you're looking for in a partner changed since we met?",
        "type": "mc",
        "depth": 4,
        "note": "Surfaces whether the list bent to fit the person in front of them — which can be growth or self-deception. The conversation is the point.",
        "guessable": true,
        "opts": [
          "Not at all",
          "A little",
          "A lot — you changed it",
          "I've let go of things that didn't matter"
        ]
      },
      {
        "id": "US-011",
        "q": "What about me gives you pause or concern right now?",
        "type": "open",
        "depth": 5,
        "note": "Invites honest concerns while there's still time."
      },
      {
        "id": "US-024",
        "q": "How much are you counting on me changing after we marry?",
        "type": "scale",
        "depth": 5,
        "note": "The personal application; the reveal is the whole point of the conversation.",
        "guessable": true,
        "lo": "Not at all, I accept you as you are",
        "hi": "I'm counting on some real changes"
      }
    ]
  },
  "values-convictions": {
    "name": "Convictions",
    "color": "#C2843A",
    "icon": "compass",
    "questions": [
      {
        "id": "VAL-013",
        "q": "How often do you talk politics?",
        "type": "mc",
        "depth": 1,
        "note": "Values & Convictions currently opens on abortion. This opens it gently — and the last option is a real echo-chamber tell.",
        "guessable": true,
        "core": true,
        "opts": [
          "Constantly",
          "Now and then",
          "I avoid it",
          "Only with people who already agree with me"
        ]
      },
      {
        "id": "VAL-014",
        "q": "How much do you enjoy a good debate?",
        "type": "scale",
        "depth": 1,
        "note": "Sets the temperature before the deck turns the heat up. Two people who differ here will experience this deck very differently.",
        "guessable": true,
        "lo": "I avoid them",
        "hi": "I love one"
      },
      {
        "id": "VAL-005",
        "q": "What's your view on the death penalty?",
        "type": "mc",
        "depth": 3,
        "note": "Surfaces a moral conviction about justice and life.",
        "guessable": true,
        "opts": [
          "Support it",
          "Oppose it",
          "Depends on the case",
          "Unsure"
        ]
      },
      {
        "id": "VAL-006",
        "q": "Would you want guns in our home?",
        "type": "mc",
        "depth": 3,
        "note": "Both a values question and a practical home decision.",
        "guessable": true,
        "opts": [
          "Yes, comfortable",
          "Only if secured / limited",
          "No guns at all",
          "Unsure"
        ]
      },
      {
        "id": "VAL-007",
        "q": "Where do you lean on immigration?",
        "type": "mc",
        "depth": 3,
        "note": "Surfaces political and moral leanings on a live issue.",
        "guessable": true,
        "opts": [
          "Stricter",
          "Moderate",
          "More open",
          "Unsure"
        ]
      },
      {
        "id": "VAL-009",
        "q": "How do you hold creation and evolution together - or not?",
        "type": "mc",
        "depth": 3,
        "note": "Surfaces where faith and science meet for each of you.",
        "guessable": true,
        "opts": [
          "Young-earth creation",
          "God-guided over long ages",
          "Evolution, separate from faith",
          "Still exploring"
        ]
      },
      {
        "id": "VAL-010",
        "q": "Where do you stand on vaccines?",
        "type": "mc",
        "depth": 3,
        "note": "A modern flashpoint that can hit parenting hard.",
        "guessable": true,
        "opts": [
          "Fully pro-vaccine",
          "Selective",
          "Hesitant",
          "Against"
        ]
      },
      {
        "id": "VAL-001",
        "q": "Where do you land on abortion?",
        "type": "mc",
        "depth": 5,
        "note": "A core conviction couples need to know they share or differ on.",
        "guessable": true,
        "core": true,
        "opts": [
          "Always wrong",
          "Wrong, with some exceptions",
          "A personal or medical choice",
          "Still working it out"
        ]
      },
      {
        "id": "VAL-002",
        "q": "What's your view on same-sex marriage?",
        "type": "mc",
        "depth": 5,
        "note": "Surfaces the belief and the lived, relational side of it.",
        "guessable": true,
        "opts": [
          "Wrong",
          "Acceptable for others, not us",
          "Fully support it",
          "Still working it out"
        ]
      },
      {
        "id": "VAL-003",
        "q": "How do you feel about birth control?",
        "type": "mc",
        "depth": 5,
        "note": "Surfaces convictions that directly shape family planning.",
        "guessable": true,
        "opts": [
          "Avoid it entirely",
          "Natural methods only",
          "Most methods are fine",
          "Whatever works for us"
        ]
      },
      {
        "id": "VAL-004",
        "q": "Under what circumstances, if any, is divorce acceptable to you?",
        "type": "mc",
        "depth": 5,
        "note": "Surfaces how each views the exit door before the vows.",
        "guessable": true,
        "core": true,
        "opts": [
          "Never",
          "Only for abuse, adultery, or abandonment",
          "When it's broken beyond repair",
          "Still working it out"
        ]
      },
      {
        "id": "VAL-008",
        "q": "What's your view on assisted dying?",
        "type": "mc",
        "depth": 5,
        "note": "Surfaces convictions you may one day face for each other or family.",
        "guessable": true,
        "opts": [
          "Wrong",
          "Acceptable in some cases",
          "A personal right",
          "Unsure"
        ]
      },
      {
        "id": "VAL-011",
        "q": "How important is it that we share the same social and political convictions?",
        "type": "scale",
        "depth": 5,
        "note": "Weights values/convictions gaps in the alignment score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "VAL-012",
        "q": "How do you feel about living together before marriage?",
        "type": "mc",
        "depth": 5,
        "ref": "1 Corinthians 6:18",
        "note": "Cohabitation — a distinct moral/practical position the bank was missing.",
        "guessable": true,
        "opts": [
          "Wait until married",
          "Okay once engaged",
          "Fine if we're committed",
          "No issue with it"
        ]
      }
    ]
  },
  "faithfulness-loyalty": {
    "name": "Faithfulness",
    "color": "#8A5A4E",
    "icon": "shield",
    "questions": [
      {
        "id": "LOYAL-009",
        "q": "Are you the jealous type?",
        "type": "scale",
        "depth": 1,
        "note": "The warm-up. Self-rated, disarming, and it sets up everything else in the deck.",
        "guessable": true,
        "core": true,
        "lo": "Not at all",
        "hi": "Very"
      },
      {
        "id": "LOYAL-010",
        "q": "Who'd get more attention in a room full of strangers?",
        "type": "mc",
        "depth": 1,
        "note": "HHB warm-up with a real edge under it — this is the deck about attention, after all.",
        "guessable": true,
        "opts": [
          "Him",
          "Her",
          "About the same",
          "Neither of us, thankfully"
        ]
      },
      {
        "id": "LOYAL-004",
        "q": "How open should our social media be to each other?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces comfort levels around posts, follows, and online life.",
        "guessable": true,
        "lo": "Keep our profiles private",
        "hi": "Fully open to each other"
      },
      {
        "id": "LOYAL-005",
        "q": "How open should our phones be to each other?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces expectations about privacy and openness with devices.",
        "guessable": true,
        "core": true,
        "lo": "Phones stay private",
        "hi": "Full access to each other"
      },
      {
        "id": "LOYAL-006",
        "q": "How comfortable are you with solo trips with friends?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces trust and independence around time apart.",
        "guessable": true,
        "lo": "Not comfortable",
        "hi": "Totally fine"
      },
      {
        "id": "LOYAL-007",
        "q": "How comfortable are you with close opposite-sex friendships after marriage?",
        "type": "scale",
        "depth": 2,
        "note": "Surfaces boundaries and comfort with friendships after marriage.",
        "guessable": true,
        "core": true,
        "lo": "Not comfortable",
        "hi": "Completely fine"
      },
      {
        "id": "LOYAL-011",
        "q": "Is an emotional affair as bad as a physical one?",
        "type": "scale",
        "depth": 3,
        "note": "A genuine divider that the bank never asks. Couples routinely assume they agree here and routinely don't.",
        "guessable": true,
        "core": true,
        "lo": "Physical is far worse",
        "hi": "Emotional is far worse"
      },
      {
        "id": "LOYAL-016",
        "q": "How much reassurance do you need to feel secure?",
        "type": "scale",
        "depth": 3,
        "note": "The security axis, entirely missing from the bank. A high-reassurance partner and a low-reassurance partner is a workable marriage — but only if they both know.",
        "guessable": true,
        "lo": "Very little",
        "hi": "Quite a lot"
      },
      {
        "id": "LOYAL-008",
        "q": "How fully closed are your past relationships?",
        "type": "scale",
        "depth": 4,
        "note": "Surfaces genuine closure on exes.",
        "guessable": true,
        "lo": "Still processing them",
        "hi": "Fully closed"
      },
      {
        "id": "LOYAL-012",
        "q": "If someone at work was clearly flirting with you, what would you do?",
        "type": "mc",
        "depth": 4,
        "note": "Behavioural rather than principled. INT-004 asks where the line is; this asks what you'd actually do standing on it.",
        "guessable": true,
        "core": true,
        "opts": [
          "Shut it down immediately",
          "Keep it professional and say nothing",
          "Tell you about it that evening",
          "Enjoy it a bit, honestly"
        ]
      },
      {
        "id": "LOYAL-013",
        "q": "Would you tell me if you found someone else attractive?",
        "type": "mc",
        "depth": 4,
        "note": "The honesty-versus-kindness trade-off, made concrete. Both answers are defensible, which is what makes the gap worth talking about.",
        "guessable": true,
        "opts": [
          "Always",
          "Only if it was becoming a problem",
          "No — it would only hurt you",
          "There'd be nothing to tell"
        ]
      },
      {
        "id": "LOYAL-014",
        "q": "Do you still follow or message any exes?",
        "type": "mc",
        "depth": 4,
        "note": "PAST-002 asks this open-ended and gets a speech. This gets an answer.",
        "guessable": true,
        "opts": [
          "No, none",
          "One or two, just following",
          "We still talk occasionally",
          "Yes — we're genuinely close"
        ]
      },
      {
        "id": "LOYAL-015",
        "q": "What would you do if you saw me being a bit too friendly with someone?",
        "type": "mc",
        "depth": 4,
        "note": "The other side of the deck: not what you'd do, but what you'd do about me. 'Say nothing but feel it' is the answer that predicts trouble.",
        "guessable": true,
        "opts": [
          "Say something to you that night",
          "Wait and see if it carried on",
          "Say nothing, but feel it",
          "Say something to them"
        ]
      },
      {
        "id": "LOYAL-017",
        "q": "Rank what would feel most like a betrayal.",
        "type": "rank",
        "depth": 4,
        "note": "The best question in the deck. Forces a comparison nobody makes voluntarily — is porn worse than confiding in someone else, is hidden money worse than a kiss. Two very different lists is the conversation.",
        "core": true,
        "opts": [
          "A physical affair",
          "An emotional affair",
          "Hiding money from me",
          "Confiding in someone else instead of me",
          "Looking at porn",
          "Repeatedly lying about small things"
        ]
      },
      {
        "id": "LOYAL-001",
        "q": "Where does crossing the line begin for you?",
        "type": "mc",
        "depth": 5,
        "note": "Surfaces where each draws the line on faithfulness, emotional and physical.",
        "guessable": true,
        "opts": [
          "Any flirting",
          "Emotional closeness with someone else",
          "Only physical contact",
          "We should define it together"
        ]
      },
      {
        "id": "LOYAL-002",
        "q": "How do you view pornography in a marriage?",
        "type": "mc",
        "depth": 5,
        "note": "A sensitive but important boundary conversation.",
        "core": true,
        "opts": [
          "Never acceptable",
          "A serious problem",
          "Depends",
          "Not a big deal"
        ]
      },
      {
        "id": "LOYAL-003",
        "q": "If one of us struggles with sexual temptation or pornography, what should we do?",
        "type": "mc",
        "depth": 5,
        "ref": "Galatians 6:1-2",
        "note": "The accountability protocol — distinct from the moral view of porn (INT-006).",
        "guessable": true,
        "opts": [
          "Always tell each other",
          "Tell a mentor or accountability partner",
          "Handle it privately",
          "Unsure"
        ]
      }
    ]
  },
  "where-we-are-now": {
    "name": "Where We Are Now",
    "color": "#7A6A9C",
    "icon": "compass",
    "hook": {
      "id": "NOW-025",
      "q": "When did we last properly laugh together?"
    },
    "questions": [
      {
        "id": "NOW-025",
        "q": "When did we last properly laugh together?",
        "type": "mc",
        "depth": 1,
        "note": "The warm-up this deck badly needed, and quietly one of its best questions. Light to answer, and 'it's been a while' is a real finding sitting inside a soft question.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Today or yesterday",
          "Sometime this week",
          "I'd have to think about it",
          "It's been a while"
        ]
      },
      {
        "id": "NOW-026",
        "q": "What's been the best bit of the last month for us?",
        "type": "mc",
        "depth": 1,
        "note": "Warm, affirming, and the last option gives permission to be honest without having to make a speech about it.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Something we did together",
          "A conversation we had",
          "Just being around each other",
          "Honestly, it's been a bit of a slog"
        ]
      },
      {
        "id": "NOW-027",
        "q": "How often do we try something new together?",
        "type": "mc",
        "depth": 1,
        "note": "Novelty as an observable fact. Light, and it pairs with the momentum question deeper in the deck.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "All the time",
          "Now and then",
          "Rarely",
          "We're deep in a routine"
        ]
      },
      {
        "id": "NOW-008",
        "q": "Rank where you feel closest to me.",
        "type": "rank",
        "depth": 2,
        "note": "Where connection actually lives. Distinct from CONF-009 (love languages) — that's how love is given and received, this is the setting in which the two of you click.",
        "notYet": true,
        "opts": [
          "Doing something together",
          "Deep conversation",
          "Comfortable silence",
          "Working through a problem side by side",
          "Being physically close",
          "Praying or worshipping together"
        ]
      },
      {
        "id": "NOW-001",
        "q": "How much has this relationship actually been tested?",
        "type": "mc",
        "depth": 3,
        "ref": "James 1:2-4",
        "note": "The most important question in the bank. Everything else assumes each person has evidence about the other; this asks whether that evidence exists. Two people answering 'not tested yet' is not alignment — it's the finding.",
        "guessable": true,
        "opts": [
          "We've been through something genuinely hard together",
          "We've had real arguments and come through them",
          "Some friction, nothing serious",
          "It's been smooth — we haven't been tested yet"
        ]
      },
      {
        "id": "NOW-002",
        "q": "Right now, what is this?",
        "type": "mc",
        "depth": 3,
        "note": "A present-tense read on the thing itself. US-033 asks intent for the season; this asks what the relationship actually is at this moment, which is a different and often uncomfortable answer.",
        "guessable": true,
        "opts": [
          "Solid — it knows what it is",
          "Something real that's still finding its shape",
          "In transition — changing in ways neither of us controls",
          "Still deciding what we want it to be"
        ]
      },
      {
        "id": "NOW-009",
        "q": "What does this relationship bring out in you?",
        "type": "mc",
        "depth": 3,
        "note": "Who you become in it, rather than what you believe about it. Generative rather than wounding — every option is a conversation, none is a verdict.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "More tender than I expected",
          "More guarded than I admit",
          "More demanding than I show",
          "More patient than I usually am",
          "More loyal than people realise"
        ]
      },
      {
        "id": "NOW-012",
        "q": "When something's clearly bothering me but I won't say what, you:",
        "type": "mc",
        "depth": 3,
        "note": "The pursue-or-withdraw move, as behaviour. Pairs with the CONF question about how my going quiet lands on you — that one is the feeling, this is what you actually do about it.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Ask directly",
          "Create space and wait for me",
          "Feel frustrated but don't push",
          "Assume it'll surface when I'm ready"
        ]
      },
      {
        "id": "NOW-019",
        "q": "After a disagreement, how long does it take us to be okay again?",
        "type": "mc",
        "depth": 3,
        "note": "Observed repair speed. CONF-002 asks how soon you like to resolve conflict — the preference. This is what actually happens between the two of you.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Minutes",
          "A few hours",
          "A day or two",
          "We don't really close things — they fade"
        ]
      },
      {
        "id": "NOW-021",
        "q": "Are we the same together in private as we are in front of other people?",
        "type": "mc",
        "depth": 3,
        "ref": "Proverbs 10:9",
        "note": "SELF-026 asks whether an individual is consistent across audiences. This asks it of the couple, which is a different and more uncomfortable question.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Exactly the same",
          "A bit more relaxed on our own",
          "Quite different",
          "We perform a bit when others are around"
        ]
      },
      {
        "id": "NOW-022",
        "q": "Compared to six months ago, where are we?",
        "type": "mc",
        "depth": 3,
        "note": "Momentum rather than state. This is the question that makes the category worth re-taking — the answer is meaningless once and meaningful four times.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Much closer",
          "A bit closer",
          "About the same",
          "Drifting, if I'm honest"
        ]
      },
      {
        "id": "NOW-003",
        "q": "How well do you feel understood by me?",
        "type": "scale",
        "depth": 4,
        "note": "Being known, rated by the one being known. A gap here — one feels deeply understood, the other doesn't — is one of the most useful reveals the app can produce.",
        "guessable": true,
        "notYet": true,
        "lo": "You see the surface",
        "hi": "You get the parts most people miss"
      },
      {
        "id": "NOW-004",
        "q": "How does giving to this relationship feel to you right now?",
        "type": "mc",
        "depth": 4,
        "note": "The economics of giving. 'Costly' is the option nobody volunteers unprompted, which is exactly why it has to be on the list.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Natural — I don't keep score",
          "Intentional — I want you to feel it",
          "Measured — I think about how much I put in",
          "Costly — part of me notices what it takes from me"
        ]
      },
      {
        "id": "NOW-005",
        "q": "Does the support between us flow both ways?",
        "type": "scale",
        "depth": 4,
        "ref": "Galatians 6:2",
        "note": "Deliberately not phrased as 'who gives more' — that version scores two people who both feel over-giving as perfectly aligned, which inverts the meaning.",
        "guessable": true,
        "notYet": true,
        "lo": "Mostly in one direction",
        "hi": "Evenly, both ways"
      },
      {
        "id": "NOW-006",
        "q": "When this is at its hardest, what's usually underneath it?",
        "type": "mc",
        "depth": 4,
        "note": "Root cause rather than conflict style. The last option is a deliberate honesty valve and pairs with NOW-001.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Expectations neither of us has said out loud",
          "Timing — we want different things at different moments",
          "Things get lost between what's meant and what's heard",
          "It hasn't been genuinely hard yet"
        ]
      },
      {
        "id": "NOW-007",
        "q": "Rank what would most seriously threaten us.",
        "type": "rank",
        "depth": 4,
        "note": "A threat model both build separately. DEAL-001 ranks deal-breakers in a partner; this ranks what could break the two of you. The faith option is the localisation the source didn't have.",
        "notYet": true,
        "opts": [
          "A breach of trust",
          "Slowly growing in different directions",
          "One of us needing more than the other can give",
          "Outside pressure — money, family, work",
          "Drifting apart in our faith"
        ]
      },
      {
        "id": "NOW-010",
        "q": "How steady is your emotional availability here?",
        "type": "mc",
        "depth": 4,
        "note": "'Restrained by habit' names something people recognise instantly and would never say out loud. That recognition is the value.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "High — I show up fully when you need me",
          "Conditional — it depends where I am mentally",
          "Restrained — I keep some distance by habit",
          "Variable — it shifts more than I'd like"
        ]
      },
      {
        "id": "NOW-011",
        "q": "When you sense I'm not fully present with you, what do you do?",
        "type": "mc",
        "depth": 4,
        "note": "Protest behaviour. The last two options are the start of a withdrawal spiral, and a couple who both pick them has found something no belief question would ever surface.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Say something — I'd rather name it",
          "Give you space, you might need it",
          "Feel it but stay quiet — I don't want to be demanding",
          "Pull back too"
        ]
      },
      {
        "id": "NOW-014",
        "q": "What's the one change in you that would most improve us?",
        "type": "mc",
        "depth": 4,
        "ref": "Matthew 7:5",
        "note": "SELF-015 asks what you'd change about yourself in the abstract and is open-ended. This aims it at the relationship and makes it scoreable — and the reveal is whether each guessed the other's answer.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Being less defensive",
          "Being more present",
          "Speaking up sooner",
          "Needing less control",
          "Being gentler with myself"
        ]
      },
      {
        "id": "NOW-015",
        "q": "What is trust between us currently built on?",
        "type": "mc",
        "depth": 4,
        "note": "Trust as a present-tense structure rather than a value. 'Hope more than evidence' is where a lot of engaged couples honestly are, and no question in the bank lets them say it.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Track record — you've proven it",
          "What I believe about your character",
          "Hope and faith more than evidence",
          "It isn't fully there yet"
        ]
      },
      {
        "id": "NOW-017",
        "q": "What have we avoided talking about?",
        "type": "mc",
        "depth": 4,
        "note": "An avoidance map. If both name the same thing, that's the next conversation handed to them. If they name different things, that's two.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "Nothing I can think of",
          "Money",
          "Family",
          "The physical side",
          "The future",
          "Something one of us did"
        ]
      },
      {
        "id": "NOW-023",
        "q": "When did you last feel far from me?",
        "type": "mc",
        "depth": 4,
        "note": "Distance as an event with a date, not a rating. 'Recently, and it hasn't passed' is a live issue the app just found.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "I can't remember feeling far from you",
          "Recently, but it passed",
          "Recently, and it hasn't passed",
          "Often, honestly"
        ]
      },
      {
        "id": "NOW-013",
        "q": "Does this relationship bring out more in you, or less?",
        "type": "scale",
        "depth": 5,
        "ref": "Proverbs 27:17",
        "note": "The heaviest question in the category and correctly placed last. A low answer from either side is the whole point of an app called Aligned.",
        "guessable": true,
        "notYet": true,
        "lo": "Less — I'm somehow smaller in it",
        "hi": "More — I'm most myself in it"
      },
      {
        "id": "NOW-016",
        "q": "Is there something you haven't told me yet?",
        "type": "mc",
        "depth": 5,
        "note": "The bluntest expression of surface, don't settle. Both answer it, both see it. Even 'something small' opens a door that nothing else in the bank reaches.",
        "guessable": true,
        "opts": [
          "No — you know everything",
          "Yes, something small",
          "Yes, something significant",
          "Yes, and I'm not sure I ever will"
        ]
      },
      {
        "id": "NOW-018",
        "q": "Has anyone close to you raised a concern about us?",
        "type": "mc",
        "depth": 5,
        "ref": "Proverbs 27:6",
        "note": "US-037 asks how open you are to people questioning the relationship. This asks whether it has already happened and what you did with it — a fact, not a posture.",
        "guessable": true,
        "notYet": true,
        "opts": [
          "No",
          "Yes, and I dismissed it",
          "Yes, and it stuck with me",
          "No one has said anything either way"
        ]
      },
      {
        "id": "NOW-020",
        "q": "How often do you have doubts about us?",
        "type": "scale",
        "depth": 5,
        "note": "US-007 measures confidence you'd go the distance. This measures frequency of doubt, which is a different thing — people can be confident overall and still wobble weekly.",
        "guessable": true,
        "notYet": true,
        "lo": "Almost never",
        "hi": "Often"
      },
      {
        "id": "NOW-024",
        "q": "If this ended tomorrow, your honest first feeling would be:",
        "type": "mc",
        "depth": 5,
        "note": "The hardest question in the bank and the one the tagline exists for. Sad relief is a real answer that thousands of people carry into weddings because nobody ever asked.",
        "guessable": true,
        "opts": [
          "Devastated",
          "Grief, but I'd be okay",
          "Sad, with some relief",
          "I genuinely don't know"
        ]
      }
    ]
  }
};
