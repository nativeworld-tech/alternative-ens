import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// ---- Design tokens (from the Alternatives handoff design) ----
const C = {
  ink: "#3e3e40",
  muted: "#6e6e73",
  surface: "#f9f9ff",
  divider: "#e6e6ea",
  accent: "#4d4cff",
  accentDeep: "#3a39e6",
  accentTint: "#ecebff",
  accentBorder: "#d4d3ff",
  labelGrey: "#8e8e96",
};

const NAV_LINKS = [
  { href: "#offerings", label: "Offerings" },
  { href: "#clients", label: "Client Types" },
  { href: "#cases", label: "Case Studies" },
  { href: "#compliance", label: "Compliance" },
  { href: "#signup", label: "Expert Sign-Up" },
  { href: "#careers", label: "Careers" },
];

const OFFERINGS = [
  {
    title: "Expert Calls",
    desc: "One-on-one consultations with vetted industry experts.",
    tags: ["Commercial Due Diligence", "Market Research", "Competitive Intelligence", "Strategic Decision-Making", "Technology & Industry Assessments"],
  },
  {
    title: "Expert Advisory",
    desc: "Access senior advisors for project-based or long-term engagements.",
    tags: ["Portfolio Value Creation", "Business Transformation", "Operational Excellence", "Growth Strategy", "Change Management"],
  },
  {
    title: "Independent Director Placement",
    desc: "Identify and place experienced Independent Directors and Board Advisors.",
    tags: ["Board Appointments", "Corporate Governance", "IPO Readiness", "Strategic Oversight and Guidance"],
  },
  {
    title: "Interim & Fractional Leadership",
    desc: "Access specialized leadership without long-term hiring commitments.",
    tags: ["Interim CXOs / Mid-level Resources", "Transformation Projects", "Strategic Project Initiatives", "Business Expansion", "Short/Medium Term Leadership Gaps"],
  },
  {
    title: "Surveys & Market Intelligence",
    desc: "Structured insights from selected industry professionals.",
    tags: ["Customer Insights", "Market Assessment and Landscaping", "Competitive Benchmarking", "Industry Trend Analysis", "Investment Research"],
  },
];

const SHOWCASE = [
  { label: "Expert Calls", title: "First-hand insight, one conversation away", desc: "One-on-one consultations with vetted industry experts.", img: "/landing/assets/expert-calls.jpg" },
  { label: "Expert Advisory", title: "Senior operators, on the problem with you", desc: "Apply operational expertise to complex business challenges.", img: "/landing/assets/expert-advisory.jpg" },
  { label: "Independent Directors", title: "Boards built for the next stage", desc: "Leaders with relevant industry, governance, and functional expertise.", img: "/landing/assets/independent-directors.jpg" },
  { label: "Interim & Fractional", title: "Leadership for the interval", desc: "Support during growth, transition, or transformation.", img: "/landing/assets/interim-fractional.jpg" },
  { label: "Surveys & Intelligence", title: "Market sentiment, at scale", desc: "Structured insights from selected industry professionals.", img: "/landing/assets/surveys-intelligence.jpg" },
];

const CLIENT_TYPES = [
  {
    roman: "i",
    numeral: "01",
    headerBg: "linear-gradient(135deg, #3a39e6 0%, #4d4cff 60%, #6f6eff 100%)",
    headerPattern: "network" as const,
    title: "Private Equity & Venture Capital",
    points: [
      "Support commercial due diligence and investment evaluations",
      "Validate investment theses through first-hand industry insights",
      "Assess markets, competitors, customers, and operations",
      "Identify value creation opportunities across portfolio companies",
      "Access experienced operators and industry specialists globally",
      "Identify Independent Directors for board roles",
    ],
  },
  {
    roman: "ii",
    numeral: "02",
    headerBg: "#ffffff",
    headerPattern: "dots" as const,
    title: "Consulting Firms",
    points: [
      "Connect project teams with industry and functional experts",
      "Validate strategic recommendations with practitioner insights",
      "Support market assessments, benchmarking, and transformation projects",
      "Access niche expertise across industries and geographies",
      "Accelerate research and improve project outcomes",
    ],
  },
  {
    roman: "iii",
    numeral: "03",
    headerBg: "#26273a",
    headerPattern: "bars" as const,
    title: "Corporates & Enterprises",
    points: [
      "Support strategic planning and business transformation",
      "Gain insights on new markets, products, technologies, and competitors",
      "Benchmark industry best practices and operational performance",
      "Engage experts for innovation, growth, and problem solving",
      "Access independent perspectives to strengthen decision-making",
    ],
  },
];

const SECTORS = [
  { name: "Pharma & Healthcare", tags: ["Diagnostics", "Medical Devices", "Pharmaceuticals", "Biotech", "Hospitals", "Lifesciences"], img: "/landing/assets/sector-pharma.jpg" },
  { name: "Tech", tags: ["IT Services & Consulting", "Software & SaaS", "Fintech", "Cloud Infra & Data Centers", "AI & ML", "Healthtech", "Hardware"], img: "/landing/assets/sector-tech.jpg" },
  { name: "Financial Services", tags: ["Banks & FIs", "NBFCs", "Wealth and Asset Management", "Insurance", "Cards and Payments", "Fintech"], img: "/landing/assets/sector-financial.jpg" },
  { name: "Industrials", tags: ["Chemicals", "Building Materials", "Manufacturing & Engineering", "Industrial Machinery", "Auto and Auto Components", "Metals & Mining", "Construction & Infra", "Energy"], img: "/landing/assets/sector-industrials.jpg" },
  { name: "Consumer", tags: ["Internet Brands", "Media, Entertainment and Telecom", "FMCG", "Apparel and Fashion", "Retail", "Food and Restaurants", "Consumer Durables", "Travel and Tourism"], img: "/landing/assets/sector-consumer.jpg" },
];

const REGION_MARQUEE = [
  { count: "1,00,000+", region: "India" },
  { count: "75,000+", region: "USA" },
  { count: "40,000+", region: "Europe" },
  { count: "10,000+", region: "Middle East" },
  { count: "10,000+", region: "Southeast Asia" },
  { count: "8,000+", region: "China & East Asia" },
  { count: "4,000+", region: "Australia & NZ" },
  { count: "2,000+", region: "Latin America" },
  { count: "1,000+", region: "Africa" },
];

type CaseStudy = {
  badge: string;
  subIndustry: string;
  headline: string;
  sector: string;
  scope: string;
  duration: string;
  overview: string[];
  quote: string;
  experts: { initials: string; title: string; company: string }[];
  tags: string[];
};

const CASE_SECTORS = ["Healthcare", "Tech", "Financial Services", "Industrials", "Consumer"];

