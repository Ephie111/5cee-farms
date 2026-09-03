import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PolicyH2, PolicyP, PolicyList } from "@/components/policy/PolicySection";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-forest py-14">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <span className="section-eyebrow text-gold">Legal</span>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Privacy Policy</h1>
            <p className="mt-2 text-sm text-white/70">5CEE Farms Limited · Effective Date: August 13, 2026</p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-6 py-14 lg:px-10">
          <PolicyP>
            This Privacy Policy explains how 5CEE Farms Limited
            (&ldquo;5CEE Farms,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) collects, uses, and protects your personal
            information when you use our website, create an account, or
            place an order with us.
          </PolicyP>
          <PolicyP>
            By using our website or purchasing our products, you agree to
            the collection and use of information as described in this
            policy.
          </PolicyP>

          <PolicyH2>1. Information We Collect</PolicyH2>
          <PolicyP>We collect information you provide directly to us, including:</PolicyP>
          <PolicyList
            items={[
              "Account information — your name, email address, and phone number when you register for an account.",
              "Delivery information — your delivery address, city, and any delivery instructions when you place an order.",
              "Order information — the products you purchase, order history, and payment method selected.",
              "Communications — messages you send us via email, WhatsApp, or phone, and any information you provide in them.",
            ]}
          />
          <PolicyP>We also automatically collect limited technical information, such as your shopping cart contents, which is stored in your browser to keep your cart items saved between visits.</PolicyP>

          <PolicyH2>2. Payment Information</PolicyH2>
          <PolicyP>
            When you pay by card, bank transfer, or USSD, your payment is
            processed directly by Paystack, our payment processor. We do
            not collect or store your card number, CVV, or banking
            credentials on our own systems — Paystack handles this
            securely on our behalf, and we only receive confirmation of
            whether a payment succeeded.
          </PolicyP>

          <PolicyH2>3. How We Use Your Information</PolicyH2>
          <PolicyP>We use the information we collect to:</PolicyP>
          <PolicyList
            items={[
              "Process and fulfil your orders, including coordinating delivery;",
              "Create and manage your account;",
              "Communicate with you about your orders, including confirmations and delivery updates;",
              "Respond to your questions, complaints, or requests;",
              "Improve our website, products, and services; and",
              "Comply with legal, tax, and regulatory obligations.",
            ]}
          />

          <PolicyH2>4. Who We Share Information With</PolicyH2>
          <PolicyP>
            We do not sell your personal information to third parties. We
            share information only where necessary to operate our business,
            including with:
          </PolicyP>
          <PolicyList
            items={[
              "Paystack, to process your payment;",
              "Supabase, our database and account-hosting provider, which stores your account and order information securely on our behalf;",
              "Our delivery personnel, to the extent necessary to deliver your order (name, phone number, and address); and",
              "Regulatory or law enforcement authorities, where required by applicable law.",
            ]}
          />

          <PolicyH2>5. Data Storage and Security</PolicyH2>
          <PolicyP>
            Your account and order information is stored securely using
            Supabase&rsquo;s infrastructure, with access restricted to
            authorized personnel only. While we take reasonable steps to
            protect your information, no method of transmission or storage
            over the internet is completely secure, and we cannot guarantee
            absolute security.
          </PolicyP>

          <PolicyH2>6. Data Retention</PolicyH2>
          <PolicyP>
            We retain your personal information for as long as your account
            remains active, and for as long as necessary to fulfil the
            purposes described in this policy, including meeting legal,
            accounting, or tax reporting requirements.
          </PolicyP>

          <PolicyH2>7. Your Rights</PolicyH2>
          <PolicyP>You may, at any time, request to:</PolicyP>
          <PolicyList
            items={[
              "Access the personal information we hold about you;",
              "Correct inaccurate or incomplete information (you can also update your name, phone number, and address directly from your Account page);",
              "Request deletion of your account and associated personal information, subject to any legal or regulatory obligation to retain certain records; or",
              "Withdraw consent to marketing communications, where applicable.",
            ]}
          />
          <PolicyP>
            To make any of these requests, please contact us using the
            details below.
          </PolicyP>

          <PolicyH2>8. Cookies and Local Storage</PolicyH2>
          <PolicyP>
            We use your browser&rsquo;s local storage to keep items in your
            shopping cart saved between visits. This information stays on
            your own device and is used only to support your shopping
            experience — it is not used for advertising or tracking
            purposes.
          </PolicyP>

          <PolicyH2>9. Children&rsquo;s Privacy</PolicyH2>
          <PolicyP>
            Our website and services are not directed at children, and we
            do not knowingly collect personal information from children.
          </PolicyP>

          <PolicyH2>10. Changes to This Policy</PolicyH2>
          <PolicyP>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for legal or regulatory reasons.
            The updated version will be posted on this page together with
            its effective date.
          </PolicyP>

          <PolicyH2>11. Contact Us</PolicyH2>
          <PolicyP>
            If you have questions about this Privacy Policy or how your
            information is handled, please contact us at:
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
            <Link href="/terms" className="text-forest underline">Terms and Conditions</Link>
            {" "}and{" "}
            <Link href="/policies" className="text-forest underline">Return &amp; Delivery Policy</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}