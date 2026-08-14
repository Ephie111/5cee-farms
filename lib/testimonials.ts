export type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number; // 0-5
  quote: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ngozi A.",
    location: "Awka, Anambra State",
    rating: 5,
    quote:
      "The freshest chicken I have bought in Awka. No smell, no mess, and it cooks so much better than what I used to get at the market.",
  },
  {
    id: "t2",
    name: "Chef Emeka O.",
    location: "Restaurant owner, Onitsha",
    rating: 5,
    quote:
      "We order in bulk every week for the restaurant. Consistent sizing, on-time delivery, and our customers can taste the difference.",
  },
  {
    id: "t3",
    name: "Blessing U.",
    location: "Nnewi, Anambra State",
    rating: 4,
    quote:
      "Ordering was simple and the delivery rider was courteous. My family's new go-to for Sunday chicken.",
  },
];