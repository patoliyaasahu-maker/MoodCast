export type DemoUser = {
  email: string;
  displayName: string;
  anonymousAlias: string;
  city: string;
  moodCoins: number;
};

export type DemoFeedPost = {
  email: string;
  moodLabel: string;
  content: string;
  likes: number;
  helpful: number;
  saves: number;
  shares: number;
  hoursAgo?: number;
};

export type DemoRoomPost = {
  email: string;
  content: string;
  likes?: number;
  helpful?: number;
  saves?: number;
  shares?: number;
  hoursAgo?: number;
};

export type DemoRoom = {
  name: string;
  moodLabel: string;
  memberEmails: string[];
  posts: DemoRoomPost[];
};

export const DEMO_USERS: DemoUser[] = [
  { email: "demo@moodcast.app", displayName: "Aanya", anonymousAlias: "StarGazer", city: "Pune", moodCoins: 72 },
  { email: "rahul@demo.com", displayName: "Rahul", anonymousAlias: "QuietWave", city: "Pune", moodCoins: 84 },
  { email: "priya@demo.com", displayName: "Priya", anonymousAlias: "MoonLeaf", city: "Mumbai", moodCoins: 120 },
  { email: "amit@demo.com", displayName: "Amit", anonymousAlias: "SoftEcho", city: "Bangalore", moodCoins: 56 },
  { email: "sneha@demo.com", displayName: "Sneha", anonymousAlias: "CalmRiver", city: "Delhi", moodCoins: 95 },
  { email: "kiran@demo.com", displayName: "Kiran", anonymousAlias: "NightOwl", city: "Hyderabad", moodCoins: 42 },
  { email: "meera@demo.com", displayName: "Meera", anonymousAlias: "SunDust", city: "Chennai", moodCoins: 68 },
  { email: "arjun@demo.com", displayName: "Arjun", anonymousAlias: "PaperBoat", city: "Jaipur", moodCoins: 91 },
  { email: "nisha@demo.com", displayName: "Nisha", anonymousAlias: "CloudNine", city: "Kochi", moodCoins: 77 },
  { email: "vikram@demo.com", displayName: "Vikram", anonymousAlias: "IronWill", city: "Chandigarh", moodCoins: 103 },
  { email: "dia@demo.com", displayName: "Dia", anonymousAlias: "SparkPlug", city: "Ahmedabad", moodCoins: 58 },
  { email: "rohan@demo.com", displayName: "Rohan", anonymousAlias: "LaughTrack", city: "Lucknow", moodCoins: 64 },
  { email: "ananya@demo.com", displayName: "Ananya", anonymousAlias: "PageTurner", city: "Indore", moodCoins: 49 },
  { email: "kabir@demo.com", displayName: "Kabir", anonymousAlias: "DeepBreath", city: "Goa", moodCoins: 88 },
  { email: "tara@demo.com", displayName: "Tara", anonymousAlias: "GoldenHour", city: "Mysore", moodCoins: 71 },
  { email: "dev@demo.com", displayName: "Dev", anonymousAlias: "CodeWhisper", city: "Nagpur", moodCoins: 112 },
  { email: "ishita@demo.com", displayName: "Ishita", anonymousAlias: "BrightSide", city: "Bhopal", moodCoins: 53 },
  { email: "zayn@demo.com", displayName: "Zayn", anonymousAlias: "ChillPill", city: "Surat", moodCoins: 66 },
];

