import * as z from "zod";

export const ART_FORMS_DATA = [
  { id: "painting", name: "🎨 Painting" },
  { id: "drawing", name: "✏️ Drawing" },
  { id: "photography", name: "📷 Photography" },
  { id: "pottery-ceramics", name: "🏺 Pottery & Ceramics" },
  { id: "jewelry", name: "💎 Jewelry Making" },
  { id: "printmaking", name: "🖨️ Printmaking" },
  { id: "mixed-media", name: "🎭 Mixed Media" },
  { id: "digital-art", name: "💻 Digital Art" },
  { id: "sculpture", name: "🗿 Sculpture" },
  { id: "textiles", name: "🧵 Textiles & Fiber Arts" },
  { id: "music-performance", name: "🎶 Music & Performance" },
  { id: "culinary-arts", name: "🍲 Culinary Arts" },
  { id: "literary-arts", name: "✍️ Literary Arts & Writing" },
  { id: "other", name: "✨ Other Creative Forms" },
] as const; // Use 'as const' for Zod enum derivation

const artFormIds = ART_FORMS_DATA.map((form) => form.id);

export const stage1RegisterSchema = z.object({
  fullName: z.string().min(2, "Full name is required (min 2 characters)"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(
      8,
      "Password must include at least 8 characters, letters, and numbers."
    ),
  // Example: .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, "Password needs letters & numbers."),
  city: z.string().min(2, "City is required for local discovery"),
  artForms: z
    .array(z.enum(artFormIds as [string, ...string[]])) // Array of selected art form IDs
    .min(1, "Please select at least one art form.")
    .max(5, "Please select up to 5 art forms."), // Optional: limit max selections
  instagramHandle: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9._]{1,30}$/.test(val), {
      message: "Invalid Instagram handle format.",
    }),
  agreedToGuidelines: z.literal<boolean>(true, {
    errorMap: () => ({
      message: "You must agree to the community guidelines.",
    }),
  }),
  agreedToTerms: z.literal<boolean>(true, {
    errorMap: () => ({
      message: "You must agree to the terms and privacy policy.",
    }),
  }),
});

export type Stage1RegisterValues = z.infer<typeof stage1RegisterSchema>;

export const INITIAL_ARTIST_REGISTER_VALUES: Stage1RegisterValues = {
  fullName: "",
  email: "",
  password: "",
  city: "",
  artForms: [],
  instagramHandle: "",
  agreedToGuidelines: false,
  agreedToTerms: false,
};
