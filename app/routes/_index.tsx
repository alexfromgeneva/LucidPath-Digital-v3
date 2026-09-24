import {
  IconAccessible,
  IconArrowUpRight,
  IconChartBar,
  IconFileText,
  IconHierarchy3,
  IconMail,
  IconPhone,
  IconRoute,
  IconSchool,
} from "@tabler/icons-react";

import { APP_TITLE } from "@/lib/app-config";

const services = [
  {
    icon: IconFileText,
    visual: "content",
    title: "Content strategy & design",
    description:
      "Use plain language, UX writing, information architecture, and digital storytelling to make complex content useful.",
  },
  {
    icon: IconRoute,
    visual: "transformation",
    title: "Digital transformation",
    description:
      "Modernize public sites and intranets with practical strategy across Drupal, SharePoint, and other enterprise platforms.",
  },
  {
    icon: IconHierarchy3,
    visual: "workflow",
    title: "ContentOps & workflow",
    description:
      "Build governance and editorial systems that help distributed teams publish with confidence.",
  },
  {
    icon: IconAccessible,
    visual: "accessibility",
    title: "UX & accessibility",
    description:
      "Create inclusive, research-led experiences that meet WCAG standards and real user needs.",
  },
  {
    icon: IconChartBar,
    visual: "analytics",
    title: "Analytics & performance",
    description:
      "Use meaningful data, search insights, and behavior analysis to improve digital outcomes.",
  },
  {
    icon: IconSchool,
    visual: "training",
    title: "Training & capacity building",
    description:
      "Give teams the skills and tools to sustain clear content and strong digital practice.",
  },
];

function ExpertiseVisual({ visual }: { visual: string }) {
  if (visual === "content") {
    return (
      <div
        className="expertise-visual expertise-visual-content"
        aria-hidden="true"
      >
        <span className="expertise-page">
          <i />
          <i />
          <i />
        </span>
        <span className="expertise-content-tag">Aa</span>
      </div>
    );
  }

  if (visual === "transformation") {
    return (
      <div
        className="expertise-visual expertise-visual-transformation"
        aria-hidden="true"
      >
        <span className="expertise-system expertise-system-old">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="expertise-transform-path" />
        <span className="expertise-system expertise-system-new">
          <i />
          <i />
          <i />
        </span>
      </div>
    );
  }

  if (visual === "workflow") {
    return (
      <div
        className="expertise-visual expertise-visual-workflow"
        aria-hidden="true"
      >
        <span className="workflow-node workflow-node-one" />
        <span className="workflow-node workflow-node-two" />
        <span className="workflow-node workflow-node-three" />
        <span className="workflow-node workflow-node-four" />
        <span className="workflow-line workflow-line-one" />
        <span className="workflow-line workflow-line-two" />
        <span className="workflow-line workflow-line-three" />
      </div>
    );
  }

  if (visual === "accessibility") {
    return (
      <div
        className="expertise-visual expertise-visual-accessibility"
        aria-hidden="true"
      >
        <span className="accessibility-screen">
          <i className="accessibility-focus" />
          <i className="accessibility-copy" />
          <i className="accessibility-action" />
        </span>
        <span className="accessibility-pulse" />
      </div>
    );
  }

  if (visual === "analytics") {
    return (
      <div
        className="expertise-visual expertise-visual-analytics"
        aria-hidden="true"
      >
        <span className="analytics-grid" />
        <span className="analytics-bar analytics-bar-one" />
        <span className="analytics-bar analytics-bar-two" />
        <span className="analytics-bar analytics-bar-three" />
        <span className="analytics-line" />
        <span className="analytics-point" />
      </div>
    );
  }

  return (
    <div
      className="expertise-visual expertise-visual-training"
      aria-hidden="true"
    >
      <span className="training-board">
        <i />
        <i />
        <i />
      </span>
      <span className="training-person training-person-one" />
      <span className="training-person training-person-two" />
      <span className="training-person training-person-three" />
    </div>
  );
}

const proof = [
  ["20+", "years of experience"],
  ["5+", "UN agencies"],
  ["+380%", "traffic growth at WMO"],
  ["90+", "contributors managed"],
];

