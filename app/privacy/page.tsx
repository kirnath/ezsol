import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Privacy Policy | EzSol",
  description: "Privacy policy for EzSol - No-Code Solana Token Creation Platform",
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6 lg:py-16">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">Last updated: May 19, 2025</p>
        </div>

        <Separator className="my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Introduction</h2>
          <p>
            EzSol ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your
            personal information is collected, used, and disclosed by EzSol when you use our website (ezsol.xyz) and our
            services for no-code Solana token creation (collectively, the "Services").
          </p>
          <p>
            By accessing or using our Services, you signify that you have read, understood, and agree to our collection,
            storage, use, and disclosure of your personal information as described in this Privacy Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Information We Collect</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-medium">Information You Provide to Us</h3>
            <p>We collect information you provide directly to us when you use our Services, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wallet addresses and public blockchain information</li>
              <li>Token creation parameters and preferences</li>
              <li>Communication data when you contact us</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-medium mt-4">Information We Collect Automatically</h3>
            <p>When you access or use our Services, we automatically collect certain information, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Log and usage data (IP address, browser type, pages visited, time spent)</li>
              <li>Device information (hardware model, operating system, unique device identifiers)</li>
              <li>Blockchain transaction data related to your token creation and management</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our Services</li>
            <li>Process and complete token creation transactions</li>
            <li>Send technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            <li>Personalize and improve the Services</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Sharing of Information</h2>
          <p>We may share the information we collect in various ways, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              With vendors, consultants, and other service providers who need access to such information to carry out
              work on our behalf
            </li>
            <li>
              In response to a request for information if we believe disclosure is in accordance with, or required by,
              any applicable law or legal process
            </li>
            <li>
              If we believe your actions are inconsistent with our user agreements or policies, or to protect the
              rights, property, and safety of EzSol or others
            </li>
            <li>
              In connection with, or during negotiations of, any merger, sale of company assets, financing, or
              acquisition of all or a portion of our business by another company
            </li>
            <li>With your consent or at your direction</li>
          </ul>
          <p className="mt-3">
            Please note that blockchain transactions are public by nature. Information about your token creation
            activities on the Solana blockchain is publicly visible.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized
            access, disclosure, alteration, and destruction. However, no security system is impenetrable, and we cannot
            guarantee the security of our systems or your information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar technologies to collect information about your browsing activities and to
            distinguish you from other users of our Services. This helps us provide you with a good experience when you
            browse our Services and allows us to improve our site.
          </p>
          <p>
            You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access
            cookies. If you disable or refuse cookies, please note that some parts of our Services may become
            inaccessible or not function properly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Your Rights and Choices</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate or incomplete information</li>
            <li>Deletion of your personal information</li>
            <li>Restriction or objection to processing</li>
            <li>Data portability</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section
            below.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Children's Privacy</h2>
          <p>
            Our Services are not directed to children under 18 years of age, and we do not knowingly collect personal
            information from children under 18. If we learn we have collected personal information from a child under
            18, we will delete this information as quickly as possible.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Changes to this Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we will notify you by
            updating the date at the top of the policy and, in some cases, we may provide you with additional notice
            (such as adding a statement to our website or sending you a notification).
          </p>
          <p>
            We encourage you to review the Privacy Policy whenever you access the Services to stay informed about our
            information practices and the ways you can help protect your privacy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us at:</p>
          <div className="mt-2">
            <p>
              <strong>Email:</strong> privacy@ezsol.xyz
            </p>
            <p>
              <strong>Address:</strong> EzSol Headquarters, 123 Blockchain Avenue, San Francisco, CA 94105
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
