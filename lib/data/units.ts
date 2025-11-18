// lib/data/units.ts
import { Unit } from "@/lib/types/language";

export const UNITS_DATA: Unit[] = [
  {
    unitId: "unit_1_introduction",
    title: "Introduction",
    lessons: [
      {
        id: "l1",
        title: "Casual Greetings",
        phrase: "Hey! How's it going?",
        phraseMeaning: "A casual, friendly way to greet someone and ask how they are doing.",
        script:
          "Let's learn a friendly way to greet people at work or with friends. Say: 'Hey! How's it going?' It's a simple, casual 'How are you?' Now try it — say: 'Hey! How's it going?'",
        phraseExplanations: [
          { phrase: "'Hey!'", explanation: "is a casual, friendly greeting used with friends and colleagues." },
          { phrase: "'How's it going?'", explanation: "is an informal way to ask 'How are you?' — common in everyday conversation." }
        ],
        cueQuestion: {
          question:
            "Your friend says: 'Hey! How's it going?' Choose the best reply:",
          options: [
            "I'm going to the shop.",
            "Good, thanks! How about you?",
            "Repeat again.",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "Hey! How's it going?" },
          { speaker: "B", text: "Good, thanks! How about you?" },
          { speaker: "A", text: "I'm good too!" },
        ],
      },
      {
        id: "l2",
        title: "First Meeting",
        phrase: "Nice to meet you.",
        phraseMeaning: "A polite phrase used when meeting someone for the first time.",
        script:
          "When you meet someone for the first time, use this polite phrase: 'Nice to meet you.' Say it with a smile to sound confident. Now try it — say: 'Nice to meet you.'",
        cueQuestion: {
          question: "Someone says: 'I'm Rohan.' What should you say?",
          options: [
            "Okay, go on.",
            "Nice to meet you, Rohan.",
            "Where are you going?",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "I'm Rohan." },
          { speaker: "B", text: "Nice to meet you, Rohan." },
          { speaker: "A", text: "Nice to meet you too!" },
        ],
      },
      {
        id: "l3",
        title: "Asking Origin",
        phrase: "Where are you from?",
        phraseMeaning: "Used to ask about someone's origin or hometown.",
        script:
          "This is a very common introduction question. Ask: 'Where are you from?' To answer, say: 'I'm from Bihar.' Now try it — say: 'I'm from Bihar.'",
        cueQuestion: {
          question:
            "Someone asks: 'Where are you from?' Which answer is natural?",
          options: ["Bihar my.", "I'm from Bihar.", "From Bihar I."],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "Where are you from?" },
          { speaker: "B", text: "I'm from Bihar. What about you?" },
          { speaker: "A", text: "I'm from Delhi." },
        ],
      },
      {
        id: "l4",
        title: "Talking About Work",
        phrase: "What do you do?",
        phraseMeaning: "A common question to ask about someone's job or profession.",
        script:
          "To talk about your job or studies, use this question: 'What do you do?' A natural answer is: 'I'm a student' or 'I work in IT.' Now try it — say: 'I'm a student.'",
        cueQuestion: {
          question: "Someone asks: 'What do you do?' Choose the correct reply:",
          options: ["Doing job.", "I'm a student.", "Work I doing."],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "What do you do?" },
          { speaker: "B", text: "I'm a student. And you?" },
          { speaker: "A", text: "I work in marketing." },
        ],
      },
      {
        id: "l5",
        title: "Interests & Hobbies",
        phrase: "What are your hobbies?",
        phraseMeaning: "Used to ask about someone's interests and free-time activities.",
        script:
          "When you want to know someone better, ask: 'What are your hobbies?' To answer, say: 'My hobby is reading' or 'I like music.' Now try it — say: 'My hobby is reading.'",
        cueQuestion: {
          question:
            "Someone asks: 'What are your hobbies?' Choose the natural reply:",
          options: [
            "Hobby cricket my.",
            "My hobby is cricket.",
            "I am cricket.",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "What are your hobbies?" },
          { speaker: "B", text: "My hobby is music. What about you?" },
          { speaker: "A", text: "I like painting." },
        ],
      },
    ],
  },
  {
    unitId: "unit_2_workplace",
    title: "Workplace Communication",
    lessons: [
      {
        id: "l6",
        title: "Asking for Help",
        phrase: "Can you help me with this?",
        phraseMeaning: "A polite and professional way to request assistance at work.",
        script:
          "When you need assistance at work, use this polite phrase: 'Can you help me with this?' It's professional and respectful. Now try it — say: 'Can you help me with this?'",
        cueQuestion: {
          question:
            "You need help from a colleague. What's the best way to ask?",
          options: [
            "Do this for me.",
            "Can you help me with this?",
            "Help me now.",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "Can you help me with this report?" },
          { speaker: "B", text: "Of course! What do you need?" },
          { speaker: "A", text: "I need help with the formatting." },
        ],
      },
      {
        id: "l7",
        title: "Professional Response",
        phrase: "I'll get back to you.",
        phraseMeaning: "Used when you need time to find an answer or make a decision.",
        script:
          "When you need time to think or research, say: 'I'll get back to you.' This shows professionalism. Now try it — say: 'I'll get back to you.'",
        cueQuestion: {
          question:
            "Your manager asks a question you don't know. What should you say?",
          options: [
            "I don't know anything.",
            "I'll get back to you on that.",
            "Ask someone else.",
          ],
          correctIndex: 1,
        },
        roleplay: [
          { speaker: "A", text: "When can you finish this task?" },
          { speaker: "B", text: "Let me check my schedule. I'll get back to you." },
          { speaker: "A", text: "Sounds good, thanks!" },
        ],
      },
    ],
  },
];