const organizations = [
  {
    name: "WMO",
    fullName: "World Meteorological Organization",
    image: "/images/agency-wmo-building.jpg",
    alt: "The distinctive glass façade and landscaped exterior of WMO headquarters in Geneva",
    width: 1200,
    height: 814,
    credit: "Torbjorn Toby Jorgensen",
    license: "CC BY-SA 2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:World_Meteorological_Organization_(32807705467).jpg",
  },
  {
    name: "WIPO",
    fullName: "World Intellectual Property Organization",
    image: "/images/agency-wipo.jpg",
    alt: "WIPO headquarters complex in Geneva",
    width: 1200,
    height: 546,
    credit: "Emmanuel Berrod",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:WIPO_Headquarters.jpg",
  },
  {
    name: "WHO",
    fullName: "World Health Organization",
    image: "/images/agency-who.jpg",
    alt: "WHO headquarters main building in Geneva viewed from the south",
    width: 1200,
    height: 900,
    credit: "Thorkild Tylleskar",
    license: "CC BY-SA 3.0",
    source:
      "https://commons.wikimedia.org/wiki/File:WHO_HQ_main_building,_Geneva_from_South.JPG",
  },
  {
    name: "ILO",
    fullName: "International Labour Organization",
    image: "/images/agency-ilo.jpg",
    alt: "ILO headquarters building in Geneva",
    width: 1200,
    height: 900,
    credit: "BiiJii",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:ILO_Geneva.JPG",
  },
  {
    name: "UNCTAD",
    fullName: "UN Trade and Development",
    image: "/images/agency-unctad-palais.jpg",
    alt: "Palais des Nations in Geneva, home to UN Trade and Development",
    width: 1200,
    height: 898,
    credit: "Yann Forget",
    license: "CC BY-SA 3.0",
    source: "https://commons.wikimedia.org/wiki/File:Palais_des_nations.jpg",
  },
];

const upuDeliverables = [
  "Evidence-led target sitemap",
  "Content simplification plan",
  "Editorial governance framework",
  "CMS procurement specification",
];

const portfolioCases = [
  {
    organization: "International Labour Organization",
    type: "Public web redesign",
    title: "Making job search accessible and user-friendly",
    summary:
      "Rewrote job information in plain language, shaped the content hierarchy, and designed mobile-first user flows with HR editors.",
    result:
      "Improved task completion, earned positive user feedback, and reduced support inquiries.",
    visual: "jobs",
  },
  {
    organization: "World Meteorological Organization",
    type: "Flagship report storytelling",
    title: "Turning climate science into a clear digital narrative",
    summary:
      "Structured the 2024 State of the Global Climate report around key findings for journalists, policymakers, and the public.",
    result:
      "Became one of WMO’s most-visited pages in 2024 and established a model for future publication templates.",
    visual: "climate",
  },
  {
    organization: "International Labour Organization",
    type: "HR intranet redesign",
    title: "Helping staff find and act on HR information",
    summary:
      "Rewrote 80% of the content in plain English and created a reusable What / Who / When / How structure in SharePoint.",
    result:
      "+31% pageviews, +10.5% time on page, a 5% lower bounce rate, and fewer repetitive HR queries.",
    visual: "intranet",
  },
  {
    organization: "World Intellectual Property Organization",
    type: "Campaign microsite",
    title: "Designing an inclusive awards experience for SMEs",
    summary:
      "Organized the Global Awards journey around eligibility, nomination, and value, with accessible copy for multilingual audiences.",
    result:
      "Supported strong engagement and completion, multilingual rollout, and a reusable pattern for future awards pages.",
    visual: "awards",
  },
  {
    organization: "International Labour Organization",
    type: "Web storytelling redesign",
    title: "Making institutional history readable and relevant",
    summary:
      "Transformed legacy content into a scannable timeline, working with editors and archivists to surface key milestones.",
    result:
      "+31.1% pageviews, +10.5% time on page, a 5% lower bounce rate, and a template for other long-form content.",
    visual: "history",
  },
];

