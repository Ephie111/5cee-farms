export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  category: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    category: "Ordering & Payment",
    items: [
      {
        question: "How do I place an order?",
        answer:
          "Browse the Shop, add items to your cart, and check out. You'll need an account to complete an order — registering only takes a minute.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "Card, bank transfer, and USSD (all processed securely via Paystack), plus Pay on Delivery for orders within our delivery areas.",
      },
      {
        question: "Is it safe to pay online?",
        answer:
          "Yes. We never see or store your card details — payments are handled directly by Paystack, a licensed payment processor, and we only receive confirmation of whether the payment succeeded.",
      },
    ],
  },
  {
    category: "Delivery",
    items: [
      {
        question: "Which areas do you deliver to?",
        answer:
          "We currently deliver within Awka, Onitsha, Nnewi, and other parts of the southeast. Deliveries to other states may be arranged on request, subject to availability and transportation charges.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Deliveries run Monday through Saturday, within the time slot you choose at checkout. We'll notify you directly if anything causes an unexpected delay.",
      },
      {
        question: "Do I need to be home to receive my order?",
        answer:
          "Yes — please make sure someone is available at the delivery address during your chosen time slot. This matters especially for live birds and perishable products, which need to be received and inspected promptly.",
      },
      {
        question: "Is there a delivery fee?",
        answer:
          "Delivery fees depend on your location and order size, and are shown clearly at checkout before you pay.",
      },
    ],
  },
  {
    category: "Products & Freshness",
    items: [
      {
        question: "How fresh is your chicken?",
        answer:
          "Whole chicken and cuts are processed and chilled the same day for maximum freshness — no additives, no preservatives. Frozen options are also available for longer storage.",
      },
      {
        question: "What's the difference between live and processed chicken?",
        answer:
          "Live birds are farm-raised, inspected before dispatch, and delivered in ventilated crates — you receive a live, healthy bird. Processed chicken is already cleaned, portioned, and ready to cook or freeze.",
      },
      {
        question: "Do product weights vary?",
        answer:
          "Yes — because these are real agricultural products, actual weight can vary slightly from the listed range. Photos are for general representation and may not exactly match the individual product you receive.",
      },
    ],
  },
  {
    category: "Returns & Issues",
    items: [
      {
        question: "What if something's wrong with my order?",
        answer:
          "Report it as soon as possible — within 2 hours of delivery for live birds, or 24 hours for processed products — with photos where possible. See our full Return & Refund Policy for details.",
      },
      {
        question: "Can I cancel an order?",
        answer:
          "Orders cancelled at least 24 hours before delivery are eligible for a full refund. Orders already processed, packaged, or dispatched may not be eligible for cancellation.",
      },
      {
        question: "Do you offer bulk or wholesale pricing?",
        answer:
          "Yes — for restaurants, caterers, and events. Visit our Bulk & Wholesale Orders page to send us your requirements and get a custom quote.",
      },
    ],
  },
];