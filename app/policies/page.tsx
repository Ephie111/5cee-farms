import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PolicyH2, PolicyP, PolicyList } from "@/components/policy/PolicySection";

const TABS = [
  { href: "#return-refund", label: "Return & Refund Policy" },
  { href: "#delivery", label: "Delivery Information & Policy" },
];

export default function PoliciesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Page header */}
        <section className="bg-forest py-14">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <span className="section-eyebrow text-gold">Good to Know</span>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Return, Refund &amp; Delivery Policy
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Please read this page carefully before placing an order with 5CEE
              Farms Ltd.
            </p>
          </div>
        </section>

        {/* In-page nav */}
        <div className="sticky top-[73px] z-40 border-b border-forest/10 bg-cream/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl gap-6 overflow-x-auto px-6 py-3 lg:px-10">
            {TABS.map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className="whitespace-nowrap text-sm font-semibold text-forest hover:text-gold-dark"
              >
                {tab.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-14 lg:px-10">
          {/* ============ RETURN & REFUND POLICY ============ */}
          <section id="return-refund" className="scroll-mt-32">
            <h2 className="text-2xl font-bold sm:text-3xl">Return and Refund Policy</h2>
            <PolicyP>
              At 5CEE Farms Ltd., we are committed to providing our customers with
              high-quality, healthy, and organically raised poultry products.
              Customer satisfaction is important to us, and this policy outlines
              the conditions under which returns, replacements, and refunds may
              be granted.
            </PolicyP>

            <PolicyH2>1. Live Chickens</PolicyH2>
            <PolicyP>
              All live chickens are inspected before they leave our farm to
              ensure they are healthy and fit for sale.
            </PolicyP>
            <PolicyList
              items={[
                "Customers are encouraged to inspect the birds before taking delivery.",
                "Once live birds have been accepted and leave the farm or are delivered to the customer, they cannot be returned due to biosecurity and disease prevention measures.",
                "Refunds or replacements will only be considered if the customer can demonstrate that the birds were dead or seriously ill at the time of delivery.",
                "Any concerns regarding live birds must be reported within 2 hours of delivery and must be supported with clear photographs or videos.",
              ]}
            />

            <PolicyH2>2. Processed Chickens</PolicyH2>
            <PolicyP>
              We maintain strict hygiene and quality control standards during
              processing. Processed chickens may be eligible for replacement or
              refund if:
            </PolicyP>
            <PolicyList
              items={[
                "The wrong order was supplied.",
                "The product was damaged before delivery.",
                "The product was spoiled upon delivery due to factors within our control.",
                "The quantity delivered is less than the quantity purchased.",
              ]}
            />
            <PolicyP>
              Claims must be made within 24 hours of receiving the order and
              must include photographs or other reasonable evidence.
            </PolicyP>

            <PolicyH2>Non-Returnable Items</PolicyH2>
            <PolicyP>The following items are not eligible for return or refund:</PolicyP>
            <PolicyList
              items={[
                "Products improperly stored after delivery.",
                "Products damaged due to customer handling or negligence.",
                "Products purchased at discounted or clearance prices (unless defective).",
                "Live birds that become sick or die after delivery due to the customer's management, transportation, feeding, or environmental conditions.",
              ]}
            />

            <PolicyH2>Order Cancellations</PolicyH2>
            <PolicyList
              items={[
                "Orders cancelled at least 24 hours before the scheduled delivery or pickup may receive a full refund.",
                "Orders cancelled less than 24 hours before delivery may be subject to a cancellation fee to cover production and logistics costs.",
                "Custom or bulk orders prepared specifically for a customer may not be cancelled once processing has begun.",
              ]}
            />

            <PolicyH2>Refund Process</PolicyH2>
            <PolicyP>Where a refund is approved:</PolicyP>
            <PolicyList
              items={[
                "Refunds will be processed using the original payment method whenever possible.",
                "Approved refunds will typically be completed within 5–10 business days.",
                "Alternatively, at the customer's request, a replacement product or store credit may be provided instead of a cash refund.",
              ]}
            />

            <PolicyH2>Limitation of Liability</PolicyH2>
            <PolicyP>
              5CEE Farms Ltd.&rsquo;s liability is limited to the purchase price
              of the affected product. We are not responsible for indirect,
              incidental, or consequential losses arising from the use of our
              products.
            </PolicyP>
          </section>

          <hr className="my-14 border-forest/10" />

          {/* ============ DELIVERY INFORMATION & POLICY ============ */}
          <section id="delivery" className="scroll-mt-32">
            <h2 className="text-2xl font-bold sm:text-3xl">Delivery Information &amp; Policy</h2>
            <PolicyP>
              At 5CEE Farms Ltd., we strive to provide timely, reliable, and
              safe delivery of our live and processed poultry products. This
              policy outlines our delivery procedures and customer
              responsibilities.
            </PolicyP>

            <PolicyH2>Delivery Areas</PolicyH2>
            <PolicyP>
              We currently deliver within Awka, Onitsha, Nnewi, and other parts
              of the southeast. Deliveries to other states may be arranged upon
              request, subject to availability and applicable transportation
              charges.
            </PolicyP>

            <PolicyH2>Delivery Schedule</PolicyH2>
            <PolicyList
              items={[
                "Deliveries are made Monday through Saturday.",
                "Orders are delivered during agreed delivery windows.",
                "Customers will be notified if unforeseen circumstances result in delays.",
              ]}
            />

            <PolicyH2>Order Processing</PolicyH2>
            <PolicyList
              items={[
                "Orders are processed after payment has been confirmed, unless otherwise agreed.",
                "Large or bulk orders should be placed at least 24–72 hours in advance to ensure availability.",
                "Orders are fulfilled on a first-paid, first-served basis.",
              ]}
            />

            <PolicyH2>Delivery Charges</PolicyH2>
            <PolicyList
              items={[
                "Delivery fees are based on the delivery location, order size, and transportation requirements.",
                "Customers will be informed of the applicable delivery charge before confirming their order.",
                "Promotional free delivery offers, where applicable, are subject to stated terms and conditions.",
              ]}
            />

            <PolicyH2>Delivery of Live Chickens</PolicyH2>
            <PolicyList
              items={[
                "Live birds are transported in suitable crates to minimize stress and maintain their health.",
                "Customers are expected to receive the birds immediately upon arrival.",
                "Ownership and responsibility for the birds transfer to the customer once delivery has been completed.",
              ]}
            />

            <PolicyH2>Delivery of Processed Chickens</PolicyH2>
            <PolicyList
              items={[
                "Processed chickens are packaged hygienically to maintain freshness and quality.",
                "Customers should refrigerate or freeze products immediately upon receipt.",
                "5CEE Farms Ltd. is not responsible for product deterioration resulting from delays in collection or improper storage after delivery.",
              ]}
            />

            <PolicyH2>Customer Responsibilities</PolicyH2>
            <PolicyP>Customers are responsible for:</PolicyP>
            <PolicyList
              items={[
                "Providing an accurate delivery address and contact phone number.",
                "Ensuring someone is available to receive the order.",
                "Inspecting the order upon delivery and reporting any issues immediately.",
              ]}
            />

            <PolicyH2>Failed Deliveries</PolicyH2>
            <PolicyP>A delivery may be considered unsuccessful if:</PolicyP>
            <PolicyList
              items={[
                "The customer is unavailable at the agreed delivery time.",
                "The delivery address provided is incorrect or inaccessible.",
                "The customer cannot be reached using the provided contact information.",
              ]}
            />
            <PolicyP>Where a delivery fails due to customer-related reasons:</PolicyP>
            <PolicyList
              items={[
                "Additional delivery charges may apply for re-delivery.",
                "Perishable products may not be eligible for replacement or refund.",
                "Orders left unattended at the customer's request become the customer's responsibility once delivered.",
              ]}
            />

            <PolicyH2>Delivery Delays</PolicyH2>
            <PolicyP>While we make every effort to deliver on time, delays may occur due to:</PolicyP>
            <PolicyList
              items={["Traffic conditions", "Weather", "Vehicle breakdowns", "Road closures", "Other unforeseen circumstances"]}
            />
            <PolicyP>
              We will notify customers as soon as reasonably possible if delays
              occur.
            </PolicyP>

            <PolicyH2>Inspection Upon Delivery</PolicyH2>
            <PolicyP>
              Customers should inspect their order immediately upon receipt. Any
              shortages, damaged packaging, or incorrect items should be
              reported before the delivery personnel leave the premises or
              within 2 hours of delivery, accompanied by photographs where
              applicable.
            </PolicyP>

            <PolicyH2>Biosecurity</PolicyH2>
            <PolicyP>For the health and safety of our poultry:</PolicyP>
            <PolicyList
              items={[
                "Delivered live birds cannot be returned to the farm.",
                "Our delivery personnel follow farm biosecurity procedures during transportation and delivery.",
              ]}
            />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}