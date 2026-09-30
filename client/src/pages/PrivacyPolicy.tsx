import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663387762142/GGrdr6YE4DiKCgcDQKRagu/Alternative_Logo_White_Background-removebg-preview_9d4821e4.png";

export default function PrivacyPolicy() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="border-b border-border bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <img src={LOGO} alt="AlterNatives" className="h-8 w-auto object-contain" />
          </button>
          <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

          <div className="prose prose-slate max-w-none space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>
                AlterNatives ("AlterNatives," "we," "us," or "our") is an expert network platform operated as part of the Native group of companies ("Native"). This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website, register as an expert, submit an inquiry, or otherwise interact with our services (collectively, the "Services"), and describes the rights available to you under applicable data protection law. By using the Services, you agree to the collection and use of information in accordance with this policy.
              </p>
              <p className="mt-3">
                This policy applies to visitors, experts, and client contacts worldwide, including individuals located in the European Economic Area ("EEA") and the United Kingdom ("UK"), for whom the EU General Data Protection Regulation ("GDPR") and the UK GDPR / Data Protection Act 2018 apply respectively.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Data Controller</h2>
              <p>
                For the purposes of the GDPR and UK GDPR, the data controller responsible for your personal information is AlterNatives, operating as part of the Native group of companies. You can contact us using the details in Section 13 below regarding any aspect of this policy or our processing of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Information We Collect</h2>
              <p className="mb-3">We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Contact details such as your name, email address, phone number, and organization</li>
                <li>Professional information such as work history, education, credentials, and areas of expertise submitted through your expert profile or CV</li>
                <li>Communications you send us, including inquiries submitted through our contact and lead-generation forms</li>
                <li>Account credentials when you register for an expert or client account</li>
              </ul>
              <p className="mt-3">
                We also automatically collect limited technical information — such as IP address, browser type, device information, and pages visited — through standard web server logs and analytics tools when you use our Services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. How We Use Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Create and manage expert and client accounts</li>
                <li>Match experts with relevant client opportunities</li>
                <li>Respond to inquiries submitted through our contact forms</li>
                <li>Send administrative communications, including project invitations and account notifications</li>
                <li>Improve, secure, and maintain the Services</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Legal Basis for Processing (EEA/UK)</h2>
              <p className="mb-3">Where the GDPR or UK GDPR applies, we rely on the following legal bases to process your personal information:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Consent</strong> — where you have given clear consent, such as submitting a contact form or opting in to marketing communications. You may withdraw consent at any time.</li>
                <li><strong>Contract</strong> — where processing is necessary to create your account, manage your expert profile, or facilitate an engagement you have entered into</li>
                <li><strong>Legitimate interests</strong> — where processing is necessary for our legitimate interests in operating, securing, and improving the Services, provided those interests are not overridden by your rights and interests</li>
                <li><strong>Legal obligation</strong> — where processing is necessary to comply with applicable law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. How We Share Information</h2>
              <p className="mb-3">We do not sell your personal information. We may share information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>With client organizations</strong> — when there is a relevant engagement opportunity, we may share your professional profile with prospective clients, with your knowledge as part of the matching process</li>
                <li><strong>With service providers</strong> — vendors who perform services on our behalf, such as email delivery and cloud hosting, under confidentiality and data processing obligations</li>
                <li><strong>Within the Native group of companies</strong> — for internal administration and to support the Services</li>
                <li><strong>For legal reasons</strong> — where required to comply with applicable law, regulation, or legal process</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. International Data Transfers</h2>
              <p>
                We may transfer, store, and process personal information in countries outside the EEA or UK, including India, where our infrastructure and support teams are based. Where we transfer personal data from the EEA or UK to a country that has not been deemed to provide an adequate level of protection, we rely on appropriate safeguards, such as the European Commission's Standard Contractual Clauses (or the UK International Data Transfer Addendum, as applicable), to ensure your information remains protected in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Cookies and Similar Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to operate and improve our Services, remember your preferences, and understand how visitors use our website. Where required by applicable law, including the EU ePrivacy Directive and UK Privacy and Electronic Communications Regulations, we will request your consent before placing non-essential cookies. You can control or withdraw cookie consent at any time through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Data Retention</h2>
              <p>
                We retain personal information only for as long as necessary to fulfill the purposes described in this policy, including satisfying any legal, accounting, or reporting requirements. Expert profile data is retained for the duration of your account and for a reasonable period afterward to support re-engagement and legal recordkeeping. When information is no longer needed, we securely delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Data Security</h2>
              <p>
                We implement reasonable administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, alteration, disclosure, or destruction. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Your Data Protection Rights</h2>
              <p className="mb-3">
                If you are located in the EEA, UK, or another jurisdiction with similar data protection laws, you have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Right of access</strong> — request a copy of the personal information we hold about you</li>
                <li><strong>Right to rectification</strong> — request correction of inaccurate or incomplete information</li>
                <li><strong>Right to erasure</strong> — request deletion of your personal information in certain circumstances</li>
                <li><strong>Right to restrict processing</strong> — request that we limit how we use your information</li>
                <li><strong>Right to data portability</strong> — request your information in a structured, commonly used, machine-readable format</li>
                <li><strong>Right to object</strong> — object to processing based on legitimate interests or for direct marketing purposes</li>
                <li><strong>Right to withdraw consent</strong> — withdraw previously given consent at any time, without affecting the lawfulness of processing before withdrawal</li>
                <li><strong>Right to lodge a complaint</strong> — lodge a complaint with your local data protection supervisory authority — in the UK, the Information Commissioner's Office (ICO) at ico.org.uk; in the EEA, your national data protection authority</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us using the details in Section 13 below. We will respond to verified requests within the timeframes required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Children's Privacy</h2>
              <p>
                Our Services are intended for professional use by individuals who are at least 18 years old. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, wish to exercise your data protection rights, or have a concern about how we handle your information, please contact us at{" "}
                <a href="mailto:alternatives@nativeworld.com" className="text-primary hover:underline">alternatives@nativeworld.com</a>. If you are located in the EEA or UK and are not satisfied with our response, you have the right to lodge a complaint with your local supervisory authority.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">14. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will post the updated policy on this page and revise the "Last updated" date above. Continued use of the Services after changes take effect constitutes acceptance of the revised policy.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-white/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} AlterNatives. Part of the Native group of companies.</p>
        </div>
      </footer>
    </div>
  );
}
