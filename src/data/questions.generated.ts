// AUTO-GENERATED — DO NOT EDIT BY HAND.
// Source of truth: data/questions.json + data/decks.json.
// Regenerate with: npm run build:questions   (see CLAUDE.md §9)

export type QuestionType = "scale" | "mc" | "rank" | "open";

export interface Question {
  id: string;
  q: string;
  type: QuestionType;
  /** Difficulty tier "1"|"2"|"3" (kept as string, verbatim from the bank). */
  tier: string;
  ref?: string;
  note?: string;
  /** Supports the predict-your-partner scoring layer. */
  guessable?: boolean;
  /** Scores as fully aligned even when answers differ (purple "Complementary"). */
  complement?: boolean;
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
  "values-convictions"
];

/** All decks keyed by slug. */
export const DECKS: Record<string, Deck> = {
  "in-the-home": {
    "name": "In the Home",
    "color": "#B0865E",
    "icon": "home",
    "questions": [
      {
        "id": "HOME-001",
        "q": "Who does most of the cooking in your home?",
        "type": "mc",
        "tier": "1",
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
        "tier": "1",
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
        "tier": "1",
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
        "id": "HOME-004",
        "q": "Where do you picture us putting down roots - city, suburbs, or somewhere quieter?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
        "ref": "Romans 12:13",
        "note": "The hospitality theme as a home-culture value; HOME was a thin category.",
        "guessable": true,
        "lo": "Our home is our private space",
        "hi": "Always open to others"
      },
      {
        "id": "HOME-006",
        "q": "How tidy do you need our home to be?",
        "type": "scale",
        "tier": "1",
        "note": "Cleanliness standards — a classic daily-friction gap.",
        "guessable": true,
        "lo": "Relaxed about mess",
        "hi": "Everything in its place"
      },
      {
        "id": "HOME-007",
        "q": "How important is it to you to own a home rather than rent?",
        "type": "scale",
        "tier": "2",
        "note": "A practical housing value with real financial weight.",
        "guessable": true,
        "lo": "Renting is fine",
        "hi": "Owning matters a lot"
      },
      {
        "id": "HOME-008",
        "q": "Who should handle home repairs and maintenance?",
        "type": "mc",
        "tier": "1",
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
        "id": "HOME-009",
        "q": "How important is having some space at home that's just yours?",
        "type": "scale",
        "tier": "2",
        "note": "Personal-space needs within a shared home.",
        "guessable": true,
        "lo": "Sharing everything is fine",
        "hi": "I need my own space"
      }
    ]
  },
  "finances-money": {
    "name": "Finances & Money",
    "color": "#5E7A4E",
    "icon": "coin",
    "questions": [
      {
        "id": "FIN-001",
        "q": "Should a married couple combine their finances fully, keep them separate, or a mix?",
        "type": "mc",
        "tier": "2",
        "note": "Money is a leading source of marital conflict — better named now than discovered later.",
        "guessable": true,
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
        "tier": "2",
        "ref": "Romans 13:8",
        "note": "Brings financial baggage into the open early.",
        "guessable": true,
        "lo": "Avoid debt entirely",
        "hi": "Comfortable carrying it"
      },
      {
        "id": "FIN-003",
        "q": "How financially open should we be with each other?",
        "type": "scale",
        "tier": "2",
        "note": "Opens the door to financial transparency.",
        "guessable": true,
        "lo": "Keep some things private",
        "hi": "Fully transparent"
      },
      {
        "id": "FIN-004",
        "q": "How disciplined are you with a monthly budget?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces day-to-day money habits and rhythm.",
        "guessable": true,
        "lo": "Loose with budgeting",
        "hi": "Track every dollar"
      },
      {
        "id": "FIN-005",
        "q": "How should we manage money day to day?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
        "note": "Surfaces long-term financial planning habits.",
        "guessable": true,
        "lo": "Live for today",
        "hi": "Save aggressively for the future"
      },
      {
        "id": "FIN-007",
        "q": "How do you feel about a prenuptial agreement?",
        "type": "mc",
        "tier": "3",
        "note": "Surfaces views on a prenuptial agreement candidly.",
        "guessable": true,
        "opts": [
          "Want one",
          "Open to one",
          "Prefer not",
          "Strongly against"
        ]
      },
      {
        "id": "FIN-008",
        "q": "Beyond any children, who should our will provide for?",
        "type": "mc",
        "tier": "2",
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
        "id": "FIN-009",
        "q": "Be honest - are you more of a saver or a spender?",
        "type": "scale",
        "tier": "1",
        "note": "A quick, gamified read on money temperament.",
        "guessable": true,
        "lo": "Saver to the bone",
        "hi": "Spender at heart"
      },
      {
        "id": "FIN-010",
        "q": "How important is it that we agree on money?",
        "type": "scale",
        "tier": "2",
        "note": "Weights money gaps in the agreement score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "FIN-011",
        "q": "When you're stressed, how often do you spend or shop to feel better?",
        "type": "scale",
        "tier": "2",
        "note": "The 'retail therapy' flag in neutral, self-rated terms.",
        "guessable": true,
        "lo": "Never",
        "hi": "Very often"
      },
      {
        "id": "FIN-012",
        "q": "If we had money left over each month, where should most of it go?",
        "type": "rank",
        "tier": "2",
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
        "tier": "2",
        "ref": "Proverbs 22:7",
        "note": "A debt disclosure as buckets — distance, not a private number.",
        "guessable": true,
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
        "tier": "2",
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
        "tier": "2",
        "note": "A concrete sequencing decision raised in the worksheet exercise.",
        "guessable": true,
        "lo": "Not a priority",
        "hi": "Essential to clear it first"
      },
      {
        "id": "FIN-016",
        "q": "How do you see the things you own?",
        "type": "mc",
        "tier": "2",
        "ref": "1 Peter 4:10",
        "note": "Surfaces stewardship theology behind money and possessions.",
        "guessable": true,
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
        "tier": "2",
        "ref": "Proverbs 21:20",
        "note": "Crisis-resilience mindset, distinct from long-term saving (FIN-006).",
        "guessable": true,
        "lo": "We'll manage problems as they come",
        "hi": "I want a solid emergency cushion"
      }
    ]
  },
  "faith-worship-practice": {
    "name": "Faith & Worship practice",
    "color": "#682D5C",
    "icon": "faith",
    "questions": [
      {
        "id": "FAITH-001",
        "q": "How essential is praying together as a couple to you?",
        "type": "scale",
        "tier": "1",
        "ref": "1 Thessalonians 5:17",
        "note": "Reveals expectations about a shared spiritual rhythm.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-002",
        "q": "How central is your faith to your everyday life?",
        "type": "scale",
        "tier": "2",
        "ref": "1 Peter 3:15",
        "note": "Surfaces the foundation each person's faith is built on, in their own words.",
        "guessable": true,
        "lo": "A background part of life",
        "hi": "It centres everything"
      },
      {
        "id": "FAITH-003",
        "q": "How committed are you to regular giving or tithing?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
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
        "id": "FAITH-007",
        "q": "How involved do you want to be in church community and small groups?",
        "type": "scale",
        "tier": "1",
        "ref": "Hebrews 10:25",
        "note": "Surfaces expectations about church community and studying together.",
        "guessable": true,
        "lo": "Rarely involved",
        "hi": "Highly involved"
      },
      {
        "id": "FAITH-008",
        "q": "How much should we shape each other's spiritual growth?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
        "ref": "Romans 12:2",
        "note": "Surfaces willingness to live out convictions against the grain.",
        "guessable": true,
        "lo": "Blend in with the culture",
        "hi": "Stand apart for our convictions"
      },
      {
        "id": "FAITH-010",
        "q": "What's been your best experience with church - and your worst? How involved do you want to be?",
        "type": "open",
        "tier": "1",
        "note": "Surfaces church hopes and hurts."
      },
      {
        "id": "FAITH-011",
        "q": "What has God taught you through the hard stretches - failure, waiting, loss, disappointment?",
        "type": "open",
        "tier": "2",
        "ref": "Romans 5:3-4",
        "note": "Surfaces faith shaped in difficulty."
      },
      {
        "id": "FAITH-012",
        "q": "If you could ask God one question, what would it be?",
        "type": "open",
        "tier": "1",
        "note": "A gentle window into each person's faith wrestlings."
      },
      {
        "id": "FAITH-013",
        "q": "Rank what marriage is ultimately for.",
        "type": "rank",
        "tier": "2",
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
        "tier": "2",
        "note": "Weights how much faith gaps should count in the alignment score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "FAITH-015",
        "q": "How important is having a personal prayer life to you?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
        "note": "Measures the expectation that a partner owns their own spiritual disciplines.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-017",
        "q": "Should we pray together before making big decisions?",
        "type": "scale",
        "tier": "2",
        "ref": "Proverbs 3:5-6",
        "note": "Surfaces whether prayer is woven into how the couple decides things.",
        "guessable": true,
        "lo": "Rarely",
        "hi": "Always"
      },
      {
        "id": "FAITH-018",
        "q": "How important is it that your partner's relationship with God comes before their relationship with you?",
        "type": "scale",
        "tier": "3",
        "ref": "Matthew 6:33",
        "note": "The core 'loves Christ first' value, asked as a shared expectation both rate.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-019",
        "q": "When your time with God and time with your partner compete for the same hour, which usually wins?",
        "type": "scale",
        "tier": "3",
        "note": "Spectrum framing of the same value as a behaviour, not just an ideal.",
        "guessable": true,
        "lo": "The relationship usually wins",
        "hi": "God always comes first"
      },
      {
        "id": "FAITH-020",
        "q": "What rhythm of personal Bible reading do you hope to keep?",
        "type": "mc",
        "tier": "1",
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
        "id": "FAITH-021",
        "q": "How important is regularly studying the Bible together as a couple?",
        "type": "scale",
        "tier": "2",
        "note": "Distinct from church involvement (FAITH-007) — this is the two of you.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "FAITH-022",
        "q": "Our relationship should actively draw us both closer to God, not just leave our faith untouched.",
        "type": "scale",
        "tier": "2",
        "note": "The summing-up green flag, framed as a conviction both rate for agreement.",
        "guessable": true,
        "lo": "Strongly disagree",
        "hi": "Strongly agree"
      },
      {
        "id": "FAITH-023",
        "q": "Who should take the lead in prayer and spiritual life in the home?",
        "type": "mc",
        "tier": "3",
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
        "id": "FAITH-024",
        "q": "How important is it to you that your partner is born again, with a personal conversion?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
        "ref": "James 1:22",
        "note": "Surfaces posture toward biblical authority — a real, often-hidden divider.",
        "guessable": true,
        "opts": [
          "I adjust my view to fit Scripture",
          "I wrestle, but usually submit",
          "I look for another interpretation",
          "I follow my own conviction"
        ]
      },
      {
        "id": "FAITH-030",
        "q": "When you sin, what's your instinct?",
        "type": "mc",
        "tier": "3",
        "ref": "1 John 1:9",
        "note": "The 'do you hide sin or live in repentance' question, made scoreable.",
        "guessable": true,
        "opts": [
          "Confess and seek accountability",
          "Tell God privately and move on",
          "Try to fix it on my own",
          "I tend to hide it"
        ]
      },
      {
        "id": "FAITH-031",
        "q": "How important is it to you that we actively serve in a church, not just attend?",
        "type": "scale",
        "tier": "2",
        "ref": "Galatians 5:13",
        "note": "Distinct from involvement level (FAITH-007) — this is contributing vs consuming.",
        "guessable": true,
        "lo": "Attending is enough",
        "hi": "Serving really matters"
      },
      {
        "id": "FAITH-032",
        "q": "How do you most want to serve in a church?",
        "type": "mc",
        "tier": "1",
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
        "id": "FAITH-033",
        "q": "How open are you to being mentored and corrected by mature believers?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
        "ref": "Philippians 2:12",
        "note": "Spiritual ownership vs dependence, distinct from active-growth effort (SELF-020).",
        "guessable": true,
        "lo": "I own my own growth",
        "hi": "I'd lean on my partner to lead me"
      }
    ]
  },
  "roles-responsibilities": {
    "name": "Roles & Responsibilities",
    "color": "#6E7A8A",
    "icon": "compass",
    "questions": [
      {
        "id": "ROLE-001",
        "q": "How do you see roles and leadership working in a marriage?",
        "type": "mc",
        "tier": "2",
        "ref": "Ephesians 5:21-33",
        "note": "Theology varies widely by tradition — keep it open. Surface, don't settle.",
        "guessable": true,
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
        "tier": "2",
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
        "tier": "2",
        "note": "Weights roles gaps in the alignment score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "ROLE-004",
        "q": "How important is it to you that the husband is the primary financial provider?",
        "type": "scale",
        "tier": "2",
        "ref": "1 Timothy 5:8",
        "note": "The provision question as a pointed values split, not folded into general roles.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "ROLE-005",
        "q": "How literally do you take 'the husband is the head of the home'?",
        "type": "scale",
        "tier": "3",
        "note": "Adds scoring resolution to the headship/submission axis beyond ROLE-001's categories.",
        "guessable": true,
        "lo": "Symbolic, we share leadership",
        "hi": "Literal male headship"
      }
    ]
  },
  "theology-beliefs": {
    "name": "Theology & Beliefs",
    "color": "#7C4B72",
    "icon": "book",
    "questions": [
      {
        "id": "THEO-001",
        "q": "Do you believe a woman can preach or pastor in a church?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
        "note": "Surfaces overall theological and social posture without forcing a label.",
        "guessable": true,
        "lo": "Traditional / conservative",
        "hi": "Progressive"
      },
      {
        "id": "THEO-003",
        "q": "Can salvation be lost?",
        "type": "mc",
        "tier": "3",
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
        "tier": "3",
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
        "tier": "3",
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
        "tier": "3",
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
        "tier": "3",
        "note": "Surfaces political alignment without taking sides.",
        "guessable": true,
        "lo": "Conservative",
        "hi": "Progressive"
      },
      {
        "id": "THEO-008",
        "q": "How important is it that we share the same denomination or church tradition?",
        "type": "scale",
        "tier": "2",
        "note": "The Presbyterian-marries-Baptist clash as a shared value.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Very important"
      },
      {
        "id": "THEO-009",
        "q": "Should our children be baptized as infants, or wait until they choose for themselves?",
        "type": "mc",
        "tier": "3",
        "note": "The exact infant-baptism landmine the transcript names; a real divider.",
        "guessable": true,
        "opts": [
          "Baptize as infants",
          "Dedicate now, baptize when they choose",
          "Wait until they can decide",
          "Unsure"
        ]
      },
      {
        "id": "THEO-010",
        "q": "Rank which theological issues matter most for us to agree on.",
        "type": "rank",
        "tier": "2",
        "note": "A granular doctrine-priority rank, beyond the binary importance weightings.",
        "opts": [
          "Baptism (infant vs believer)",
          "End times",
          "Spiritual gifts",
          "Women in ministry",
          "Worship style",
          "Predestination vs free will"
        ]
      }
    ]
  },
  "dreams-future": {
    "name": "Dreams & Future",
    "color": "#9C4A6E",
    "icon": "star",
    "questions": [
      {
        "id": "DREAM-001",
        "q": "How clear is your sense of life purpose?",
        "type": "scale",
        "tier": "2",
        "ref": "Jeremiah 29:11",
        "note": "Surfaces each person's sense of calling and direction.",
        "guessable": true,
        "lo": "Still searching",
        "hi": "Very clear"
      },
      {
        "id": "DREAM-002",
        "q": "How often would you love for us to travel in a typical year?",
        "type": "mc",
        "tier": "1",
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
        "id": "DREAM-003",
        "q": "What does retirement look like to you?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
        "note": "Surfaces inherited marriage patterns to carry forward or leave behind.",
        "guessable": true,
        "lo": "Very different from my parents'",
        "hi": "Much like my parents'"
      },
      {
        "id": "DREAM-005",
        "q": "Ten years out, where do you want to be - in your heart, your faith, and your finances?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces a whole-life growth vision."
      },
      {
        "id": "DREAM-006",
        "q": "Finish this a few times: 'If we marry, I would love for us to...'",
        "type": "open",
        "tier": "1",
        "note": "A dreaming game that reveals hopes for married life."
      }
    ]
  },
  "family-children": {
    "name": "Family & Children",
    "color": "#88A06A",
    "icon": "family",
    "questions": [
      {
        "id": "FAM-001",
        "q": "How many children would you hope for?",
        "type": "mc",
        "tier": "2",
        "ref": "Psalm 127:3-5",
        "note": "Aligns hopes for family size and timing early.",
        "guessable": true,
        "opts": [
          "None",
          "1-2",
          "3-4",
          "5+",
          "Open / unsure"
        ]
      },
      {
        "id": "FAM-002",
        "q": "If we faced fertility struggles, how open are you to reproductive medicine?",
        "type": "mc",
        "tier": "3",
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
        "id": "FAM-003",
        "q": "How open are you to adoption?",
        "type": "scale",
        "tier": "2",
        "ref": "Ephesians 1:5",
        "note": "Explores openness to adoption as a path to family.",
        "guessable": true,
        "lo": "Eager to adopt",
        "hi": "Prefer not to"
      },
      {
        "id": "FAM-004",
        "q": "How important is it that we agree on children and parenting?",
        "type": "scale",
        "tier": "2",
        "note": "Weights family/parenting gaps in the alignment score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "FAM-005",
        "q": "How soon after marriage would you want to start trying for children?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
        "note": "Distinct from openness to adoption (FAM-003).",
        "guessable": true,
        "lo": "Any path to family is equal",
        "hi": "Biological children matter a lot"
      },
      {
        "id": "FAM-007",
        "q": "How important is it that our children grow up close to extended family?",
        "type": "scale",
        "tier": "2",
        "note": "A family-geography value couples often assume.",
        "guessable": true,
        "lo": "Wherever life takes us",
        "hi": "Near family really matters"
      },
      {
        "id": "FAM-008",
        "q": "If we disagreed about having more children, how should we handle it?",
        "type": "mc",
        "tier": "3",
        "note": "Surfaces the decision rule for a high-stakes disagreement.",
        "guessable": true,
        "opts": [
          "Keep talking until we agree",
          "Defer to whoever feels strongest",
          "The one who wants fewer decides",
          "We'd seek outside help"
        ]
      },
      {
        "id": "FAM-009",
        "q": "How important is it to raise our children in the faith?",
        "type": "scale",
        "tier": "2",
        "ref": "Proverbs 22:6",
        "note": "Faith-transmission priority, distinct from responding to a child's doubt (PAR-003).",
        "guessable": true,
        "lo": "Let them choose freely",
        "hi": "Essential to raise them in it"
      },
      {
        "id": "FAM-010",
        "q": "How involved should grandparents be in raising our children?",
        "type": "scale",
        "tier": "2",
        "note": "Grandparent involvement in childrearing specifically.",
        "guessable": true,
        "lo": "Minimal, we parent",
        "hi": "Very involved"
      }
    ]
  },
  "parenting-style": {
    "name": "Parenting style",
    "color": "#88A06A",
    "icon": "family",
    "questions": [
      {
        "id": "PAR-001",
        "q": "Rank what matters most in raising children.",
        "type": "rank",
        "tier": "2",
        "ref": "Proverbs 22:6",
        "note": "Surfaces core parenting philosophy and values.",
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
        "tier": "2",
        "note": "Surfaces what each would keep or change from their own upbringing.",
        "guessable": true,
        "lo": "Very differently from how I was raised",
        "hi": "Much the same"
      },
      {
        "id": "PAR-003",
        "q": "If a child questions their faith, how should we respond?",
        "type": "mc",
        "tier": "3",
        "ref": "Deuteronomy 6:6-7",
        "note": "Explores how they'd respond if a child questions their faith.",
        "guessable": true,
        "opts": [
          "Gently guide them back",
          "Let them explore freely",
          "Step in with concern",
          "Trust the foundation we laid"
        ]
      },
      {
        "id": "PAR-004",
        "q": "Where does your discipline style fall?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces discipline philosophy and inherited patterns.",
        "guessable": true,
        "lo": "Firm and structured",
        "hi": "Gentle and relational"
      },
      {
        "id": "PAR-005",
        "q": "How do you feel about spanking as a form of discipline?",
        "type": "mc",
        "tier": "2",
        "ref": "Proverbs 13:24",
        "note": "Names a real discipline split directly instead of folding it into PAR-004.",
        "guessable": true,
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
        "tier": "2",
        "ref": "Deuteronomy 6:7",
        "note": "A concrete schooling decision couples often discover they differ on.",
        "guessable": true,
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
        "tier": "2",
        "note": "The counterculture flag (Halloween, media, etc.) aimed at parenting.",
        "guessable": true,
        "lo": "Fully part of the culture",
        "hi": "Deliberately set apart"
      }
    ]
  },
  "intimacy-physical": {
    "name": "Intimacy & Physical",
    "color": "#A8554E",
    "icon": "heart",
    "questions": [
      {
        "id": "INT-001",
        "q": "How important is physical intimacy to you in marriage?",
        "type": "scale",
        "tier": "3",
        "ref": "1 Corinthians 7:3-5",
        "note": "Opens honest conversation about physical intimacy and expectations.",
        "guessable": true,
        "lo": "A low priority",
        "hi": "Very important"
      },
      {
        "id": "INT-002",
        "q": "What should our physical boundaries be before marriage?",
        "type": "mc",
        "tier": "3",
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
        "id": "INT-003",
        "q": "How much does physical attraction factor into a relationship for you?",
        "type": "scale",
        "tier": "2",
        "note": "Names honestly how much physical attraction factors in.",
        "guessable": true,
        "lo": "Not much",
        "hi": "Very much"
      },
      {
        "id": "INT-004",
        "q": "Where does crossing the line begin for you?",
        "type": "mc",
        "tier": "3",
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
        "id": "INT-005",
        "q": "How comfortable are you talking openly about sex?",
        "type": "scale",
        "tier": "3",
        "note": "Opens honest, judgment-free talk about intimacy and expectations.",
        "guessable": true,
        "lo": "Very uncomfortable",
        "hi": "Very comfortable"
      },
      {
        "id": "INT-006",
        "q": "How do you view pornography in a marriage?",
        "type": "mc",
        "tier": "3",
        "note": "A sensitive but important boundary conversation.",
        "opts": [
          "Never acceptable",
          "A serious problem",
          "Depends",
          "Not a big deal"
        ]
      },
      {
        "id": "INT-007",
        "q": "How important is it that we agree on physical intimacy?",
        "type": "scale",
        "tier": "3",
        "note": "Weights intimacy gaps in the agreement score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "INT-008",
        "q": "How important is it to you that your partner saved, or is saving, sex for marriage?",
        "type": "scale",
        "tier": "3",
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
        "tier": "3",
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
        "tier": "3",
        "note": "Surfaces disclosure comfort; left non-guessable as too sensitive to gamify.",
        "lo": "I'd rather keep my past private",
        "hi": "Fully open about it"
      },
      {
        "id": "INT-011",
        "q": "If one of us struggles with sexual temptation or pornography, what should we do?",
        "type": "mc",
        "tier": "3",
        "ref": "Galatians 6:1-2",
        "note": "The accountability protocol — distinct from the moral view of porn (INT-006).",
        "guessable": true,
        "opts": [
          "Always tell each other",
          "Tell a mentor or accountability partner",
          "Handle it privately",
          "Unsure"
        ]
      },
      {
        "id": "INT-012",
        "q": "How important is everyday affection and playfulness to you?",
        "type": "scale",
        "tier": "1",
        "ref": "Song of Solomon 2:4",
        "note": "The 'delight and enjoyment' theme as a non-sexual affection need.",
        "guessable": true,
        "lo": "Not a big need",
        "hi": "Very important"
      }
    ]
  },
  "conflict-communication": {
    "name": "Conflict & Communication",
    "color": "#B06A5E",
    "icon": "chat",
    "questions": [
      {
        "id": "CONF-001",
        "q": "How do you most naturally give and receive love?",
        "type": "mc",
        "tier": "1",
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
        "id": "CONF-002",
        "q": "How soon do you like to resolve conflict?",
        "type": "scale",
        "tier": "2",
        "ref": "James 1:19",
        "note": "Surfaces conflict styles before they collide.",
        "guessable": true,
        "lo": "I need space first",
        "hi": "Address it right away"
      },
      {
        "id": "CONF-003",
        "q": "Rank how you react under stress, most like you first.",
        "type": "rank",
        "tier": "2",
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
        "tier": "2",
        "note": "Invites honesty about fears and the hard parts of marriage.",
        "guessable": true,
        "lo": "Completely at ease",
        "hi": "Quite anxious"
      },
      {
        "id": "CONF-005",
        "q": "How open should our social media be to each other?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces comfort levels around posts, follows, and online life.",
        "guessable": true,
        "lo": "Keep our profiles private",
        "hi": "Fully open to each other"
      },
      {
        "id": "CONF-006",
        "q": "How open should our phones be to each other?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces expectations about privacy and openness with devices.",
        "guessable": true,
        "lo": "Phones stay private",
        "hi": "Full access to each other"
      },
      {
        "id": "CONF-007",
        "q": "How comfortable are you with solo trips with friends?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces trust and independence around time apart.",
        "guessable": true,
        "lo": "Not comfortable",
        "hi": "Totally fine"
      },
      {
        "id": "CONF-008",
        "q": "Rank what makes you feel most respected.",
        "type": "rank",
        "tier": "2",
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
        "id": "CONF-009",
        "q": "Rank these from most to least how you give and receive love.",
        "type": "rank",
        "tier": "1",
        "note": "Surfaces what makes each feel most loved.",
        "opts": [
          "Words of affirmation",
          "Quality time",
          "Acts of service",
          "Gifts",
          "Physical touch"
        ]
      },
      {
        "id": "CONF-010",
        "q": "How comfortable are you with close opposite-sex friendships after marriage?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces boundaries and comfort with friendships after marriage.",
        "guessable": true,
        "lo": "Not comfortable",
        "hi": "Completely fine"
      },
      {
        "id": "CONF-011",
        "q": "Rank these communication styles from most to least like you.",
        "type": "rank",
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
        "note": "Surfaces default conflict mode.",
        "guessable": true,
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
        "tier": "2",
        "note": "Surfaces respect for boundaries and limits.",
        "guessable": true,
        "lo": "I struggle with it",
        "hi": "I take it easily"
      },
      {
        "id": "CONF-015",
        "q": "How much privacy is healthy in a marriage?",
        "type": "scale",
        "tier": "3",
        "note": "Surfaces transparency vs privacy expectations.",
        "guessable": true,
        "lo": "Total transparency",
        "hi": "Plenty can stay private"
      },
      {
        "id": "CONF-016",
        "q": "How much conflict feels normal and healthy in a relationship to you?",
        "type": "scale",
        "tier": "2",
        "note": "Catches the chaos-tolerance gap before it collides.",
        "guessable": true,
        "lo": "Almost none",
        "hi": "Frequent is normal"
      },
      {
        "id": "CONF-017",
        "q": "How calm or high-energy do you want our home environment to feel?",
        "type": "scale",
        "tier": "2",
        "note": "The peace-vs-chaos flag, framed as a shared preference.",
        "guessable": true,
        "lo": "Calm and quiet",
        "hi": "Lively and high-energy"
      },
      {
        "id": "CONF-018",
        "q": "How quick is your temper?",
        "type": "scale",
        "tier": "2",
        "note": "Names the anger red flag directly as a self-rating, distinct from conflict style.",
        "guessable": true,
        "lo": "Very slow to anger",
        "hi": "Quick-tempered"
      },
      {
        "id": "CONF-019",
        "q": "In a disagreement, how much does being proven right matter to you?",
        "type": "scale",
        "tier": "2",
        "ref": "Philippians 2:3",
        "note": "The 'unity over being right' value, distinct from conflict reflex (CONF-013).",
        "guessable": true,
        "lo": "I'd rather keep the peace",
        "hi": "Being right matters to me"
      },
      {
        "id": "CONF-020",
        "q": "How much daily contact do you need to feel connected?",
        "type": "mc",
        "tier": "1",
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
        "id": "CONF-021",
        "q": "When someone interrupts you, how do you usually react?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
        "ref": "Matthew 7:5",
        "note": "The ownership-vs-victim axis, distinct from conflict reflex (CONF-013).",
        "guessable": true,
        "lo": "I usually feel wronged",
        "hi": "I quickly own my part"
      },
      {
        "id": "CONF-023",
        "q": "How okay is it to talk through our relationship problems with friends or family?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
        "note": "The 'ships passing in the night' theme; quality-time intentionality vs contact frequency (CONF-020).",
        "guessable": true,
        "lo": "We'll connect when we connect",
        "hi": "We must guard dedicated time"
      },
      {
        "id": "CONF-026",
        "q": "When we argue, is it fair to bring up past mistakes?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
        "note": "The blind-spot value as approach — pairs with the SCALE on intensity.",
        "guessable": true,
        "opts": [
          "Always, lovingly",
          "Only the big ones",
          "Only when asked",
          "Better to let it be"
        ]
      }
    ]
  },
  "in-laws-extended-family": {
    "name": "In-Laws & Extended Family",
    "color": "#9C7A4A",
    "icon": "family",
    "questions": [
      {
        "id": "INLAW-001",
        "q": "How firm should our boundaries with extended family be?",
        "type": "scale",
        "tier": "2",
        "ref": "Genesis 2:24",
        "note": "Surfaces boundaries with extended family before tensions arise.",
        "guessable": true,
        "lo": "Keep family very involved",
        "hi": "Firm boundaries"
      },
      {
        "id": "INLAW-002",
        "q": "How should we handle holidays between both families?",
        "type": "mc",
        "tier": "2",
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
        "id": "INLAW-003",
        "q": "How should we approach caring for aging parents?",
        "type": "mc",
        "tier": "3",
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
        "tier": "3",
        "note": "Surfaces 'leave and cleave' and healthy independence.",
        "guessable": true,
        "lo": "It would be hard",
        "hi": "Fully ready"
      },
      {
        "id": "INLAW-005",
        "q": "How important is it to you that both our families support our relationship?",
        "type": "scale",
        "tier": "2",
        "note": "The 'both families are at peace' flag as a shared value.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "INLAW-006",
        "q": "How much do your parents influence your decisions?",
        "type": "scale",
        "tier": "2",
        "note": "Parental-influence level, distinct from leave-and-cleave (INLAW-004); thin category.",
        "guessable": true,
        "lo": "I decide independently",
        "hi": "I lean on them heavily"
      },
      {
        "id": "INLAW-007",
        "q": "As a couple, how much should we make big decisions on our own versus with our parents' input?",
        "type": "scale",
        "tier": "2",
        "note": "The couple's stance on parental input, distinct from how much parents influence you (INLAW-006).",
        "guessable": true,
        "lo": "On our own",
        "hi": "With our parents' input"
      }
    ]
  },
  "fun-icebreakers": {
    "name": "Fun & Icebreakers",
    "color": "#E0A93C",
    "icon": "star",
    "questions": [
      {
        "id": "FUN-002",
        "q": "What's your ideal way to spend a free day?",
        "type": "mc",
        "tier": "1",
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
        "q": "Here's everything I love doing - which of these would you secretly rather sit out?",
        "type": "open",
        "tier": "1",
        "note": "Clears the air on shared vs solo activities, honestly."
      },
      {
        "id": "FUN-004",
        "q": "Which shows or movies have actually shaped you - and who gets the remote?",
        "type": "open",
        "tier": "1",
        "note": "A playful window into taste and values."
      },
      {
        "id": "FUN-005",
        "q": "Surprise inheritance, money's no object - where do we live, what do you do, and am I still in the picture?",
        "type": "open",
        "tier": "1",
        "note": "A fun hypothetical that quietly surfaces values."
      },
      {
        "id": "FUN-006",
        "q": "How much of your free time do you want to spend on your own hobbies versus together?",
        "type": "scale",
        "tier": "1",
        "note": "Leisure allocation, distinct from solitude-to-recharge (SELF-013).",
        "guessable": true,
        "lo": "Mostly together",
        "hi": "Lots of independent time"
      }
    ]
  },
  "deal-breakers": {
    "name": "Deal-breakers",
    "color": "#B0504E",
    "icon": "shield",
    "questions": [
      {
        "id": "DEAL-001",
        "q": "Rank these from most to least of a deal-breaker for you.",
        "type": "rank",
        "tier": "3",
        "note": "Names genuine non-negotiables out loud.",
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
        "tier": "3",
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
        "id": "DEAL-003",
        "q": "What's one value or part of your life you'd never be willing to give up?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces core, unchangeable values."
      },
      {
        "id": "DEAL-004",
        "q": "Could you marry someone who doesn't share your faith?",
        "type": "mc",
        "tier": "3",
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
        "tier": "3",
        "note": "Surfaces where each lands on infidelity before it's ever tested.",
        "guessable": true,
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
        "tier": "3",
        "note": "Names the addiction line directly.",
        "guessable": true,
        "lo": "I could work through it",
        "hi": "An absolute deal-breaker"
      },
      {
        "id": "DEAL-007",
        "q": "Could you marry someone who never wants children, when you do?",
        "type": "mc",
        "tier": "3",
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
        "tier": "3",
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
        "tier": "3",
        "note": "Family approval as a make-or-break, distinct from family-support (INLAW-005).",
        "guessable": true,
        "opts": [
          "No",
          "I'd hesitate a lot",
          "Yes, if I was sure",
          "My family's view wouldn't decide it"
        ]
      }
    ]
  },
  "health-lifestyle": {
    "name": "Health & Lifestyle",
    "color": "#7E9A5E",
    "icon": "leaf",
    "questions": [
      {
        "id": "HEALTH-001",
        "q": "Where do your eating habits fall?",
        "type": "scale",
        "tier": "1",
        "note": "Surfaces daily food and lifestyle compatibility.",
        "guessable": true,
        "lo": "Very health-focused",
        "hi": "Whatever tastes good"
      },
      {
        "id": "HEALTH-002",
        "q": "How often do you like to see friends - what's your ideal social rhythm?",
        "type": "mc",
        "tier": "1",
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
        "tier": "1",
        "note": "Light values check on body and appearance.",
        "guessable": true,
        "lo": "Against them",
        "hi": "Love them"
      },
      {
        "id": "HEALTH-004",
        "q": "What's your relationship with alcohol, and what would you want it to look like in our home?",
        "type": "mc",
        "tier": "2",
        "note": "Surfaces habits and convictions around alcohol.",
        "guessable": true,
        "opts": [
          "I don't drink",
          "Occasionally / socially",
          "Regularly",
          "I'd prefer an alcohol-free home"
        ]
      },
      {
        "id": "HEALTH-005",
        "q": "If you were filling out a health history with me, what should I know - past and present?",
        "type": "open",
        "tier": "3",
        "note": "A gentle prompt for important health disclosure."
      },
      {
        "id": "HEALTH-006",
        "q": "What's your history and current relationship with alcohol or other substances?",
        "type": "open",
        "tier": "3",
        "note": "Surfaces substance history honestly and without shame."
      },
      {
        "id": "HEALTH-007",
        "q": "When you're sick, how do you most want to be treated?",
        "type": "mc",
        "tier": "2",
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
        "id": "HEALTH-008",
        "q": "How much of your day goes to screens and your phone, and how would that flex in a marriage?",
        "type": "mc",
        "tier": "1",
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
        "tier": "1",
        "note": "A light but real daily-rhythm compatibility check that was missing.",
        "guessable": true,
        "lo": "Early bird",
        "hi": "Night owl"
      },
      {
        "id": "HEALTH-010",
        "q": "How much do you prioritise personal grooming and self-care?",
        "type": "scale",
        "tier": "1",
        "note": "A real domestic-friction axis (differing standards) that was missing.",
        "guessable": true,
        "lo": "Low-maintenance",
        "hi": "Very particular about it"
      }
    ]
  },
  "past-baggage": {
    "name": "Past & Baggage",
    "color": "#7E6A78",
    "icon": "leaf",
    "questions": [
      {
        "id": "PAST-001",
        "q": "Is there anything from your past you're still working through or healing from?",
        "type": "open",
        "tier": "3",
        "ref": "Psalm 147:3",
        "note": "Invites gentle honesty about wounds still being worked through."
      },
      {
        "id": "PAST-002",
        "q": "Is there anyone in our circle you've had more than a friendship with that I should know about?",
        "type": "open",
        "tier": "3",
        "note": "Invites honest disclosure about past or present entanglements."
      },
      {
        "id": "PAST-003",
        "q": "What have your past relationships taught you that'll make you a better partner now?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces growth (vs blame) from previous relationships."
      },
      {
        "id": "PAST-004",
        "q": "How much 'baggage' are you bringing - and what size does it pack into?",
        "type": "mc",
        "tier": "1",
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
        "id": "PAST-005",
        "q": "How fully closed are your past relationships?",
        "type": "scale",
        "tier": "3",
        "note": "Surfaces genuine closure on exes.",
        "guessable": true,
        "lo": "Still processing them",
        "hi": "Fully closed"
      },
      {
        "id": "PAST-006",
        "q": "Pick a few words for your relationship with each of your parents - and tell me the story behind them.",
        "type": "open",
        "tier": "2",
        "note": "Surfaces family-of-origin bonds."
      },
      {
        "id": "PAST-007",
        "q": "Is there anything you wish you could say to your parents that you never have?",
        "type": "open",
        "tier": "3",
        "note": "Surfaces unfinished business with parents."
      },
      {
        "id": "PAST-008",
        "q": "What was the home you grew up in like?",
        "type": "mc",
        "tier": "2",
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
        "id": "PAST-009",
        "q": "What's been the lowest point you've walked through, and how did you come out of it?",
        "type": "open",
        "tier": "3",
        "ref": "Psalm 34:18",
        "note": "Surfaces resilience and tender spots."
      },
      {
        "id": "PAST-010",
        "q": "What are a few memories from childhood that still shape you today?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces formative early experiences."
      },
      {
        "id": "PAST-011",
        "q": "Have you worked through your past issues with a mentor, counselor, or in discipleship?",
        "type": "mc",
        "tier": "2",
        "note": "The 'have you done the work before engagement' question, made scoreable.",
        "guessable": true,
        "opts": [
          "Yes, ongoing",
          "Yes, in the past",
          "No, but I'm open to it",
          "No"
        ]
      }
    ]
  },
  "career-ambition": {
    "name": "Career & Ambition",
    "color": "#C28A3A",
    "icon": "star",
    "questions": [
      {
        "id": "CAREER-001",
        "q": "How central is career ambition to you?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
        "note": "Surfaces work patterns and stability."
      },
      {
        "id": "CAREER-003",
        "q": "How willing are you to relocate for a job opportunity?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces mobility vs rootedness, a common career-stage clash.",
        "guessable": true,
        "lo": "I want to put down roots",
        "hi": "Very willing to move"
      },
      {
        "id": "CAREER-004",
        "q": "If our careers ever conflict, whose should take priority?",
        "type": "mc",
        "tier": "3",
        "note": "A pointed career + gender-roles question; distinct positions.",
        "guessable": true,
        "opts": [
          "The husband's",
          "The wife's",
          "Whoever earns more",
          "Whoever is more passionate about theirs",
          "We'd decide case by case"
        ]
      },
      {
        "id": "CAREER-005",
        "q": "How many hours a week is too many to spend on work?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
        "note": "Money vs calling in how each picks work.",
        "guessable": true,
        "lo": "Paying well is enough",
        "hi": "It must feel meaningful"
      },
      {
        "id": "CAREER-007",
        "q": "Would you take a pay cut for a better lifestyle or more time together?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces the income-vs-time trade-off.",
        "guessable": true,
        "lo": "I'd hold out for the income",
        "hi": "Gladly, for a better life"
      },
      {
        "id": "CAREER-008",
        "q": "How do you feel about one of us taking a big career risk, like starting a business?",
        "type": "scale",
        "tier": "2",
        "note": "Career risk appetite as a couple.",
        "guessable": true,
        "lo": "I prefer stability",
        "hi": "I'm all for bold risks"
      },
      {
        "id": "CAREER-009",
        "q": "When work and family time conflict, which should usually win?",
        "type": "scale",
        "tier": "2",
        "note": "A specific work-life boundary, distinct from the priorities rank (US-032).",
        "guessable": true,
        "lo": "Family almost always wins",
        "hi": "Work has to come first sometimes"
      },
      {
        "id": "CAREER-010",
        "q": "At what age would you like to be able to retire or slow down?",
        "type": "mc",
        "tier": "1",
        "note": "Retirement timing, distinct from the retirement-vision question (DREAM-003).",
        "guessable": true,
        "opts": [
          "Mid-50s or earlier",
          "Around 60",
          "Mid-60s",
          "I'd work as long as I can"
        ]
      }
    ]
  },
  "character-self-awareness": {
    "name": "Character & Self-Awareness",
    "color": "#5E8074",
    "icon": "star",
    "questions": [
      {
        "id": "SELF-001",
        "q": "How easily do you open up to someone?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces how safe each feels being truly known.",
        "guessable": true,
        "lo": "Guarded",
        "hi": "Very open"
      },
      {
        "id": "SELF-002",
        "q": "If you had to describe who you really are to someone who'd never met you, what would you say?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces identity and self-understanding."
      },
      {
        "id": "SELF-003",
        "q": "Give five reasons someone would love sharing life with you - and three reasons they might find it hard.",
        "type": "open",
        "tier": "3",
        "note": "Tests self-honesty; the 'hard' three matter most."
      },
      {
        "id": "SELF-004",
        "q": "How easily do you express your emotions?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces emotional vocabulary and openness.",
        "guessable": true,
        "lo": "They stay locked inside",
        "hi": "I express them easily"
      },
      {
        "id": "SELF-005",
        "q": "What are a couple of habits you're glad you have, and a couple you'd love to shake?",
        "type": "open",
        "tier": "2",
        "note": "Light self-awareness about daily patterns."
      },
      {
        "id": "SELF-006",
        "q": "How much do you need to feel in control?",
        "type": "scale",
        "tier": "3",
        "note": "Surfaces control and flexibility.",
        "guessable": true,
        "lo": "Easygoing, happy to go with the flow",
        "hi": "I need to be in control"
      },
      {
        "id": "SELF-007",
        "q": "What are your biggest fears in life right now?",
        "type": "open",
        "tier": "3",
        "note": "Surfaces fears beyond the relationship itself."
      },
      {
        "id": "SELF-008",
        "q": "Rank what gives your life the most meaning.",
        "type": "rank",
        "tier": "2",
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
        "tier": "2",
        "note": "Surfaces openness to correction.",
        "guessable": true,
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
        "tier": "2",
        "note": "Surfaces relational style and patience."
      },
      {
        "id": "SELF-011",
        "q": "Who has shaped who you are the most, and in what way?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces formative influences."
      },
      {
        "id": "SELF-012",
        "q": "How easily do you forgive?",
        "type": "scale",
        "tier": "3",
        "ref": "Colossians 3:13",
        "note": "Surfaces whether grudges linger or release.",
        "guessable": true,
        "lo": "I hold on a long time",
        "hi": "I forgive quickly"
      },
      {
        "id": "SELF-013",
        "q": "How much alone time do you need to feel like yourself again?",
        "type": "scale",
        "tier": "1",
        "note": "Surfaces introvert/extrovert rhythm.",
        "guessable": true,
        "lo": "I recharge around people",
        "hi": "I need lots of solitude"
      },
      {
        "id": "SELF-014",
        "q": "Which character traits come naturally to you - patience, kindness, self-control, gentleness - and which take real effort?",
        "type": "open",
        "tier": "2",
        "ref": "Galatians 5:22-23",
        "note": "A gentle, honest character self-check."
      },
      {
        "id": "SELF-015",
        "q": "If you could change one thing about yourself, what would it be?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces self-awareness and desire to grow."
      },
      {
        "id": "SELF-016",
        "q": "If I asked your parents what I should really know about you, what would they say?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces self-awareness through others' eyes."
      },
      {
        "id": "SELF-017",
        "q": "When life gets hard, how do you most often cope?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
        "note": "The passivity red flag as a self-awareness measure.",
        "guessable": true,
        "lo": "I tend to wait and follow",
        "hi": "I take charge and initiate"
      },
      {
        "id": "SELF-019",
        "q": "How do you feel about small 'white lies'?",
        "type": "mc",
        "tier": "2",
        "note": "Surfaces the integrity threshold without inviting self-flattery.",
        "guessable": true,
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
        "tier": "2",
        "note": "Surfaces present-tense sanctification effort the hosts press on.",
        "guessable": true,
        "lo": "Not focused on it",
        "hi": "Actively working on myself"
      },
      {
        "id": "SELF-021",
        "q": "How comfortable are you being held accountable for your weaknesses?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
        "ref": "Proverbs 10:9",
        "note": "Consistency of character in public vs private — a real character tell.",
        "guessable": true,
        "lo": "I'm the same with everyone",
        "hi": "I adapt a lot to who I'm with"
      },
      {
        "id": "SELF-027",
        "q": "When your feelings and your convictions clash, which usually wins?",
        "type": "scale",
        "tier": "2",
        "ref": "Proverbs 3:5",
        "note": "Head-vs-heart axis; broader than the biblical-authority question (FAITH-029).",
        "guessable": true,
        "lo": "My feelings usually win",
        "hi": "My convictions usually win"
      }
    ]
  },
  "us-compatibility": {
    "name": "Us & Compatibility",
    "color": "#9C4A6E",
    "icon": "heart",
    "questions": [
      {
        "id": "US-001",
        "q": "What does being 'compatible' actually mean to you?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces each person's working definition of fit."
      },
      {
        "id": "US-002",
        "q": "What tells you that what we have is really love and not just strong feelings?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces how each distinguishes love from infatuation."
      },
      {
        "id": "US-003",
        "q": "Name three ways we're alike and three ways we're different - which differences do you actually treasure?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces how differences are held."
      },
      {
        "id": "US-004",
        "q": "What would marriage give you that staying single wouldn't?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces the 'why marriage' for each."
      },
      {
        "id": "US-005",
        "q": "Forget 'perfect' - paint me your picture of a realistic, great marriage.",
        "type": "open",
        "tier": "2",
        "note": "Surfaces marriage expectations grounded in reality."
      },
      {
        "id": "US-006",
        "q": "Rank what makes a marriage last, most important first.",
        "type": "rank",
        "tier": "2",
        "note": "Surfaces priorities; compare the two rankings.",
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
        "id": "US-007",
        "q": "How confident are you that we'd go the distance?",
        "type": "scale",
        "tier": "3",
        "note": "Surfaces commitment and realism about lasting.",
        "guessable": true,
        "lo": "Some real doubts",
        "hi": "Completely confident"
      },
      {
        "id": "US-008",
        "q": "What about me makes you proud?",
        "type": "open",
        "tier": "1",
        "note": "An affirming prompt that builds each other up."
      },
      {
        "id": "US-009",
        "q": "How would you keep romance alive over the long haul?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces intentionality about romance."
      },
      {
        "id": "US-010",
        "q": "Whose marriage do you admire, and what do they do that you'd want for us?",
        "type": "open",
        "tier": "1",
        "note": "Surfaces role models for a healthy marriage."
      },
      {
        "id": "US-011",
        "q": "What about me gives you pause or concern right now?",
        "type": "open",
        "tier": "3",
        "note": "Invites honest concerns while there's still time."
      },
      {
        "id": "US-012",
        "q": "What life experiences would you hope your future spouse had had - and which would you hope they hadn't?",
        "type": "open",
        "tier": "3",
        "note": "Surfaces expectations about a partner's history."
      },
      {
        "id": "US-013",
        "q": "How open are you to premarital counseling now, and marriage counseling later if we needed it?",
        "type": "mc",
        "tier": "2",
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
        "id": "US-014",
        "q": "Where did most of what you believe about marriage come from?",
        "type": "mc",
        "tier": "1",
        "note": "Surfaces the source of marriage assumptions.",
        "guessable": true,
        "opts": [
          "My parents",
          "Friends",
          "Church",
          "Books or media",
          "Mostly figuring it out"
        ]
      },
      {
        "id": "US-015",
        "q": "In marriage, what would you want us to lean on each other for - and what would you keep as your own?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces healthy interdependence and boundaries."
      },
      {
        "id": "US-016",
        "q": "What's something you've always wanted to ask me but never have?",
        "type": "open",
        "tier": "2",
        "note": "A trust-builder that opens hidden doors."
      },
      {
        "id": "US-017",
        "q": "What do you picture for the future of us?",
        "type": "open",
        "tier": "2",
        "note": "Surfaces shared vision and direction."
      },
      {
        "id": "US-018",
        "q": "How much do you feel you give up of yourself to be in this relationship?",
        "type": "scale",
        "tier": "3",
        "note": "Surfaces the give-and-take balance honestly.",
        "guessable": true,
        "lo": "Very little",
        "hi": "A great deal"
      },
      {
        "id": "US-019",
        "q": "Whose blessing on our relationship matters most to you?",
        "type": "rank",
        "tier": "2",
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
        "tier": "3",
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
        "tier": "2",
        "ref": "Amos 3:3",
        "note": "The 'clarity over chemistry' principle as a value both rate.",
        "guessable": true,
        "lo": "Chemistry and connection",
        "hi": "Clarity and shared direction"
      },
      {
        "id": "US-022",
        "q": "How much should a couple agree on the big things before marrying, rather than working it out later?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces how much pre-marriage alignment each thinks is needed.",
        "guessable": true,
        "lo": "Work most of it out later",
        "hi": "Agree on the big things first"
      },
      {
        "id": "US-023",
        "q": "How much do you believe a person's habits and character can change after marriage?",
        "type": "scale",
        "tier": "2",
        "note": "The 'fixer-upper' belief — general view, pairs with the personal one below.",
        "guessable": true,
        "lo": "People rarely change",
        "hi": "People can change a lot"
      },
      {
        "id": "US-024",
        "q": "How much are you counting on me changing after we marry?",
        "type": "scale",
        "tier": "3",
        "note": "The personal application; the reveal is the whole point of the conversation.",
        "guessable": true,
        "lo": "Not at all, I accept you as you are",
        "hi": "I'm counting on some real changes"
      },
      {
        "id": "US-025",
        "q": "Do you think marriage will improve our current problems, or mostly reveal them?",
        "type": "scale",
        "tier": "2",
        "note": "Surfaces an idealistic vs realistic view of what marriage does.",
        "guessable": true,
        "lo": "Marriage will help fix things",
        "hi": "Marriage mainly reveals what's already there"
      },
      {
        "id": "US-026",
        "q": "When hard seasons hit, how do you expect we'll get through them?",
        "type": "mc",
        "tier": "2",
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
        "id": "US-027",
        "q": "Rank the markers of readiness for marriage, most important first.",
        "type": "rank",
        "tier": "2",
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
        "id": "US-028",
        "q": "Do you see marriage more as a covenant or a contract?",
        "type": "mc",
        "tier": "3",
        "ref": "Malachi 2:14",
        "note": "The 'covenant, not box-checking' question; surfaces permanence theology.",
        "guessable": true,
        "opts": [
          "A sacred covenant before God",
          "A lifelong commitment",
          "A partnership that can end if needed",
          "Not sure"
        ]
      },
      {
        "id": "US-029",
        "q": "How do you feel about the pace our relationship is moving?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
        "note": "A practical compatibility check the friendship section raises.",
        "guessable": true,
        "lo": "Not important",
        "hi": "Essential"
      },
      {
        "id": "US-031",
        "q": "Once you knew it was right, how soon would you want to get married?",
        "type": "mc",
        "tier": "2",
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
        "id": "US-032",
        "q": "Rank what should come first in our life together.",
        "type": "rank",
        "tier": "2",
        "ref": "Matthew 6:33",
        "note": "Surfaces ordering of life priorities; the 'marriage as first ministry' theme.",
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
        "id": "US-033",
        "q": "What's your goal for this season of dating?",
        "type": "mc",
        "tier": "2",
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
        "id": "US-034",
        "q": "Should this season be more about having fun or seriously evaluating our future?",
        "type": "scale",
        "tier": "1",
        "note": "Surfaces approach to dating; catches the over-spiritualizing-it trap.",
        "guessable": true,
        "lo": "Mostly enjoy it",
        "hi": "Seriously evaluate it"
      },
      {
        "id": "US-035",
        "q": "How important is it that your spouse is also your best friend?",
        "type": "scale",
        "tier": "2",
        "ref": "Song of Solomon 5:16",
        "note": "The friendship-vs-romance value behind 'enjoy time together in non-romantic settings'.",
        "guessable": true,
        "lo": "Romance matters more to me",
        "hi": "Best friends first"
      },
      {
        "id": "US-036",
        "q": "Early in a relationship, how much do you guard your heart versus give it fully?",
        "type": "scale",
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
        "ref": "Proverbs 27:17",
        "note": "The growth-pushing tension behind 'support each other's growth without pressure'; broader than the spiritual version (FAITH-008).",
        "guessable": true,
        "lo": "Accept each other as we are",
        "hi": "Actively push each other to grow"
      },
      {
        "id": "US-039",
        "q": "As a couple, how involved in community do you want to be?",
        "type": "scale",
        "tier": "2",
        "note": "Couple-level community orientation, distinct from individual social rhythm (HEALTH-002).",
        "guessable": true,
        "lo": "Mostly just us",
        "hi": "Deeply involved in community"
      },
      {
        "id": "US-040",
        "q": "How readily would you give up a hobby or commitment if it was hurting our relationship?",
        "type": "scale",
        "tier": "2",
        "ref": "Philippians 2:4",
        "note": "Willingness to sacrifice outside commitments, distinct from ranking priorities (US-032).",
        "guessable": true,
        "lo": "I'd be reluctant",
        "hi": "Readily"
      }
    ]
  },
  "values-convictions": {
    "name": "Values & Convictions",
    "color": "#C2843A",
    "icon": "compass",
    "questions": [
      {
        "id": "VAL-001",
        "q": "Where do you land on abortion?",
        "type": "mc",
        "tier": "3",
        "note": "A core conviction couples need to know they share or differ on.",
        "guessable": true,
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
        "tier": "3",
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
        "tier": "3",
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
        "tier": "3",
        "note": "Surfaces how each views the exit door before the vows.",
        "guessable": true,
        "opts": [
          "Never",
          "Only for abuse, adultery, or abandonment",
          "When it's broken beyond repair",
          "Still working it out"
        ]
      },
      {
        "id": "VAL-005",
        "q": "What's your view on the death penalty?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
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
        "tier": "2",
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
        "id": "VAL-008",
        "q": "What's your view on assisted dying?",
        "type": "mc",
        "tier": "3",
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
        "id": "VAL-009",
        "q": "How do you hold creation and evolution together - or not?",
        "type": "mc",
        "tier": "2",
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
        "tier": "2",
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
        "id": "VAL-011",
        "q": "How important is it that we share the same social and political convictions?",
        "type": "scale",
        "tier": "3",
        "note": "Weights values/convictions gaps in the alignment score.",
        "guessable": true,
        "lo": "We can differ freely",
        "hi": "We need to agree"
      },
      {
        "id": "VAL-012",
        "q": "How do you feel about living together before marriage?",
        "type": "mc",
        "tier": "3",
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
  }
};
