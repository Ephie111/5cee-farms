export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[]; // one array item per paragraph
  category: "Recipes" | "Farm Updates" | "Nutrition" | "Behind the Scenes";
  publishedAt: string; // ISO date
  author: string;
  readTimeMinutes: number;
};

// NOTE: Static content for now. A future step could move this into
// Supabase with an admin-managed Blog Posts page, similar to how
// Products started as a static array before being connected.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "5-easy-ways-to-cook-whole-chicken",
    title: "5 Easy Ways to Cook a Whole Chicken at Home",
    excerpt:
      "From peppered chicken to oven roast — five simple, reliable ways to turn a fresh whole chicken into a family meal.",
    category: "Recipes",
    publishedAt: "2026-07-14",
    author: "5CEE Farms Team",
    readTimeMinutes: 5,
    content: [
      "A good whole chicken doesn't need much — just a bit of care and the right method. Here are five ways to prepare yours, whichever mood (or occasion) you're cooking for.",
      "1. Peppered Chicken: Boil the chicken with onions, stock cubes, and a little ginger-garlic until tender, then fry until golden. Toss in a hot pepper sauce and serve with jollof rice or fried plantain.",
      "2. Oven Roast: Rub with butter, garlic, and your favourite dried herbs, then roast at 180°C for about an hour, basting halfway through. Simple, and always a crowd-pleaser.",
      "3. Chicken Pepper Soup: Cut the chicken into pieces, boil with uziza seeds, pepper soup spice, and scent leaf. Ready in under 40 minutes — perfect for a cold evening.",
      "4. Grilled Chicken: Marinate overnight in a mix of yogurt, paprika, and lemon juice, then grill over charcoal or in the oven until the skin is crisp.",
      "5. Chicken Stew: Blend fresh tomatoes and peppers, fry down with onions and a little tomato paste, then simmer the chicken in the sauce until it's soaked up all the flavour.",
      "Whichever method you choose, always cook chicken thoroughly before eating — juices should run clear, with no pink remaining near the bone.",
    ],
  },
  {
    slug: "why-freshness-matters",
    title: "Why Same-Day Processing Matters More Than You Think",
    excerpt:
      "The difference between chicken processed the same day and chicken that's sat in a market stall since morning — and why it matters for your health.",
    category: "Nutrition",
    publishedAt: "2026-06-30",
    author: "5CEE Farms Team",
    readTimeMinutes: 4,
    content: [
      "Not all chicken is created equal — and a lot of that comes down to something simple: how quickly it's processed and how it's handled afterward.",
      "When chicken sits at room temperature for extended periods, bacteria multiply quickly, increasing the risk of foodborne illness — even if the meat still looks and smells fine on the surface.",
      "At 5CEE Farms, whole chickens and cuts are processed and chilled the same day, then packaged and kept refrigerated right up until delivery. No additives, no preservatives — just proper cold-chain handling from farm to your fridge.",
      "The result isn't just peace of mind — it's also better texture and flavour, since freshly processed meat holds moisture and tenderness far better than chicken that's been sitting out.",
      "Our simple rule of thumb for you at home: refrigerate or freeze your order as soon as it arrives, and cook thoroughly before eating. Freshness on our end only matters if it's protected on yours too.",
    ],
  },
  {
    slug: "inside-5cee-farms",
    title: "A Day at 5CEE Farms: From Feed to Farm Gate",
    excerpt:
      "A behind-the-scenes look at what a normal day looks like on our farm in Ifite, Awka South LGA.",
    category: "Behind the Scenes",
    publishedAt: "2026-06-10",
    author: "5CEE Farms Team",
    readTimeMinutes: 6,
    content: [
      "Mornings at 5CEE Farms start early — feeding and health checks begin before sunrise, well before the rest of the day's work gets underway.",
      "Our team follows strict biosecurity procedures at every stage: controlled access to the birds' housing, regular sanitation, and careful monitoring for any sign of illness. It's not glamorous work, but it's the foundation of everything we promise our customers.",
      "By mid-morning, the day's orders are reviewed and processing begins for anything scheduled to go out fresh. Birds are handled, processed, and chilled the same day — no shortcuts, no sitting around.",
      "In the afternoon, packaged orders move into cold storage or straight onto our delivery vehicles, depending on the day's schedule. Live bird orders are loaded into ventilated crates designed to keep the birds calm and healthy during transport.",
      "It's a long day, start to finish — but it's exactly what lets us stand behind the words on our packaging: Fresh. Clean. Trusted.",
    ],
  },
  {
    slug: "choosing-the-right-cut",
    title: "Breast, Thigh, or Wing? Choosing the Right Cut for Your Recipe",
    excerpt:
      "A quick guide to which chicken cut works best for which dish — so you're not guessing at the market or in our Shop.",
    category: "Recipes",
    publishedAt: "2026-05-22",
    author: "5CEE Farms Team",
    readTimeMinutes: 4,
    content: [
      "Not every dish calls for the same cut of chicken — and picking the right one can make a real difference in how a meal turns out.",
      "Chicken Breast: Lean and mild-flavoured, best for grilling, pan-searing, or dicing into stir-fries and salads. Cooks quickly, so watch it closely to avoid drying it out.",
      "Thighs & Drumsticks: More fat and connective tissue means more flavour and forgiveness — perfect for soups, stews, and slow-cooked dishes where the meat has time to become tender.",
      "Wings: Small and quick-cooking, ideal for grilling, frying, or baking with a bold marinade — a party favourite and a pepper-soup staple.",
      "Gizzard: Often overlooked, but a favourite in many Nigerian kitchens — great peppered, grilled on skewers, or added to a rich stew.",
      "Whichever cut you're after, freshness matters more than the cut itself — which is exactly why every pack we sell is cleaned, portioned, and sealed the same day it's prepared.",
    ],
  },
];

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(post: BlogPost, count = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, count);
}

export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" });
}