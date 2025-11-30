// lib/data/roleplay-scenarios.ts

import { Scenario } from '../types/roleplay';

/**
 * Comprehensive roleplay scenarios organized by category
 * Each scenario includes example conversations with Hindi translations
 * optimized for Rahul's B2 level and learning goals
 */
export const ROLEPLAY_SCENARIOS: Scenario[] = [
  // ============ INTERVIEW CATEGORY ============
  {
    id: 'interview-job-basic',
    title: 'Job Interview Basics',
    description: 'Practice answering common interview questions with confidence and clarity.',
    topic: 'Professional',
    category: 'interview',
    difficulty: 'Intermediate',
    duration: '5-8 min',
    image: 'https://files.catbox.moe/v81mjc.png',
    role: 'HR Interviewer',
    learningObjective: 'Introduce yourself professionally and answer "Tell me about yourself" confidently.',
    initialGreeting: 'Good morning! Please have a seat. How are you doing today?',
    badge: 'Most Popular',
    badgeColor: 'gold',
    rating: 4.8,
    learners: '5.8K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Good morning! Please have a seat. How are you doing today?',
        translation: 'सुप्रभात! कृपया बैठिए। आज आप कैसे हैं?',
      },
      {
        speaker: 'Learner',
        text: "Good morning! I'm doing well, thank you. I'm excited to be here.",
        translation: 'सुप्रभात! मैं ठीक हूं, धन्यवाद। मुझे यहां आकर खुशी हो रही है।',
        explanation: 'Start with a positive, confident tone',
      },
      {
        speaker: 'Agent',
        text: 'Great to hear! So, tell me about yourself.',
        translation: 'सुनकर अच्छा लगा! तो, अपने बारे में बताइए।',
      },
      {
        speaker: 'Learner',
        text: "I'm a software developer with 3 years of experience in web development. I specialize in React and Node.js, and I'm passionate about building user-friendly applications.",
        translation:
          'मैं 3 साल के अनुभव के साथ एक सॉफ्टवेयर डेवलपर हूं। मैं React और Node.js में विशेषज्ञता रखता हूं, और मुझे user-friendly applications बनाने का शौक है।',
        explanation: 'Keep it concise, highlight your strengths',
      },
      {
        speaker: 'Agent',
        text: 'Excellent! What interests you about this position?',
        translation: 'बहुत अच्छा! इस पद में आपकी दिलचस्पी क्या है?',
      },
      {
        speaker: 'Learner',
        text: "I'm really drawn to your company's focus on innovation and the opportunity to work on challenging projects that make a real impact.",
        translation:
          'मुझे आपकी कंपनी के innovation पर ध्यान और चुनौतीपूर्ण परियोजनाओं पर काम करने का मौका वाकई आकर्षित करता है।',
        explanation: 'Show genuine interest and align with company values',
      },
    ],
  },

  {
    id: 'interview-presentation',
    title: 'Business Presentation',
    description: 'Deliver a professional presentation with clear structure and confident delivery.',
    topic: 'Professional',
    category: 'interview',
    difficulty: 'Advanced',
    duration: '8-12 min',
    image: 'https://files.catbox.moe/3t05gt.png',
    role: 'Audience Member',
    learningObjective: 'Present a business idea with clear introduction, body, and conclusion.',
    initialGreeting: 'Welcome! We\'re ready for your presentation. Please begin when you\'re comfortable.',
    badge: 'New',
    badgeColor: 'teal',
    rating: 4.7,
    learners: '2.3K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: "Welcome! We're ready for your presentation. Please begin when you're comfortable.",
        translation: 'स्वागत है! हम आपकी presentation के लिए तैयार हैं। जब आप comfortable हों तो शुरू करें।',
      },
      {
        speaker: 'Learner',
        text: 'Good afternoon, everyone. Today, I\'ll be presenting our new customer engagement strategy.',
        translation: 'सभी को नमस्कार। आज मैं हमारी नई customer engagement strategy present करूंगा।',
        explanation: 'Start with a clear, confident opening',
      },
      {
        speaker: 'Agent',
        text: 'Great start. Please continue.',
        translation: 'बढ़िया शुरुआत। कृपया जारी रखें।',
      },
      {
        speaker: 'Learner',
        text: "First, I'll cover our current challenges. Then, I'll outline the proposed solution. Finally, we'll discuss the expected outcomes.",
        translation:
          'पहले, मैं हमारी वर्तमान चुनौतियों को cover करूंगा। फिर, मैं proposed solution को outline करूंगा। अंत में, हम expected outcomes पर चर्चा करेंगे।',
        explanation: 'Use signposting language to structure your presentation',
      },
    ],
  },

  // ============ TRAVEL CATEGORY ============
  {
    id: 'travel-airport',
    title: 'Airport & Check-in',
    description: 'Navigate airport procedures, check-in, and security with ease.',
    topic: 'Travel',
    category: 'travel',
    difficulty: 'Beginner',
    duration: '6-10 min',
    image: 'https://files.catbox.moe/pj7voe.png',
    role: 'Airport Staff',
    learningObjective: 'Complete check-in and answer questions about luggage and travel documents.',
    initialGreeting: 'Good morning! Welcome to Sky Airlines. May I see your passport and ticket, please?',
    badge: 'Trending',
    badgeColor: 'coral',
    rating: 4.9,
    learners: '4.2K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Good morning! Welcome to Sky Airlines. May I see your passport and ticket, please?',
        translation: 'सुप्रभात! Sky Airlines में आपका स्वागत है। कृपया अपना passport और ticket दिखाएं?',
      },
      {
        speaker: 'Learner',
        text: 'Good morning. Here you go.',
        translation: 'सुप्रभात। यह लीजिए।',
        explanation: 'Simple, polite response',
      },
      {
        speaker: 'Agent',
        text: 'Thank you. Are you checking any bags today?',
        translation: 'धन्यवाद। क्या आप आज कोई bag check कर रहे हैं?',
      },
      {
        speaker: 'Learner',
        text: 'Yes, I have one suitcase to check.',
        translation: 'हां, मेरे पास check करने के लिए एक suitcase है।',
        explanation: 'Clear and direct answer',
      },
      {
        speaker: 'Agent',
        text: 'Perfect. Please place it on the scale. Any carry-on luggage?',
        translation: 'बढ़िया। कृपया इसे scale पर रखें। कोई carry-on luggage है?',
      },
      {
        speaker: 'Learner',
        text: 'Just this backpack.',
        translation: 'बस यह backpack।',
        explanation: 'Short, clear response is fine',
      },
    ],
  },

  {
    id: 'travel-hotel-checkin',
    title: 'Hotel Check-in',
    description: 'Check into a hotel smoothly and request amenities confidently.',
    topic: 'Travel',
    category: 'travel',
    difficulty: 'Beginner',
    duration: '12 min',
    image: 'https://files.catbox.moe/doim0x.png',
    role: 'Hotel Receptionist',
    learningObjective: 'Complete hotel check-in and ask about hotel facilities.',
    initialGreeting: 'Good evening! Welcome to Grand Hotel. How may I assist you?',
    rating: 4.7,
    learners: '3.5K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Good evening! Welcome to Grand Hotel. How may I assist you?',
        translation: 'शुभ संध्या! Grand Hotel में आपका स्वागत है। मैं आपकी कैसे सहायता कर सकता हूं?',
      },
      {
        speaker: 'Learner',
        text: "Good evening. I have a reservation under the name Rahul Kumar.",
        translation: 'शुभ संध्या। Rahul Kumar के नाम पर मेरा reservation है।',
        explanation: 'State your purpose clearly',
      },
      {
        speaker: 'Agent',
        text: "Yes, Mr. Kumar. I have your reservation here. You're booked for three nights, is that correct?",
        translation: 'जी, Mr. Kumar। मेरे पास आपका reservation है। आप तीन रातों के लिए booked हैं, क्या यह सही है?',
      },
      {
        speaker: 'Learner',
        text: "Yes, that's correct.",
        translation: 'हां, यह सही है।',
        explanation: 'Confirm details clearly',
      },
      {
        speaker: 'Agent',
        text: 'Excellent. May I see your ID and credit card for incidentals?',
        translation: 'बढ़िया। क्या मैं incidentals के लिए आपका ID और credit card देख सकता हूं?',
      },
    ],
  },

  // ============ RESTAURANT CATEGORY ============
  {
    id: 'restaurant-ordering',
    title: 'Restaurant Ordering',
    description: 'Order food confidently, ask questions about menu items, and handle special requests.',
    topic: 'Dining',
    category: 'restaurant',
    difficulty: 'Beginner',
    duration: '8-10 min',
    image: 'https://files.catbox.moe/xrexkj.png',
    role: 'Waiter',
    learningObjective: 'Order a complete meal and make one special request or dietary modification.',
    initialGreeting: 'Good afternoon! Welcome to our restaurant. Can I start you off with something to drink?',
    rating: 4.9,
    learners: '6.1K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Good afternoon! Welcome to our restaurant. Can I start you off with something to drink?',
        translation: 'शुभ दोपहर! हमारे restaurant में आपका स्वागत है। क्या मैं आपके लिए कुछ पीने के लिए ला सकता हूं?',
      },
      {
        speaker: 'Learner',
        text: "Yes, I'll have a glass of water, please.",
        translation: 'हां, कृपया मुझे एक गिलास पानी दीजिए।',
        explanation: 'Simple, polite request',
      },
      {
        speaker: 'Agent',
        text: "Perfect. Are you ready to order, or would you like a few more minutes?",
        translation: 'बढ़िया। क्या आप order देने के लिए तैयार हैं, या आपको कुछ और मिनट चाहिए?',
      },
      {
        speaker: 'Learner',
        text: "I'm ready. Could you tell me more about the grilled chicken?",
        translation: 'मैं तैयार हूं। क्या आप मुझे grilled chicken के बारे में और बता सकते हैं?',
        explanation: 'Asking for details shows engagement',
      },
      {
        speaker: 'Agent',
        text: "Certainly! It's marinated in herbs and served with roasted vegetables and rice.",
        translation: 'बिल्कुल! यह herbs में marinate किया हुआ है और roasted vegetables और rice के साथ परोसा जाता है।',
      },
      {
        speaker: 'Learner',
        text: "That sounds great. I'll have that, but can I get the vegetables without butter?",
        translation: 'यह बढ़िया लग रहा है। मैं वह लूंगा, लेकिन क्या मुझे vegetables बिना butter के मिल सकती हैं?',
        explanation: 'Making a dietary request politely',
      },
    ],
  },

  {
    id: 'restaurant-cafe',
    title: 'Coffee Order',
    description: 'Order specialty coffee drinks and handle customizations like a local.',
    topic: 'Dining',
    category: 'restaurant',
    difficulty: 'Beginner',
    duration: '5-8 min',
    image: 'https://files.catbox.moe/qv4vkp.png',
    role: 'Barista',
    learningObjective: 'Order a customized coffee drink with size and modifications.',
    initialGreeting: 'Hi there! What can I get started for you today?',
    rating: 4.8,
    learners: '5.2K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Hi there! What can I get started for you today?',
        translation: 'नमस्ते! मैं आज आपके लिए क्या बना सकता हूं?',
      },
      {
        speaker: 'Learner',
        text: "Hi! I'd like a latte, please.",
        translation: 'नमस्ते! मुझे एक latte चाहिए, कृपया।',
        explanation: 'State your order clearly',
      },
      {
        speaker: 'Agent',
        text: 'Great choice! What size would you like?',
        translation: 'बढ़िया choice! आप कौन सा size लेंगे?',
      },
      {
        speaker: 'Learner',
        text: "I'll take a medium, please.",
        translation: 'कृपया medium दीजिए।',
        explanation: 'Specify size',
      },
      {
        speaker: 'Agent',
        text: 'Perfect. Regular milk or would you prefer almond, oat, or soy?',
        translation: 'बढ़िया। Regular milk या आप almond, oat, या soy milk पसंद करेंगे?',
      },
      {
        speaker: 'Learner',
        text: 'Oat milk, please.',
        translation: 'कृपया oat milk।',
        explanation: 'Simple preference statement',
      },
    ],
  },

  // ============ SHOPPING CATEGORY ============
  {
    id: 'shopping-clothing',
    title: 'Clothing Store Shopping',
    description: 'Ask for sizes, try on clothes, and make purchases confidently.',
    topic: 'Shopping',
    category: 'shopping',
    difficulty: 'Beginner',
    duration: '6-10 min',
    image: 'https://files.catbox.moe/nevtj6.png',
    role: 'Store Associate',
    learningObjective: 'Ask about sizes and colors, request to try something on, and complete a purchase.',
    initialGreeting: 'Hi! Welcome to our store. Are you looking for anything specific today?',
    rating: 4.8,
    learners: '4.7K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Hi! Welcome to our store. Are you looking for anything specific today?',
        translation: 'नमस्ते! हमारे store में आपका स्वागत है। क्या आप आज कुछ खास ढूंढ रहे हैं?',
      },
      {
        speaker: 'Learner',
        text: "Yes, I'm looking for a formal shirt.",
        translation: 'हां, मैं एक formal shirt ढूंढ रहा हूं।',
        explanation: 'State what you need clearly',
      },
      {
        speaker: 'Agent',
        text: 'Great! What size do you usually wear?',
        translation: 'बढ़िया! आप आम तौर पर कौन सा size पहनते हैं?',
      },
      {
        speaker: 'Learner',
        text: 'I wear a medium, usually.',
        translation: 'मैं आमतौर पर medium पहनता हूं।',
        explanation: 'Provide your size',
      },
      {
        speaker: 'Agent',
        text: 'Perfect! We have several options. Do you have a color preference?',
        translation: 'बढ़िया! हमारे पास कई options हैं। क्या आपकी कोई color preference है?',
      },
      {
        speaker: 'Learner',
        text: "I prefer light blue or white.",
        translation: 'मुझे हल्का नीला या सफेद पसंद है।',
        explanation: 'Express preferences clearly',
      },
      {
        speaker: 'Agent',
        text: 'Excellent. Let me show you our collection. The fitting rooms are right over there if you\'d like to try anything on.',
        translation:
          'बहुत अच्छा। मैं आपको हमारा collection दिखाता हूं। अगर आप कुछ try करना चाहें तो fitting rooms वहीं हैं।',
      },
    ],
  },

  {
    id: 'shopping-electronics',
    title: 'Electronics Store',
    description: 'Ask about product features, compare options, and make informed tech purchases.',
    topic: 'Shopping',
    category: 'shopping',
    difficulty: 'Intermediate',
    duration: '15 min',
    image: 'https://files.catbox.moe/q8mg78.png',
    role: 'Sales Representative',
    learningObjective: 'Ask about product specifications and make a comparison between two products.',
    initialGreeting: 'Hello! How can I help you with your electronics needs today?',
    rating: 4.6,
    learners: '3.1K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Hello! How can I help you with your electronics needs today?',
        translation: 'नमस्कार! मैं आज electronics में आपकी कैसे मदद कर सकता हूं?',
      },
      {
        speaker: 'Learner',
        text: "Hi! I'm looking for a laptop for work. Something good for programming.",
        translation: 'नमस्ते! मैं काम के लिए एक laptop ढूंढ रहा हूं। Programming के लिए कुछ अच्छा।',
        explanation: 'Explain your use case',
      },
      {
        speaker: 'Agent',
        text: 'Great! What\'s your budget range, and do you have a preference for screen size?',
        translation: 'बढ़िया! आपका budget range क्या है, और screen size के लिए कोई preference है?',
      },
      {
        speaker: 'Learner',
        text: 'Around 60,000 rupees, and I prefer a 14 or 15-inch screen.',
        translation: 'लगभग 60,000 रुपये, और मुझे 14 या 15-inch की screen पसंद है।',
        explanation: 'Provide specific requirements',
      },
    ],
  },

  // ============ MEDICAL CATEGORY ============
  {
    id: 'medical-doctor-visit',
    title: 'Doctor Visit',
    description: 'Describe symptoms, answer medical questions, and understand doctor\'s advice.',
    topic: 'Healthcare',
    category: 'medical',
    difficulty: 'Intermediate',
    duration: '8-12 min',
    image: 'https://files.catbox.moe/0yz0d8.png',
    role: 'Doctor',
    learningObjective: 'Describe health symptoms and answer follow-up medical questions.',
    initialGreeting: 'Good morning! Please have a seat. What brings you in today?',
    rating: 4.6,
    learners: '2.9K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Good morning! Please have a seat. What brings you in today?',
        translation: 'सुप्रभात! कृपया बैठिए। आज आप क्यों आए हैं?',
      },
      {
        speaker: 'Learner',
        text: "Good morning, doctor. I've been having a headache for the past three days.",
        translation: 'सुप्रभात, doctor। मुझे पिछले तीन दिनों से सिरदर्द हो रहा है।',
        explanation: 'Describe your main symptom',
      },
      {
        speaker: 'Agent',
        text: 'I see. Can you describe the headache? Is it constant or does it come and go?',
        translation: 'समझ गया। क्या आप सिरदर्द को describe कर सकते हैं? क्या यह constant है या आता-जाता रहता है?',
      },
      {
        speaker: 'Learner',
        text: 'It comes and goes. It\'s usually worse in the afternoon.',
        translation: 'यह आता-जाता रहता है। दोपहर में यह आमतौर पर ज्यादा होता है।',
        explanation: 'Provide specific details about timing',
      },
      {
        speaker: 'Agent',
        text: 'Alright. Any other symptoms? Fever, nausea, or vision problems?',
        translation: 'ठीक है। कोई और लक्षण? बुखार, मतली, या आंखों की समस्या?',
      },
      {
        speaker: 'Learner',
        text: 'No fever, but I do feel a bit nauseous sometimes.',
        translation: 'कोई बुखार नहीं, लेकिन मुझे कभी-कभी थोड़ी मतली महसूस होती है।',
        explanation: 'Mention all relevant symptoms',
      },
    ],
  },

  {
    id: 'medical-pharmacy',
    title: 'Pharmacy Visit',
    description: 'Ask for medications, understand dosage instructions, and ask pharmacy questions.',
    topic: 'Healthcare',
    category: 'medical',
    difficulty: 'Beginner',
    duration: '8-10 min',
    image: 'https://files.catbox.moe/bfwtsx.png',
    role: 'Pharmacist',
    learningObjective: 'Request medication and understand dosage instructions clearly.',
    initialGreeting: 'Hello! Do you have a prescription, or can I help you find something over-the-counter?',
    rating: 4.7,
    learners: '3.4K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Hello! Do you have a prescription, or can I help you find something over-the-counter?',
        translation: 'नमस्ते! क्या आपके पास prescription है, या मैं आपको कुछ over-the-counter खोजने में मदद कर सकता हूं?',
      },
      {
        speaker: 'Learner',
        text: 'Yes, I have a prescription for antibiotics.',
        translation: 'हां, मेरे पास antibiotics के लिए prescription है।',
        explanation: 'State your purpose',
      },
      {
        speaker: 'Agent',
        text: "Perfect. May I see your prescription, please?",
        translation: 'बढ़िया। कृपया अपना prescription दिखाएं?',
      },
      {
        speaker: 'Learner',
        text: 'Here you go.',
        translation: 'यह लीजिए।',
        explanation: 'Simple response when handing something over',
      },
      {
        speaker: 'Agent',
        text: "Thank you. This will take about 10 minutes to fill. Can you wait, or would you like to come back?",
        translation: 'धन्यवाद। इसे भरने में लगभग 10 मिनट लगेंगे। क्या आप wait कर सकते हैं, या वापस आना चाहेंगे?',
      },
      {
        speaker: 'Learner',
        text: "I'll wait, thank you.",
        translation: 'मैं wait करूंगा, धन्यवाद।',
        explanation: 'Express your choice clearly',
      },
    ],
  },

  // ============ SOCIAL CATEGORY ============
  {
    id: 'social-small-talk',
    title: 'Small Talk & Introductions',
    description: 'Start conversations naturally and keep them flowing with common topics.',
    topic: 'Social',
    category: 'social',
    difficulty: 'Beginner',
    duration: '8-10 min',
    image: 'https://files.catbox.moe/54vmg7.png',
    role: 'New Acquaintance',
    learningObjective: 'Introduce yourself and maintain a 3-turn conversation on a common topic.',
    initialGreeting: "Hi! I don't think we've met before. I'm Alex.",
    rating: 4.9,
    learners: '7.2K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: "Hi! I don't think we've met before. I'm Alex.",
        translation: 'नमस्ते! मुझे नहीं लगता कि हम पहले मिले हैं। मैं Alex हूं।',
      },
      {
        speaker: 'Learner',
        text: "Nice to meet you, Alex! I'm Rahul.",
        translation: 'आपसे मिलकर अच्छा लगा, Alex! मैं Rahul हूं।',
        explanation: 'Respond warmly and introduce yourself',
      },
      {
        speaker: 'Agent',
        text: 'Great to meet you too, Rahul! So, what brings you here today?',
        translation: 'आपसे मिलकर बहुत अच्छा लगा, Rahul! तो, आप आज यहां क्यों आए हैं?',
      },
      {
        speaker: 'Learner',
        text: "I'm here for the tech meetup. It's my first time attending. How about you?",
        translation: 'मैं tech meetup के लिए यहां हूं। यह मेरी पहली बार है। आप कैसे हैं?',
        explanation: 'Answer and return the question to keep conversation flowing',
      },
      {
        speaker: 'Agent',
        text: "Same here! I heard it's a great event. What kind of tech work do you do?",
        translation: 'मैं भी यहीं हूं! मैंने सुना है कि यह बहुत अच्छा event है। आप किस तरह का tech काम करते हैं?',
      },
      {
        speaker: 'Learner',
        text: "I'm a software developer. I mainly work with web technologies. What about you?",
        translation: 'मैं एक software developer हूं। मैं मुख्य रूप से web technologies के साथ काम करता हूं। आप क्या करते हैं?',
        explanation: 'Share information and show interest in the other person',
      },
    ],
  },

  {
    id: 'social-colleague-chat',
    title: 'Office Small Talk',
    description: 'Chat with colleagues about work, weekend plans, and build professional relationships.',
    topic: 'Social',
    category: 'social',
    difficulty: 'Intermediate',
    duration: '10 min',
    image: 'https://files.catbox.moe/mqrx8a.png',
    role: 'Colleague',
    learningObjective: 'Engage in office small talk and discuss weekend plans naturally.',
    initialGreeting: 'Hey! How was your weekend?',
    rating: 4.8,
    learners: '5.5K',
    exampleConversation: [
      {
        speaker: 'Agent',
        text: 'Hey! How was your weekend?',
        translation: 'अरे! आपका weekend कैसा था?',
      },
      {
        speaker: 'Learner',
        text: 'It was great! I went hiking with some friends. How about yours?',
        translation: 'बढ़िया था! मैं कुछ दोस्तों के साथ hiking गया था। आपका कैसा था?',
        explanation: 'Share briefly and reciprocate the question',
      },
      {
        speaker: 'Agent',
        text: 'Nice! I mostly relaxed at home. Where did you go hiking?',
        translation: 'अच्छा! मैंने ज्यादातर घर पर आराम किया। आप hiking कहां गए थे?',
      },
      {
        speaker: 'Learner',
        text: 'We went to a trail near Lonavala. The weather was perfect for it.',
        translation: 'हम Lonavala के पास एक trail पर गए थे। मौसम इसके लिए बिल्कुल सही था।',
        explanation: 'Provide specific details to keep conversation interesting',
      },
      {
        speaker: 'Agent',
        text: "That sounds wonderful! I've been meaning to go hiking. Do you have any plans for this weekend?",
        translation: 'यह बहुत अच्छा लगता है! मैं hiking जाने के बारे में सोच रहा था। इस weekend के लिए कोई योजना है?',
      },
      {
        speaker: 'Learner',
        text: "Not yet. Probably just catching up on some reading. Any suggestions?",
        translation: 'अभी तक नहीं। शायद बस कुछ reading में समय बिताऊंगा। कोई सुझाव?',
        explanation: 'Keep the conversation open and collaborative',
      },
    ],
  },
];

/**
 * Get scenarios by category
 */
export function getScenariosByCategory(category: string): Scenario[] {
  if (category === 'all') return ROLEPLAY_SCENARIOS;
  return ROLEPLAY_SCENARIOS.filter((scenario) => scenario.category === category);
}

/**
 * Get featured scenarios (for hero section)
 */
export function getFeaturedScenarios(): Scenario[] {
  return ROLEPLAY_SCENARIOS.filter((scenario) => scenario.badge !== undefined);
}

/**
 * Get scenario by ID
 */
export function getScenarioById(id: string): Scenario | undefined {
  return ROLEPLAY_SCENARIOS.find((scenario) => scenario.id === id);
}
