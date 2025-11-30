// lib/data/units.ts
import { Unit } from "@/lib/types/language";
import { QuizQuestion } from "@/lib/types/quiz";

export const UNITS_DATA: Unit[] = [
  {
    unitId: "unit_1_introduction",
    title: "Introduction",
    lessons: [
      {
        id: "l1",
        title: "Casual Workplace Greetings",
        phrase: "Hey! How's it going?",
        phraseMeaning: "Yeh ek casual aur friendly tarika hai kisi ko greet karne ka aur puchhne ka ki woh kaise hain. Office mein colleagues ke saath daily use karte hain.",
        script:
          "Let's learn a friendly way to greet colleagues at work. 'Hey! How's it going?' is perfect for casual workplace conversations. It's warm, natural, and shows you care. Use it when you meet teammates in the morning or during breaks. Now practice saying it with a smile: 'Hey! How's it going?'",
        phraseExplanations: [
          { phrase: "'Hey!'", explanation: "is a casual, friendly greeting perfect for colleagues and team members you work with regularly." },
          { phrase: "'How's it going?'", explanation: "is an informal way to ask 'How are you?' — very common in professional yet relaxed environments like tech offices." }
        ],
        cueQuestion: {
          question:
            "Your colleague says: 'Hey! How's it going?' Choose the best reply:",
          options: [
            "I'm going to the meeting room.",
            "Good, thanks! How about you?",
            "Please repeat that.",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "Hey! How's it going?" },
          { speaker: "B", text: "Good, thanks! How about you?" },
          { speaker: "A", text: "Pretty good! Just finished that report." },
          { speaker: "B", text: "Nice! Want to grab coffee?" },
        ],
        imageUrl: "https://files.catbox.moe/mlbctf.png",
        duration: "5 min",
        category: "Conversation",
        subtitle: "Office colleagues ke saath friendly aur professional greetings ke liye perfect phrase.",
      },
      {
        id: "l2",
        title: "Professional Introduction at Work",
        phrase: "Nice to meet you.",
        phraseMeaning: "Yeh ek polite aur professional phrase hai jo first time kisi se milne par use kiya jaata hai. Office, interviews, aur meetings mein zaroor use karein.",
        script:
          "When meeting someone for the first time at work, this phrase creates a great impression: 'Nice to meet you.' It's polite, professional, and universally accepted. Always pair it with eye contact and a firm handshake. You can also add their name to make it more personal: 'Nice to meet you, [Name].' Now practice: 'Nice to meet you.'",
        phraseExplanations: [
          { phrase: "'Nice to meet you'", explanation: "is the standard professional greeting when meeting someone for the first time — shows respect and courtesy." },
          { phrase: "Adding their name", explanation: "like 'Nice to meet you, Priya' makes it more personal and helps you remember their name." }
        ],
        cueQuestion: {
          question: "A new team member says: 'I'm Rohan, I just joined the marketing team.' What's the best response?",
          options: [
            "Okay, continue working.",
            "Nice to meet you, Rohan. Welcome to the team!",
            "Where is your desk?",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "Hi! I'm Rohan, the new software developer." },
          { speaker: "B", text: "Nice to meet you, Rohan. I'm Priya from the design team." },
          { speaker: "A", text: "Nice to meet you too, Priya!" },
          { speaker: "B", text: "If you need any help settling in, just let me know." },
        ],
        imageUrl: "https://files.catbox.moe/db1o37.png",
        duration: "5 min",
        category: "Introduction",
        subtitle: "Naye colleagues aur clients se milte waqt professional impression banane ka perfect tarika.",
      },
      {
        id: "l3",
        title: "Building Connections Through Background",
        phrase: "Where are you from?",
        phraseMeaning: "Iska use kisi ke origin ya hometown ke baare mein puchhne ke liye kiya jaata hai. Yeh conversation ko natural aur personal banana mein madad karta hai.",
        script:
          "Want to build rapport with colleagues? Ask about their background: 'Where are you from?' This simple question shows genuine interest and helps create connections. When answering, share your city proudly: 'I'm from [City].' You can add more context like 'but I've been in [current city] for work.' Now practice asking: 'Where are you from?'",
        phraseExplanations: [
          { phrase: "'Where are you from?'", explanation: "is a friendly way to ask about someone's hometown or origin — great for small talk and building connections." },
          { phrase: "'I'm from...'", explanation: "is the standard response structure. You can add more details like 'originally from' or 'but I grew up in' for richer conversation." }
        ],
        cueQuestion: {
          question:
            "During lunch break, someone asks: 'Where are you from?' Which is the most natural reply?",
          options: ["Bihar my hometown.", "I'm from Bihar, but I've been working here for a year.", "From Bihar I am coming."],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "So, where are you from originally?" },
          { speaker: "B", text: "I'm from Bihar. What about you?" },
          { speaker: "A", text: "I'm from Mumbai. How are you finding it here?" },
          { speaker: "B", text: "It's great! The team is really welcoming." },
        ],
        imageUrl: "https://files.catbox.moe/a3x1wb.png",
        duration: "5 min",
        category: "Introduction",
        subtitle: "Naye colleagues ke saath personal connection banane ka simple aur effective tarika.",
      },
      {
        id: "l4",
        title: "Discussing Your Professional Role",
        phrase: "What do you do?",
        phraseMeaning: "Yeh ek common question hai kisi ke job ya profession ke baare mein puchhne ke liye. Networking aur professional introductions mein bahut useful hai.",
        script:
          "In professional settings, people often ask: 'What do you do?' This is the standard way to ask about someone's job or role. Your answer should be clear and confident: 'I work in [field]' or 'I'm a [job title].' Add a brief detail to make it memorable: 'I'm a software developer specializing in mobile apps.' Practice your answer: 'I work in...' or 'I'm a...'",
        phraseExplanations: [
          { phrase: "'What do you do?'", explanation: "is the standard way to ask about someone's profession or job role in English." },
          { phrase: "'I work in...'", explanation: "is perfect when talking about your field (e.g., 'I work in technology')" },
          { phrase: "'I'm a...'", explanation: "is best when stating your specific role (e.g., 'I'm a software engineer')" }
        ],
        cueQuestion: {
          question: "At a networking event, someone asks: 'What do you do?' Which response sounds most professional?",
          options: ["Doing software job.", "I'm a software developer at a tech startup.", "Work I do in computers."],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "So, what do you do?" },
          { speaker: "B", text: "I'm a business analyst at an IT company. What about you?" },
          { speaker: "A", text: "I work in digital marketing. How long have you been in that role?" },
          { speaker: "B", text: "About two years now. I really enjoy the data analysis part." },
        ],
        imageUrl: "https://files.catbox.moe/ygx3lv.png",
        duration: "5 min",
        category: "Professional",
        subtitle: "Apne profession ke baare mein confidently baat karke strong professional image banayein.",
      },
      {
        id: "l5",
        title: "Connecting Through Interests",
        phrase: "What do you like to do in your free time?",
        phraseMeaning: "Iska use kisi ke interests aur free-time activities ke baare mein puchhne ke liye hota hai. Yeh casual conversations ko interesting banata hai.",
        script:
          "Building friendships at work means sharing interests. Instead of the formal 'What are your hobbies?', try the more natural: 'What do you like to do in your free time?' or simply 'What do you do for fun?' Answer naturally: 'I enjoy [activity]' or 'I love [hobby].' You can add why you like it to keep the conversation flowing. Practice: 'What do you like to do in your free time?'",
        phraseExplanations: [
          { phrase: "'What do you like to do in your free time?'", explanation: "is a natural, conversational way to ask about hobbies — more relaxed than 'What are your hobbies?'" },
          { phrase: "'I enjoy...' or 'I love...'", explanation: "are natural ways to share your interests and show enthusiasm about your hobbies." }
        ],
        cueQuestion: {
          question:
            "During team lunch, someone asks: 'What do you do for fun?' Choose the most natural reply:",
          options: [
            "Hobby cricket my interest.",
            "I enjoy playing cricket on weekends. It's a great stress-buster!",
            "I am cricket player.",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "So, what do you like to do in your free time?" },
          { speaker: "B", text: "I enjoy reading and playing music. What about you?" },
          { speaker: "A", text: "I love hiking and photography. Helps me unwind after work." },
          { speaker: "B", text: "That sounds great! We should plan a team outing sometime." },
        ],
        imageUrl: "https://files.catbox.moe/rcifli.png",
        duration: "5 min",
        category: "Personal",
        subtitle: "Colleagues ke saath personal bonds banane ke liye apne interests share karein.",
      },
      {
        id: "l6",
        title: "Requesting Help Professionally",
        phrase: "Could you help me with this?",
        phraseMeaning: "Yeh ek polite aur professional tarika hai workplace mein help maangne ka. 'Could' use karne se aur zyada respectful lagta hai.",
        script:
          "Asking for help confidently is a crucial workplace skill. Use: 'Could you help me with this?' or 'Would you mind helping me with [task]?' These phrases are polite and professional. Always specify what you need help with: 'Could you help me understand this report?' or 'Would you mind reviewing my presentation?' Being specific shows respect for their time. Practice: 'Could you help me with this?'",
        phraseExplanations: [
          { phrase: "'Could you help me with...'", explanation: "is a polite, professional way to request assistance — 'could' is more formal than 'can'" },
          { phrase: "'Would you mind helping me with...'", explanation: "is an even more polite alternative, perfect for senior colleagues or busy situations" },
          { phrase: "Be specific", explanation: "always say what you need help with — it shows you value their time and makes it easier for them to assist" }
        ],
        cueQuestion: {
          question:
            "You're stuck on a task and need your senior's help. What's the most professional approach?",
          options: [
            "Do this work for me.",
            "Could you help me understand this analysis? I'm having trouble with the formulas.",
            "Come here and help now.",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "Hey, could you help me with this client proposal?" },
          { speaker: "B", text: "Sure! What do you need?" },
          { speaker: "A", text: "I'm not sure how to structure the pricing section. Could you review it?" },
          { speaker: "B", text: "Of course. Let me take a look. Have you tried the template we used last time?" },
          { speaker: "A", text: "Oh, I didn't know there was a template. That would really help!" },
        ],
        imageUrl: "https://files.catbox.moe/ygx3lv.png",
        duration: "5 min",
        category: "Workplace",
        subtitle: "Office mein confident aur professional tarike se help maangna seekhein.",
      },
      {
        id: "l7",
        title: "Buying Time Professionally",
        phrase: "I'll get back to you on that.",
        phraseMeaning: "Jab aapko answer dhoondhne ya decision lene ke liye time chahiye tab use karein. Yeh professional lagta hai aur better than saying 'I don't know'.",
        script:
          "Don't know the answer? Don't panic! Use this professional phrase: 'I'll get back to you on that.' It shows you're responsible and thorough. You can add a timeframe to be more specific: 'I'll get back to you by end of day' or 'Let me check and get back to you.' This is much better than saying 'I don't know' or guessing. It shows professionalism and commitment. Practice: 'I'll get back to you on that.'",
        phraseExplanations: [
          { phrase: "'I'll get back to you on that'", explanation: "means you'll research and provide an answer later — shows responsibility and professionalism" },
          { phrase: "Add a timeframe", explanation: "like 'by tomorrow' or 'in an hour' to set clear expectations and build trust" },
          { phrase: "Alternative phrases", explanation: "'Let me check and get back to you' or 'I'll look into that and follow up' work equally well" }
        ],
        cueQuestion: {
          question:
            "Your manager asks: 'What's the status of the client feedback?' but you haven't checked yet. What's the best response?",
          options: [
            "I don't know anything about it.",
            "Let me check the latest updates and get back to you within an hour.",
            "Ask the team lead instead.",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "When can you complete the testing phase?" },
          { speaker: "B", text: "Let me review the remaining tasks and dependencies. I'll get back to you by tomorrow morning." },
          { speaker: "A", text: "Perfect. That gives me time to plan the next sprint." },
          { speaker: "B", text: "I'll send you a detailed timeline via email." },
          { speaker: "A", text: "Great, thanks for being thorough!" },
        ],
        imageUrl: "https://files.catbox.moe/wectjq.png",
        duration: "5 min",
        category: "Workplace",
        subtitle: "Jab aapko information verify karni ho tab professionally time maangna seekhein.",
      },
    ],
    finalQuiz: {
      id: "unit_1_final_quiz",
      totalQuestions: 8,
      questions: [
        // Q1: Listening Comprehension - Casual Greeting (tests L1)
        {
          id: 1,
          type: "listening",
          question: "Listen carefully and choose the best response:",
          audio: "Hey! How's it going?",
          options: [
            "I'm going to the meeting room.",
            "Good, thanks! How about you?",
            "Nice to meet you.",
          ],
          correct: 1,
          correctFeedback: "Perfect! 'Good, thanks! How about you?' is the natural response to a casual workplace greeting.",
          incorrectFeedback: "Remember: 'How's it going?' means 'How are you?' - it's asking about how you are, not where you're going!",
        },
        // Q2: Context Recognition - First Meeting (tests L2)
        {
          id: 2,
          type: "context",
          question: "Choose the most appropriate response for this situation:",
          scenario: "A new colleague says: 'Hi! I'm Arjun, I just joined the sales team.'",
          options: [
            "Okay, continue your work.",
            "Nice to meet you, Arjun. Welcome to the team!",
            "Hey! What's up?",
          ],
          correct: 1,
          correctFeedback: "Excellent! Adding their name and a welcoming phrase makes the introduction warm and professional.",
          incorrectFeedback: "When meeting someone for the first time, use 'Nice to meet you' with their name to make a great impression.",
        },
        // Q3: Comprehension - Background Questions (tests L3)
        {
          id: 3,
          type: "comprehension",
          question: "During lunch, a colleague asks: 'Where are you from?' What's the best way to respond?",
          sentence: "This question is asking about your hometown or place of origin.",
          options: [
            "From Bangalore I am.",
            "Bangalore my city.",
            "I'm from Bangalore, but I've been working here for two years.",
            "I live in office.",
          ],
          correct: 2,
          correctFeedback: "Great! This response is natural and adds context, making the conversation more engaging.",
          incorrectFeedback: "Use 'I'm from [city]' and consider adding more context like 'but I've been here for...' to keep the conversation flowing.",
        },
        // Q4: Professional Role Discussion (tests L4)
        {
          id: 4,
          type: "listening",
          question: "Listen and select the best answer to the question:",
          audio: "What do you do?",
          options: [
            "I'm from the technology field.",
            "I'm a software developer at a fintech startup.",
            "My hobby is coding.",
          ],
          correct: 1,
          correctFeedback: "Perfect! This answer is specific, professional, and gives clear information about your role.",
          incorrectFeedback: "'What do you do?' asks about your job role. Answer with 'I'm a [job title]' or 'I work in [field]'.",
        },
        // Q5: Personal Interests (tests L5)
        {
          id: 5,
          type: "context",
          question: "Choose the most natural response to this question:",
          scenario: "During a team outing, someone asks: 'What do you like to do in your free time?'",
          options: [
            "Hobby reading my.",
            "I enjoy reading and playing badminton. It helps me relax after work.",
            "I am reader.",
          ],
          correct: 1,
          correctFeedback: "Excellent! This response is natural and adds why you enjoy it, which keeps the conversation flowing.",
          incorrectFeedback: "Use 'I enjoy...' or 'I love...' and add a brief reason to make your answer more engaging.",
        },
        // Q6: Asking for Help (tests L6)
        {
          id: 6,
          type: "context",
          question: "You're stuck on a project. What's the most professional way to ask for help?",
          scenario: "You need your senior colleague's guidance on a complex analysis.",
          options: [
            "Do this for me please.",
            "Could you help me understand this analysis? I'm having trouble with the formulas.",
            "Come here now and help.",
          ],
          correct: 1,
          correctFeedback: "Perfect! This is polite, specific about what you need, and shows respect for their time.",
          incorrectFeedback: "Use 'Could you help me with...' and be specific about what you need. This shows professionalism and respect.",
        },
        // Q7: Professional Response (tests L7)
        {
          id: 7,
          type: "context",
          question: "Your manager asks: 'What's the deadline status?' but you need to check. What should you say?",
          scenario: "You haven't reviewed the latest project timeline yet.",
          options: [
            "I don't know anything.",
            "Let me review the timeline and get back to you within an hour.",
            "Ask the project lead.",
          ],
          correct: 1,
          correctFeedback: "Great! This shows responsibility and professionalism by setting a clear timeframe.",
          incorrectFeedback: "Use 'I'll get back to you' or 'Let me check and get back to you' with a timeframe. Never say 'I don't know' in professional settings.",
        },
        // Q8: Speaking Practice - Integration of All Lessons
        {
          id: 8,
          type: "speaking",
          question: "Practice your workplace communication skills!",
          prompt: "Choose ONE scenario and speak the appropriate phrase clearly:",
          options: [
            "Greet a colleague casually: 'Hey! How's it going?'",
            "Request help professionally: 'Could you help me with this report?'",
            "Buy time professionally: 'Let me check and get back to you by tomorrow.'",
          ],
        },
      ] as QuizQuestion[],
    },
  },
];
