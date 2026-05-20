import { ShieldCheck, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Pavex Institutional",
  description: "Privacy Policy governing the processing and protection of client and corporate information by Pavex Institutional.",
};

const SECTIONS = [
  { id: "collection", title: "1. Information Collection" },
  { id: "usage", title: "2. Usage & Data Processing" },
  { id: "sharing", title: "3. Information Sharing" },
  { id: "security", title: "4. Cryptographic Security" },
  { id: "transfers", title: "5. International Transfers" },
  { id: "retention", title: "6. Data Retention" },
  { id: "rights", title: "7. Regulatory Data Rights" },
  { id: "contact", title: "8. DPO Contact & Updates" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="border-b border-border/20 pb-8 mb-12">
          <div className="flex items-center gap-3 text-gold mb-4">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-sm font-semibold tracking-wider uppercase">Data Privacy Office</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Last Updated: May 20, 2026</span>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Left Sticky Sidebar (Table of Contents) */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit max-h-[80vh] overflow-y-auto pr-4 scrollbar-thin">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4 border-b border-border/20 pb-2">
              Table of Contents
            </h2>
            <nav className="space-y-1">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center justify-between group p-2 text-xs md:text-sm text-muted-foreground hover:text-gold hover:bg-card/50 rounded-lg transition-all"
                >
                  <span>{section.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-gold shrink-0 ml-2" />
                </a>
              ))}
            </nav>
          </aside>

          {/* Right Column (Legal Copy) */}
          <main className="lg:col-span-3 space-y-12 text-sm md:text-base text-muted-foreground leading-relaxed">
            
            <section id="collection" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                1. Information Collection
              </h2>
              <p>
                Pavex Institutional collects personal and corporate data to fulfill legal requirements, perform verification, and deliver digital asset services. This includes identifying corporate representatives (names, email addresses, phone numbers, passport credentials), corporate records (articles of association, ultimate beneficial ownership details, corporate registration files), and transaction log records.
              </p>
              <p>
                Additionally, we automatically capture telemetry, network logs, and device data (IP addresses, operating system specifications, access timestamps, and API usage stats) to safeguard account access and prevent unauthorized transactions.
              </p>
            </section>

            <section id="usage" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                2. Usage & Data Processing
              </h2>
              <p>
                We process your data based on several legal grounds: to perform contracts, to comply with anti-money laundering (AML) and counter-terrorist financing (CTF) mandates, and to satisfy legitimate business interests.
              </p>
              <p>
                Data is utilized to: onboard corporate clients, execute institutional trades, manage custody vaults, route orders through liquidity pools, detect and prevent fraud, optimize platform loading performance, and communicate security updates.
              </p>
            </section>

            <section id="sharing" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                3. Information Sharing
              </h2>
              <p>
                We do not sell, rent, or lease your personal or corporate data to third parties. Information is shared strictly under confidential arrangements with trusted third-party service providers, banking partners, and custody aggregators who help operate our systems.
              </p>
              <p>
                Furthermore, Pavex Institutional reserves the right to disclose client data to national security bodies, regulatory authorities (e.g., the FCA or SEC), or judicial tribunals if required by binding subpoena, regulatory reporting mandates, or AML inquiries.
              </p>
            </section>

            <section id="security" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                4. Cryptographic Security
              </h2>
              <p>
                Client records and transactional databases are guarded using bank-grade cryptographic protocols. Pavex implements AES-256 encryption for data at rest and Transport Layer Security (TLS 1.3) for data in transit.
              </p>
              <p>
                Access controls are strictly partitioned within our network. Cryptographic key materials are segmented across highly secure, hardware security modules (HSMs) and verified using Multi-Party Computation protocols, ensuring zero centralized vulnerabilities.
              </p>
            </section>

            <section id="transfers" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                5. International Transfers
              </h2>
              <p>
                Because Pavex Institutional serves a global market, client information may be stored, processed, or transferred across international boundaries, including locations outside the UK, the European Economic Area (EEA), or the United States.
              </p>
              <p>
                All cross-border data transfers comply with statutory frameworks, incorporating standard contractual clauses (SCCs) and robust data protection audits to guarantee an equivalent degree of privacy protection across foreign jurisdictions.
              </p>
            </section>

            <section id="retention" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                6. Data Retention
              </h2>
              <p>
                Pavex Institutional retains client information only as long as necessary to perform platform operations or to comply with applicable statutory timelines.
              </p>
              <p>
                Pursuant to financial regulations and anti-money laundering regulations, we are required to maintain customer identification records, ultimate beneficial ownership dossiers, and transaction logs for a minimum of five (5) to seven (7) years following account closure.
              </p>
            </section>

            <section id="rights" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                7. Regulatory Data Rights
              </h2>
              <p>
                Depending on your geographical jurisdiction, corporate representatives may have specific individual rights under frameworks like the General Data Protection Regulation (GDPR) or California Consumer Privacy Act (CCPA).
              </p>
              <p>
                These include the right to request access to personal data, request rectification of errors, request erasure (subject to statutory AML retention overrides), object to processing, or request data portability. To submit a request, contact our privacy division.
              </p>
            </section>

            <section id="contact" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                8. DPO Contact & Updates
              </h2>
              <p>
                We may revise this Privacy Policy periodically to reflect technological adjustments, regulatory developments, or product adaptations. Revisions will be published directly here, with an updated timestamp at the header.
              </p>
              <p>
                If you have questions regarding our data usage practices, or wish to communicate with our Data Protection Officer, please contact our legal desk via email at dpo@pavex.com or write to our corporate address.
              </p>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
