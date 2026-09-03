import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PolicyH2, PolicyP, PolicyList } from "@/components/policy/PolicySection";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-forest py-14">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <span className="section-eyebrow text-gold">Legal</span>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Terms and Conditions</h1>
            <p className="mt-2 text-sm text-white/70">5CEE Farms Limited · Effective Date: August 13, 2026</p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6 py-14 lg:px-10">
          <PolicyP>
            Welcome to 5CEE Farms Limited. These Terms and Conditions govern
            your use of our website, online platforms, and the purchase of
            products and services from 5CEE Farms Limited (&ldquo;5CEE
            Farms,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;).
          </PolicyP>
          <PolicyP>
            By accessing our website, placing an order, making a payment, or
            purchasing our products, you agree to these Terms and Conditions.
          </PolicyP>

          <PolicyH2>1. About 5CEE Farms Limited</PolicyH2>
          <PolicyP>
            5CEE Farms Limited is an agro-allied company engaged in poultry
            production and related agricultural activities. We supply live
            and processed chickens and may provide delivery and other
            related services.
          </PolicyP>
          <PolicyP>
            Our operations are based in Ifite, Awka South Local Government
            Area, Anambra State, Nigeria.
          </PolicyP>

          <PolicyH2>2. Products and Services</PolicyH2>
          <PolicyP>
            We make reasonable efforts to ensure that descriptions,
            photographs, weights, quantities, prices, and other information
            relating to our products are accurate.
          </PolicyP>
          <PolicyP>
            Because poultry products are agricultural products, actual
            weight, size, appearance, and availability may vary. Images
            displayed on our website or promotional materials are for
            general representation and may not exactly reflect the product
            received.
          </PolicyP>
          <PolicyP>All products are subject to availability.</PolicyP>

          <PolicyH2>3. Orders</PolicyH2>
          <PolicyP>
            Orders may be accepted through our website or other authorized
            sales channels operated by 5CEE Farms Limited.
          </PolicyP>
          <PolicyP>
            An order is not considered fully confirmed until we have
            accepted the order and, where applicable, received the required
            payment.
          </PolicyP>
          <PolicyP>We reserve the right to decline or cancel an order where:</PolicyP>
          <PolicyList
            items={[
              "The requested product is unavailable;",
              "Incorrect pricing or product information was displayed;",
              "Payment cannot be verified;",
              "Delivery to the requested location is unavailable;",
              "We reasonably suspect fraudulent or unauthorized activity; or",
              "Circumstances outside our reasonable control prevent us from fulfilling the order.",
            ]}
          />
          <PolicyP>
            If we cancel an order after receiving payment, any amount due
            for refund will be processed in accordance with our refund
            policy.
          </PolicyP>

          <PolicyH2>4. Prices and Payment</PolicyH2>
          <PolicyP>
            All prices are stated in Nigerian Naira (₦) unless otherwise
            indicated.
          </PolicyP>
          <PolicyP>
            Prices may change based on market conditions, production costs,
            bird weight, processing requirements, delivery location, or
            other relevant factors.
          </PolicyP>
          <PolicyP>
            The price applicable to an order will normally be the price
            confirmed at the time the order is accepted.
          </PolicyP>
          <PolicyP>
            Customers are responsible for providing accurate payment
            information. Orders may not be released or delivered until
            payment has been confirmed, except where 5CEE Farms Limited has
            expressly approved a credit arrangement.
          </PolicyP>

          <PolicyH2>5. Credit Sales</PolicyH2>
          <PolicyP>
            Credit purchases are available only when expressly approved by
            management.
          </PolicyP>
          <PolicyP>
            Unless otherwise agreed in writing, approved credit purchases
            must be paid within the agreed credit period. Customers with
            overdue balances may have their credit privileges suspended and
            may be required to make full payment before subsequent orders
            are processed.
          </PolicyP>
          <PolicyP>
            5CEE Farms Limited reserves the right to modify or withdraw
            credit privileges at its discretion.
          </PolicyP>

          <PolicyH2>6. Delivery</PolicyH2>
          <PolicyP>We may provide delivery services to selected locations.</PolicyP>
          <PolicyP>
            Customers must provide accurate names, telephone numbers,
            delivery addresses, and any instructions reasonably necessary to
            complete delivery.
          </PolicyP>
          <PolicyP>
            Estimated delivery dates and times are provided in good faith
            but are not guaranteed. Delays may occur because of traffic,
            weather, vehicle problems, security conditions, product
            availability, or other circumstances outside our reasonable
            control.
          </PolicyP>
          <PolicyP>
            Customers or their authorized representatives should be
            available to receive and inspect orders at the agreed delivery
            location.
          </PolicyP>
          <PolicyP>
            Additional delivery charges may apply depending on the
            destination, quantity ordered, or delivery requirements.
          </PolicyP>

          <PolicyH2>7. Live Chickens</PolicyH2>
          <PolicyP>
            Customers purchasing live chickens are responsible for properly
            handling and caring for the birds after delivery or collection.
          </PolicyP>
          <PolicyP>
            Customers should inspect live birds at the time they are
            received and promptly report any material concern to us.
          </PolicyP>
          <PolicyP>
            Once live birds have been accepted by the customer, 5CEE Farms
            Limited cannot ordinarily be responsible for subsequent
            mortality, injury, improper handling, transportation conditions,
            feeding, environmental exposure, disease exposure, or other
            circumstances occurring after the birds have left our custody,
            except where liability arises under applicable law.
          </PolicyP>

          <PolicyH2>8. Processed Poultry Products</PolicyH2>
          <PolicyP>
            Processed poultry products should be inspected promptly upon
            delivery.
          </PolicyP>
          <PolicyP>
            Customers are responsible for maintaining appropriate
            refrigeration or freezing conditions after receiving the
            products.
          </PolicyP>
          <PolicyP>
            For food-safety reasons, processed or perishable poultry
            products generally cannot be returned once accepted unless the
            products were incorrect, damaged, spoiled at the time of
            delivery, or otherwise defective.
          </PolicyP>
          <PolicyP>
            Any concern regarding the condition of a processed product
            should be reported as soon as reasonably possible after
            delivery, together with photographs or other information that
            may assist us in reviewing the matter.
          </PolicyP>

          <PolicyH2>9. Returns, Refunds and Replacements</PolicyH2>
          <PolicyP>
            Due to the perishable nature of poultry products, returns are
            subject to food-safety considerations.
          </PolicyP>
          <PolicyP>
            Where we confirm that an incorrect, damaged, spoiled, or
            otherwise defective product was supplied by us, we may, as
            appropriate:
          </PolicyP>
          <PolicyList
            items={["Replace the affected product;", "Issue store credit; or", "Provide a full or partial refund."]}
          />
          <PolicyP>
            Refunds or replacements will be assessed based on the
            circumstances of each order and applicable consumer protection
            laws.
          </PolicyP>
          <PolicyP>
            Nothing in these Terms limits any statutory rights that cannot
            legally be excluded.
          </PolicyP>

          <PolicyH2>10. Cancellations</PolicyH2>
          <PolicyP>
            Customers should contact us as soon as possible if an order
            needs to be cancelled.
          </PolicyP>
          <PolicyP>
            Orders that have already been processed, slaughtered, packaged,
            dispatched, or specially prepared may not be eligible for
            cancellation or a full refund.
          </PolicyP>
          <PolicyP>
            Bulk and customized orders may be subject to separate
            cancellation requirements communicated at the time of ordering.
          </PolicyP>

          <PolicyH2>11. Food Handling</PolicyH2>
          <PolicyP>
            Customers purchasing processed poultry products are responsible
            for safely storing, preparing, and cooking the products after
            delivery.
          </PolicyP>
          <PolicyP>
            Raw poultry should be handled in accordance with appropriate
            food-safety practices and thoroughly cooked before consumption.
          </PolicyP>

          <PolicyH2>12. Website Use</PolicyH2>
          <PolicyP>You agree not to use our website or online services:</PolicyP>
          <PolicyList
            items={[
              "For fraudulent or unlawful purposes;",
              "To interfere with the operation or security of the website;",
              "To attempt unauthorized access to our systems or customer information;",
              "To transmit malicious software or harmful content; or",
              "To impersonate another person or provide deliberately false information.",
            ]}
          />
          <PolicyP>
            We may restrict access to our online services where we
            reasonably believe these Terms have been violated.
          </PolicyP>

          <PolicyH2>13. Intellectual Property</PolicyH2>
          <PolicyP>
            Unless otherwise stated, the 5CEE Farms Limited name, logos,
            branding, photographs, graphics, website content, product
            materials, and other original content belong to 5CEE Farms
            Limited or are used with appropriate authorization.
          </PolicyP>
          <PolicyP>
            Such materials may not be reproduced, distributed, modified, or
            commercially exploited without our prior written permission,
            except as permitted by law.
          </PolicyP>

          <PolicyH2>14. Limitation of Liability</PolicyH2>
          <PolicyP>
            5CEE Farms Limited will exercise reasonable care in supplying
            its products and services.
          </PolicyP>
          <PolicyP>
            To the extent permitted by applicable law, we will not be
            responsible for indirect or consequential losses arising from
            circumstances outside our reasonable control.
          </PolicyP>
          <PolicyP>
            Nothing in these Terms excludes or limits liability where such
            liability cannot lawfully be excluded or limited.
          </PolicyP>

          <PolicyH2>15. Force Majeure</PolicyH2>
          <PolicyP>
            We will not be responsible for delays or failure to perform
            obligations caused by circumstances reasonably beyond our
            control, including severe weather, flooding, fire, disease
            outbreaks, government restrictions, civil disturbances,
            transportation disruptions, power failures, supply-chain
            disruptions, or similar events.
          </PolicyP>

          <PolicyH2>16. Changes to These Terms</PolicyH2>
          <PolicyP>
            We may update these Terms and Conditions periodically to
            reflect changes in our operations, services, legal obligations,
            or business practices.
          </PolicyP>
          <PolicyP>
            The current version will be made available through our website
            or other appropriate channels, together with its effective
            date.
          </PolicyP>

          <PolicyH2>17. Governing Law</PolicyH2>
          <PolicyP>
            These Terms and Conditions are governed by the laws of the
            Federal Republic of Nigeria and applicable laws and regulations
            of Anambra State.
          </PolicyP>
          <PolicyP>
            Any dispute arising from these Terms will be handled in
            accordance with applicable Nigerian law.
          </PolicyP>

          <PolicyH2>18. Contact Us</PolicyH2>
          <PolicyP>
            Questions, complaints, or requests concerning an order or these
            Terms and Conditions may be directed to:
          </PolicyP>
          <div className="mt-3 rounded-xl border border-forest/10 bg-white p-5 text-sm text-charcoal/80">
            <p className="font-display font-bold text-forest">5CEE Farms Limited</p>
            <p>Ifite, Awka South LGA</p>
            <p>Anambra State, Nigeria</p>
            <p className="mt-2">
              Email:{" "}
              <a href="mailto:chisofoods@gmail.com" className="text-forest underline">
                chisofoods@gmail.com
              </a>
            </p>
            <p>
              Telephone/WhatsApp:{" "}
              <a href="tel:+2347061302674" className="text-forest underline">
                0706 130 2674
              </a>
            </p>
          </div>

          <p className="mt-10 text-xs text-charcoal/40">
            © 2026 5CEE Farms Limited. All Rights Reserved.
          </p>

          <p className="mt-6 text-sm text-charcoal/60">
            See also our{" "}
            <Link href="/privacy" className="text-forest underline">Privacy Policy</Link>
            {" "}and{" "}
            <Link href="/policies" className="text-forest underline">Return &amp; Delivery Policy</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}