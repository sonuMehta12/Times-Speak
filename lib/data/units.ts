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
        title: "Casual Greetings",
        phrase: "Hey! How's it going?",
        phraseMeaning: "Yeh ek casual aur friendly tarika hai kisi ko greet karne ka aur puchhne ka ki woh kaise hain.",
        script:
          "Let's learn a friendly way to greet people at work or with friends. 'Hey! How's it going?' It's a simple, casual 'How are you?' Now try it — say: 'Hey! How's it going?'",
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
        duration: "5 min",
        category: "Conversation",
        subtitle: "Dost aur colleagues ke saath daily conversations ke liye friendly greetings seekhiye.",
      },
      {
        id: "l2",
        title: "First Meeting",
        phrase: "Nice to meet you.",
        phraseMeaning: "Yeh ek polite phrase hai jo first time kisi se milne par use kiya jaata hai.",
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
        duration: "5 min",
        category: "Introduction",
        subtitle: "Professional settings mein pehli baar mile toh achhi impression banayein.",
      },
      {
        id: "l3",
        title: "Asking Origin",
        phrase: "Where are you from?",
        phraseMeaning: "Iska use kisi ke origin ya hometown ke baare mein puchhne ke liye kiya jaata hai.",
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
        duration: "5 min",
        category: "Introduction",
        subtitle: "Apne hometown ke baare mein baat karke naye logon se connect karein.",
      },
      {
        id: "l4",
        title: "Talking About Work",
        phrase: "What do you do?",
        phraseMeaning: "Yeh ek common question hai kisi ke job ya profession ke baare mein puchhne ke liye.",
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
        duration: "5 min",
        category: "Professional",
        subtitle: "Apne profession aur career ke baare mein English mein confidently baat karein.",
      },
      {
        id: "l5",
        title: "Interests & Hobbies",
        phrase: "What are your hobbies?",
        phraseMeaning: "Iska use kisi ke interests aur free-time activities ke baare mein puchhne ke liye hota hai.",
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
        duration: "5 min",
        category: "Personal",
        subtitle: "Apne hobbies share karke meaningful connections banayein.",
      },
      {
        id: "l6",
        title: "Asking for Help",
        phrase: "Can you help me with this?",
        phraseMeaning: "Yeh ek polite aur professional tarika hai workplace mein help maangne ka.",
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
        duration: "5 min",
        category: "Workplace",
        subtitle: "Office mein professionally help maangein aur collaborative relationships banayein.",
      },
      {
        id: "l7",
        title: "Professional Response",
        phrase: "I'll get back to you.",
        phraseMeaning: "Jab aapko answer dhoondhne ya decision lene ke liye time chahiye tab use karein.",
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
        duration: "5 min",
        category: "Workplace",
        subtitle: "Jab aapko research ya sochne ke liye time chahiye tab professionally respond karein.",
      },
    ],
    finalQuiz: {
      id: "unit_1_final_quiz",
      totalQuestions: 6,
      questions: [
        // Q1: Listening Comprehension - Casual Context (tests L1)
        {
          id: 1,
          type: "listening",
          question: "Listen carefully and choose the best response:",
          audio: "Hey! How's it going?",
          options: [
            "I'm going to the market.",
            "Good, thanks! How about you?",
            "Nice to meet you.",
          ],
          correct: 1,
          correctFeedback: "Perfect! 'Good, thanks! How about you?' is the natural response to a casual greeting.",
          incorrectFeedback: "Remember: 'How's it going?' means 'How are you?' - it's asking about how you are, not where you're going!",
        },
        // Q2: Context Recognition (tests L1, L2, L4)
        {
          id: 2,
          type: "context",
          question: "Choose the most appropriate greeting for this situation:",
          scenario: "You're meeting your new manager for the first time at the office.",
          options: [
            "Hey! What's up?",
            "Good morning. Nice to meet you.",
            "Yo! How's it going?",
          ],
          correct: 1,
          correctFeedback: "Excellent! In a professional setting with someone senior, 'Good morning. Nice to meet you.' is the perfect choice.",
          incorrectFeedback: "Think about formality: casual greetings like 'Hey' or 'Yo' aren't appropriate when meeting a manager for the first time.",
        },
        // Q3: Listening Comprehension - Professional Context (tests L4)
        {
          id: 3,
          type: "listening",
          question: "Listen and select the correct answer to the question:",
          audio: "What do you do?",
          options: [
            "I'm from Mumbai.",
            "I work in marketing.",
            "My hobby is cricket.",
          ],
          correct: 1,
          correctFeedback: "Great! 'What do you do?' is asking about your job or profession.",
          incorrectFeedback: "'What do you do?' asks about your work or studies, not your location or hobbies.",
        },
        // Q4: Sentence Construction (tests L2, L3, L4)
        {
          id: 4,
          type: "arrange",
          question: "Arrange these words to make a complete introduction:",
          words: ["to", "meet", "you", "Nice", "I'm", "a", "teacher"],
          correct: "Nice to meet you, I'm a teacher.",
          correctFeedback: "Excellent sentence structure! You combined a polite greeting with a professional introduction.",
          incorrectFeedback: "Start with the greeting 'Nice to meet you,' then add your introduction 'I'm a teacher.'",
        },
        // Q5: Comprehension Check (tests L3, L5)
        {
          id: 5,
          type: "comprehension",
          question: "Read this introduction. What information did the person share?",
          sentence: "Hi! I'm Priya from Delhi, and my hobby is painting.",
          options: [
            "Only their name and city",
            "Their name, city, and hobby",
            "Only their hobby",
            "Their name and job",
          ],
          correct: 1,
          correctFeedback: "Perfect! The person shared three things: name (Priya), origin (Delhi), and hobby (painting).",
          incorrectFeedback: "Look carefully - the person mentioned their name (Priya), where they're from (Delhi), and their hobby (painting).",
        },
        // Q6: Speaking Practice (tests L1, L2, L5)
        {
          id: 6,
          type: "speaking",
          question: "Now it's your turn to speak!",
          prompt: "Choose ONE phrase and say it clearly:",
          options: [
            "Hey! How's it going?",
            "Nice to meet you, I'm a student.",
            "My hobby is reading.",
          ],
        },
      ] as QuizQuestion[],
    },
  },
];
