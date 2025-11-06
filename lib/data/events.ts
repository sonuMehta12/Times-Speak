// lib/data/events.ts
import { Event } from "../types/event"; // Adjust path if your types are elsewhere
import { addDays, format as formatDateFn } from "date-fns";

// Helper function to generate slugs (simple version)
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

// Helper to format date for upcomingDates consistently
const getFutureDateString = (daysToAdd: number): string => {
  return formatDateFn(addDays(new Date(), daysToAdd), "yyyy-MM-dd");
};

export const EVENTS_DATA: Event[] = [
  // Event 1: Summer Art Festival (Fully Populated)

  // Add this new event object to your lib/data/events.ts file

{
  id: "5",
  name: "Colors of Resilience: The Delhi Healing Project",
  slug: generateSlug("Colors of Resilience The Delhi Healing Project"),
  tagline: "Handing the brush to the people whose stories need to be told.",
  description:
    "This is more than paint on a wall. It is an act of healing, a process of transformation. 'Colors of Resilience' is an intensive 11-day initiative that partners world-renowned artists with local communities in Delhi to create murals that are monuments to their stories. We believe art is a catalyst for change—an alchemy that can turn fear into fearlessness, and silence into a voice. This project moves beyond mere aesthetics to ask a deeper question: Can we paint the world we want to live in?",
  shortDescription:
    "A 11-day public art initiative creating community-led murals across Delhi.",
  type: "Community Art Project",
  category: {
    id: "Community Art Project",
    name: "Community Art Project",
  },
  tags: [
    { id: "t22", name: "Mural Art" },
    { id: "t23", name: "Community Healing" },
    { id: "t24", name: "Social Art" },
    { id: "t25", name: "Street Art" },
    { id: "t26", name: "Delhi Events" },
    { id: "t27", name: "Participatory Art" },
    { id: "t28", name: "Activism" },
  ],
  isFeatured: true,
  isTrending: false,
  status: "upcoming",
  date: "2026-04-20",
  startTime: "10:00 AM", // General start time for daily activities
  endTime: "6:00 PM", // General end time for daily activities
  duration: "11 Days",
  upcomingDates: [
    {
      date: "2026-04-20", // The project spans this entire duration
      startTime: "10:00 AM",
      endTime: "6:00 PM",
      spotsLeft: 100, // Represents open slots for participation
      totalSpots: 100,
      status: "available",
    },
  ],
  price: 0,
  currency: "INR",
  isFree: true,
  capacity: 100, // Capacity for active daily participants
  ticketsLeft: 100,
  heroImage: {
    url: "https://i0.wp.com/eastwalnuthills.org/wp-content/uploads/2021/08/MuralProgress.png?resize=900%2C550&ssl=1",
    alt: "A massive, colorful mural on a city building being painted by a team.",
  },
  galleryImages: [
    {
      id: "g5-1",
      url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Community members of all ages collaborating on a large canvas.",
    },
    {
      id: "g5-2",
      url: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "An intimate dialogue session with artists and community members in a circle.",
    },
    {
      id: "g5-3",
      url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "A close-up of a vibrant, abstract mural detail with bold colors.",
    },
    {
      id: "g5-4",
      url: "https://images.unsplash.com/photo-1600723829034-39d518755b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "A street artist on a lift, working on a large-scale public wall.",
    },
    {
      id: "g5-5",
      url: "https://images.unsplash.com/photo-1528281146393-6143d33eb431?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "The hands of many people, covered in paint, working together.",
    },
    {
      id: "g5-6",
      url: "https://images.unsplash.com/photo-1505664124572-b7654a4a5844?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "A smiling woman from the community proudly pointing to her contribution on the finished mural.",
    },
  ],
  host: [
    {
      id: "h8",
      name: "Artful Museum of Art",
      title: "Organizing Institution",
      tagline: "Pioneering public access to contemporary Indian art.",
      avatar: {
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748969808/Artful_Icon_n7sv2v.png",
        alt: "Goartful logo",
      },
      verified: true,
      bio: "As a leading institution for the arts in India, Goartful is committed to fostering creative and socially engaged public projects. 'Colors of Resilience' is a flagship initiative to bring art out of the gallery and into the heart of the community.",
      portfolioUrl: "https://www.43wew.in/",
    },
    {
      id: "h9",
      name: "Aafreen 'Fearless' Khan",
      title: "Lead Artist & Methodologist",
      tagline: "My art is my protest. Beauty is my strategy.",
      avatar: {
        url: "https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2016/12/14/Photos/Multimedia/tanya-U101411283090xC--621x414@LiveMint.jpg",
        alt: "Aafreen Khan, a confident female artist.",
      },
      verified: true,
      bio: "Aafreen is a globally recognized street artist whose work focuses on amplifying the voices of women and marginalized communities. Her 'Fearless Methodology' uses collaborative art-making as a tool for building solidarity and demanding social change.",
      hostRating: 4.9,
      hostReviewCount: 78,
    },
  ],
  venue: {
    id: "v5",
    name: "Various Public Sites, Delhi",
    address: "Central Hub: Goartful, 145, DLF South Court Mall, Saket, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    zipCode: "110017",
    mapUrl: "https://maps.google.com/?q=Kiran+Nadar+Museum+of+Art",
    directions:
      "The project will take place at select community centers and public walls across Delhi. Registered participants will receive detailed location information for each day.",
    venueImage: {
      url: "https://images.unsplash.com/photo-1588147348401-903b4486333c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "A bustling and vibrant street in Delhi, representing the public canvas for the project.",
    },
    howToGetThere: {
      publicTransport: [
        "Locations are chosen for their accessibility via the Delhi Metro and local bus networks.",
      ],
    },
    accessibility: [
      "As a public street art project, accessibility will vary by location. Please contact us with specific needs.",
    ],
    amenities: [
      "All Art Materials Provided",
      "On-site Safety Equipment",
      "Daily Refreshments & Lunch for Participants",
      "Mobile Restroom Facilities",
      "Shaded Areas for Dialogues",
    ],
    isVerified: true,
  },
  averageRating: 4.9,
  reviewCount: 42, // Based on previous fictional projects
  reviews: [
    {
      id: "r5-1",
      name: "Sunita Devi",
      rating: 5,
      comment:
        "I never held a brush before. For 10 days, I painted my story alongside my sisters. Now, I see our faces, our strength, on a wall for the whole world to see. This project didn't just color a wall; it colored my soul with pride. Thank you, Aafreen Ma'am.",
      date: "2025-05-10",
      verified: true,
    },
    {
      id: "r5-2",
      name: "Ravi Kumar",
      rating: 5,
      comment:
        "Volunteering for this was a life-changing experience. The 'Artist Dialogues' were incredibly profound. It's one thing to see art, but to be part of its creation, to understand its purpose from the ground up... that's something else entirely. True art in action.",
      date: "2025-05-12",
      verified: true,
    },
  ],
  attendeeMoments: null,
  skillLevel: "No experience needed. All are welcome.",
  ageRequirement: "All Ages Welcome",
  whatYoullDo: [
    {
      id: '33443',
      title: "The Ritual of Creation",
      description:
        "Co-create themes in a ritual of collective imagination.",
      image: {
        url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "A diverse group of people sitting in a circle, engaged in a deep and collaborative discussion.",
      },
    },
    {
      id: '343',
      title: "Paint with Purpose",
      description:
        "Paint bold strokes with Delhi’s fearless street artists.",
      image: {
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1751959690/image_22_lpqoiq.png",
        alt: "Close-up of a person's hand, holding a brush, painting a bold yellow stroke on a large wall.",
      },
    },
    {
      id: '43',
      title: "Artist Dialogues: The Fearless Methodology",
      description:
        "Hear fearless stories from artists who paint with purpose.",
      image: {
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1751959690/image_18_utschf.png",
        alt: "An artist speaking passionately to an engaged and listening audience in an informal setting.",
      },
    },
    {
      id: '343',
      title: "The Unveiling Celebration",
      description:
        "Celebrate the mural and the voices behind its colors..",
      image: {
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1751959691/image_21_kido9k.png",
        alt: "A joyful community celebration in front of a massive, newly completed mural.",
      },
    },
  ],
  goodToKnow: [
    {
      icon: undefined,
      heading: "All Materials Provided",
      text: "From paints and brushes to safety gear, we provide everything you need to participate.",
    },
    {
      icon: undefined,
      heading: "Wear Comfortable Clothes",
      text: "Come in clothing that you don't mind getting paint on. We're here to make a beautiful mess!",
    },
    {
      icon: undefined,
      heading: "Nourishment for All",
      text: "Light lunch, snacks, and water will be provided on-site daily for all active participants.",
    },
  ],
  policies: {
    cancellation:
      "This is a free project. If you register and cannot make it, please inform us so we can offer the spot to someone else.",
    healthSafety:
      "Safety briefings are conducted daily. All participants must adhere to on-site safety guidelines, especially when working with ladders or lifts.",
  },
  guidelines: [
    "This is a space of respect. Listen to every story with an open heart.",
    "Collaboration is key. This is about 'we', not 'me'.",
    "Embrace the process. The journey of creation is as important as the final mural.",
    "This is a drug and alcohol-free project to ensure a safe environment for all.",
  ],
  faqs: [
    {
      id: "faq5-1",
      question: "Do I need any artistic skills to participate?",
      answer:
        "Absolutely not. This project is for everyone. Your willingness to participate is all that's required. We need hands to mix paint, run errands, talk to people, and paint!",
    },
    {
      id: "faq5-2",
      question: "How do I sign up to be a participant?",
      answer:
        "An open call for participation will be announced on the Goartful website and our social media channels. You can register for one day or for the entire duration.",
    },
    {
      id: "faq5-3",
      question: "Do I have to commit for all 11 days?",
      answer:
        "No, while we encourage longer participation to fully experience the process, you can sign up for as many days as you are available.",
    },
  ],
  videoUrl: "https://www.youtube.com/watch?v=68hT5PA-r48", // Example: St+art India festival video
  videoPosterUrl:
    "https://images.unsplash.com/photo-1599422089965-3d576e273d68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
},

// Add this new event object to your lib/data/events.ts file

{
  id: "4",
  name: "Sangam: A Confluence of Arts",
  slug: generateSlug("Sangam: A Confluence of Arts"),
  tagline: "Where ancient echoes meet modern rhythms.",
  description:
    "Step into a 3-day immersive festival set against the majestic backdrop of Udaipur. Sangam celebrates the vibrant confluence of music, poetry, dance, and painting, creating an unforgettable sensory journey for those who seek to not just observe, but to truly experience art in its most dynamic forms.",
  shortDescription: "A 3-day immersive arts festival in majestic Udaipur.",
  type: "Arts Festival",
  category: { id: "Arts Festival", name: "Arts Festival" },
  tags: [
    { id: "t15", name: "Music Festival" },
    { id: "t16", name: "Poetry" },
    { id: "t17", name: "Dance" },
    { id: "t18", name: "Live Painting" },
    { id: "t19", name: "Udaipur" },
    { id: "t20", name: "Cultural" },
    { id: "t21", name: "Immersive Experience" },
    { id: "t9", name: "Suminagashi" },
  ],
  isFeatured: true,
  isTrending: true,
  status: "upcoming",
  date: "2026-02-20",
  startTime: "10:00 AM",
  endTime: "11:00 PM",
  duration: "3 Days",
  upcomingDates: [
    {
      date: "2026-02-20",
      startTime: "10:00 AM",
      endTime: "11:00 PM",
      spotsLeft: 850,
      totalSpots: 2000,
      status: "available",
    },
    {
      date: "2026-02-21",
      startTime: "10:00 AM",
      endTime: "11:00 PM",
      spotsLeft: 850,
      totalSpots: 2000,
      status: "available",
    },
    {
      date: "2026-02-22",
      startTime: "10:00 AM",
      endTime: "11:00 PM",
      spotsLeft: 850,
      totalSpots: 2000,
      status: "available",
    },
  ],
  price: 3550, // Price for a 3-day pass
  currency: "INR",
  isFree: false,
  capacity: 500,
  ticketsLeft: 289,
  heroImage: {
    url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1751794109/image_9_yrudgw.png",
    alt: "A vibrant music festival stage lit up at night against a historic Indian backdrop.",
  },
  galleryImages: [
    {
      id: "g4-1",
      url: "https://images.unsplash.com/photo-1616292239335-512590510643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "A sitar player performing during a golden sunrise.",
    },
    {
      id: "g4-2",
      url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "An intimate poetry reading session in a warmly lit, cozy setting.",
    },
    {
      id: "g4-3",
      url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Hands gently placing paper on water during a Suminagashi workshop.",
    },
    {
      id: "g4-4",
      url: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "A crowd enjoying a live band performance at the main stage.",
    },
    {
      id: "g4-5",
      url: "https://images.unsplash.com/photo-1596633649948-2cf9f7059784?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "A classical Indian dancer performing with expressive movements.",
    },
    {
      id: "g4-6",
      url: "https://images.unsplash.com/photo-1550614004-97cb39600a06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Festival attendees collaborating on a large, colorful community mural.",
    },
  ],
  host: [
    {
      id: "h4",
      name: "Ananya Rao",
      title: "Founder & Artistic Director",
      tagline: "Curating conversations between tradition and tomorrow.",
      avatar: {
        url: "https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2016/12/14/Photos/Multimedia/tanya-U101411283090xC--621x414@LiveMint.jpg",
        alt: "Ananya Rao, Artistic Director of Sangam",
      },
      verified: true,
      bio: "Ananya is the visionary behind Sangam Arts Collective. With a background in cultural studies and event curation, she is passionate about creating immersive spaces where diverse art forms can interact and inspire a new generation of art lovers.",
      hostRating: 4.9,
      hostReviewCount: 182,
    },
    {
      id: "h5",
      name: "Rohan Das",
      title: "Sitar Virtuoso & Music Producer",
      tagline: "Weaving ancient ragas into contemporary soundscapes.",
      avatar: {
        url: "https://images.unsplash.com/photo-1615197241945-853443834638?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        alt: "Rohan Das, musician",
      },
      verified: true,
      bio: "A master of the sitar, Rohan has toured globally, collaborating with artists across genres. At Sangam, he will lead the sunrise meditation sessions and perform a headline fusion set that blends classical Indian music with electronic beats.",
      hostRating: 4.8,
      hostReviewCount: 155,
    },
    {
      id: "h6",
      name: "Meera Iyer",
      title: "Kathak Danseuse & Spoken Word Poet",
      tagline: "Telling stories through rhythm and rhyme.",
      avatar: {
        url: "https://images.unsplash.com/photo-1599151522079-a4173a58e5e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        alt: "Meera Iyer, dancer and poet",
      },
      verified: true,
      bio: "Meera believes that every movement and every word holds a universe of stories. Her performances are a powerful blend of graceful Kathak choreography and evocative spoken word poetry, exploring themes of mythology and modern identity.",
      hostRating: 4.9,
      hostReviewCount: 130,
    },
    {
      id: "h7",
      name: "Kabir Al-Farsi",
      title: "Muralist & Art Facilitator",
      tagline: "Art is not a thing, it is a way.",
      avatar: {
        url: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        alt: "Kabir Al-Farsi, muralist",
      },
      verified: true,
      bio: "Kabir's large-scale murals adorn cities worldwide. He is a passionate advocate for community art and mindfulness. At Sangam, he will guide participants in Suminagashi workshops and lead the creation of a massive collaborative mural.",
      hostRating: 4.8,
      hostReviewCount: 210,
    },
  ],
  venue: {
    id: "v4",
    name: "Shilpgram, Udaipur",
    address: "Shilpgram, Near Havala Village, Udaipur, Rajasthan 313001",
    city: "Udaipur",
    state: "Rajasthan",
    zipCode: "313001",
    mapUrl: "https://maps.google.com/?q=Shilpgram+Udaipur",
    directions:
      "Located 3 km west of Udaipur, near Fateh Sagar Lake. Easily accessible by auto-rickshaws and ride-sharing services from the city center.",
    venueImage: {
      url: "https://images.unsplash.com/photo-1624555130297-3a17e058655c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "The rustic and artistic entrance to Shilpgram, the rural arts and crafts complex in Udaipur.",
    },
    howToGetThere: {
      publicTransport: [
        "Auto-rickshaws and local taxis are readily available from all parts of Udaipur.",
      ],
      parking:
        "Ample paid parking space available for cars and two-wheelers at the main entrance.",
    },
    accessibility: [
      "The venue is large with uneven, rustic pathways. Comfortable footwear is highly recommended.",
      "Accessible restrooms are available near the main activity zones.",
    ],
    amenities: [
      "Multiple Open-Air Stages",
      "Dedicated Workshop Tents",
      "Central Food & Beverage Zone",
      "Artisan & Crafts Market",
      "First Aid & Medical Stations",
      "Restroom Facilities",
      "Designated Chill-Out Areas",
    ],
    isVerified: true,
  },
  averageRating: 4.9,
  reviewCount: 1245,
  reviews: [
    {
      id: "r4-1",
      name: "Aarav Sharma",
      rating: 5,
      comment:
        "The last edition of Sangam was pure magic. Rohan Das's sunrise sitar session with the Aravalli hills in the background is a memory I'll cherish forever. The energy is infectious. Can't wait for 2026!",
      date: "2024-03-01",
      verified: true,
    },
    {
      id: "r4-2",
      name: "Priya Singh",
      rating: 5,
      comment:
        "I'm not an 'artist', but the Suminagashi workshop with Kabir was so meditative and welcoming. I came for the music, but I left with a newfound love for painting and a piece of art I created myself. A truly transformative experience.",
      date: "2024-02-28",
      verified: true,
    },
    {
      id: "r4-3",
      name: "Vikram Mehta",
      rating: 4.5,
      comment:
        "An incredible festival. The sheer variety of performances is astounding. The food court was great too, offering so much more than typical festival fare. My only advice: book your stay well in advance!",
      date: "2024-03-05",
      verified: true,
    },
  ],
  attendeeMoments: null,
  skillLevel: "Everyone Welcome",
  ageRequirement: "18+",


  whatYoullDo: [
    {
      id: "workshop-1",
      image:  {
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1751877340/image_11_pvqzqm.png",
        alt: "img",
      },
      title: "Poetry & Dance",
      description: "Live poetry slams, storytelling, and mesmerizing dance",
    },
   
    {
      id: "artist-1",
      image: {
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1751877338/image_10_vnsdbj.png",
        alt: "image2"
      },
      title: "Musical Journeys",
      description: "From sunrise ragas to electrifying night performances",
    },
   
    {
      id: "venue-1",
      image: {
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1751877339/image_12_iwek0z.png",
        alt: "image 3"
      },
      title: "Live Art Creation",
      description: "Hands-on workshops and collaborative community murals",
    },
    {
      id: "community-1",
      image: {
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1751877340/image_13_y6mzj2.png",
        alt: "image 4"
      },
      title: "Canvas of Community",
      description: "Unleash creativity through mindful art and Suminagashi",
    },
  ],
  goodToKnow: [
    {
      icon: undefined, // e.g., 'Paintbrush'
      heading: "Artisan Materials Provided",
      text: "Everything you need for the workshops, from inks to canvases, is included. Just bring your creativity.",
    },
    {
      icon: undefined, // e.g., 'Utensils'
      heading: "Festival Food Hub",
      text: "A diverse food and beverage zone is available, featuring gourmet local pop-ups and pan-Indian culinary delights.",
    },
    {
      icon: undefined, // e.g., 'Bed'
      heading: "Curated Stay Partners",
      text: "We have partnered with select local heritage hotels and guesthouses to offer you a comfortable and authentic Udaipur retreat.",
    },
  ],
  policies: {
    cancellation:
      "Tickets are non-refundable. However, they are transferrable up to 15 days before the event start date.",
    healthSafety:
      "Your safety is our priority. Medical stations and security personnel are present throughout the festival grounds. Please stay hydrated.",
    refund: "No refunds will be issued for any reason. In the event of festival cancellation, tickets will be valid for the rescheduled date.",
  },
  guidelines: [
    "This is an 18+ event. Please carry valid government-issued photo ID.",
    "Sangam is an inclusive space. Respect the artists, fellow attendees, and the venue.",
    "No outside food, beverages, or illicit substances are permitted.",
    "Professional photography/videography equipment requires a media pass.",
  ],
  faqs: [
    {
      id: "faq4-1",
      question: "Are single-day passes available?",
      answer:
        "Single-day passes will be released closer to the festival date, subject to availability. The 3-day pass offers the most comprehensive experience.",
    },
    {
      id: "faq4-2",
      question: "What is the accommodation situation?",
      answer:
        "While accommodation is not included in the festival pass, we have partnered with several local hotels and guesthouses. A list of partners will be sent to ticket holders.",
    },
    {
      id: "faq4-3",
      question: "Is the venue wheelchair accessible?",
      answer:
        "Shilpgram is a rural arts complex with many rustic and uneven pathways, which may pose challenges for wheelchair users. Please contact our support team for specific accessibility queries.",
    },
  ],
  videoUrl: "https://www.youtube.com/watch?v=CnJp-z33_bw", // Example: NH7 Weekender aftermovie
  videoPosterUrl:
    "https://images.unsplash.com/photo-1516947650893-01c513881434?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
},

  // Event 2: Suminagashi Event
  {
    id: "2",
    name: "Suminagashi: The Art of Floating Ink",
    slug: generateSlug("Suminagashi: The Art of Floating Ink"),
    tagline: "An Exclusive Workshop on Japanese Marbling & Mindfulness",
    description:
      "You are invited into a centuries-old practice of calm and a Zen creative journey. This workshop is designed for high-achieving professionals to provide you a serene yet stimulating environment where you can experience the captivating art of Suminagashi, create stunning unique pieces for your home and office, and experience a profound sense of calm and accomplishment.",
    shortDescription: "A Calm and Zen Creative Journey",
    type: "Art Workshop",
    category: { id: "Art Workshop", name: "Art Workshop" },
    tags: [
      { id: "t7", name: "Japanese Art" },
      { id: "t8", name: "Mindfulness" },
      { id: "t9", name: "Marbling" },
      { id: "t10", name: "Zen" },
      { id: "t11", name: "Meditation" },
      { id: "t12", name: "Professional Development" },
    ],
    isFeatured: true,
    isTrending: false,
    status: "active",
    date: "2025-07-15",
    startTime: "10:00 AM",
    endTime: "01:00 PM",
    duration: "3 hours",
    upcomingDates: [
      {
        date: "2025-07-15",
        startTime: "10:00 AM",
        endTime: "01:00 PM",
        spotsLeft: 8,
        totalSpots: 12,
        status: "available",
      },
      {
        date: "2025-07-22",
        startTime: "10:00 AM",
        endTime: "01:00 PM",
        spotsLeft: 10,
        totalSpots: 12,
        status: "available",
      },
      {
        date: "2025-07-29",
        startTime: "2:00 PM",
        endTime: "5:00 PM",
        spotsLeft: 12,
        totalSpots: 12,
        status: "available",
      },
    ],
    price: 0,
    currency: "INR",
    isFree: false,
    capacity: 12,
    ticketsLeft: 8,
    heroImage: {
      url: "https://static1.squarespace.com/static/5e9f075c097b7d5688f6cb57/t/65392c9f09d6fc227aa48ce1/1698245791779/Suminagashi+Floating+Japanese+ink+marbling+kit+art+and+craft+creative+team+building+offsite+retreat+activity+in+NYC+or+virtual+for+remote+employees+3.jpg?format=1500w",
      alt: "Serene Suminagashi ink patterns floating on water surface",
    },
    galleryImages: [
      {
        id: "g2-1",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Beautiful concentric ink rings on water surface",
      },
      {
        id: "g2-2",
        url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Hands gently placing paper on marbled water",
      },
      {
        id: "g2-3",
        url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Collection of finished Suminagashi art pieces",
      },
      {
        id: "g2-4",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Zen workspace with traditional Japanese materials",
      },
      {
        id: "g2-5",
        url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Participants in meditation before starting the workshop",
      },
    ],
    // FIX: Host property is now a valid array. Corrected typo in introVideoPosterUrl and removed redundant properties that were outside the object.
    host: [
      {
        id: "h2",
        name: "Kenji Nakamura",
        tagline: "Master of traditional Japanese arts and mindfulness practices",
        title: "Suminagashi Master & Mindfulness Instructor",
        avatar: {
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX5KS_GZg9np5n3EyRga8AvF_6nqembwan1t7iW933YIx1Hd-3XByaiAHO_C39_HbaE98&usqp=CAU",
          alt: "Kenji Nakamura - Suminagashi Master",
        },
        verified: true,
        bio: "Kenji has been practicing traditional Japanese arts for over 15 years...",
        experience: "15+ years",
        eventsHosted: 127,
        hostRating: 4.9,
        hostReviewCount: 89,
        responseTime: "Usually responds within 1 hour",
        languages: ["English", "Japanese"],
        instagramHandle: "@kenji_suminagashi",
        portfolioUrl: "https://kenji-art.com",
        introVideoUrl: null,
        introVideoPosterUrl: null,
      },
      {
        id: "h3",
        name: "Sarah Chen",
        tagline:
          "Contemporary artist specializing in mixed media and digital art",
        title: "Digital Art Specialist",
        avatar: {
          url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
          alt: "Sarah Chen - Digital Artist",
        },
        verified: true,
        bio: "Sarah combines traditional techniques with modern digital tools...",
        experience: "8+ years",
        eventsHosted: 45,
        hostRating: 4.8,
        hostReviewCount: 32,
        responseTime: "Usually responds within 2 hours",
        languages: ["English", "Mandarin"],
        instagramHandle: "@sarah_digital_art",
        portfolioUrl: "https://sarahchen.art",
        introVideoUrl: "https://example.com/video.mp4",
        introVideoPosterUrl: "https://example.com/poster.jpg",
      },
    ],
    venue: {
      id: "v2",
      name: "Zen Garden Studio | Sector 18 Noida",
      address:
        "2nd Floor, Unity One Mall, Sector 18, Noida, Uttar Pradesh 201301",
      city: "NOIDA",
      state: "Uttar Pradesh",
      zipCode: "201301",
      mapUrl: "https://maps.google.com/?q=Unity+One+Mall+Sector+18+Noida",
      directions:
        "Take the Blue Line Metro to Sector 18 Metro Station. The studio is a 3-minute walk from the station.",
      venueImage: {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        alt: "Peaceful zen studio with natural lighting",
      },
      howToGetThere: {
        publicTransport: [
          "Blue Line Metro to Sector 18 Station, then 3-minute walk",
          "Multiple bus routes available to Sector 18 hub",
        ],
        parking: "Free parking available at Unity One Mall for 4 hours",
      },
      accessibility: [
        "Elevator access to 2nd floor",
        "Wide doorways suitable for wheelchairs",
        "Accessible restrooms on same floor",
      ],
      amenities: [
        "Air-conditioned studio space",
        "Natural lighting with adjustable blinds",
        "Comfortable floor seating with back support",
        "Tea and meditation corner",
        "Washroom facilities",
      ],
      isVerified: true,
    },
    averageRating: 4.9,
    reviewCount: 34,
    reviews: [
      {
        id: "r2-1",
        name: "Priya Mehta",
        rating: 5,
        comment:
          "This was the most peaceful 3 hours I've had in months! Kenji's guidance was gentle yet profound. The art I created was beautiful, but the inner calm I experienced was priceless. Highly recommend for anyone feeling overwhelmed.",
        date: "2025-07-01",
        verified: true,
      },
      {
        id: "r2-2",
        name: "Arjun Singh",
        rating: 4.5,
        comment:
          "As a software engineer, I was skeptical about 'floating ink' art, but this workshop completely changed my perspective. The meditative process helped me disconnect from work stress. Will definitely attend again!",
        date: "2025-06-28",
        verified: true,
      },
      {
        id: "r2-3",
        name: "Kavya Sharma",
        rating: 5,
        comment:
          "Kenji's explanation of the philosophy behind Suminagashi was enlightening. The workspace was serene, and I loved how each piece turned out uniquely. Perfect for a digital detox weekend activity!",
        date: "2025-06-25",
        verified: true,
      },
    ],
    attendeeMoments: [
      {
        id: "am2-1",
        mediaUrl:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        mediaType: "image",
        altText: "My first Suminagashi creation - so proud!",
        caption: "Found my zen through floating ink ✨ #Suminagashi #Mindfulness",
        attendee: {
          name: "Ravi K.",
          avatarUrl: "https://i.pravatar.cc/150?u=ravi",
        },
        timestamp: "5 days ago",
      },
      {
        id: "am2-2",
        mediaUrl:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        mediaType: "image",
        altText: "The magical moment of capturing the floating ink",
        caption: "This moment when the paper touches water... pure magic! 🎨",
        attendee: {
          name: "Neha P.",
          avatarUrl: "https://i.pravatar.cc/150?u=neha",
        },
        timestamp: "1 week ago",
      },
      {
        id: "am2-3",
        mediaUrl:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        mediaType: "image",
        altText: "Collection of beautiful Suminagashi pieces",
        caption: "Each piece tells a story of mindfulness and flow 🌊",
        attendee: {
          name: "Amit J.",
          avatarUrl: "https://i.pravatar.cc/150?u=amit2",
        },
        timestamp: "2 weeks ago",
      },
    ],
    skillLevel: "Beginner Friendly",
    ageRequirement: "16+",
    whatYoullDo: [
      {
        id: 'ew',
        title: "The Stillness",
        description:
          "Begin with a welcome tea ceremony and learn about the philosophy of Suminagashi and Wabi-Sabi. Engage in guided meditation to enter a state of mindful awareness and prepare your mind for the creative journey ahead.",
        image: {
          url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Peaceful meditation space with tea ceremony setup",
        },
      },
      {
        id: '34',
        title: "The Flow",
        description:
          "Learn to 'kiss' the water surface with ink-loaded brushes, creating concentric rings that bloom like ripples. Master breath control and gentle vibrations to guide ink into mesmerizing patterns. Practice the ancient techniques with premium Sumi inks.",
        image: {
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Hands creating ink patterns on water surface",
        },
      },
      {
        id: "45",
        title: "The Capture",
        description:
          "Master the delicate art of laying absorbent paper onto the water to capture your floating designs. Learn timing, pressure, and lifting techniques to create perfect prints. Create multiple pieces with different color combinations.",
        image: {
          url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Paper being placed on marbled water surface",
        },
      },
      {
        id: "34",
        title: "Reflection & Tea: Integration (15 mins)",
        description:
          "Conclude with a mindful tea session while your artwork dries. Share your experience with fellow participants and receive guidance on incorporating mindfulness practices into daily life. Package your creations for safekeeping.",
        image: {
          url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          alt: "Finished artwork collection with tea setting",
        },
      },
    ],
    policies: {
      cancellation: "Full refund available up to 48 hours before the workshop",
      healthSafety:
        "Please inform us of any allergies. If feeling unwell, please reschedule at no charge.",
      refund:
        "All approved refunds processed within 48 hours to original payment method.",
    },
    guidelines: [
      "Arrive 15 minutes early for check-in and settling in",
      "Maintain silence during meditation portions",
      "Embrace imperfection - there are no mistakes in Suminagashi",
      "Respect the meditative atmosphere and others' creative process",
      "Turn phones to silent mode during the workshop",
      "Stay hydrated and take breaks as needed",
    ],
    faqs: [
      {
        id: "faq2-1",
        question: "Do I need any prior art experience?",
        answer:
          "Absolutely not! Suminagashi is about letting go of control and embracing the natural flow. A beginner's mind is actually ideal for this practice.",
      },
      {
        id: "faq2-2",
        question: "How many art pieces will I create?",
        answer:
          "You'll typically create 5-7 unique pieces during the workshop. Each piece is one-of-a-kind and cannot be replicated exactly.",
      },
      {
        id: "faq2-3",
        question: "Is this suitable for people with anxiety or stress?",
        answer:
          "Yes! The meditative nature of Suminagashi is particularly beneficial for reducing stress and anxiety. The workshop is designed to be calming and therapeutic.",
      },
      {
        id: "faq2-4",
        question: "What if I'm not comfortable with meditation?",
        answer:
          "The meditation portion is gentle and optional. We focus more on mindful awareness during the art-making process rather than formal meditation.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoPosterUrl:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    goodToKnow: [],
  },
  {
    id: "1",
    name: "Paint Your Summer Mood",
    slug: generateSlug("Paint Your Summer Mood"),
    tagline:
      "Transform stress into art, emotions into colors, and strangers into connections",
    description:
      "Step away from your screens, deadlines, and daily pressures. Join Noida's first therapeutic art experience where you'll discover the healing power of mindful painting.",
    shortDescription: "An Evening of Artful Expression & Connection",

    type: "Art Workshop",
    category: { id: "Art Workshop", name: "Art Workshop" },
    tags: [
      { id: "t1", name: "Mindful Painting" },
      { id: "t2", name: "Summer Vibes" },
      { id: "t3", name: "Food" },
      { id: "t4", name: "NOIDAevents" },
      { id: "t6", name: "WorkLifeBalance" },
    ],
    isFeatured: true,
    isTrending: true,
    status: "active",
    date: "2025-06-19",
    startTime: "6:00 PM",
    endTime: "08:00 PM",
    duration: "2 hours",
    upcomingDates: [
      {
        date: "2025-06-19",
        startTime: "6:00 PM",
        endTime: "09:00 PM",
        spotsLeft: 15,
        totalSpots: 15,
        status: "available",
      },
      {
        date: "2025-06-20",
        startTime: "10:00 AM",
        endTime: "10:00 PM",
        spotsLeft: 15,
        totalSpots: 15,
        status: "available",
      },
    ],
    price: 799,
    currency: "INR",
    isFree: false,
    capacity: 15,
    ticketsLeft: 15,
    heroImage: {
      url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748940564/Summer_HERO_veqoki.webp",
      alt: "Vibrant outdoor art festival with people browsing stalls",
    },
    galleryImages: [
      {
        id: "g1-2",
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748940564/SUmmer-Step2_brwfr0.webp",
        alt: "Live band performing on an outdoor stage at the art festival",
      },
      {
        id: "g1-3",
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748941319/myqhrnp1y3dse2axeg0l_mgsoal.png",
        alt: "Children participating in a hands-on art workshop at the festival",
      },

      {
        id: "g1-5",
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748969809/WhatsApp_Image_2025-06-03_at_14.57.35_88e14e43_ki3y57.jpg",
        alt: "Attendees works",
      },
      {
        id: "g1-6",
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748969809/WhatsApp_Image_2025-06-03_at_14.57.35_b18b86ca_wlkol7.jpg",
        alt: "Attendees works",
      },
      {
        id: "g1-4",
        url: "https://img.traveltriangle.com/blog/wp-content/uploads/2019/09/Restaurants-In-Bikaner.jpg",
        alt: "Artisan food truck serving customers at the festival",
      },
      {
        id: "g1-1",
        url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        alt: "Close-up of colorful abstract paintings at a festival stall",
      },
    ],
    // FIX: Changed host to be an array of hosts
    host: [
      {
        id: "h1",
        name: "Akansha Sharma",
        tagline: "Cultivating creativity, connecting communities.",
        avatar: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748969461/Akansha_Sharma_aexlhb.jpg",
          alt: "Akansha Sharma",
        },
        introVideoUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        introVideoPosterUrl:
          "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
        portfolioUrl: "https://www.instagram.com/akansha.sharma_/",
        hostRating: 4.8,
        hostReviewCount: 25,
        instagramHandle: "akansha.sharma_",
        verified: true,
        title: "Artist & Associate Dentist",
        bio: "I am Akanksha Sharma , an acrylic and watercolor artist. Creative art has been my go to especially in times when pressed by overwhelming emotions as it provides a healthy medium of expressing oneself . I wish to help others to utilise this meditative experience and thus introduce to them a tool they can access to process their feelings.",
        experience: "1+ years doing art workshops and community events",
        eventsHosted: 2,
      },
    ],
    venue: {
      id: "v1",
      name: "Bikanervala | Sector 62 Noida",
      address:
        "Ground Floor, TOWER-A, A-40, Block A, Industrial Area, Sector 62, Noida, Uttar Pradesh 201301",
      city: "NOIDA",
      state: "Uttar Pradesh",
      zipCode: "201301",
      mapUrl: "https://maps.google.com/?q=Bikanervala+Sector+62+Noida",
      directions:
        "Easily accessible via NOIDA electronic city metro station. Take a 5-min walk from the station.",
      venueImage: {
        url: "https://cdn.shopify.com/s/files/1/0774/9769/6567/files/Untitled_design_-_2024-07-18T140314.462_480x480.png?v=1721291681",
        alt: "Aerial view of Noida Bikanervala Grounds",
      },
      howToGetThere: {
        publicTransport: [
          "Blue Line Metro to Noida Sector 16, then 10-min auto ride.",
          "UPRTC Bus routes 347, 323 stop near the stadium.",
        ],
        parking:
          "Paid parking available within tower premises. Free street parking is limited.",
      },
      accessibility: [
        "Designated accessible parking near main entrances.",
        "Paved pathways suitable for wheelchairs and strollers.",
      ],
      amenities: [
        "Food & Beverage",
        "Restrooms (Male, Female, Accessible)",
        "First Aid & Emergency Services",
        "ATM Facility",
        "Shaded Seating Areas",
      ],
      isVerified: true,
    },
    averageRating: 4.8,
    reviewCount: 21,
    reviews: [
      {
        id: "r1-1",
        name: "Riya Kapoor",
        rating: 5,
        comment:
          "This was such a refreshing experience! I never thought painting could be so therapeutic. The guided exercises helped me express emotions I didn't even know I had. Plus, meeting others who share the same work-life struggles was so comforting.",
        date: "2025-06-14",
        verified: true,
      },
      {
        id: "r1-2",
        name: "Rahul Verma",
        rating: 4.5,
        comment:
          "I loved the focus on mindfulness and emotional expression rather than just technique. The atmosphere was so supportive and non-judgmental. I left feeling lighter and more connected to myself and others.",
        date: "2025-06-13",
        verified: true,
      },
      {
        id: "r1-3",
        name: "Sneha Agarwal",
        rating: 5,
        comment:
          "A wonderful way to unwind after a hectic week! The art materials provided were top-notch, and the food from Bikanervala was delicious. I highly recommend this to anyone looking for a creative outlet.",
        date: "2025-06-13",
        verified: true,
      },
    ],
    attendeeMoments: [
      {
        id: "am1-1",
        mediaUrl:
          "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748940564/Summer_HERO_veqoki.webp",
        mediaType: "image",
        altText: "Attendee capturing the vibrant festival atmosphere.",
        caption: "Loved the energy at the Summer Art Fest! #GoVibeful",
        attendee: {
          name: "Priya S.",
          avatarUrl: "https://i.pravatar.cc/150?u=priya",
        },
        timestamp: "2 days ago",
      },
      {
        id: "am1-2",
        mediaUrl:
          "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748940564/SUmmer-Step2_brwfr0.webp",
        mediaType: "image",
        altText: "My artwork in progress during the workshop.",
        caption: "So much fun learning new techniques!",
        attendee: {
          name: "Rohan M.",
          avatarUrl: "https://i.pravatar.cc/150?u=rohan",
        },
        timestamp: "June 10, 2024",
      },
      {
        id: "am1-3",
        mediaUrl:
          "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748941319/myqhrnp1y3dse2axeg0l_mgsoal.png",
        mediaType: "image",
        altText: "Connecting with fellow art enthusiasts.",
        caption: "Met some amazing people. ✨",
        attendee: {
          name: "Aisha K.",
          avatarUrl: "https://i.pravatar.cc/150?u=aisha",
        },
        timestamp: "June 9, 2024",
      },
      {
        id: "am1-4",
        mediaUrl:
          "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748969809/WhatsApp_Image_2025-06-03_at_14.57.35_88e14e43_ki3y57.jpg",
        mediaType: "image",
        altText: "Enjoying the delicious food at the event.",
        caption: "Art + Food = Perfect Evening!",
        attendee: { name: "Vikram J." },
        timestamp: "1 week ago",
      },
      {
        id: "am1-5",
        mediaUrl:
          "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748969809/WhatsApp_Image_2025-06-03_at_14.57.35_b18b86ca_wlkol7.jpg",
        mediaType: "image",
        altText: "My final creation from the workshop!",
        caption: "So proud of what I made! Thanks GoVibeful!",
        attendee: {
          name: "Sneha P.",
          avatarUrl: "https://i.pravatar.cc/150?u=sneha",
        },
        timestamp: "June 8, 2024",
      },
      {
        id: "am1-6",
        mediaUrl:
          "https://img.traveltriangle.com/blog/wp-content/uploads/2019/09/Restaurants-In-Bikaner.jpg",
        mediaType: "image",
        altText: "Chilling at Bikanervala after the workshop!",
        caption: "Great end to a creative session.",
        attendee: {
          name: "Amit B.",
          avatarUrl: "https://i.pravatar.cc/150?u=amit",
        },
        timestamp: "3 days ago",
      },
    ],
    skillLevel: "Everyone Welcome",
    ageRequirement: "All Ages",
    whatYoullDo: [
      {
        id: '343',
        title: "Welcome & Theme Immersion (Approx. 15-20 mins)",
        description:
          "Enjoy a welcome tea and brief introductions, followed by a guided breathing exercise to shift from a work mindset to a creative one, and an overview of the therapeutic painting process.",
        image: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748940564/Summer_step1_qeq94c.webp",
          alt: "Art gallery pavilion",
        },
      },
      {
        id: "343",
        title: "Mindful Art Creation (75 minutes)",
        description:
          "Experience color meditation to explore your emotional landscape, engage in mood mapping to visually express your feelings, and dive into intuitive painting to capture your summer mood without overthinking.",
        image: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748940564/gamkxopc3r7viuoyafex_r9xggv.webp",
          alt: "Live band on stage",
        },
      },
      {
        id: "434",
        title: "Share & Connect (20 minutes)",
        description:
          "Join an optional sharing circle to discuss your creative process, witness others' artistic expressions and stories, and build meaningful connections through vulnerability and authenticity.",
        image: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748940564/STEP4_h3exgm.webp",
          alt: "Variety of food dishes",
        },
      },
      {
        id: "45",
        title: "Your Artful Takeaway:  Nourish & Celebrate (10 minutes)",
        description:
          "Enjoy Bikanervala’s menu with ₹250 included per person, pack your artwork as a keepsake of your inner journey, and leave with your unique creation, a lighter spirit, and new connections.",
        image: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748940563/dzzdcrxd4wsfuy7a7yrt_lmr2jy.webp",
          alt: "Hands-on workshop",
        },
      },
    ],
    policies: {
      cancellation: "Full refund available up to 24 hours before the event",
      healthSafety:
        "Please follow all posted event guidelines. First aid available. If you feel unwell, please stay home.",
      refund: "All approved refunds processed within 24 hours.",
    },
    guidelines: [
      "We maintain a safe, inclusive space where everyone can explore freely",
      "Arrive 15 minutes early to check in and settle down.",
      "Respect others' creative processes and sharing choices.",
      "Bring an open mind and a willingness to explore your emotions through art.",
      "Support each other's artistic exploration without judgment",
    ],
    faqs: [
      {
        id: "faq1-1",
        question: "Are pets allowed at the festival?",
        answer:
          "Yes, leashed and well-behaved pets are welcome in outdoor park areas. Please clean up after your pet.",
      },
      {
        id: "faq1-2",
        question: "Is there an entry fee for children?",
        answer:
          "Children under 12 enter free when accompanied by a ticketed adult.",
      },
      {
        id: "faq1-3",
        question: "Can I re-enter the festival if I leave?",
        answer:
          "Yes, re-entry is permitted with a valid ticket/wristband for the same day.",
      },
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoPosterUrl:
      "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1748940564/Summer_HERO_veqoki.webp",
    goodToKnow: [
      {
        icon: undefined,
        heading: "All Painting Materials Provided",
        text: "Canvas, paints, brushes, and aprons — everything you need to express yourself is included.",
      },
      {
        icon: undefined,
        heading: "Food & Refreshments Included",
        text: "Enjoy delicious food and drinks worth up to ₹250 from the Bikanervala menu.",
      },
      {
        icon: undefined,
        heading: "Take Home Your Mood Memoir",
        text: "Leave with your personal painting — a colorful snapshot of your emotions and experience.",
      },
    ],
  },

  

  // Event 3: Myths We Inherit Art Exhibition (Past Event)
  {
    id: "3",
    name: "Myths We Inherit",
    slug: generateSlug("Myths We Inherit"),
    tagline:
      "A visual pilgrimage through mythological stories and ancestral memory",
    description:
      "Enter a transcendent journey where ancient wisdom meets contemporary artistic vision. 'Myths We Inherit' is a groundbreaking exhibition that explores how mythological narratives, ancestral memories, and cultural symbols shape our contemporary identity. Curated by visionary Prachi Kapoor, this show brings together three powerful voices: Tirthraj Sinh Zala from Rajkot with his 'Neelantara: A Mythic Blue Journey' series, Abhishek Pandey from Pune exploring inherited myths through mixed media, and Farwa Moledina from Birmingham interpreting cultural symbolism through contemporary visual art. Zala's work specifically focuses on the cosmic power of blue, ritualistic mark-making, and symbols derived from Rajputana heritage, offering a deeply personal and evocative exploration of mythology that feels both timeless and entirely of the present.",
    shortDescription:
      "A Multi-Artist Exhibition Exploring Cultural Heritage & Identity",
    type: "Art Exhibition",
    category: { id: "Art Exhibition", name: "Art Exhibition" },
    tags: [
      { id: "t7", name: "Contemporary Art" },
      { id: "t8", name: "Mythology" },
      { id: "t9", name: "Rajputana Heritage" },
      { id: "t10", name: "Blue Journey" },
      { id: "t11", name: "Ancestral Memory" },
      { id: "t12", name: "Visual Pilgrimage" },
      { id: "t13", name: "Neelantara Series" },
      { id: "t14", name: "Cultural Symbolism" },
    ],
    isFeatured: false,
    isTrending: false,
    status: "past", // Past event
    date: "2025-05-31", // Start date from the invite
    startTime: "6:00 PM",
    endTime: "9:00 PM",
    duration: "2 Days Exhibition",
    upcomingDates: [
      {
        date: "2025-05-31", // Preview Day 1
        startTime: "6:00 PM",
        endTime: "9:00 PM",
        spotsLeft: 0,
        totalSpots: 80,
        status: "past",
      },
      {
        date: "2025-06-01", // Preview Day 2
        startTime: "11:00 AM",
        endTime: "8:00 PM",
        spotsLeft: 0,
        totalSpots: 120,
        status: "past",
      },
    ],
    price: 0,
    currency: "INR",
    isFree: true,
    capacity: 120,
    ticketsLeft: 0,
    heroImage: {
      url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134006/Myth_gallery_2_-_Copy_qjxmq1.jpg",
      alt: "Contemporary art gallery with visitors viewing large-scale paintings",
    },
    galleryImages: [
      {
        id: "g2-1",
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134004/Language_art_-_Copy_rnc9hx.jpg",
        alt: "Tirthraj Sinh Zala's 'Neelantara' series featuring blue ritualistic figures with geometric patterns",
      },
      {
        id: "g2-2",
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134544/art_frl6ke.jpg",
        alt: "Close-up of Zala's intricate mark-making technique showing cosmic blue and orange patterns on human forms",
      },

      {
        id: "g2-3",
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134005/Myth_gallery_1_-_Copy_jy3shg.jpg",
        alt: "Abhishek Pandey's mixed media installation exploring inherited family myths and memories",
      },
      {
        id: "g2-4",
        url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134545/art_artwork_artgallery_artist_artcollector_artoftheday_artlover_artesanato_artcurator_artjournal_arte_artdaily_arts_artistic_contemporaryart_artgalleries_artistic_tattooart_modernart_ksujre.jpg",
        alt: "Farwa Moledina's contemporary interpretation of cultural symbols from Birmingham perspective",
      },
    ],
    // FIX: Changed host to be an array of hosts
    host: [
      {
        id: "h2",
        name: "Prachi Kapoor",
        tagline:
          "Bringing Fine Art into functional environments, believing in art that transcends traditional boundaries",
        avatar: {
          url: "https://media.licdn.com/dms/image/v2/D4D03AQH2nZGaM9wqIQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1728452638004?e=2147483647&v=beta&t=RAPuGe0rFl4L2srbERKkBMK36ZgYNny2OE_MqUHXkH0",
          alt: "Prachi Kapoor, Founder & Curator of Artura Spaces",
        },
        title: "Founder & Curator, Artura Spaces",
        bio: "Prachi Kapoor is the visionary founder of Artura Spaces, dedicated to creating dialogue between local and international artists while exploring stories, materials, cultures, and people. With a philosophy that art should transcend the confines of traditional galleries and collector storage units, she curates exhibitions that bring powerful voices together. Her curatorial approach focuses on creating space for meaningful artistic dialogue, as demonstrated in 'Myths We Inherit' where she brings together three distinct voices—each exploring myths, memories, and cultural symbols that shape identity.",
        experience:
          "8+ years creating dialogue-focused contemporary art exhibitions",
        eventsHosted: 25,
        verified: true,
      },
    ],
    venue: {
      id: "v2",
      name: "Artura Spaces",
      address:
        "Divine Chairs D-7, Arna Industrial Estate, Sakinaka Road, Sakinaka, Andheri (E), Mumbai - 400 072",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400072",
      mapUrl: "https://maps.google.com/?q=Artura+Spaces+Sakinaka+Mumbai",
      directions:
        "Located in Sakinaka's industrial arts district, easily accessible via Western Railway and Metro.",
      venueImage: {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpvXvg7lZ_Fuum33n-xPAK0_0iVydHtJcyDg&s",
        alt: "Artura Spaces contemporary gallery with industrial aesthetic",
      },
      howToGetThere: {
        publicTransport: [
          "Western Railway: Andheri Station (10-minute auto ride to Sakinaka)",
          "Mumbai Metro: Andheri Metro Station, then auto/taxi to venue",
          "BEST Bus: Routes to Sakinaka from various parts of Mumbai",
        ],
        parking:
          "Industrial area parking available. Street parking accessible during exhibition hours.",
      },
      accessibility: [
        "Ground floor gallery space with easy access",
        "Wide entrance suitable for wheelchairs",
        "Accessible restroom facilities",
      ],
      amenities: [
        "Climate-controlled industrial gallery space",
        "Professional lighting for art viewing",
        "Comfortable seating areas for reflection",
        "Refreshment area during openings",
        "Artist catalogues and exhibition materials",
        "WiFi access for visitors",
      ],
      isVerified: true,
    },
    averageRating: 4.7,
    reviewCount: 89,
    reviews: [
      {
        id: "r2-1",
        name: "Aditi Sharma",
        rating: 5,
        comment:
          "Zala's 'Neelantara' series was absolutely mesmerizing! The way he uses blue to create this cosmic, ritualistic journey through mythology - it felt like meditation. The conversation with Prachi about his Rajputana heritage added so much depth to understanding the work.",
        date: "2025-06-02",
        verified: true,
      },
      {
        id: "r2-2",
        name: "Rohit Mehta",
        rating: 5,
        comment:
          "What struck me most was how Tirthraj's work connects ancient symbols with contemporary mark-making. The podcast conversation revealed how his travels across India inform his deeply personal mythology exploration. Truly transcendent art.",
        date: "2025-06-01",
        verified: true,
      },
      {
        id: "r2-3",
        name: "Kavya Patel",
        rating: 4,
        comment:
          "The exhibition brilliantly showcases how myths shape our identity. Zala's blue journey felt like a spiritual pilgrimage, and the way all three artists' works dialogue with each other shows Prachi's exceptional curatorial vision.",
        date: "2025-06-01",
        verified: true,
      },
    ],
    skillLevel: "All Art Enthusiasts",
    ageRequirement: "All Ages (Children under 16 with adult supervision)",
    whatYoullDo: [
      {
        id: '4334',
        title: "Welcome & Exhibition Overview (15 minutes)",
        description:
          "Begin with a curator-led introduction to the exhibition's themes and artists. Receive a detailed gallery map and insights into the conceptual framework connecting the three distinct practices.",
        image: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134005/Welcome_Exhibition_rqhz6k.jpg",
          alt: "Curator speaking to a small group in gallery entrance",
        },
      },
      {
        id: '34',
        title:
          "Tirthraj Sinh Zala: Neelantara - A Mythic Blue Journey (45 minutes)",
        description:
          "Immerse yourself in Zala's transformative 'Neelantara' series, where the cosmic power of blue meets ritualistic mark-making. Discover how his Rajputana heritage and travels across India inform this deeply personal mythology exploration, as featured in The Aishya Magazine's exclusive artist conversation.",
        image: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134004/Tirthraj_journey_zobcni.jpg",
          alt: "Zala's 'Neelantara' featuring blue ritualistic figures with intricate geometric patterns",
        },
      },
      {
        id: '34',
        title: "Abhishek Pandey: Memory Fragments (30 minutes)",
        description:
          "Engage with Pandey's mixed-media installations that reconstruct familial and collective memories, inviting viewers to consider how personal histories shape identity formation.",
        image: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134004/Memory_Fragments_angwd3.jpg",
          alt: "Mixed media installation with photographs and found objects",
        },
      },
      {
        id: 'de4',
        title: "Farwa Moledina: Psychedelic Repetitions (30 minutes)",
        description:
          "Experience Moledina's hypnotic works that use repetitive patterns and vibrant colors to explore the cyclical nature of cultural transmission and transformation.",
        image: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134004/Myth_gallery_1_cnnt56.jpg",
          alt: "Colorful psychedelic artwork with repetitive patterns",
        },
      },
      {
        id: 'e34',
        title: "Reflection & Discussion (15 minutes)",
        description:
          "Conclude your visit in the dedicated reflection space where you can journal your thoughts, participate in guided discussions, or simply contemplate the themes explored.",
        image: {
          url: "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134003/gallery_3_cbbks3.jpg",
          alt: "Visitors sitting and discussing art in gallery seating area",
        },
      },
    ],
    policies: {
      cancellation: "Free cancellation up to 2 hours before visit time",
      healthSafety:
        "Gallery maintains COVID-19 protocols. Photography permitted without flash. No touching of artworks.",
      refund:
        "Full refunds processed within 48 hours for approved cancellations.",
    },
    guidelines: [
      "Maintain respectful distance from all artworks",
      "Keep voices low to preserve the contemplative atmosphere",
      "Children under 16 must be accompanied by adults at all times",
      "No food or beverages in exhibition areas (café available separately)",
      "Turn mobile devices to silent mode during your visit",
      "Engage respectfully with other visitors and gallery staff",
    ],
    faqs: [
      {
        id: "faq2-1",
        question: "How long should I plan for my visit?",
        answer:
          "We recommend allowing 2-2.5 hours for a comprehensive experience, though you're welcome to stay longer. The exhibition is designed for contemplative viewing.",
      },
      {
        id: "faq2-2",
        question: "Are guided tours available?",
        answer:
          "Yes, curator-led tours are available on weekends at 3 PM and 6 PM. Private group tours can be arranged by calling +91 91368 66779.",
      },
      {
        id: "faq2-3",
        question: "Can I purchase artworks from the exhibition?",
        answer:
          "Yes, most pieces are available for purchase. Please speak with gallery staff for pricing and acquisition information.",
      },
      {
        id: "faq2-5",
        question:
          "What makes Tirthraj Sinh Zala's 'Neelantara' series special?",
        answer:
          "'Neelantara: A Mythic Blue Journey' explores the cosmic power of blue through ritualistic mark-making and symbols from Rajputana heritage. As featured in The Aishya Magazine, Zala's work offers a deeply personal and evocative exploration of mythology that feels both timeless and contemporary.",
      },
    ],
    videoUrl:
      "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134006/Myth_gallery_2_-_Copy_qjxmq1.jpg",
    videoPosterUrl:
      "https://res.cloudinary.com/dv9mzq2bv/image/upload/v1749134006/Myth_gallery_2_-_Copy_qjxmq1.jpg",
    // FIX: Replaced incorrect goodToKnow data with an empty array.
    goodToKnow: [],
  },
];