function ProjectVisual({ visual }: { visual: string }) {
  if (visual === "jobs") {
    return (
      <div className="project-visual project-visual-jobs" aria-hidden="true">
        <div className="visual-search">
          <span />
          Search opportunities
        </div>
        <div className="visual-layout">
          <div className="visual-filters">
            <span />
            <span />
            <span />
          </div>
          <div className="visual-results">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (visual === "climate") {
    return (
      <div className="project-visual project-visual-climate">
        <img
          className="climate-photo"
          src="/images/climate-earth.jpeg"
          alt="Satellite view of Earth over South America and the Atlantic Ocean"
          width="1200"
          height="675"
          loading="lazy"
        />
        <div className="visual-climate-bars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <p>Key findings</p>
      </div>
    );
  }

  if (visual === "intranet") {
    return (
      <div
        className="project-visual project-visual-intranet"
        aria-hidden="true"
      >
        <div className="visual-intranet-nav">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="visual-intranet-content">
          <span className="visual-title" />
          <div>
            <span />
            <span />
            <span />
          </div>
          <div>
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  if (visual === "awards") {
    return (
      <div className="project-visual project-visual-awards" aria-hidden="true">
        <div className="visual-award-mark">
          <span>01</span>
        </div>
        <div className="visual-award-steps">
          <span>Eligible</span>
          <span>Nominate</span>
          <span>Submit</span>
        </div>
      </div>
    );
  }

  return (
    <div className="project-visual project-visual-history" aria-hidden="true">
      <div className="visual-history-line" />
      {[1919, 1944, 1969, 2019].map((year) => (
        <div className="visual-history-event" key={year}>
          <span />
          <p>{year}</p>
        </div>
      ))}
    </div>
  );
}

export function meta() {
  return [
    { title: `${APP_TITLE} | Content Strategy & UX` },
    {
      name: "description",
      content:
        "LucidPath Digital helps international organizations create clear, accessible, and impactful digital experiences.",
    },
  ];
}

export default function HomeRoute() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8 lg:px-12">
          <a
            href="#top"
            className="group flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            aria-label="LucidPath Digital home"
          >
            <svg
              className="size-10 shrink-0"
              viewBox="0 0 40 40"
              aria-hidden="true"
            >
              <rect
                width="40"
                height="40"
                rx="7"
                fill="hsl(var(--brand-deep))"
              />
              <path
                d="M11 10v12h8M29 30V18h-8"
                fill="none"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="11" cy="10" r="2.8" fill="hsl(var(--brand-orange))" />
              <circle cx="29" cy="30" r="2.8" fill="white" />
            </svg>
            <span className="text-[15px] font-bold tracking-[-0.025em] text-[hsl(var(--brand-deep))] dark:text-white sm:text-base">
              LucidPath{" "}
              <span className="font-medium text-[hsl(var(--brand-sky))] dark:text-[hsl(var(--ring))]">
                Digital
              </span>
            </span>
          </a>

          <nav
            className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex"
            aria-label="Main navigation"
          >
            <a className="nav-link" href="#expertise">
              Expertise
            </a>
            <a className="nav-link" href="#about">
              About
            </a>
            <a className="nav-link" href="#work">
              Work
            </a>
          </nav>

          <a
            href="mailto:alex@lucidpathdigital.com?subject=Project%20enquiry"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[hsl(var(--brand-deep))] px-4 py-2 text-sm font-semibold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[hsl(var(--brand-ocean))] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:px-5"
          >
            Start a project
            <IconArrowUpRight
              className="hidden size-4 sm:block"
              aria-hidden="true"
            />
          </a>
        </div>
      </header>

      <main id="main-content">
        <section
          id="top"
          className="relative overflow-hidden scroll-mt-24 bg-[hsl(var(--brand-deep))] text-white"
        >
          <div className="hero-axis" aria-hidden="true">
            <span>Geneva</span>
            <span>46.2° N</span>
          </div>
          <div className="mx-auto grid min-h-[calc(100dvh-72px)] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.18fr_0.82fr] lg:px-12 lg:py-28">
            <div className="relative z-10 max-w-3xl">
              <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/72">
                <span className="h-px w-8 bg-[hsl(var(--brand-orange))]" />
                Content strategy · UX design
              </p>
              <h1 className="max-w-4xl text-balance text-[clamp(2.8rem,7vw,5.9rem)] font-bold leading-[0.98] tracking-[-0.055em]">
                Clear paths through complex content
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-white/78 sm:text-xl">
                We help international organizations turn complex information
                into accessible digital experiences that people can understand
                and use.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:alex@lucidpathdigital.com?subject=Project%20enquiry"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-semibold text-[hsl(var(--brand-deep))] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[hsl(var(--brand-light))] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  Start a project
                  <IconArrowUpRight className="size-5" aria-hidden="true" />
                </a>
                <a
                  href="#work"
                  className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/50 px-6 py-3 font-semibold text-white transition-[background-color,border-color] hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  View our work
                </a>
              </div>

              <div
                className="hero-mobile-route mt-14 lg:hidden"
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
              </div>
            </div>

            <figure className="path-visual mx-auto hidden aspect-square w-full max-w-[31rem] overflow-hidden rounded-lg sm:block">
              <img
                className="path-photo"
                src="/images/geneva-wipo.jpeg"
                alt="The WIPO headquarters in Geneva reflecting a clear blue sky"
                width="1400"
                height="2100"
                fetchPriority="high"
              />
              <div className="path-overlay" aria-hidden="true">
                <div className="path-orbit" />
                <div className="path-crosshair path-crosshair-one" />
                <div className="path-crosshair path-crosshair-two" />
                <div className="path-frame path-frame-one" />
                <div className="path-frame path-frame-two" />
                <div className="path-segment path-segment-one" />
                <div className="path-segment path-segment-two" />
                <div className="path-point path-point-one" />
                <div className="path-point path-point-two" />
                <div className="path-point path-point-three" />
                <span className="path-label path-label-one">Complexity</span>
                <span className="path-label path-label-two">Clarity</span>
              </div>
              <figcaption className="path-caption">
                Geneva · digital work for global missions
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          aria-label="Selected results"
          className="border-b border-border bg-background"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4 lg:px-12">
            {proof.map(([value, label], index) => (
              <div
                key={label}
                className={`outcome-cell relative py-8 sm:py-10 ${index % 2 === 0 ? "pr-5" : "border-l border-border pl-5"} lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0`}
              >
                <span className="outcome-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-3xl font-bold tracking-[-0.04em] text-primary sm:text-4xl">
                  {value}
                </p>
                <p className="mt-2 max-w-40 text-sm leading-5 text-muted-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="expertise"
          className="scroll-mt-20 bg-[hsl(var(--brand-light))] py-20 sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid gap-8 border-b border-[hsl(var(--brand-deep)/0.18)] pb-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="section-kicker text-[hsl(var(--brand-deep))]">
                  Expertise
                </p>
                <h2 className="mt-4 max-w-lg text-4xl font-bold leading-tight tracking-[-0.04em] text-[hsl(var(--brand-deep))] sm:text-5xl">
                  Strategy that moves into practice
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-[hsl(var(--brand-charcoal)/0.82)] lg:justify-self-end">
                From high-level direction to hands-on delivery, every engagement
                is shaped around your audience, content, and team.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <article
                    key={service.title}
                    className={`service-cell group relative overflow-hidden border-b border-[hsl(var(--brand-deep)/0.16)] py-9 md:px-8 ${index % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"} ${index % 3 !== 2 ? "lg:border-r" : "lg:border-r-0"} lg:px-8 lg:first:pl-0 lg:[&:nth-child(3n+1)]:pl-0 lg:[&:nth-child(3n)]:pr-0`}
                  >
                    <span className="service-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      className="service-icon size-7 text-[hsl(var(--brand-sky))]"
                      stroke={1.7}
                      aria-hidden="true"
                    />
                    <ExpertiseVisual visual={service.visual} />
                    <h3 className="mt-7 text-xl font-semibold tracking-[-0.02em] text-[hsl(var(--brand-deep))]">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-sm leading-7 text-[hsl(var(--brand-charcoal)/0.82)]">
                      {service.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-20 bg-background py-20 sm:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20 lg:px-12">
            <div>
              <p className="section-kicker">About</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-primary sm:text-5xl">
                Alex Faundez
              </h2>
              <p className="mt-3 text-lg font-semibold text-[hsl(var(--brand-sky))]">
                Founder &amp; Principal Consultant
              </p>
              <div className="mt-8 h-1 w-16 bg-[hsl(var(--brand-orange))]" />

              <ol
                className="method-track mt-12"
                aria-label="LucidPath Digital method"
              >
                {["Research", "Structure", "Design", "Deliver"].map(
                  (step, index) => (
                    <li key={step}>
                      <span aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ),
                )}
              </ol>

              <figure className="about-image mt-12">
                <img
                  src="/images/content-structure.jpeg"
                  alt="Printed source material organized with color-coded tabs"
                  width="1400"
                  height="932"
                  loading="lazy"
                />
                <figcaption>
                  Finding structure in complex source material
                </figcaption>
              </figure>
            </div>

            <div className="max-w-3xl">
              <p className="text-balance text-2xl font-medium leading-9 tracking-[-0.025em] text-foreground sm:text-3xl sm:leading-11">
                Twenty years shaping accessible, user-focused web ecosystems for
                international organizations.
              </p>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
                Alex leads LucidPath Digital’s strategy and quality across every
                engagement, from research and plain-language writing to
                information architecture, wireframes, and build. His portfolio
                spans public websites and intranets built with Drupal,
                SharePoint, Sitefinity, and other enterprise platforms.
              </p>

              <div className="mt-10 border-t border-border pt-8">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Experience includes
                </p>
                <ul
                  className="agency-grid mt-5 sm:grid-cols-3"
                  aria-label="Organizations Alex has worked with"
                >
                  {organizations.map((organization) => (
                    <li key={organization.name} className="agency-card">
                      <figure>
                        <img
                          src={organization.image}
                          alt={organization.alt}
                          width={organization.width}
                          height={organization.height}
                          loading="lazy"
                        />
                        <figcaption>
                          <strong>{organization.name}</strong>
                          <span>{organization.fullName}</span>
                          <a
                            href={organization.source}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {organization.credit} · {organization.license}
                          </a>
                        </figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          id="work"
          className="scroll-mt-20 bg-[hsl(var(--brand-charcoal))] py-20 text-white sm:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
              <div>
                <p className="section-kicker text-[hsl(var(--brand-orange))]">
                  Latest case study
                </p>
                <p className="mt-8 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/76">
                  Universal Postal Union · United Nations system
                </p>
                <h2 className="mt-6 text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">
                  Rebuilding the content foundations of upu.int
                </h2>
                <p className="mt-7 max-w-xl text-lg leading-8 text-white/72">
                  A nine-month consultancy took a 6,600-page reference website
                  from ungoverned sprawl to an evidence-based architecture, a
                  working governance model, and a procurement-ready
                  specification.
                </p>

                <dl className="mt-10 grid grid-cols-2 border-t border-white/15">
                  {[
                    ["6,623", "Pages audited"],
                    ["~50%", "Reduction target"],
                    ["80+", "Contributors"],
                    ["496", "Survey responses"],
                  ].map(([value, label], index) => (
                    <div
                      key={label}
                      className={`border-b border-white/15 py-6 ${index % 2 === 0 ? "pr-4" : "border-l border-white/15 pl-5"}`}
                    >
                      <dt className="text-sm text-white/60">{label}</dt>
                      <dd className="mt-2 text-3xl font-bold tracking-[-0.035em]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div
                className="case-preview upu-preview self-center"
                aria-label="Illustration of the UPU content audit, governance model, and target information architecture"
              >
                <div className="flex items-center justify-between border-b border-[hsl(var(--brand-deep)/0.12)] px-5 py-4">
                  <div className="flex gap-2" aria-hidden="true">
                    <span className="size-2 rounded-full bg-[hsl(var(--brand-orange))]" />
                    <span className="size-2 rounded-full bg-[hsl(var(--brand-sky)/0.55)]" />
                    <span className="size-2 rounded-full bg-[hsl(var(--brand-deep)/0.22)]" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--brand-deep)/0.62)]">
                    upu.int · target architecture
                  </span>
                </div>
                <figure className="upu-photo">
                  <img
                    src="/images/postal-network.jpeg"
                    alt="Numbered postal boxes arranged as an organized information system"
                    width="1600"
                    height="916"
                    loading="lazy"
                  />
                  <figcaption>
                    From a sprawling estate to a governed system
                  </figcaption>
                </figure>
                <div className="p-5 sm:p-8">
                  <div className="upu-map" aria-hidden="true">
                    <div className="upu-map-root">UPU</div>
                    <div className="upu-map-line" />
                    <div className="upu-map-branches">
                      <span>Postal policy</span>
                      <span>Standards</span>
                      <span>Knowledge</span>
                    </div>
                  </div>
                  <div
                    className="mt-5 grid grid-cols-3 gap-2 sm:gap-3"
                    aria-hidden="true"
                  >
                    {[
                      "Simplify",
                      "Merge",
                      "Migrate",
                      "Archive",
                      "Delete",
                      "Keep",
                    ].map((action) => (
                      <span className="upu-action" key={action}>
                        {action}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--brand-deep)/0.12)] pt-5">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[hsl(var(--brand-deep)/0.58)]">
                      Evidence before technology
                    </span>
                    <span className="text-2xl font-bold text-[hsl(var(--brand-orange))]">
                      52%
                    </span>
                  </div>
                  <p className="mt-1 text-right text-xs text-[hsl(var(--brand-charcoal)/0.65)]">
                    of documented issues were governance failures
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 grid gap-10 border-t border-white/20 pt-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-orange))]">
                  The challenge
                </p>
                <p className="mt-5 max-w-xl text-lg leading-8 text-white/76">
                  UPU’s public website is a working reference for regulators,
                  postal operators, researchers, and partners. Its aging CMS and
                  fragmented ownership had produced architecture drift, stalled
                  workflows, and content with no accountable owner.
                </p>
                <p className="mt-5 max-w-xl leading-7 text-white/64">
                  Alex joined as Chief Digital Project Manager to reduce the
                  content estate, establish governance, and prepare the evidence
                  needed to procure a replacement platform—in that order.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--brand-orange))]">
                  The approach
                </p>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/76">
                  The diagnostic combined crawl and analytics data, search
                  behavior, session recordings, interviews across ten
                  directorates, and a 496-response stakeholder survey. Every
                  assessed record received one of six decisions: keep, simplify,
                  merge, migrate, archive, or delete.
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {upuDeliverables.map((item) => (
                    <li
                      className="flex gap-3 border-t border-white/15 pt-3 text-sm leading-6 text-white/82"
                      key={item}
                    >
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[hsl(var(--brand-sky))]"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <blockquote className="mt-12 border-l-2 border-[hsl(var(--brand-orange))] py-1 pl-6 text-xl font-medium leading-8 text-white sm:max-w-4xl sm:text-2xl sm:leading-9">
              “Building the evidence first, then the governance, then the
              specification gave the organization a defensible basis for every
              decision.”
            </blockquote>

            <div
              id="portfolio-projects"
              className="mt-20 scroll-mt-24 border-t border-white/20 pt-10 sm:mt-24 sm:pt-14"
            >
              <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
                <h2 className="max-w-xl text-3xl font-bold tracking-[-0.035em] sm:text-4xl">
                  Selected content design projects
                </h2>
                <p className="max-w-2xl text-base leading-7 text-white/72 lg:justify-self-end">
                  Public websites, intranets, campaign experiences, and digital
                  stories designed around real user tasks.
                </p>
              </div>

              <ol className="mt-10 grid border-t border-white/15 md:grid-cols-2">
                {portfolioCases.map((project, index) => (
                  <li
                    key={project.title}
                    className={`project-entry relative border-b border-white/15 py-9 md:px-8 ${index % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"} ${index === portfolioCases.length - 1 ? "md:col-span-2 md:border-r-0 md:pr-[50%]" : ""}`}
                  >
                    <article>
                      <ProjectVisual visual={project.visual} />
                      <div className="mt-7 flex items-start gap-4">
                        <span className="text-sm font-bold tabular-nums text-[hsl(var(--brand-orange))]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-white/64">
                            {project.organization} · {project.type}
                          </p>
                          <h3 className="mt-3 text-xl font-semibold leading-7 tracking-[-0.02em] sm:text-2xl">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                      <p className="mt-6 max-w-xl leading-7 text-white/72">
                        {project.summary}
                      </p>
                      <p className="mt-5 max-w-xl border-l-2 border-[hsl(var(--brand-sky))] pl-4 text-sm font-medium leading-6 text-white/88">
                        {project.result}
                      </p>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="bg-[hsl(var(--brand-deep))] text-white"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12">
            <div>
              <p className="section-kicker text-[hsl(var(--brand-orange))]">
                Start a conversation
              </p>
              <h2 className="mt-5 max-w-4xl text-balance text-4xl font-bold leading-tight tracking-[-0.045em] sm:text-6xl">
                Make your next digital experience easier to understand—and
                easier to use.
              </h2>
            </div>
            <a
              href="mailto:alex@lucidpathdigital.com?subject=Project%20enquiry"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-md bg-white px-7 py-3 font-semibold text-[hsl(var(--brand-deep))] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[hsl(var(--brand-light))] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Get in touch
              <IconArrowUpRight className="size-5" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-[hsl(var(--brand-charcoal))] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-12">
          <div>
            <p className="font-bold">LucidPath Digital</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/72">
              Clear paths through complex content for organizations with a
              global mission.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:gap-6">
            <a className="footer-link" href="mailto:alex@lucidpathdigital.com">
              <IconMail className="size-4" aria-hidden="true" />
              alex@lucidpathdigital.com
            </a>
            <a className="footer-link" href="tel:+41793767922">
              <IconPhone className="size-4" aria-hidden="true" />
              +41 79 376 7922
            </a>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-white/68 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <p>© 2025 LucidPath Digital. All rights reserved.</p>
            <p>Geneva, Switzerland</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