export const DEMO_FEED_POSTS: DemoFeedPost[] = [
  // Happy
  {
    email: "meera@demo.com",
    moodLabel: "Happy",
    content:
      "Had chai with my neighbour today. We didn't solve anything big. We just sat. Somehow the whole afternoon felt lighter after that.",
    likes: 19,
    helpful: 6,
    saves: 2,
    shares: 5,
    hoursAgo: 2,
  },
  {
    email: "dia@demo.com",
    moodLabel: "Happy",
    content: "My plant grew a new leaf and I genuinely clapped at it. Small joys count.",
    likes: 34,
    helpful: 4,
    saves: 1,
    shares: 8,
    hoursAgo: 8,
  },
  // Excited
  {
    email: "arjun@demo.com",
    moodLabel: "Excited",
    content:
      "Got the internship offer I've been refreshing my inbox for since March. Still shaking a little. Going to call my mom and cry happy tears.",
    likes: 47,
    helpful: 12,
    saves: 3,
    shares: 11,
    hoursAgo: 5,
  },
  {
    email: "dev@demo.com",
    moodLabel: "Excited",
    content:
      "Shipped my side project tonight. It's rough around the edges but it's LIVE. Twelve people signed up already. Twelve strangers believed in a thing I built.",
    likes: 52,
    helpful: 18,
    saves: 9,
    shares: 14,
    hoursAgo: 14,
  },
  // Sad
  {
    email: "amit@demo.com",
    moodLabel: "Sad",
    content:
      "Moved to a new city for work. I have colleagues but no one who'd notice if I skipped lunch. Loneliness in a crowd is a strange feeling.",
    likes: 18,
    helpful: 11,
    saves: 5,
    shares: 1,
    hoursAgo: 6,
  },
  {
    email: "kiran@demo.com",
    moodLabel: "Sad",
    content:
      "Missed my best friend's wedding because of a last-minute work trip. She said she understood. I still feel like I failed her.",
    likes: 22,
    helpful: 14,
    saves: 6,
    shares: 2,
    hoursAgo: 20,
  },
  // Motivated
  {
    email: "vikram@demo.com",
    moodLabel: "Motivated",
    content:
      "Day 21 of waking up at 6 AM. Not because I'm disciplined — because I finally admitted I want a different life than the one I was sleepwalking through.",
    likes: 41,
    helpful: 27,
    saves: 15,
    shares: 9,
    hoursAgo: 3,
  },
  {
    email: "dev@demo.com",
    moodLabel: "Motivated",
    content:
      "Productivity tip that actually worked for me: one ugly task before breakfast. Email the person you've been avoiding. Everything else feels easier after.",
    likes: 38,
    helpful: 31,
    saves: 22,
    shares: 7,
    hoursAgo: 11,
  },
  // Curious
  {
    email: "ananya@demo.com",
    moodLabel: "Curious",
    content:
      "Started learning pottery at 29. My first bowl looks like a hat. Question for the room: what's something you picked up later in life that surprised you?",
    likes: 16,
    helpful: 8,
    saves: 4,
    shares: 3,
    hoursAgo: 9,
  },
  {
    email: "zayn@demo.com",
    moodLabel: "Curious",
    content:
      "Poll-style — be honest:\nA) You overthink then do nothing\nB) You act then overthink\nC) You somehow do both at once\n\nI'm solidly C and it's exhausting.",
    likes: 29,
    helpful: 5,
    saves: 2,
    shares: 6,
    hoursAgo: 16,
  },
  // Grateful
  {
    email: "tara@demo.com",
    moodLabel: "Grateful",
    content:
      "My landlord fixed the leaky tap without me asking twice. Tiny kindness. I'm writing it down so I remember good people exist on hard days too.",
    likes: 25,
    helpful: 9,
    saves: 3,
    shares: 4,
    hoursAgo: 4,
  },
  {
    email: "nisha@demo.com",
    moodLabel: "Grateful",
    content:
      "Three years ago I couldn't get out of bed most mornings. Today I cooked for myself and washed the dishes right after. Recovery isn't linear but it is real.",
    likes: 56,
    helpful: 34,
    saves: 18,
    shares: 12,
    hoursAgo: 22,
  },
  // Funny
  {
    email: "rohan@demo.com",
    moodLabel: "Funny",
    content:
      "Told my therapist I have imposter syndrome. She said 'that's very common in your field.' I said 'I'm unemployed.' Longest silence of my life.",
    likes: 63,
    helpful: 3,
    saves: 1,
    shares: 19,
    hoursAgo: 7,
  },
  {
    email: "rohan@demo.com",
    moodLabel: "Funny",
    content:
      "Me: I'll just check one notification.\nAlso me, three hours later: deeply invested in a stranger's sourdough journey.\n\nAnyone else?",
    likes: 44,
    helpful: 2,
    saves: 0,
    shares: 11,
    hoursAgo: 18,
  },
  // Confused
  {
    email: "kiran@demo.com",
    moodLabel: "Confused",
    content:
      "Everyone keeps asking what I want to do with my life. Honestly? I want to stop pretending I have it figured out. Is that an acceptable answer?",
    likes: 14,
    helpful: 9,
    saves: 4,
    shares: 2,
    hoursAgo: 10,
  },
  {
    email: "ishita@demo.com",
    moodLabel: "Confused",
    content:
      "Got praise and criticism in the same meeting. Left feeling like Schrödinger's employee — simultaneously doing great and failing. How do you process mixed signals?",
    likes: 21,
    helpful: 13,
    saves: 5,
    shares: 1,
    hoursAgo: 15,
  },
  // Celebrating
  {
    email: "sneha@demo.com",
    moodLabel: "Celebrating",
    content:
      "PAID OFF MY STUDENT LOAN. Not a typo. Five years of rice-and-dal dinners and saying no to trips. I'm going to ugly-cry in my car and I'm not ashamed.",
    likes: 71,
    helpful: 19,
    saves: 8,
    shares: 16,
    hoursAgo: 1,
  },
  {
    email: "arjun@demo.com",
    moodLabel: "Celebrating",
    content:
      "Team hit our quarterly target. Boss ordered pizza. I ordered extra garlic dip. We earned every bite.",
    likes: 28,
    helpful: 6,
    saves: 1,
    shares: 5,
    hoursAgo: 12,
  },
  // Nostalgic
  {
    email: "tara@demo.com",
    moodLabel: "Nostalgic",
    content:
      "Found my old diary from college. I wrote 'one day I'll be brave.' Past me would be proud I showed up here tonight instead of scrolling alone.",
    likes: 33,
    helpful: 15,
    saves: 7,
    shares: 6,
    hoursAgo: 13,
  },
  {
    email: "ananya@demo.com",
    moodLabel: "Nostalgic",
    content:
      "Rain today smelled like my grandmother's balcony. She used to dry mangoes there every summer. Grief and warmth can share the same minute.",
    likes: 27,
    helpful: 11,
    saves: 6,
    shares: 3,
    hoursAgo: 24,
  },
  // Relaxed
  {
    email: "zayn@demo.com",
    moodLabel: "Relaxed",
    content:
      "Sunday rule: no plans before noon, no guilt after. Currently on my third cup of filter coffee and a book I don't have to finish.",
    likes: 22,
    helpful: 7,
    saves: 5,
    shares: 2,
    hoursAgo: 6,
  },
  {
    email: "kabir@demo.com",
    moodLabel: "Relaxed",
    content:
      "Took a walk without headphones for once. Heard birds, a kid laughing, someone practicing tabla badly. Best soundtrack I've had in months.",
    likes: 18,
    helpful: 8,
    saves: 4,
    shares: 1,
    hoursAgo: 19,
  },
  // Inspirational
  {
    email: "nisha@demo.com",
    moodLabel: "Inspirational",
    content:
      "You don't need to have a breakdown to deserve rest. You don't need to earn kindness. You don't need permission to start over on a random Tuesday.",
    likes: 89,
    helpful: 52,
    saves: 41,
    shares: 23,
    hoursAgo: 5,
  },
  {
    email: "vikram@demo.com",
    moodLabel: "Inspirational",
    content:
      "Success story, no flex: failed my first two startups. Third one is breakeven. The lesson wasn't 'never give up' — it was 'change the plan, not the purpose.'",
    likes: 45,
    helpful: 33,
    saves: 19,
    shares: 10,
    hoursAgo: 17,
  },
  // Platform core moods (Stressed, Anxious, Hopeful, Tired, Angry)
  {
    email: "rahul@demo.com",
    moodLabel: "Stressed",
    content:
      "Deadline moved up again. I haven't slept properly in three days but everyone expects me to be cheerful in meetings. Anyone else performing okay-ness at work?",
    likes: 12,
    helpful: 8,
    saves: 3,
    shares: 2,
    hoursAgo: 3,
  },
  {
    email: "priya@demo.com",
    moodLabel: "Anxious",
    content:
      "3 AM again. My brain is running scenarios that will never happen. I know logically I'm fine. My body doesn't believe me.",
    likes: 24,
    helpful: 15,
    saves: 6,
    shares: 4,
    hoursAgo: 8,
  },
  {
    email: "sneha@demo.com",
    moodLabel: "Hopeful",
    content:
      "Small win today: I told my friend I wasn't okay instead of saying 'I'm fine.' She just listened. No advice. That was enough.",
    likes: 31,
    helpful: 22,
    saves: 9,
    shares: 7,
    hoursAgo: 4,
  },
  {
    email: "priya@demo.com",
    moodLabel: "Tired",
    content:
      "Burnout isn't always dramatic. Sometimes it's answering 'how are you' with 'tired' for six months straight and meaning it every time.",
    likes: 27,
    helpful: 19,
    saves: 8,
    shares: 3,
    hoursAgo: 21,
  },
  {
    email: "dia@demo.com",
    moodLabel: "Angry",
    content:
      "Got talked over in a meeting again. Smiled like always. Went to the bathroom and screamed into my scarf. Not my finest moment but at least I didn't quit on the spot.",
    likes: 15,
    helpful: 10,
    saves: 2,
    shares: 1,
    hoursAgo: 11,
  },
  // Daily life & community mix
  {
    email: "ishita@demo.com",
    moodLabel: "Happy",
    content: "Daily update: laundry done, inbox zero (for now), called my sister. Adulting score: 7/10.",
    likes: 11,
    helpful: 3,
    saves: 1,
    shares: 0,
    hoursAgo: 7,
  },
  {
    email: "kabir@demo.com",
    moodLabel: "Motivated",
    content:
      "Community question: what's one habit that took you less than 10 minutes but changed your mornings? I'll start — making the bed. Sounds silly. Works anyway.",
    likes: 20,
    helpful: 16,
    saves: 11,
    shares: 4,
    hoursAgo: 9,
  },
  {
    email: "meera@demo.com",
    moodLabel: "Funny",
    content:
      "My smart speaker played sad songs because it 'detected my mood.' Bro, I was just eating silently. Even the robots are concerned.",
    likes: 37,
    helpful: 2,
    saves: 0,
    shares: 8,
    hoursAgo: 14,
  },
  {
    email: "dev@demo.com",
    moodLabel: "Curious",
    content:
      "Achievement post: finished a 30-day coding streak. Not every day was productive — some days I just opened the editor and closed it. Still counts.",
    likes: 26,
    helpful: 14,
    saves: 7,
    shares: 5,
    hoursAgo: 23,
  },
  {
    email: "demo@moodcast.app",
    moodLabel: "Grateful",
    content:
      "First time posting here. Nervous but glad this space exists. Thanks to everyone sharing honestly — it makes showing up feel less scary.",
    likes: 14,
    helpful: 9,
    saves: 3,
    shares: 2,
    hoursAgo: 2,
  },
];