const CASE_STUDIES: CaseStudy[][] = [
  // Healthcare
  [
    {
      badge: "Advisor Connect",
      subIndustry: "Medical Devices",
      headline: "Alternatives supported a leading private equity firm in identifying European advisors with expertise in minimally invasive valve replacement procedures for one of its life sciences portfolio companies.",
      sector: "Medical Devices",
      scope: "Fractional Consultant",
      duration: "4 weeks",
      overview: [
        "Alternatives leveraged its life sciences network to identify a seasoned leader in the interventional cardiology space.",
        "The advisor brought over 30 years of life sciences experience, having led commercialization efforts across a range of heart valve technologies.",
      ],
      quote: "Alternatives helped the client identify an advisor to guide their interventional cardiology strategy.",
      experts: [
        { initials: "EL", title: "Ex. BU-Director", company: "Edwards Lifesciences" },
        { initials: "M", title: "Ex. VP Commercial", company: "Medtronic" },
        { initials: "BS", title: "Ex. VP Strategy", company: "Boston Scientific" },
      ],
      tags: ["Operating Advisors", "Fractional Consultants", "Deal Advisors"],
    },
    {
      badge: "Expert Consultations",
      subIndustry: "Pharmaceuticals",
      headline: "Alternatives supported a global strategy consulting firm in assessing market access pathways for a novel oncology therapy across key Southeast Asian markets.",
      sector: "Pharmaceuticals",
      scope: "Expert Consultations",
      duration: "60 mins",
      overview: [
        "Alternatives connected the project team with former market access, pricing, and medical affairs leaders who had launched oncology products in Singapore, Thailand, Malaysia, and Vietnam.",
        "The experts shared insights on reimbursement timelines, hospital formulary listing, tender dynamics, and patient assistance programmes.",
      ],
      quote: "Alternatives helped the client build a country-by-country launch sequencing plan grounded in practitioner insight.",
      experts: [
        { initials: "R", title: "Ex. Head of Market Access, SEA", company: "Roche" },
        { initials: "A", title: "Ex. Oncology Business Unit Head", company: "AstraZeneca" },
        { initials: "N", title: "Ex. Regional Pricing Director", company: "Novartis" },
      ],
      tags: ["Expert Consultations", "Quick Insights", "Market Research"],
    },
    {
      badge: "Interim & Fractional",
      subIndustry: "Hospitals",
      headline: "Alternatives supported a PE-backed multi-specialty hospital chain in placing an interim Chief Operating Officer to lead its expansion into Tier-2 cities in India.",
      sector: "Hospitals",
      scope: "Interim COO",
      duration: "6 months",
      overview: [
        "Alternatives screened senior hospital operators with experience in greenfield commissioning, clinical talent acquisition, and payer empanelment.",
        "The placed executive brought over two decades of hospital operations experience and had previously led the launch of multiple facilities across North and West India.",
      ],
      quote: "Alternatives helped the client commission two new facilities on schedule while a permanent COO search was completed.",
      experts: [
        { initials: "FH", title: "Ex. Regional COO", company: "Fortis Healthcare" },
        { initials: "MH", title: "Ex. Cluster Head, Operations", company: "Manipal Hospitals" },
        { initials: "MH", title: "Ex. Director, New Facilities", company: "Max Healthcare" },
      ],
      tags: ["Interim Leadership", "Fractional Executives", "Transformation"],
    },
    {
      badge: "Surveys",
      subIndustry: "Diagnostics",
      headline: "Alternatives supported an investment firm in surveying pathologists and lab directors to gauge adoption of digital pathology platforms across India and the Middle East.",
      sector: "Diagnostics",
      scope: "Quantitative Survey",
      duration: "3 weeks, 120+ respondents",
      overview: [
        "Alternatives fielded a structured survey among practicing pathologists and diagnostics procurement leaders to size near-term appetite for digital pathology and AI-assisted reads.",
        "Responses covered budget ownership, vendor shortlists, and rollout timelines across hospital and standalone-lab settings.",
      ],
      quote: "Alternatives helped the client size near-term demand and validate its investment thesis.",
      experts: [
        { initials: "DL", title: "Ex. Lab Director", company: "Dr Lal PathLabs" },
        { initials: "AD", title: "Ex. Head of Pathology", company: "Aster DM Healthcare" },
        { initials: "MH", title: "Ex. Procurement Head, Diagnostics", company: "Metropolis Healthcare" },
      ],
      tags: ["Quantitative Surveys", "Market Sentiment", "Benchmarking"],
    },
  ],
  // Tech
  [
    {
      badge: "Expert Consultations",
      subIndustry: "IT Services",
      headline: "Alternatives supported a private equity-owned IT services portfolio company in benchmarking sales structures and compensation design against global peers.",
      sector: "IT Services",
      scope: "Expert Consultations",
      duration: "60 mins",
      overview: [
        "Alternatives connected the client with senior sales and client-management leaders from comparable global services and BPO organizations.",
        "Conversations covered account coverage models, quota design, and variable-pay structures for enterprise sales teams.",
      ],
      quote: "Alternatives helped the client redesign its sales compensation framework using proven peer benchmarks.",
      experts: [
        { initials: "GC", title: "Chief Client Officer", company: "Global CX & BPO firm" },
        { initials: "GP", title: "EVP Global Sales", company: "Global Professional Services Firm" },
        { initials: "GS", title: "SVP Sales", company: "Global Software Engineering firm" },
        { initials: "DA", title: "VP Sales", company: "Data Analytics & AI firm" },
      ],
      tags: ["Expert Consultations", "Quick Insights", "Market Research"],
    },
    {
      badge: "Surveys",
      subIndustry: "Cybersecurity",
      headline: "Alternatives supported a growth equity investor in surveying CISOs on budget allocation and vendor consolidation trends across the US and Europe.",
      sector: "Cybersecurity",
      scope: "Quantitative Survey",
      duration: "2 weeks, 150+ respondents",
      overview: [
        "Alternatives surveyed security leaders on spend priorities, tool sprawl, and consolidation intentions across identity, endpoint, and cloud security categories.",
        "Findings were segmented by company size and industry to support the investor's category thesis.",
      ],
      quote: "Alternatives helped the client validate where CISO budgets are consolidating over the next 12 months.",
      experts: [
        { initials: "GR", title: "Ex. CISO", company: "Global Retail Bank" },
        { initials: "FM", title: "Ex. VP Security Architecture", company: "Fortune 500 Manufacturer" },
        { initials: "ET", title: "Ex. Head of IT Procurement", company: "European Telecom Operator" },
      ],
      tags: ["Quantitative Surveys", "Market Sentiment", "Benchmarking"],
    },
    {
      badge: "Interim & Fractional",
      subIndustry: "SaaS",
      headline: "Alternatives placed a fractional Chief Revenue Officer at a vertical SaaS company to lead its US mid-market expansion.",
      sector: "SaaS",
      scope: "Fractional CRO",
      duration: "9 months",
      overview: [
        "Alternatives identified a fractional CRO with direct experience scaling mid-market SaaS go-to-market motions in North America.",
        "The advisor rebuilt the pipeline model, hired the first US-based AEs, and set the pricing and packaging strategy for the segment.",
      ],
      quote: "Alternatives helped the client stand up a repeatable US mid-market motion within two quarters.",
      experts: [
        { initials: "F", title: "Ex. CRO", company: "Freshworks" },
        { initials: "Z", title: "Ex. VP Sales, NA", company: "Zoho" },
        { initials: "C", title: "Ex. Head of RevOps", company: "Chargebee" },
      ],
      tags: ["Interim Leadership", "Fractional Executives", "Transformation"],
    },
    {
      badge: "Expert Consultations",
      subIndustry: "Data Centers",
      headline: "Alternatives supported an infrastructure fund in evaluating power availability and hyperscaler demand across India and Southeast Asia.",
      sector: "Data Centers",
      scope: "Expert Consultations",
      duration: "60 mins",
      overview: [
        "Alternatives connected the fund with data center site-selection and development leaders who had recently commissioned capacity in the region.",
        "Conversations covered power procurement timelines, land availability, and hyperscaler leasing terms.",
      ],
      quote: "Alternatives helped the client stress-test its capacity growth assumptions ahead of investment committee.",
      experts: [
        { initials: "GH", title: "Ex. Head of Site Selection, APAC", company: "Global Hyperscaler" },
        { initials: "ST", title: "Ex. VP Development", company: "ST Telemedia GDC" },
        { initials: "E", title: "Ex. Director Energy Procurement", company: "Equinix" },
      ],
      tags: ["Expert Consultations", "Quick Insights", "Market Research"],
    },
  ],
  // Financial Services
  [
    {
      badge: "Expert Consultations",
      subIndustry: "Treasury",
      headline: "Alternatives supported a private equity firm in assessing treasury modernization opportunities at a public sector bank.",
      sector: "Treasury",
      scope: "Expert Consultations",
      duration: "60 mins",
      overview: [
        "Alternatives connected the client with senior treasury and global markets operations leaders from comparable banks.",
        "Discussions covered core treasury system upgrades, straight-through processing gaps, and vendor landscape for PSU banks.",
      ],
      quote: "Alternatives helped the client shape its technology diligence questions ahead of a bid.",
      experts: [
        { initials: "H", title: "SVP Head Treasury Ops", company: "HDFC" },
        { initials: "BP", title: "Director, Head Global Markets & ALM Treasury Ops", company: "BNP Paribas" },
        { initials: "YB", title: "Country Head Trade Operations", company: "Yes Bank" },
      ],
      tags: ["Expert Consultations", "Quick Insights", "Market Research"],
    },
    {
      badge: "Advisor Connect",
      subIndustry: "Investment Management",
      headline: "Alternatives supported a private equity firm in mapping the investment management technology landscape in India.",
      sector: "Investment Management",
      scope: "Treasury Operations Consultant",
      duration: "4 weeks",
      overview: [
        "Alternatives placed a fractional consultant to map front, middle, and back-office technology vendors used by Indian asset managers.",
        "The engagement produced a landscape view of build-vs-buy decisions and switching costs across the category.",
      ],
      quote: "Alternatives helped the client build conviction on where technology spend is heading in Indian asset management.",
      experts: [
        { initials: "SM", title: "Sr VP & CIO", company: "SBI Mutual Fund" },
        { initials: "WC", title: "Executive Director & CTO", company: "WhiteOak Capital" },
        { initials: "CF", title: "CTO", company: "Credila Financial Services Ltd" },
      ],
      tags: ["Operating Advisors", "Fractional Consultants", "Deal Advisors"],
    },
    {
      badge: "Independent Directors",
      subIndustry: "NBFC",
      headline: "Alternatives supported a PE-backed NBFC in appointing an independent director ahead of its planned IPO.",
      sector: "NBFC",
      scope: "Independent Director Placement",
      duration: "8 weeks",
      overview: [
        "Alternatives ran a targeted search for candidates with credit risk and regulatory experience relevant to an IPO-track NBFC.",
        "The shortlist was screened for independence, board availability, and audit-committee readiness.",
      ],
      quote: "Alternatives helped the client strengthen its board ahead of listing scrutiny.",
      experts: [
        { initials: "IB", title: "Ex. CRO", company: "ICICI Bank" },
        { initials: "RB", title: "Ex. Executive Director", company: "RBI" },
        { initials: "SB", title: "Ex. Deputy MD", company: "State Bank of India" },
      ],
      tags: ["Board Search", "Governance", "Independent Directors"],
    },
    {
      badge: "Surveys",
      subIndustry: "Payments",
      headline: "Alternatives supported a consulting firm in surveying merchants on digital payment acceptance trends across Indian cities.",
      sector: "Payments",
      scope: "Quantitative Survey",
      duration: "3 weeks, 300+ respondents",
      overview: [
        "Alternatives surveyed small and mid-sized merchants on acceptance costs, settlement speed, and preferred payment rails.",
        "The dataset was cut by city tier and merchant category to support the client's go-to-market recommendations.",
      ],
      quote: "Alternatives helped the client quantify where UPI and card acceptance friction remains highest.",
      experts: [
        { initials: "P", title: "Ex. Head Merchant Acquiring", company: "Paytm" },
        { initials: "P", title: "Ex. VP Merchant Lending", company: "PhonePe" },
        { initials: "R", title: "Ex. Director SME Payments", company: "Razorpay" },
      ],
      tags: ["Quantitative Surveys", "Market Sentiment", "Benchmarking"],
    },
  ],
  // Industrials
  [
    {
      badge: "Expert Consultations",
      subIndustry: "Lubricants",
      headline: "Alternatives supported a market research firm in benchmarking agricultural-equipment lubricant suppliers across Southeast Asia and India.",
      sector: "Lubricants",
      scope: "Expert Consultations",
      duration: "60 mins",
      overview: [
        "Alternatives connected the client with OEM procurement and national sales leaders across four lubricant brands and geographies.",
        "Conversations covered channel margins, OEM approval cycles, and competitive positioning by brand.",
      ],
      quote: "Alternatives helped the client build a country-by-country competitive map for its client.",
      experts: [
        { initials: "P", title: "National OEM Manager, India", company: "Petronas" },
        { initials: "K", title: "Procurement Head, Myanmar", company: "Kubota" },
        { initials: "C", title: "National Sales Head, Vietnam", company: "Castrol" },
        { initials: "V", title: "Senior GM, India", company: "Veedol" },
      ],
      tags: ["Expert Consultations", "Quick Insights", "Market Research"],
    },
    {
      badge: "Expert Consultations",
      subIndustry: "Auto Components",
      headline: "Alternatives supported a private equity firm in assessing the impact of the EV shift on powertrain component demand.",
      sector: "Auto Components",
      scope: "Expert Consultations",
      duration: "60 mins",
      overview: [
        "Alternatives connected the client with OEM procurement and product planning leaders across passenger and two-wheeler segments.",
        "Discussions covered component-level content shifts as OEMs transition powertrain mix toward electric platforms.",
      ],
      quote: "Alternatives helped the client size which component categories face the steepest demand decline.",
      experts: [
        { initials: "TM", title: "Ex. Head of Procurement", company: "Tata Motors" },
        { initials: "BA", title: "Ex. VP Product Planning", company: "Bajaj Auto" },
        { initials: "ME", title: "Ex. Director EV Engineering", company: "Mahindra Electric" },
      ],
      tags: ["Expert Consultations", "Quick Insights", "Market Research"],
    },
    {
      badge: "Interim & Fractional",
      subIndustry: "Specialty Chemicals",
      headline: "Alternatives placed an interim Chief Financial Officer at a specialty chemicals business during a carve-out from its parent group.",
      sector: "Specialty Chemicals",
      scope: "Interim CFO",
      duration: "5 months",
      overview: [
        "Alternatives identified an interim CFO with direct carve-out and standalone-finance-function experience in the chemicals sector.",
        "The advisor built the standalone finance stack, closed the first independent audit, and supported lender negotiations.",
      ],
      quote: "Alternatives helped the client complete the carve-out finance workstream on schedule.",
      experts: [
        { initials: "AI", title: "Ex. CFO", company: "Aarti Industries" },
        { initials: "BI", title: "Ex. VP Finance, Carve-outs", company: "BASF India" },
        { initials: "SL", title: "Ex. Group Controller", company: "SRF Limited" },
      ],
      tags: ["Interim Leadership", "Fractional Executives", "Transformation"],
    },
    {
      badge: "Surveys",
      subIndustry: "Logistics",
      headline: "Alternatives supported an investment firm in surveying supply chain heads on warehousing and third-party logistics adoption.",
      sector: "Logistics",
      scope: "Quantitative Survey",
      duration: "3 weeks, 200+ respondents",
      overview: [
        "Alternatives surveyed supply chain and logistics heads on 3PL spend, warehouse automation adoption, and switching intent.",
        "The results informed the investor's view of consolidation opportunities in the 3PL space.",
      ],
      quote: "Alternatives helped the client validate demand for automated warehousing at scale.",
      experts: [
        { initials: "AP", title: "Ex. Head of Supply Chain", company: "Asian Paints" },
        { initials: "F", title: "Ex. VP Warehousing", company: "Flipkart" },
        { initials: "NI", title: "Ex. Director Logistics Procurement", company: "Nestlé India" },
      ],
      tags: ["Quantitative Surveys", "Market Sentiment", "Benchmarking"],
    },
  ],
  // Consumer
  [
    {
      badge: "Expert Consultations",
      subIndustry: "Beauty & Personal Care",
      headline: "Alternatives supported a private equity firm in evaluating a D2C beauty investment thesis ahead of a growth-round decision.",
      sector: "Beauty & Personal Care",
      scope: "Expert Consultations",
      duration: "60 mins",
      overview: [
        "Alternatives connected the client with category and growth-marketing leaders who had scaled comparable D2C beauty brands.",
        "Discussions covered customer acquisition economics, retention curves, and offline expansion playbooks.",
      ],
      quote: "Alternatives helped the client pressure-test the target's unit economics before signing.",
      experts: [
        { initials: "N", title: "Ex. VP Category, Beauty", company: "Nykaa" },
        { initials: "HC", title: "Ex. Head of Growth Marketing", company: "Honasa Consumer" },
        { initials: "HU", title: "Ex. GM Skin Care", company: "Hindustan Unilever" },
      ],
      tags: ["Expert Consultations", "Quick Insights", "Market Research"],
    },
    {
      badge: "Expert Consultations",
      subIndustry: "FMCG",
      headline: "Alternatives supported a consulting firm in mapping rural distribution networks across North and East India.",
      sector: "FMCG",
      scope: "Expert Consultations",
      duration: "60 mins",
      overview: [
        "Alternatives connected the project team with rural sales and distribution leaders from leading FMCG and foods companies.",
        "Conversations covered distributor economics, rural retail penetration, and last-mile fulfillment models.",
      ],
      quote: "Alternatives helped the client design a phased rural go-to-market rollout.",
      experts: [
        { initials: "D", title: "Ex. Head of Rural Sales", company: "Dabur" },
        { initials: "IF", title: "Ex. National Distribution Manager", company: "ITC Foods" },
        { initials: "B", title: "Ex. VP Sales, East", company: "Britannia" },
      ],
      tags: ["Expert Consultations", "Quick Insights", "Market Research"],
    },
    {
      badge: "Advisor Connect",
      subIndustry: "Food Service",
      headline: "Alternatives placed an operating advisor with a private equity firm to support a QSR franchising scale-up.",
      sector: "Food Service",
      scope: "Operating Advisor",
      duration: "12 weeks",
      overview: [
        "Alternatives identified an operating advisor with direct QSR franchising and expansion experience in the Indian market.",
        "The advisor supported franchisee selection criteria, unit economics benchmarking, and store rollout sequencing.",
      ],
      quote: "Alternatives helped the client build a disciplined franchise expansion playbook.",
      experts: [
        { initials: "JF", title: "Ex. COO", company: "Jubilant FoodWorks" },
        { initials: "MI", title: "Ex. Head of Franchising", company: "McDonald's India" },
        { initials: "DI", title: "Ex. VP Expansion", company: "Devyani International" },
      ],
      tags: ["Operating Advisors", "Fractional Consultants", "Deal Advisors"],
    },
    {
      badge: "Surveys",
      subIndustry: "Retail",
      headline: "Alternatives supported a consumer fund in surveying urban households on the shift toward quick-commerce grocery shopping.",
      sector: "Retail",
      scope: "Quantitative Survey",
      duration: "2 weeks, 1,500+ households, 8 metros",
      overview: [
        "Alternatives surveyed households across eight metros on grocery spend, channel mix, and quick-commerce adoption drivers.",
        "The results were segmented by income cohort and city tier to inform the fund's category thesis.",
      ],
      quote: "Alternatives helped the client quantify how fast quick-commerce is displacing traditional grocery trips.",
      experts: [
        { initials: "B", title: "Ex. Head of Category, Grocery", company: "BigBasket" },
        { initials: "B", title: "Ex. VP Operations", company: "Blinkit" },
        { initials: "RR", title: "Ex. Director Modern Trade", company: "Reliance Retail" },
      ],
      tags: ["Quantitative Surveys", "Market Sentiment", "Benchmarking"],
    },
  ],
];

