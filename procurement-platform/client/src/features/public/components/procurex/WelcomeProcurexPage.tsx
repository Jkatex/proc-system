import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWelcomeLandingData } from '../../hooks';

type IconProps = {
  children: ReactNode;
  className?: string;
};

type NavigateButtonProps = {
  children: ReactNode;
  className: string;
  to: string;
};

function NavigateButton({ children, className, to }: NavigateButtonProps) {
  const navigate = useNavigate();
  return (
    <button className={className} type="button" onClick={() => navigate(to)}>
      {children}
    </button>
  );
}

function WelcomeIcon({ children, className = 'welcome-icon' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function PlatformLogo() {
  return (
    <span className="platform-logo">
      <img className="platform-logo-image" src="/assets/logo.svg" alt="ProcureX" />
    </span>
  );
}

const steps = [
  {
    icon: (
      <>
        <path d="M12 8v8" />
        <path d="M8 12h8" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
    title: 'Create Tender',
    text: 'Post goods, services, or consultancy needs to your registered participants.'
  },
  {
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    title: 'Discover Tenders',
    text: 'Browse active procurement requests and find the perfect match for your business capabilities.'
  },
  {
    icon: <path d="m5 12 14-7-7 14-2-5z" />,
    title: 'Submit Bid',
    text: 'Prepare and submit professional proposals through our secure and transparent bidding engine.'
  },
  {
    icon: (
      <>
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 8h6" />
        <path d="M9 12h6" />
        <path d="M9 16h4" />
      </>
    ),
    title: 'Track Records',
    text: 'Maintain a clear audit trail of all messages, clarifications, awards, and historical data.'
  }
];

const marketCards = [
  {
    image: 'business-collaboration.webp',
    icon: (
      <>
        <path d="M12 3a6 6 0 0 0-6 6c0 4 6 12 6 12s6-8 6-12a6 6 0 0 0-6-6Z" />
        <circle cx="12" cy="9" r="2" />
      </>
    ),
    title: 'Tenders',
    text: 'Access a global stream of verified procurement requests that match your specific industry and scale.',
    points: ['Verified tender details', 'Direct procuring entity interaction']
  },
  {
    image: 'contract-review.webp',
    icon: (
      <>
        <path d="M7 11a4 4 0 1 1 8 0" />
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    title: 'Relationships',
    text: 'Build long-term partnerships through our transparent profile and performance tracking system.',
    points: ['Performance ratings', 'Repeat business alerts']
  },
  {
    image: 'procurement-meeting.webp',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </>
    ),
    title: 'Records',
    text: 'Maintain a robust, immutable record of every transaction, bid, and contract for compliance and audit.',
    points: ['Immutable audit trails', 'Data-driven insights']
  }
];

export function WelcomeProcurexPage() {
  const { data, status } = useWelcomeLandingData();
  const featuredTender = data.featuredTenders[0];
  const completionRate = `${data.stats.verifiedProfileCompletionRate.toFixed(1)}% Completion Rate`;

  return (
    <div className="landing-page welcome-page-v2" data-welcome-status={status}>
      <header className="landing-nav welcome-nav-v2">
        <div className="landing-nav-inner container">
          <Link className="brand welcome-brand-v2" to="/" aria-label="ProcureX home">
            <PlatformLogo />
            <span className="brand-text">ProcureX</span>
          </Link>
          <nav className="landing-nav-links welcome-nav-links-v2" aria-label="Welcome navigation">
            <Link className="active" to="/guest-marketplace">
              Browse Open Tenders
            </Link>
            <a href="#how-it-works">How It Works</a>
            <Link to="/about">About</Link>
            <a href="#help-center">Help Center</a>
          </nav>
          <div className="welcome-nav-actions-v2">
            <Link to="/sign-in">Sign In</Link>
            <NavigateButton className="btn btn-primary" to="/register">
              Get Started
            </NavigateButton>
          </div>
        </div>
      </header>

      <main className="welcome-hero-v2">
        <div className="container welcome-hero-grid-v2">
          <section className="welcome-hero-copy-v2 animate-fade-in">
            <span className="eyebrow">Welcome to ProcureX</span>
            <h1>Buy. Supply. Connect. Grow.</h1>
            <p>ProcureX is a modern e-procurement marketplace built to make procurement simple, fair, secure, and accessible for everyone.</p>
            <p>Create tenders, discover tenders, and build a procurement record today.</p>
            <div className="hero-actions">
              <NavigateButton className="btn btn-primary" to="/register">
                Get Started
              </NavigateButton>
              <NavigateButton className="btn btn-secondary" to="/guest-marketplace">
                Browse Open Tenders
              </NavigateButton>
            </div>
            <div className="welcome-proof-v2" aria-label="Trusted business proof">
              <span className="welcome-proof-avatars-v2" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>{data.stats.participantLabel}</span>
            </div>
          </section>

          <section className="welcome-product-stage-v2 animate-fade-in delay-1" aria-label="ProcureX marketplace preview">
            <div className="welcome-product-window-v2">
              <div className="welcome-product-top-v2">
                <span>
                  <WelcomeIcon className="welcome-product-mark-v2">
                    <path d="M7 7h10v10H7z" />
                    <path d="M9 9h6v6H9z" />
                  </WelcomeIcon>{' '}
                  ProcureX Marketplace
                </span>
                <em>{data.stats.activeWorkspaceLabel}</em>
              </div>
              <div className="welcome-product-metrics-v2">
                <article>
                  <WelcomeIcon>
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                    <circle cx="12" cy="12" r="9" />
                  </WelcomeIcon>
                  <strong>Create tender</strong>
                  <span>{data.stats.openTenderCount} open tenders visible now.</span>
                </article>
                <article>
                  <WelcomeIcon>
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </WelcomeIcon>
                  <strong>{featuredTender.reference}</strong>
                  <span>{featuredTender.title}</span>
                </article>
              </div>
              <div className="welcome-product-rate-v2">
                <div>
                  <span>Verified Profile</span>
                  <strong>{completionRate}</strong>
                </div>
                <NavigateButton className="btn btn-primary" to="/register">
                  View Profile
                </NavigateButton>
              </div>
              <figure className="welcome-product-photo-v2">
                <img src="/assets/welcome/procurement-meeting.webp" alt="Procurement team reviewing documents in a meeting" loading="eager" />
              </figure>
            </div>
          </section>
        </div>
      </main>

      <section id="how-it-works" className="welcome-section-v2 welcome-steps-section-v2">
        <div className="container">
          <div className="section-header welcome-centered-v2">
            <span className="section-label">Streamlined workflow</span>
            <h2>Four steps to procurement success</h2>
          </div>
          <div className="welcome-steps-grid-v2">
            {steps.map((step) => (
              <article className="welcome-step-v2" key={step.title}>
                <span className="welcome-step-icon-v2">
                  <WelcomeIcon>{step.icon}</WelcomeIcon>
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about-procurex" className="welcome-section-v2 welcome-gateway-section-v2">
        <div className="container">
          <div className="section-header welcome-centered-v2">
            <h2>Your procurement gateway for tendering</h2>
            <p>ProcureX connects businesses, procuring entities, and tenderers in one secure, digital-first marketplace.</p>
          </div>
          <div className="welcome-gateway-grid-v2">
            <figure className="welcome-story-image-v2">
              <img src="/assets/welcome/opportunity-signing.webp" alt="Procurement documents prepared for review and signing" loading="lazy" />
              <figcaption>
                <span>From request to decision,</span>
                <strong>every step has a place.</strong>
                <small>Centralize your entire procurement workflow. From initial RFP to final contract awarding, keep all data in a single source of truth.</small>
              </figcaption>
            </figure>
            <div className="welcome-assurance-stack-v2">
              <article>
                <WelcomeIcon>
                  <path d="M4 7h16v10H4z" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </WelcomeIcon>
                <div>
                  <h3>No scattered communication</h3>
                  <p>Messages, clarification requests, and alerts stay in the system so critical data is never lost in email threads.</p>
                </div>
              </article>
              <article>
                <WelcomeIcon>
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </WelcomeIcon>
                <div>
                  <h3>No hidden tenders</h3>
                  <p>Discover open tenders and service needs in one organized place, ensuring fair competition for all verified partners.</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="welcome-dark-band-v2">
        <div className="container">
          <div className="section-header welcome-centered-v2">
            <h2>A smarter marketplace for everyone</h2>
            <p>ProcureX creates a shared space where businesses can meet and work together efficiently, whether they are procuring entities, tenderers, or specialized professionals.</p>
          </div>
          <div className="welcome-market-grid-v2">
            {marketCards.map((card, index) => (
              <article className="welcome-market-card-v2" key={card.title}>
                <div className="welcome-market-thumb-v2">
                  <img src={`/assets/welcome/${card.image}`} alt="" loading="lazy" aria-hidden="true" />
                </div>
                <span className="welcome-market-icon-v2">
                  <WelcomeIcon>{card.icon}</WelcomeIcon>
                </span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <ul>
                  {card.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                  {index === 0 && <li>{featuredTender.buyerName}</li>}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="welcome-cta-section-v2">
        <div className="container">
          <div className="welcome-cta-panel-v2">
            <div>
              <h2>Join ProcureX today.</h2>
              <p>Start your procurement journey with one simple account. Create tenders, submit bids, and grow your business today.</p>
            </div>
            <div className="cta-actions">
              <NavigateButton className="btn btn-primary" to="/register">
                Get Started Now
              </NavigateButton>
            </div>
          </div>
        </div>
      </section>

      <footer id="help-center" className="welcome-footer-v2">
        <div className="container">
          <div>
            <strong>ProcureX</strong>
            <p>2026 ProcureX. All rights reserved. Connecting businesses, tenderers, and professionals through smarter procurement.</p>
          </div>
          <nav aria-label="Company links">
            <h3>Company</h3>
            <Link to="/about">About ProcureX</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms and Conditions</Link>
          </nav>
          <nav aria-label="Platform links">
            <h3>Platform</h3>
            <Link to="/guest-marketplace">Browse Open Tenders</Link>
            <a href="#help-center">System Status</a>
          </nav>
          <nav aria-label="Support links">
            <h3>Support</h3>
            <Link to="/contact">Help Center</Link>
            <Link to="/contact">Contact Support</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