export const DEMO_ROOMS: DemoRoom[] = [
  {
    name: "Sunny Happy Lounge",
    moodLabel: "Happy",
    memberEmails: ["meera@demo.com", "dia@demo.com", "ishita@demo.com", "demo@moodcast.app"],
    posts: [
      {
        email: "dia@demo.com",
        content: "Good morning room ☀️ Who else got unexpected good news this week?",
        likes: 6,
        helpful: 2,
        hoursAgo: 1,
      },
      {
        email: "meera@demo.com",
        content:
          "My cousin sent a voice note just saying 'proud of you' with no context. I listened to it four times. Small things hit different.",
        likes: 9,
        helpful: 4,
        hoursAgo: 3,
      },
      {
        email: "ishita@demo.com",
        content: "Short post: smiled at a stranger. They smiled back. World still works sometimes.",
        likes: 4,
        helpful: 1,
        hoursAgo: 5,
      },
    ],
  },
  {
    name: "Buzz Excited Circle",
    moodLabel: "Excited",
    memberEmails: ["arjun@demo.com", "dev@demo.com", "dia@demo.com", "vikram@demo.com"],
    posts: [
      {
        email: "arjun@demo.com",
        content: "Interview went well!! Waiting for the call back. Can't sit still. Send good vibes 🎉",
        likes: 12,
        helpful: 3,
        hoursAgo: 2,
      },
      {
        email: "dev@demo.com",
        content:
          "Long post alert: I've been building in public for 90 days. Today someone said my tool saved them an hour a week. One hour × their team = worth every late night.",
        likes: 18,
        helpful: 11,
        saves: 5,
        hoursAgo: 4,
      },
    ],
  },
  {
    name: "Quiet Sad Harbor",
    moodLabel: "Sad",
    memberEmails: ["amit@demo.com", "kiran@demo.com", "tara@demo.com", "priya@demo.com"],
    posts: [
      {
        email: "amit@demo.com",
        content: "Does anyone else feel fine at work and then completely empty the moment they're alone?",
        likes: 8,
        helpful: 6,
        hoursAgo: 2,
      },
      {
        email: "tara@demo.com",
        content:
          "Not looking for fixes. Just needed to say: today was heavy. If you're here too, you're not the only one sitting with it.",
        likes: 11,
        helpful: 9,
        hoursAgo: 6,
      },
      {
        email: "kiran@demo.com",
        content: "Cried in the shower so my roommate wouldn't hear. Then ordered samosas. Both helped a little.",
        likes: 7,
        helpful: 5,
        hoursAgo: 8,
      },
    ],
  },
  {
    name: "Forward Motivated Hub",
    moodLabel: "Motivated",
    memberEmails: ["vikram@demo.com", "dev@demo.com", "nisha@demo.com", "sneha@demo.com"],
    posts: [
      {
        email: "vikram@demo.com",
        content: "Tip: block 25 minutes for the ONE thing you've been avoiding. Timer on. Phone in another room. Report back.",
        likes: 14,
        helpful: 12,
        saves: 8,
        hoursAgo: 1,
      },
      {
        email: "nisha@demo.com",
        content:
          "Success story: applied for a role I thought was 'too senior.' Got the second round. Your ceiling might be imaginary.",
        likes: 16,
        helpful: 10,
        hoursAgo: 4,
      },
    ],
  },
  {
    name: "Open Curious Corner",
    moodLabel: "Curious",
    memberEmails: ["ananya@demo.com", "zayn@demo.com", "kabir@demo.com", "dev@demo.com"],
    posts: [
      {
        email: "ananya@demo.com",
        content: "Question: if you could master one skill in a month, no effort limit — what would you pick?",
        likes: 5,
        helpful: 3,
        hoursAgo: 3,
      },
      {
        email: "zayn@demo.com",
        content:
          "I've been reading about sleep science for fun. Wild fact: your brain cleans itself during deep sleep. Now I feel guilty for every all-nighter.",
        likes: 8,
        helpful: 6,
        saves: 4,
        hoursAgo: 7,
      },
    ],
  },
  {
    name: "Warm Grateful Room",
    moodLabel: "Grateful",
    memberEmails: ["tara@demo.com", "nisha@demo.com", "meera@demo.com", "demo@moodcast.app"],
    posts: [
      {
        email: "nisha@demo.com",
        content: "Grateful for hot water, working wifi, and a friend who replies 'I'm here' at midnight.",
        likes: 10,
        helpful: 7,
        hoursAgo: 2,
      },
      {
        email: "tara@demo.com",
        content:
          "Long-form: I kept a 'good things' list for a week. Entry 4 was 'stranger held the elevator.' Entry 9 was 'I forgave myself.' Try it.",
        likes: 13,
        helpful: 11,
        saves: 6,
        hoursAgo: 5,
      },
    ],
  },
  {
    name: "Laugh Track Lounge",
    moodLabel: "Funny",
    memberEmails: ["rohan@demo.com", "meera@demo.com", "dia@demo.com", "zayn@demo.com"],
    posts: [
      {
        email: "rohan@demo.com",
        content: "Ordered 'medium spice' at a new place. My tongue filed a formal complaint.",
        likes: 15,
        helpful: 1,
        hoursAgo: 1,
      },
      {
        email: "meera@demo.com",
        content:
          "Meme energy text post: 'I'm not procrastinating, I'm doing aggressive rest with strategic denial.'",
        likes: 11,
        helpful: 0,
        shares: 3,
        hoursAgo: 4,
      },
      {
        email: "zayn@demo.com",
        content: "Accidentally joined a video call with a filter on. Was a potato for 40 seconds before anyone said anything.",
        likes: 19,
        helpful: 2,
        hoursAgo: 6,
      },
    ],
  },
  {
    name: "Soft Confused Space",
    moodLabel: "Confused",
    memberEmails: ["kiran@demo.com", "ishita@demo.com", "amit@demo.com", "ananya@demo.com"],
    posts: [
      {
        email: "ishita@demo.com",
        content: "Is it normal to want change and fear it in the same breath? Asking for a friend (it's me).",
        likes: 9,
        helpful: 7,
        hoursAgo: 2,
      },
      {
        email: "kiran@demo.com",
        content:
          "Parents want stability. I want meaning. We use the same words but mean different things. How do you talk across that gap?",
        likes: 6,
        helpful: 5,
        hoursAgo: 5,
      },
    ],
  },
  {
    name: "Party Celebrating Room",
    moodLabel: "Celebrating",
    memberEmails: ["sneha@demo.com", "arjun@demo.com", "vikram@demo.com", "nisha@demo.com"],
    posts: [
      {
        email: "sneha@demo.com",
        content: "PROMOTION DAY 🥳 Still shaking. Thank you to everyone who listened to me vent in the Sad room last month.",
        likes: 22,
        helpful: 8,
        hoursAgo: 1,
      },
      {
        email: "arjun@demo.com",
        content: "Celebrating finishing my thesis draft. It's ugly but it's DONE. Drinks on me (metaphorically).",
        likes: 14,
        helpful: 5,
        hoursAgo: 3,
      },
    ],
  },
  {
    name: "Golden Nostalgic Room",
    moodLabel: "Nostalgic",
    memberEmails: ["tara@demo.com", "ananya@demo.com", "kabir@demo.com", "priya@demo.com"],
    posts: [
      {
        email: "ananya@demo.com",
        content: "Old playlist from 2016 hit shuffle today. Suddenly I was 19 again, on a local train, believing everything would work out.",
        likes: 8,
        helpful: 4,
        hoursAgo: 4,
      },
      {
        email: "kabir@demo.com",
        content:
          "Found photos of my old dog. He's been gone two years. Still set an extra place mentally sometimes. Grief is love with nowhere to go.",
        likes: 12,
        helpful: 9,
        hoursAgo: 7,
      },
    ],
  },
  {
    name: "Slow Relaxed Cafe",
    moodLabel: "Relaxed",
    memberEmails: ["zayn@demo.com", "kabir@demo.com", "tara@demo.com", "demo@moodcast.app"],
    posts: [
      {
        email: "zayn@demo.com",
        content: "No agenda today. Just breathing. If you're rushing, this is your permission slip to pause.",
        likes: 7,
        helpful: 5,
        hoursAgo: 2,
      },
      {
        email: "kabir@demo.com",
        content: "Daily update: did yoga badly, ate well, ignored one stressful email. Calling it a win.",
        likes: 6,
        helpful: 4,
        hoursAgo: 6,
      },
    ],
  },
  {
    name: "Bright Inspirational Hall",
    moodLabel: "Inspirational",
    memberEmails: ["nisha@demo.com", "vikram@demo.com", "sneha@demo.com", "dev@demo.com"],
    posts: [
      {
        email: "nisha@demo.com",
        content:
          "Motivational message: the version of you that gave up doesn't get to write the ending. You're still here. Still typing. That matters.",
        likes: 20,
        helpful: 15,
        saves: 10,
        hoursAgo: 1,
      },
      {
        email: "vikram@demo.com",
        content:
          "Advice post: compare yourself to who you were last year, not to someone's highlight reel. I needed to hear this so I'm saying it loud.",
        likes: 17,
        helpful: 14,
        saves: 9,
        hoursAgo: 4,
      },
      {
        email: "dev@demo.com",
        content: "Achievement: helped a junior dev debug for an hour. They said 'you made me feel less stupid.' Best compliment I've got all year.",
        likes: 13,
        helpful: 11,
        hoursAgo: 8,
      },
    ],
  },
  // Core platform mood rooms
  {
    name: "Quiet Stressed Room",
    moodLabel: "Stressed",
    memberEmails: ["rahul@demo.com", "kiran@demo.com", "amit@demo.com", "ishita@demo.com"],
    posts: [
      {
        email: "rahul@demo.com",
        content:
          "Deadline moved up again. Haven't slept properly in three days but everyone expects cheerfulness in meetings.",
        likes: 5,
        helpful: 3,
        hoursAgo: 2,
      },
      {
        email: "kiran@demo.com",
        content: "Parents keep comparing me to my cousin. I'm 26 and still feel like I'm failing an invisible test.",
        likes: 2,
        helpful: 4,
        hoursAgo: 5,
      },
    ],
  },
  {
    name: "Gentle Anxious Room",
    moodLabel: "Anxious",
    memberEmails: ["priya@demo.com", "meera@demo.com", "sneha@demo.com", "amit@demo.com"],
    posts: [
      {
        email: "priya@demo.com",
        content: "Presentation in 2 hours. Rehearsed 12 times. Heart still racing like I forgot how to breathe.",
        likes: 8,
        helpful: 6,
        hoursAgo: 1,
      },
      {
        email: "sneha@demo.com",
        content: "Does anyone else replay conversations from years ago at 1 AM? Just me? Cool.",
        likes: 11,
        helpful: 2,
        hoursAgo: 4,
      },
    ],
  },
  {
    name: "Warm Hopeful Room",
    moodLabel: "Hopeful",
    memberEmails: ["sneha@demo.com", "amit@demo.com", "demo@moodcast.app", "nisha@demo.com"],
    posts: [
      {
        email: "amit@demo.com",
        content: "Applied for a job I actually want, not one I think I deserve. Small step. Feels huge.",
        likes: 15,
        helpful: 10,
        hoursAgo: 3,
      },
      {
        email: "nisha@demo.com",
        content: "Tomorrow isn't guaranteed but tonight I choose hope. Cheap? Maybe. Keeping me alive? Yes.",
        likes: 9,
        helpful: 7,
        hoursAgo: 6,
      },
    ],
  },
];

export const DEMO_LOGIN_ACCOUNTS = [
  { email: "demo@moodcast.app", alias: "StarGazer" },
  { email: "rahul@demo.com", alias: "QuietWave" },
  { email: "priya@demo.com", alias: "MoonLeaf" },
  { email: "sneha@demo.com", alias: "CalmRiver" },
  { email: "rohan@demo.com", alias: "LaughTrack" },
  { email: "nisha@demo.com", alias: "CloudNine" },
];