const CASE_CARD_GRADIENTS = [
  "linear-gradient(160deg, #2a2a5c 0%, #1f2037 100%)",
  "linear-gradient(160deg, #26273a 0%, #16171d 100%)",
  "linear-gradient(160deg, #3a39b8 0%, #2a2a5c 100%)",
  "linear-gradient(160deg, #2e2e4a 0%, #1c1d24 100%)",
];

const STATS = [
  { target: null as number | null, suffix: "", label: "Year Set Up", value: "2023" },
  { target: 100000, suffix: "+", label: "Experts Empaneled" },
  { target: 40, suffix: "", label: "Sectors and Sub-Sectors Covered" },
  { target: 1000, suffix: "+", label: "Mandates Executed" },
  { target: 30, suffix: "+", label: "Countries where Experts Empaneled" },
  { target: 100, suffix: "+", label: "Clients" },
];

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid work email"),
  organization: z.string().optional(),
  message: z.string().min(1, "Please tell us what you need"),
});
type ContactFormData = z.infer<typeof contactSchema>;

const LOGO = "/landing/assets/logo.png";

function ClientCardPattern({ kind }: { kind: "network" | "dots" | "bars" }) {
  if (kind === "network") {
    return (
      <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        <g stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1">
          <line x1="40" y1="40" x2="140" y2="90" /><line x1="140" y1="90" x2="90" y2="160" />
          <line x1="140" y1="90" x2="240" y2="60" /><line x1="240" y1="60" x2="330" y2="120" />
          <line x1="240" y1="60" x2="200" y2="170" /><line x1="330" y1="120" x2="370" y2="40" />
          <line x1="90" y1="160" x2="200" y2="170" />
        </g>
        <g fill="#ffffff">
          <circle cx="40" cy="40" r="5" fillOpacity="0.55" />
          <circle cx="140" cy="90" r="7" fillOpacity="0.75" />
          <circle cx="90" cy="160" r="4" fillOpacity="0.4" />
          <circle cx="240" cy="60" r="6" fillOpacity="0.6" />
          <circle cx="330" cy="120" r="5" fillOpacity="0.5" />
          <circle cx="370" cy="40" r="3.5" fillOpacity="0.35" />
          <circle cx="200" cy="170" r="4.5" fillOpacity="0.45" />
        </g>
      </svg>
    );
  }
  if (kind === "dots") {
    const rows = 6;
    const cols = 14;
    const dots: any[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push(<circle key={`${r}-${c}`} cx={16 + c * 28} cy={16 + r * 28} r="2.2" fill="#c9c9ff" />);
      }
    }
    return (
      <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
        {dots}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
      <g fill="#ffffff" fillOpacity="0.18">
        <rect x="30" y="120" width="24" height="60" /><rect x="70" y="90" width="24" height="90" />
        <rect x="110" y="60" width="24" height="120" /><rect x="150" y="100" width="24" height="80" />
        <rect x="190" y="40" width="24" height="140" /><rect x="230" y="80" width="24" height="100" />
        <rect x="270" y="55" width="24" height="125" /><rect x="310" y="110" width="24" height="70" />
        <rect x="350" y="70" width="24" height="110" />
      </g>
    </svg>
  );
}

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  // ---- Landing page interactive state ----
  const [openIdx, setOpenIdx] = useState<boolean[]>([true, false, false, false, false]);
  const [activePanel, setActivePanel] = useState(0);
  const [activeSector, setActiveSector] = useState(1);
  const [activeCaseSector, setActiveCaseSector] = useState(0);
  const [activeCase, setActiveCase] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [statsK, setStatsK] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);
  const countedRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.scrollingElement || document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setScrollPct(max > 0 ? el.scrollTop / max : 0);
      setShowBackToTop(el.scrollTop > 400);
      if (!countedRef.current && statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          countedRef.current = true;
          const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
          if (reduce) {
            setStatsK(1);
          } else {
            let t0: number | null = null;
            const step = (t: number) => {
              if (t0 === null) t0 = t;
              const p = Math.min(1, (t - t0) / 1100);
              setStatsK(1 - Math.pow(1 - p, 3));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const n = (v: number) => Math.round(v * statsK).toLocaleString("en-US");

  const toggleOffering = (i: number) => {
    setOpenIdx((prev) => {
      const next = prev.slice();
      next[i] = !next[i];
      return next;
    });
  };

  const pickCaseSector = (i: number) => {
    setActiveCaseSector(i);
    setActiveCase(0);
  };

  // ---- Contact form (wired to the real leads API) ----
  const contactMutation = trpc.leads.submit.useMutation();
  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", organization: "", message: "" },
  });

  const onContactSubmit = async (data: ContactFormData) => {
    try {
      await contactMutation.mutateAsync({
        name: data.name,
        organization: data.organization || undefined,
        email: data.email,
        queryType: "other",
        otherQuery: data.message,
      });
      toast.success("Thanks for reaching out — we'll follow up within one business day.");
      contactForm.reset();
    } catch (e: any) {
      toast.error(e.message || "Something went wrong. Please try again.");
    }
  };

  // If authenticated and admin (including super_admin), redirect to dashboard
  if (isAuthenticated && (user?.role === "admin" || user?.role === "super_admin")) {
    navigate("/admin");
    return null;
  }

  // If authenticated as expert, show expert portal option
  if (isAuthenticated && user?.role === "expert") {
    const handleExpertLogout = () => {
      localStorage.removeItem("manus-runtime-user-info");
      logout().then(() => {
        navigate("/");
      }).catch(() => {
        navigate("/");
      });
    };

    return (
      <div className="min-h-screen flex flex-col bg-white">
        <nav className="border-b border-border bg-white/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={LOGO} alt="Alternatives" className="h-6 w-auto object-contain" />
            </div>
            <Button variant="outline" size="sm" onClick={handleExpertLogout}>
              Logout
            </Button>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Alternatives</h1>
            <p className="text-muted-foreground mb-8">
              You're logged in as an expert. Visit the expert portal to complete or view your profile.
            </p>
            <Button size="lg" onClick={() => navigate("/expert/register")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Go to Expert Portal
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-secondary rounded-lg"></div>
        </div>
      </div>
    );
  }

  const sector = SECTORS[activeSector];

  // ---- Not authenticated: full marketing landing page ----
  return (
    <div style={{ background: "#ffffff", color: C.ink, minHeight: "100vh" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .alt-navlink { position: relative; padding-bottom: 3px; transition: color .18s ease; text-decoration: none; font-size: 13.5px; color: ${C.ink}; }
        .alt-navlink::after { content: ""; position: absolute; left: 0; right: 100%; bottom: 0; height: 1.5px; background: ${C.accent}; transition: right .25s ease; }
        .alt-navlink:hover::after { right: 0; }
        .alt-rule:hover { background: ${C.surface}; }
        .alt-btn { transition: background .18s ease, border-color .18s ease, color .18s ease; display: inline-block; text-decoration: none; white-space: nowrap; font-size: 14px; padding: 11px 22px; border-radius: 999px; cursor: pointer; font-family: inherit; }
        .alt-btn-primary { color: ${C.accent}; border: 1px solid rgba(77,76,255,0.5); background: transparent; }
        .alt-btn-primary:hover { background: ${C.surface}; border-color: ${C.accent}; }
        .alt-btn-ghost { color: ${C.ink}; border: 1px solid ${C.divider}; background: transparent; }
        .alt-btn-ghost:hover { background: #f2f2f7; }
        .alt-btn-white { color: #1c1d24; border: 1px solid #ffffff; background: #ffffff; }
        .alt-ctcard { transition: transform .25s ease; }
        .alt-ctcard:hover { transform: translateY(-4px); }
        @keyframes altmarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .alt-marquee-track { display: flex; gap: 44px; width: max-content; animation: altmarquee 42s linear infinite; white-space: nowrap; }
        .alt-showcase-panel { position: relative; overflow: hidden; cursor: pointer; background: #2a2a2e; transition: flex-grow .55s cubic-bezier(.4,0,.2,1); min-width: 64px; }
        .alt-sector-btn { font-size: 14px; padding: 9px 16px; cursor: pointer; font-family: inherit; border-radius: 999px; transition: all .2s ease; }
        .alt-tag { border: 1px solid ${C.accentBorder}; color: ${C.accentDeep}; background: ${C.accentTint}; white-space: nowrap; font-size: 13px; padding: 6px 12px; border-radius: 999px; display: inline-block; }
        .alt-kicker { display: block; font-size: 11.5px; letter-spacing: 0.14em; text-transform: uppercase; color: ${C.accent}; margin-bottom: 22px; }
      `}</style>

      {/* Scroll progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 2, background: C.accent, zIndex: 40, width: `${(scrollPct * 100).toFixed(2)}%` }} />

      {/* Back to top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Back to top"
          style={{ position: "fixed", right: 24, bottom: 24, zIndex: 40, width: 42, height: 42, borderRadius: "50%", border: "1px solid #d8d8de", background: "#fff", color: C.accent, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 20px rgba(62,62,64,0.10)" }}
        >
          ↑
        </button>
      )}

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px clamp(20px, 5vw, 72px) 20px 24px", borderBottom: `1px solid ${C.divider}`, position: "sticky", top: 0, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)", zIndex: 20 }}>
        <img src={LOGO} alt="Alternatives" style={{ height: 24, display: "block" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="alt-navlink">{l.label}</a>
          ))}
          <a className="alt-btn alt-btn-primary" href="#contact">Talk to our team</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "72vh", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "#ffffff", borderBottom: `1px solid ${C.divider}` }}>
        <img src="/landing/assets/hero-network.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, #ffffff 0%, rgba(255,255,255,0.94) 34%, rgba(255,255,255,0.55) 62%, rgba(255,255,255,0.15) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", width: "100%", maxWidth: 1200, margin: "0 auto", padding: "clamp(72px, 12vh, 132px) clamp(20px, 5vw, 72px) clamp(48px, 8vh, 84px)" }}>
          <h1 style={{ fontSize: "clamp(36px, 5.4vw, 68px)", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0, maxWidth: "17ch", fontWeight: 500 }}>
            Curated expertise, <span style={{ color: C.accent }}>on demand</span>.
          </h1>
          <p style={{ fontSize: 17.5, lineHeight: 1.6, color: C.muted, maxWidth: "54ch", margin: "24px 0 0" }}>
            Powered by Native, India's leading executive search firm, Alternatives connects decision-makers with relevant expertise across industries and geographies.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
            <a className="alt-btn alt-btn-primary" href="#contact">Talk to our team</a>
            <a className="alt-btn alt-btn-ghost" href="#offerings">See what we offer</a>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 5vw, 72px)" }}>
        <div style={{ padding: "76px 0 0", display: "grid", gridTemplateColumns: "minmax(0, 360px) minmax(0, 1fr)", gap: "20px clamp(24px, 6vw, 96px)" }}>
          <div><span className="alt-kicker">About Us</span></div>
          <div style={{ maxWidth: "62ch" }}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: C.muted, margin: "0 0 16px" }}>
              We work as an extension of our clients' teams, providing on-demand access to expert insights that speed up decision-making.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: C.muted, margin: 0 }}>
              Whether validating a hypothesis, entering a new market, or building industry understanding, we assist in removing barriers to knowledge and give organizations the expert insights to move from uncertainty to conviction.
            </p>
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section style={{ maxWidth: 1200, margin: "76px auto 0", padding: "0 clamp(20px, 5vw, 72px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 300px) minmax(0, 1fr)", gap: "clamp(24px, 5vw, 64px)", alignItems: "center" }}>
          <div>
            <span className="alt-kicker">Global Reach</span>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: C.muted, margin: "0 0 20px" }}>
              Experts empaneled across 30+ countries, with concentrations in the markets our clients transact in most.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, borderTop: `1px solid ${C.divider}`, paddingTop: 10 }}>
                <span style={{ width: 7, height: 7, background: C.accent, display: "inline-block" }} />
                <span style={{ fontSize: 13.5, color: C.muted }}>Primary hubs</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, borderTop: `1px solid ${C.divider}`, paddingTop: 10 }}>
                <span style={{ width: 7, height: 7, background: "#b3b2ff", display: "inline-block" }} />
                <span style={{ fontSize: 13.5, color: C.muted }}>Select a location to view sample case illustrations</span>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", aspectRatio: "16 / 9", border: `1px solid ${C.divider}`, overflow: "hidden" }}>
            <iframe src="/landing/map.html" title="Global expert coverage" style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div style={{ overflow: "hidden", margin: "64px 0 0", padding: "14px 0", borderTop: `1px solid ${C.divider}`, borderBottom: `1px solid ${C.divider}` }}>
        <div className="alt-marquee-track" style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: C.labelGrey }}>
          {[...REGION_MARQUEE, ...REGION_MARQUEE].map((item, i) => (
            <span key={i} style={{ display: "inline-flex", gap: 10, alignItems: "baseline" }}>
              <span style={{ color: C.accent }}>{item.count}</span>
              <span>{item.region}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Showcase panels */}
      <section style={{ marginTop: 76, padding: "0 clamp(20px, 5vw, 72px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 6, height: 520 }}>
          {SHOWCASE.map((p, i) => {
            const active = activePanel === i;
            return (
              <div
                key={p.label}
                className="alt-showcase-panel"
                onMouseEnter={() => setActivePanel(i)}
                onClick={() => setActivePanel(i)}
                style={{ flex: `${active ? 4 : 1} 1 0%` }}
              >
                <img src={p.img} alt={p.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,20,24,0.86) 0%, rgba(20,20,24,0.22) 55%, rgba(20,20,24,0.42) 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: 0, padding: "26px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
                  <p style={{
                    fontSize: 15, lineHeight: 1.25, color: "#fff", margin: 0, whiteSpace: "nowrap",
                    writingMode: active ? "horizontal-tb" : "vertical-rl",
                    alignSelf: "flex-start",
                  }}>{p.label}</p>
                  <div style={{ opacity: active ? 1 : 0, transition: "opacity .35s ease .12s" }}>
                    <h3 style={{ fontSize: 27, lineHeight: 1.2, color: "#fff", margin: "0 0 10px", maxWidth: "22ch", fontWeight: 500 }}>{p.title}</h3>
                    <p style={{ fontSize: 14.5, lineHeight: 1.55, color: "rgba(255,255,255,0.78)", margin: "0 0 18px", maxWidth: "34ch" }}>{p.desc}</p>
                    <a
                      href="#offerings"
                      style={{ pointerEvents: "auto", position: "relative", zIndex: 2, fontSize: 14, color: "#fff", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                    >
                      <span style={{ width: 26, height: 1, background: "#fff", display: "inline-block" }} />Read More
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats band */}
      <section ref={statsRef} id="stats" style={{ marginTop: 72, background: C.accent, color: "#ffffff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "44px clamp(20px, 5vw, 72px)", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 24 }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 30, margin: 0, letterSpacing: "-0.01em", fontWeight: 500 }}>
                {s.target === null ? s.value : n(s.target) + s.suffix}
              </p>
              <p style={{ fontSize: 11.5, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.68)", margin: "8px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Offerings accordion */}
      <section id="offerings" style={{ maxWidth: 1200, margin: "0 auto", padding: "88px clamp(20px, 5vw, 72px) 72px" }}>
        <span className="alt-kicker">Our Offerings / How We Help</span>
        {OFFERINGS.map((o, i) => (
          <div
            key={o.title}
            className="alt-rule"
            onClick={() => toggleOffering(i)}
            style={{
              cursor: "pointer", display: "grid", gridTemplateColumns: "56px minmax(0, 1fr)", gap: "20px 40px", padding: "32px 0",
              borderTop: `1px solid ${C.divider}`,
              borderBottom: i === OFFERINGS.length - 1 ? `1px solid ${C.divider}` : undefined,
            }}
          >
            <p style={{ fontSize: 13, letterSpacing: "0.08em", color: C.accent, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              {String(i + 1).padStart(2, "0")}
              <span style={{ fontSize: 15, color: "#9a9aa4", transition: "transform .25s ease", display: "inline-block", transform: openIdx[i] ? "rotate(45deg)" : "none" }}>+</span>
            </p>
            <div>
              <h3 style={{ fontSize: 21, margin: 0, fontWeight: 500 }}>{o.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: C.muted, margin: "6px 0 0", maxWidth: "60ch" }}>{o.desc}</p>
              {openIdx[i] && (
                <div>
                  <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: C.labelGrey, margin: "18px 0 10px" }}>Best For</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {o.tags.map((t) => <span key={t} className="alt-tag">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Client Types */}
      <section id="clients" style={{ background: "#16171d", padding: "76px clamp(20px, 5vw, 72px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span className="alt-kicker" style={{ color: "#9a9aff" }}>Client Types</span>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.15, letterSpacing: "-0.01em", margin: "0 0 40px", maxWidth: "18ch", color: "#ffffff", fontWeight: 500 }}>Who we work with</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20 }}>
            {CLIENT_TYPES.map((c) => {
              const dark = c.headerPattern !== "dots";
              return (
                <div key={c.title} className="alt-ctcard" style={{ background: C.surface, border: "none", borderRadius: 20, overflow: "hidden" }}>
                  <div style={{ position: "relative", height: 200, background: c.headerBg, overflow: "hidden", borderBottom: c.headerPattern === "dots" ? `1px solid ${C.divider}` : "none" }}>
                    <ClientCardPattern kind={c.headerPattern} />
                    <span
                      style={{
                        position: "absolute", left: -6, bottom: -34, fontSize: 140, lineHeight: 1, fontWeight: 500,
                        letterSpacing: "-0.04em", color: "transparent",
                        WebkitTextStroke: dark ? "1.5px rgba(255,255,255,0.28)" : "1.5px rgba(77,76,255,0.28)",
                        pointerEvents: "none",
                      }}
                    >
                      {c.numeral}
                    </span>
                  </div>
                  <div style={{ padding: "28px 28px 34px" }}>
                    <p style={{ fontSize: 12, color: C.accent, margin: "0 0 18px" }}>{c.roman}</p>
                    <h3 style={{ fontSize: 22, lineHeight: 1.25, margin: "0 0 16px", fontWeight: 500 }}>{c.title}</h3>
                    <div style={{ display: "grid", gap: 0 }}>
                      {c.points.map((pt) => (
                        <p key={pt} style={{ fontSize: 14, lineHeight: 1.6, color: C.muted, margin: 0, padding: "7px 0", borderTop: `1px solid ${C.divider}` }}>{pt}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section
        id="sectors"
        style={{
          position: "relative", overflow: "hidden", padding: "76px clamp(20px, 5vw, 72px)",
          backgroundImage: `url('${sector.img}')`, backgroundSize: "cover", backgroundPosition: "center", transition: "background-image .4s ease",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.86)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="alt-kicker" style={{ position: "relative", zIndex: 1 }}>Sectors We Cover</span>
          <div>
            <img src={LOGO} alt="Alternatives" style={{ height: 22, display: "block", marginBottom: 18 }} />
            <h2 style={{ fontSize: "clamp(40px, 6vw, 88px)", lineHeight: 0.98, letterSpacing: "-0.02em", margin: 0, color: "#1a1a1e", position: "relative", zIndex: 1, fontWeight: 500 }}>
              for <span style={{ color: "#2a2a5c" }}>{sector.name}</span>.
            </h2>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", borderBottom: `1px solid ${C.divider}`, margin: "36px 0 28px", paddingBottom: 20 }}>
            {SECTORS.map((s, i) => {
              const on = activeSector === i;
              return (
                <button
                  key={s.name}
                  type="button"
                  className="alt-sector-btn"
                  onClick={() => setActiveSector(i)}
                  style={{ border: `1px solid ${on ? C.accent : C.divider}`, background: on ? C.accent : "transparent", color: on ? "#ffffff" : C.muted }}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {sector.tags.map((t) => <span key={t} className="alt-tag">{t}</span>)}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="cases" style={{ background: "#ffffff", padding: "88px clamp(20px, 5vw, 72px) 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, flexWrap: "wrap", marginBottom: 22 }}>
            <div>
              <span className="alt-kicker">Case Studies</span>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.15, letterSpacing: "-0.01em", margin: 0, maxWidth: "18ch", fontWeight: 500 }}>Our body of work</h2>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                aria-label="Previous case study"
                onClick={() => setActiveCase((p) => (p - 1 + CASE_STUDIES[activeCaseSector].length) % CASE_STUDIES[activeCaseSector].length)}
                style={{ width: 44, height: 44, border: `1px solid ${C.divider}`, background: "#ffffff", color: C.ink, cursor: "pointer", fontSize: 18 }}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next case study"
                onClick={() => setActiveCase((p) => (p + 1) % CASE_STUDIES[activeCaseSector].length)}
                style={{ width: 44, height: 44, border: `1px solid ${C.accent}`, background: C.accent, color: "#ffffff", cursor: "pointer", fontSize: 18 }}
              >
                →
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {CASE_SECTORS.map((s, i) => {
              const on = activeCaseSector === i;
              return (
                <button
                  key={s}
                  type="button"
                  className="alt-sector-btn"
                  onClick={() => pickCaseSector(i)}
                  style={{ border: `1px solid ${on ? C.accent : C.divider}`, background: on ? C.accent : "transparent", color: on ? "#ffffff" : C.muted }}
                >
                  {s}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 6, minHeight: 660, alignItems: "stretch" }}>
            {CASE_STUDIES[activeCaseSector].map((cs, i) => {
              const active = activeCase === i;
              return (
                <div
                  key={cs.subIndustry}
                  onMouseEnter={() => setActiveCase(i)}
                  onClick={() => setActiveCase(i)}
                  style={{
                    position: "relative", overflow: "hidden", cursor: "pointer",
                    background: CASE_CARD_GRADIENTS[i % CASE_CARD_GRADIENTS.length],
                    color: "#ffffff", flex: `${active ? 8 : 1} 1 0%`, minWidth: 52,
                    transition: "flex-grow .6s cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: C.accent, opacity: active ? 1 : 0, transition: "opacity .4s ease" }} />
                  <span
                    style={{
                      position: "absolute", right: -10, bottom: -40, fontSize: 220, lineHeight: 1, fontWeight: 500,
                      letterSpacing: "-0.06em", color: "transparent", WebkitTextStroke: "1px #9a9aff38",
                      pointerEvents: "none", opacity: active ? 0 : 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {!active && (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: "26px 0", transition: "opacity .3s ease", pointerEvents: "none" }}>
                      <span style={{ fontSize: 13, color: "#9a9aff" }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 15, letterSpacing: "0.02em", whiteSpace: "nowrap", color: "#ffffff" }}>{cs.subIndustry}</span>
                    </div>
                  )}
                  {active && (
                    <div style={{ padding: "clamp(22px, 3vw, 34px) clamp(20px, 3vw, 40px)", maxWidth: 820, boxSizing: "border-box", display: "grid", alignContent: "start", gap: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ffffff", background: C.accent, padding: "6px 10px" }}>{cs.badge}</span>
                        <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.82)" }}>{CASE_SECTORS[activeCaseSector]} · {cs.subIndustry}</span>
                        <span style={{ marginLeft: "auto", fontSize: 13, color: "#9a9aff" }}>{String(i + 1).padStart(2, "0")} / {String(CASE_STUDIES[activeCaseSector].length).padStart(2, "0")}</span>
                      </div>
                      <h3 style={{ fontSize: "clamp(17px, 1.9vw, 23px)", lineHeight: 1.35, letterSpacing: "-0.01em", margin: 0, color: "#ffffff", maxWidth: "40ch" }}>{cs.headline}</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18, borderTop: "1px solid rgba(255,255,255,0.22)", borderBottom: "1px solid rgba(255,255,255,0.22)" }}>
                        <div style={{ padding: "12px 18px 12px 0", borderRight: "1px solid rgba(255,255,255,0.22)" }}>
                          <p style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9aff", margin: "0 0 4px" }}>Sector</p>
                          <p style={{ fontSize: 14, color: "#ffffff", margin: 0 }}>{cs.sector}</p>
                        </div>
                        <div style={{ padding: "12px 18px 12px 0", borderRight: "1px solid rgba(255,255,255,0.22)" }}>
                          <p style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9aff", margin: "0 0 4px" }}>Scope</p>
                          <p style={{ fontSize: 14, color: "#ffffff", margin: 0 }}>{cs.scope}</p>
                        </div>
                        <div style={{ padding: "12px 18px 12px 0" }}>
                          <p style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9aff", margin: "0 0 4px" }}>Duration</p>
                          <p style={{ fontSize: 14, color: "#ffffff", margin: 0 }}>{cs.duration}</p>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px 32px" }}>
                        <div>
                          <p style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9aff", margin: "0 0 10px" }}>Overview</p>
                          {cs.overview.map((p, oi) => (
                            <p key={oi} style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.9)", margin: "0 0 10px" }}>{p}</p>
                          ))}
                          <p style={{ fontSize: 14, lineHeight: 1.55, color: "#ffffff", margin: "14px 0 0", paddingLeft: 14, borderLeft: `2px solid ${C.accent}` }}>{cs.quote}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9a9aff", margin: "0 0 10px" }}>
                            Expert profiles showcased <span style={{ color: "rgba(255,255,255,0.7)" }}>(All Formers)</span>
                          </p>
                          <div style={{ display: "grid", gap: 8 }}>
                            {cs.experts.map((ex, ei) => (
                              <div key={ei} style={{ display: "grid", gridTemplateColumns: "34px minmax(0, 1fr)", gap: 12, alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.2)" }}>
                                <span style={{ width: 34, height: 34, borderRadius: "50%", background: C.accentTint, color: C.accent, display: "grid", placeItems: "center", fontSize: 12 }}>{ex.initials}</span>
                                <span>
                                  <span style={{ display: "block", fontSize: 13.5, lineHeight: 1.35, color: "#ffffff" }}>{ex.title}</span>
                                  <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{ex.company}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
                        {cs.tags.map((t) => (
                          <span key={t} style={{ fontSize: 12, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.88)" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" style={{ background: C.surface, borderTop: `1px solid ${C.divider}`, borderBottom: `1px solid ${C.divider}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px clamp(20px, 5vw, 72px)" }}>
          <span className="alt-kicker">Compliance</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px clamp(24px, 6vw, 96px)" }}>
            <div>
              <h4 style={{ fontSize: 16, margin: "0 0 14px", color: C.accent, fontWeight: 500 }}>Expert-side controls</h4>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: "0 0 12px" }}><strong style={{ color: C.ink, fontWeight: 500 }}>Contracting — </strong>Mandatory T&amp;C acceptance covering confidentiality, MNPI, and conflicting agreements; perpetual unless flagged by the expert.</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: "0 0 12px" }}><strong style={{ color: C.ink, fontWeight: 500 }}>Training — </strong>Interactive, sector-specific tutorials, retaken annually.</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: "0 0 12px" }}><strong style={{ color: C.ink, fontWeight: 500 }}>Screening — </strong>Per-engagement questions to flag employer restrictions, NDAs, non-competes, board seats, and MNPI access.</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: 0 }}><strong style={{ color: C.ink, fontWeight: 500 }}>Right to terminate — </strong>Experts must end a call if it strays into restricted territory, and are still paid for time reserved.</p>
            </div>
            <div>
              <h4 style={{ fontSize: 16, margin: "0 0 14px", color: C.accent, fontWeight: 500 }}>Client-side controls</h4>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: "0 0 12px" }}><strong style={{ color: C.ink, fontWeight: 500 }}>Pre-approval workflows — </strong>Client compliance teams can require pre-approval of specific experts before a call.</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: "0 0 12px" }}><strong style={{ color: C.ink, fontWeight: 500 }}>Chaperoning — </strong>Compliance staff can join or record calls for higher-risk engagements.</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: "0 0 12px" }}><strong style={{ color: C.ink, fontWeight: 500 }}>Custom screens — </strong>Client-specific screening questions layered on top of baseline rules.</p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.muted, margin: 0 }}><strong style={{ color: C.ink, fontWeight: 500 }}>Audit trail / reporting — </strong>Consultation logs exportable on demand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Sign-Up */}
      <section id="signup" style={{ background: "linear-gradient(135deg, #2a2a5c 0%, #1f2037 100%)", color: "#ffffff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px clamp(20px, 5vw, 72px)", display: "grid", gridTemplateColumns: "minmax(0, 260px) minmax(0, 1fr)", gap: "clamp(28px, 5vw, 64px)", alignItems: "center" }}>
          <div style={{ position: "relative", aspectRatio: "1 / 1", overflow: "hidden" }}>
            <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: "block" }}>
              <rect x="30" y="26" width="92" height="7" fill="#ffffff" fillOpacity="0.28" /><circle cx="20" cy="29.5" r="4" fill="#ffffff" fillOpacity="0.35" />
              <rect x="30" y="46" width="120" height="7" fill="#ffffff" fillOpacity="0.28" /><circle cx="20" cy="49.5" r="4" fill="#ffffff" fillOpacity="0.35" />
              <rect x="30" y="66" width="74" height="7" fill="#ffffff" fillOpacity="0.28" /><circle cx="20" cy="69.5" r="4" fill="#ffffff" fillOpacity="0.35" />
              <rect x="30" y="86" width="138" height="7" fill="#ffffff" fillOpacity="0.95" /><circle cx="20" cy="89.5" r="4" fill="#ffffff" fillOpacity="0.95" />
              <rect x="30" y="106" width="106" height="7" fill="#ffffff" fillOpacity="0.28" /><circle cx="20" cy="109.5" r="4" fill="#ffffff" fillOpacity="0.35" />
              <rect x="30" y="126" width="84" height="7" fill="#ffffff" fillOpacity="0.28" /><circle cx="20" cy="129.5" r="4" fill="#ffffff" fillOpacity="0.35" />
              <rect x="30" y="146" width="128" height="7" fill="#ffffff" fillOpacity="0.95" /><circle cx="20" cy="149.5" r="4" fill="#ffffff" fillOpacity="0.95" />
              <rect x="30" y="166" width="98" height="7" fill="#ffffff" fillOpacity="0.28" /><circle cx="20" cy="169.5" r="4" fill="#ffffff" fillOpacity="0.35" />
            </svg>
          </div>
          <div>
            <span className="alt-kicker" style={{ color: "#9a9aff" }}>Expert Sign-Up</span>
            <h2 style={{ fontSize: 28, lineHeight: 1.25, letterSpacing: "-0.01em", margin: "0 0 12px", maxWidth: "26ch", color: "#ffffff", fontWeight: 500 }}>
              Join the <span style={{ color: "#9a9aff" }}>Alternatives</span> Expert Network
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "rgba(255,255,255,0.86)", margin: "0 0 10px", maxWidth: "62ch" }}>
              Your experience can shape investment decisions, corporate strategy, market research, and business transformation.
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", margin: 0, maxWidth: "62ch" }}>
              Senior executives, functional leaders, entrepreneurs, consultants, and researchers with deep expertise in an industry, function, technology, or market. No industry is too niche, and no expertise is too specialized.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "22px 0 0" }}>
              {["Work with Global Decision Makers", "Earn for Your Expertise", "Flexible Participation", "Expand Your Professional Influence", "Confidential & Compliant"].map((t) => (
                <span key={t} className="alt-tag" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.82)" }}>{t}</span>
              ))}
            </div>
            <button type="button" onClick={() => navigate("/expert/register")} className="alt-btn alt-btn-white" style={{ marginTop: 24, border: "1px solid #ffffff" }}>
              Complete your profile
            </button>
          </div>
        </div>
      </section>

      {/* Careers */}
      <section id="careers" style={{ maxWidth: 1200, margin: "0 auto", padding: "48px clamp(20px, 5vw, 72px)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div>
          <span className="alt-kicker" style={{ marginBottom: 10 }}>Careers</span>
          <h4 style={{ fontSize: 19, margin: 0, fontWeight: 500 }}>Help us build the <span style={{ color: C.accent }}>network</span>.</h4>
        </div>
        <a className="alt-btn alt-btn-ghost" href="#contact">View open roles</a>
      </section>

      {/* Contact */}
      <section id="contact" style={{ borderTop: `1px solid ${C.divider}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px clamp(20px, 5vw, 72px)", display: "grid", gridTemplateColumns: "minmax(0, 360px) minmax(0, 440px)", gap: "24px clamp(24px, 6vw, 96px)" }}>
          <div>
            <span className="alt-kicker">Contact Us</span>
            <h2 style={{ fontSize: 28, lineHeight: 1.25, letterSpacing: "-0.01em", margin: "0 0 12px", fontWeight: 500 }}>Talk to our <span style={{ color: C.accent }}>team</span>.</h2>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: C.muted, margin: "0 0 28px", maxWidth: "40ch" }}>Tell us what you need and we'll follow up within one business day.</p>
            <div style={{ borderTop: `1px solid ${C.divider}`, paddingTop: 22 }}>
              <h4 style={{ fontSize: 14.5, margin: "0 0 8px", fontWeight: 500 }}>Have a question for us?</h4>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: C.muted, margin: 0 }}>
                Write to us at <a href="mailto:alternatives@nativeworld.com" style={{ color: C.accent }}>alternatives@nativeworld.com</a> and we'll get back to you.
              </p>
            </div>
          </div>

          <Form {...contactForm}>
            <form onSubmit={contactForm.handleSubmit(onContactSubmit)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <FormField
                control={contactForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: C.muted, fontSize: 13 }}>Name</FormLabel>
                    <FormControl><Input placeholder="Jane Doe" {...field} className="h-10 rounded-lg" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: C.muted, fontSize: 13 }}>Work email</FormLabel>
                    <FormControl><Input type="email" placeholder="jane@firm.com" {...field} className="h-10 rounded-lg" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactForm.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: C.muted, fontSize: 13 }}>Firm</FormLabel>
                    <FormControl><Input placeholder="Firm name" {...field} className="h-10 rounded-lg" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: C.muted, fontSize: 13 }}>What do you need?</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A board seat, a deal call, portfolio support…" rows={4} {...field} className="rounded-lg resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="self-start rounded-full"
                style={{ color: C.accent, border: "1px solid rgba(77,76,255,0.5)", background: "transparent" }}
              >
                {contactMutation.isPending ? (<><Loader2 className="animate-spin mr-2" size={14} /> Submitting…</>) : "Submit"}
              </Button>
            </form>
          </Form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#3e3e40", color: "rgba(242,245,242,0.7)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px clamp(20px, 5vw, 72px)", display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", fontSize: 12.5 }}>
          <span>© {new Date().getFullYear()} Alternatives · Powered by Native</span>
          <span style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span>Expert Calls · Expert Advisory · Independent Director Placement · Interim &amp; Fractional Leadership</span>
            <a href="/privacy-policy" style={{ color: "rgba(242,245,242,0.7)" }}>Privacy Policy</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
