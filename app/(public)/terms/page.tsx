import { FileText, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Ironbridgemarket Institutional",
  description: "Terms and conditions governing the use of Ironbridgemarket Institutional digital asset brokerage and custody services.",
};

const SECTIONS = [
  { id: "intro", title: "1. Introduction & Scope" },
  { id: "eligibility", title: "2. Onboarding & Eligibility" },
  { id: "security", title: "3. Access & Account Security" },
  { id: "trading", title: "4. Execution & Order Routing" },
  { id: "custody", title: "5. Custody & MPC Vaults" },
  { id: "fees", title: "6. Fee Schedules & Payments" },
  { id: "prohibited", title: "7. Prohibited Platform Use" },
  { id: "ip", title: "8. Intellectual Property" },
  { id: "liability", title: "9. Liability & Indemnity" },
  { id: "governing-law", title: "10. Governing Law & Dispute" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="border-b border-border/20 pb-8 mb-12">
          <div className="flex items-center gap-3 text-gold mb-4">
            <FileText className="w-6 h-6" />
            <span className="text-sm font-semibold tracking-wider uppercase">Legal Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Terms of Service
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
            
            <section id="intro" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                1. Introduction & Scope
              </h2>
              <p>
                Welcome to Ironbridgemarket Institutional. These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between Ironbridgemarket Systems Ltd (&ldquo;Ironbridgemarket,&ldquo; &ldquo;we,&ldquo; &ldquo;us,&ldquo; or &ldquo;our&rdquo;) and the institutional entity or corporation (&ldquo;Client,&ldquo; &ldquo;you,&ldquo; or &ldquo;your&rdquo;) accessing or using the Ironbridgemarket Institutional digital asset brokerage, custody execution, and multi-party computation (MPC) vault platform.
              </p>
              <p>
                By executing an account agreement, accessing our application programming interfaces (APIs), or utilizing our portal interfaces, you confirm that you have read, understood, and agree to be bound by these Terms, alongside our Privacy Policy, Cookie Policy, and all applicable service schedules.
              </p>
            </section>

            <section id="eligibility" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                2. Onboarding & Eligibility
              </h2>
              <p>
                Ironbridgemarket Institutional caters exclusively to eligible institutional clients, including corporate entities, financial institutions, asset managers, hedge funds, family offices, and high-net-worth corporate partners. We do not provide retail investment services.
              </p>
              <p>
                To qualify, you must undergo mandatory Know Your Customer (KYC), Know Your Business (KYB), and Anti-Money Laundering (AML) checks. You represent that the entity you represent is duly organized, validly existing, and in good standing under the laws of its jurisdiction of incorporation, and that all corporate authorizations have been obtained to bind the entity to these Terms.
              </p>
            </section>

            <section id="security" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                3. Access & Account Security
              </h2>
              <p>
                Access to the Ironbridgemarket platform is secured using advanced authentication and cryptographic keys. For custody vault access, Ironbridgemarket implements a state-of-the-art Multi-Party Computation (MPC-CMP) key share system.
              </p>
              <p>
                You are solely responsible for maintaining the confidentiality and integrity of your corporate credentials, API keys, and local MPC key shares. You must restrict platform access only to authorized personnel and immediately notify Ironbridgemarket at security@ironbridgemarket.com if you detect or suspect any unauthorized access, breach of API key security, or compromise of local credentials.
              </p>
            </section>

            <section id="trading" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                4. Execution & Order Routing
              </h2>
              <p>
                Ironbridgemarket provides institutional order routing, liquidity aggregation, and OTC execution services. All orders routed through our smart order router (SOR) are executed according to our Best Execution Policy.
              </p>
              <p>
                Orders, once placed and confirmed, are final and cannot be modified or canceled. Ironbridgemarket does not guarantee execution speeds, liquidity availability, or specific price margins during periods of extreme market volatility or network congestion. In the event of system failures or liquidity provider outages, Ironbridgemarket reserves the right to suspend order routing to protect customer assets.
              </p>
            </section>

            <section id="custody" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                5. Custody & MPC Vaults
              </h2>
              <p>
                Custodial assets are segregated and stored across our cold, warm, and hot vault architectures. Ironbridgemarket utilizes MPC technology where key shares are distributed across independent security modules and geographical jurisdictions to eliminate single points of failure.
              </p>
              <p>
                Ironbridgemarket acts as a bailee of digital assets in custody and does not acquire any proprietary interest in your digital assets. All custodial transactions are governed by specific cold-storage delay times, multi-signature approval rules, and institutional threshold consensus protocols configured by your appointed administrators.
              </p>
            </section>

            <section id="fees" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                6. Fee Schedules & Payments
              </h2>
              <p>
                You agree to pay all applicable transaction fees, custody fees, withdrawal fees, and administration charges as outlined in your signed Fee Schedule or within the account dashboard.
              </p>
              <p>
                Fees are denominated in the respective digital asset or fiat currency and will be automatically deducted from your account balances upon transaction execution or monthly billing cycles. Ironbridgemarket reserves the right to modify fee schedules upon thirty (30) days written notice to the client.
              </p>
            </section>

            <section id="prohibited" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                7. Prohibited Platform Use
              </h2>
              <p>
                You must not use the platform to conduct, facilitate, or participate in illegal activities, including but not limited to money laundering, terrorist financing, fraud, market manipulation (such as wash trading or spoofing), tax evasion, or trade sanctions circumvention.
              </p>
              <p>
                Any attempt to reverse engineer, disrupt, or bypass our security controls, APIs, MPC protocols, or smart contract logic will result in immediate termination of access, freeze of assets, and reporting to relevant financial intelligence and regulatory authorities.
              </p>
            </section>

            <section id="ip" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                8. Intellectual Property
              </h2>
              <p>
                All proprietary software, algorithms, user interface designs, logos, trade secrets, and API protocols used to deliver the Ironbridgemarket Institutional brokerage and custody services are the exclusive property of Ironbridgemarket Systems Ltd and its licensors.
              </p>
              <p>
                Subject to compliance with these Terms, Ironbridgemarket grants you a limited, non-exclusive, non-transferable, revocable license to access the platform interface and APIs solely for the execution of your institutional digital asset operations. No other rights, explicit or implied, are granted under these Terms.
              </p>
            </section>

            <section id="liability" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                9. Liability & Indemnity
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IRONBRIDGEMARKET SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR ASSET VALUE, ARISING OUT OF OR IN CONNECTION WITH PLATFORM USE, NETWORK FORKS, PROTOCOL VULNERABILITIES, OR FORCE MAJEURE EVENTS.
              </p>
              <p>
                You agree to indemnify, defend, and hold harmless Ironbridgemarket, its affiliates, directors, officers, and employees from and against any claims, losses, liabilities, costs, and expenses (including legal fees) arising from your breach of these Terms, unauthorized account use, or violation of applicable laws and regulations.
              </p>
            </section>

            <section id="governing-law" className="scroll-mt-24 space-y-4">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground border-b border-border/10 pb-2">
                10. Governing Law & Dispute Resolution
              </h2>
              <p>
                These Terms and any dispute or claim arising out of or in connection with them (including non-contractual disputes) shall be governed by and construed in accordance with English Law.
              </p>
              <p>
                Any dispute, controversy, or claim arising under these Terms shall be resolved exclusively through final and binding arbitration administered by the London Court of International Arbitration (LCIA) under the LCIA Rules. The seat of the arbitration shall be London, UK, and the proceedings shall be conducted in English.
              </p>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
