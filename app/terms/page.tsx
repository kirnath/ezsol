import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Terms of Service | EzSol",
  description: "Terms and conditions for using the EzSol platform.",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-32">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
        <p className="text-xl text-foreground/90">Last Updated: May 19, 2025</p>
      </div>

      <Separator className="my-8" />

      <div className="prose prose-invert max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
          <p className="text-foreground/90 mb-4">
            Welcome to EzSol. By accessing or using our platform, you agree to be bound by these Terms of Service
            ("Terms"). If you do not agree to these Terms, please do not use our services.
          </p>
          <p className="text-foreground/90 mb-4">
            These Terms constitute a legally binding agreement between you and EzSol regarding your use of our website,
            mobile application, and related services (collectively, the "Platform").
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">2. Eligibility</h2>
          <p className="text-foreground/90 mb-4">
            You must be at least 18 years old to use our Platform. By using our Platform, you represent and warrant that
            you meet all eligibility requirements. If you are using the Platform on behalf of an entity, you represent
            and warrant that you have the authority to bind that entity to these Terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
          <p className="text-foreground/90 mb-4">
            Some features of our Platform may require you to connect your wallet. You are responsible for maintaining
            the security of your wallet and all activities that occur through your account. You agree to:
          </p>
          <ul className="list-disc pl-6 text-foreground/90 mb-4">
            <li>Maintain the security of your private keys</li>
            <li>Promptly notify us of any unauthorized use of your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">4. User Conduct</h2>
          <p className="text-foreground/90 mb-4">You agree not to use the Platform to:</p>
          <ul className="list-disc pl-6 text-foreground/90 mb-4">
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Create or distribute tokens that violate intellectual property rights</li>
            <li>Engage in fraudulent activities or misrepresent information</li>
            <li>Distribute malware or other harmful code</li>
            <li>Interfere with the proper functioning of the Platform</li>
            <li>Attempt to gain unauthorized access to the Platform or its systems</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">5. Intellectual Property</h2>
          <p className="text-foreground/90 mb-4">
            The Platform and its original content, features, and functionality are owned by EzSol and are protected by
            international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          <p className="text-foreground/90 mb-4">
            You retain all rights to any content you create, upload, or display on or through the Platform. By creating
            tokens through our Platform, you grant us a license to display and promote your tokens on our Platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">6. Blockchain and Cryptocurrency Risks</h2>
          <p className="text-foreground/90 mb-4">You acknowledge and agree that:</p>
          <ul className="list-disc pl-6 text-foreground/90 mb-4">
            <li>
              Blockchain technology and cryptocurrencies are subject to regulatory uncertainty and potential regulatory
              changes
            </li>
            <li>The value of cryptocurrencies can be volatile and may fluctuate significantly</li>
            <li>Transactions on the blockchain are irreversible</li>
            <li>We have no control over the Solana blockchain or any other blockchain network</li>
            <li>You are solely responsible for securing your private keys and wallet</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">7. Disclaimers</h2>
          <p className="text-foreground/90 mb-4">
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
            IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
          </p>
          <p className="text-foreground/90 mb-4">
            EzSol does not warrant that: (a) the Platform will function uninterrupted, secure, or available at any
            particular time or location; (b) any errors or defects will be corrected; (c) the Platform is free of
            viruses or other harmful components; or (d) the results of using the Platform will meet your requirements.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
          <p className="text-foreground/90 mb-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL EZSOL, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS,
            SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
            DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES,
            RESULTING FROM:
          </p>
          <ul className="list-disc pl-6 text-foreground/90 mb-4">
            <li>Your access to or use of or inability to access or use the Platform</li>
            <li>Any conduct or content of any third party on the Platform</li>
            <li>Any content obtained from the Platform</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            <li>The creation, management, or trading of tokens created through our Platform</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">9. Indemnification</h2>
          <p className="text-foreground/90 mb-4">
            You agree to defend, indemnify, and hold harmless EzSol and its licensees and licensors, and their
            employees, contractors, agents, officers, and directors, from and against any and all claims, damages,
            obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's
            fees), resulting from or arising out of: (a) your use and access of the Platform; (b) your violation of any
            term of these Terms; (c) your violation of any third-party right, including without limitation any
            copyright, property, or privacy right; or (d) any claim that content you created using our Platform caused
            damage to a third party.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">10. Termination</h2>
          <p className="text-foreground/90 mb-4">
            We may terminate or suspend your access to the Platform immediately, without prior notice or liability, for
            any reason whatsoever, including without limitation if you breach these Terms.
          </p>
          <p className="text-foreground/90 mb-4">
            All provisions of the Terms which by their nature should survive termination shall survive termination,
            including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of
            liability.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
          <p className="text-foreground/90 mb-4">
            These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without
            regard to its conflict of law provisions.
          </p>
          <p className="text-foreground/90 mb-4">
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
            rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining
            provisions of these Terms will remain in effect.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">12. Changes to Terms</h2>
          <p className="text-foreground/90 mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What
            constitutes a material change will be determined at our sole discretion.
          </p>
          <p className="text-foreground/90 mb-4">
            By continuing to access or use our Platform after those revisions become effective, you agree to be bound by
            the revised terms. If you do not agree to the new terms, please stop using the Platform.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Us</h2>
          <p className="text-foreground/90 mb-4">If you have any questions about these Terms, please contact us at:</p>
          <p className="text-foreground/90 mb-4">
            <strong className="text-foreground">Email:</strong> support@ezsol.xyz
          </p>
        </section>
      </div>

      <div className="mt-12 text-center">
        <p className="text-foreground/90 mb-4">
          By using EzSol, you acknowledge that you have read and understood these Terms of Service and agree to be bound
          by them.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/privacy" className="text-primary hover:text-primary/90 underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="/blog" className="text-primary hover:text-primary/90 underline underline-offset-4">
            Blog
          </Link>
        </div>
      </div>
    </div>
  )
}
