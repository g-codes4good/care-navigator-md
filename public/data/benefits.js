// Maryland Disability Benefits Database
// All eligibility logic runs client-side. No data is stored or transmitted.
// Sources: Maryland DHS, Maryland Department of Health, Maryland Department of Disabilities,
//          SSA.gov, HUD, Maryland DDA, DORS, 211 Maryland — verified March 2026

const BENEFITS = [

  // ─── FEDERAL PROGRAMS ────────────────────────────────────────────────────

  {
    id: "ssdi",
    name: "Social Security Disability Insurance (SSDI)",
    category: "income",
    type: "federal",
    description: "Monthly cash payments for people who have worked and paid into Social Security but can no longer work due to a disability expected to last 12+ months or result in death.",
    amount: "Varies — average ~$1,537/mo (2025); max $4,018/mo based on work history",
    how_to_apply: "Apply online at ssa.gov, by phone at 1-800-772-1213, or in person at your local Social Security office.",
    apply_url: "https://www.ssa.gov/benefits/disability/",
    processing_time: "3–6 months for initial decision; 200 days average in Maryland",
    tags: ["income", "disability", "federal", "work history"],
    eligibility: (a) =>
      a.has_disability &&
      a.has_work_history &&
      !a.currently_working_full_time,
  },

  {
    id: "ssi",
    name: "Supplemental Security Income (SSI)",
    category: "income",
    type: "federal",
    description: "Monthly cash payments for people with disabilities, blindness, or adults 65+ with very limited income and assets. Does not require work history.",
    amount: "Up to $967/mo for individuals (2025); $1,450/mo for couples",
    how_to_apply: "Apply at ssa.gov or call 1-800-772-1213.",
    apply_url: "https://www.ssa.gov/benefits/ssi/",
    processing_time: "3–6 months",
    tags: ["income", "disability", "federal", "low income", "no work history"],
    eligibility: (a) =>
      a.has_disability &&
      a.income_monthly <= 1900 &&
      a.assets <= 2000,
  },

  {
    id: "medicare",
    name: "Medicare (Parts A, B, D)",
    category: "healthcare",
    type: "federal",
    description: "Federal health insurance for people on SSDI (after 24-month waiting period), adults 65+, or those with ALS or ESRD. Covers hospital, medical, and prescription drug costs.",
    amount: "Comprehensive health coverage; Part B premium ~$185/mo (2025)",
    how_to_apply: "Automatic after 24 months on SSDI. Apply at ssa.gov or call 1-800-MEDICARE.",
    apply_url: "https://www.medicare.gov/",
    processing_time: "Automatic enrollment after qualifying period",
    tags: ["healthcare", "federal", "SSDI", "insurance"],
    eligibility: (a) =>
      (a.has_ssdi && a.months_on_ssdi >= 24) ||
      a.age >= 65 ||
      a.has_als ||
      a.has_esrd,
  },

  {
    id: "snap",
    name: "SNAP (Food Assistance / EBT)",
    category: "food",
    type: "federal",
    description: "Monthly food benefits loaded onto an EBT card. Households with a disabled member have relaxed eligibility rules — no gross income limit, and asset limit of $4,500.",
    amount: "$292/mo average per person; up to $975/mo for family of 4 (2025)",
    how_to_apply: "Apply online at mydhrbenefits.dhr.state.md.us or call 1-800-332-6347.",
    apply_url: "https://mydhrbenefits.dhr.state.md.us/",
    processing_time: "30 days; 7 days for expedited",
    tags: ["food", "federal", "low income", "EBT", "disability"],
    eligibility: (a) =>
      a.has_disability
        ? a.income_monthly <= 2500
        : a.income_monthly <= 2071,
  },

  {
    id: "hcv",
    name: "Housing Choice Voucher / Section 8",
    category: "housing",
    type: "federal",
    description: "Rental subsidy that helps low-income individuals and families, including people with disabilities, afford safe housing in the private market. Mainstream vouchers prioritize non-elderly disabled adults 18–61.",
    amount: "Pays portion of rent above 30% of your income",
    how_to_apply: "Apply through your local Public Housing Authority (PHA) when waitlist is open. Call 1-800-955-2232 to find your local PHA.",
    apply_url: "https://www.hud.gov/states/maryland",
    processing_time: "Waitlists often closed; 1–3+ years when open",
    tags: ["housing", "federal", "rental", "low income", "disability"],
    eligibility: (a) =>
      a.income_monthly <= 2500 &&
      (a.has_disability || a.household_size >= 2),
  },

  {
    id: "able",
    name: "ABLE Account (Achieving a Better Life Experience)",
    category: "savings",
    type: "federal_state",
    description: "Tax-advantaged savings account for people with disabilities that does not affect SSI or Medicaid eligibility. Disability must have begun before age 26.",
    amount: "Save up to $20,000/year (more if working); funds grow tax-free",
    how_to_apply: "Open an account at marylandable.org",
    apply_url: "https://www.marylandable.org/",
    processing_time: "Same-day account opening",
    tags: ["savings", "tax", "federal", "maryland"],
    eligibility: (a) =>
      a.has_disability &&
      a.disability_before_26,
  },

  // ─── MARYLAND STATE PROGRAMS ─────────────────────────────────────────────

  {
    id: "tdap",
    name: "Temporary Disability Assistance Program (TDAP)",
    category: "income",
    type: "state",
    description: "Short-term cash assistance for low-income disabled Maryland adults without dependent children, while they await federal disability approval or recover from a short-term disability.",
    amount: "Up to $185/month",
    how_to_apply: "Apply at your local Department of Social Services (DSS) office.",
    apply_url: "https://dhs.maryland.gov/weathering-tough-times/temporary-disability-assistance/",
    processing_time: "30 days",
    tags: ["income", "maryland", "temporary", "low income", "no children"],
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident &&
      a.income_monthly <= 1000 &&
      !a.has_dependent_children &&
      !a.has_ssdi &&
      !a.has_ssi,
  },

  {
    id: "medicaid_md",
    name: "Maryland Medicaid (HealthChoice)",
    category: "healthcare",
    type: "state",
    description: "Free or low-cost health insurance for low-income Maryland residents, including adults with disabilities. Covers doctor visits, hospital stays, mental health, prescriptions, and more.",
    amount: "Comprehensive health coverage at little or no cost",
    how_to_apply: "Apply at Maryland Health Connection: marylandhealthconnection.gov or call 1-855-642-8572.",
    apply_url: "https://www.marylandhealthconnection.gov/",
    processing_time: "45 days (90 days if disability determination needed)",
    tags: ["healthcare", "maryland", "low income", "insurance"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      (
        (a.age < 65 && a.income_monthly <= 1677) ||
        (a.age >= 65 && a.income_monthly <= 1235 && a.assets <= 2500) ||
        a.has_disability
      ),
  },

  {
    id: "community_options_waiver",
    name: "Community Options Waiver",
    category: "home_care",
    type: "state",
    description: "Medicaid waiver providing home and community-based care for adults 18+ with physical disabilities or adults 65+ at risk of nursing home placement. Covers personal care, adult day services, respite, and more.",
    amount: "In-home and community care services — value varies by need",
    how_to_apply: "Contact Maryland Access Point: 1-844-627-5465 or apply through your local health department.",
    apply_url: "https://health.maryland.gov/mmcp/waiverprograms/pages/home.aspx",
    processing_time: "Waitlist exists — 24,015 people as of Jan 2025",
    tags: ["home care", "maryland", "medicaid waiver", "physical disability", "elderly"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      (a.age >= 65 || (a.age >= 18 && a.has_physical_disability)) &&
      a.income_monthly <= 2901 &&
      a.assets <= 2000 &&
      a.needs_daily_living_assistance,
  },

  {
    id: "community_pathways_waiver",
    name: "Community Pathways Waiver (DDA)",
    category: "home_care",
    type: "state",
    description: "Medicaid waiver for Maryland residents with intellectual and developmental disabilities (IDD) who would otherwise require institutional care. Covers employment support, housing, behavioral support, assistive technology, and 22 other services.",
    amount: "Comprehensive community-based services — value varies",
    how_to_apply: "Apply through the DDA at health.maryland.gov/dda or call 410-402-8600.",
    apply_url: "https://health.maryland.gov/dda/Pages/DDA_Waiver_Application_Process.aspx",
    processing_time: "Waitlist may apply; eligibility determination required first",
    tags: ["home care", "maryland", "developmental disability", "intellectual disability", "DDA"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_developmental_disability &&
      a.age >= 18,
  },

  {
    id: "dors",
    name: "DORS — Division of Rehabilitation Services",
    category: "employment",
    type: "state",
    description: "Free vocational rehabilitation services helping Marylanders with disabilities find and keep jobs. Services include career counseling, job training, assistive technology, and placement assistance. Funded 78.7% by federal grants.",
    amount: "Free services; no income limit",
    how_to_apply: "Apply at dors.maryland.gov or visit any DORS office statewide.",
    apply_url: "https://dors.maryland.gov/",
    processing_time: "60 days for eligibility determination",
    tags: ["employment", "maryland", "vocational", "free", "job training"],
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident &&
      a.wants_to_work,
  },

  {
    id: "eid",
    name: "Employed Individuals with Disabilities (EID) Program",
    category: "healthcare",
    type: "state",
    description: "Allows working Marylanders with disabilities to buy into Medicaid even if their income is too high for regular Medicaid. Premiums are income-based.",
    amount: "Medicaid coverage; monthly premium based on income",
    how_to_apply: "Apply through Maryland Medicaid: call 1-800-492-4283.",
    apply_url: "https://health.maryland.gov/mmcp/eligibility/Pages/EID.aspx",
    processing_time: "45 days",
    tags: ["healthcare", "maryland", "working", "medicaid", "employed"],
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident &&
      a.currently_working_full_time,
  },

  {
    id: "liheap",
    name: "LIHEAP — Energy Assistance Program",
    category: "utilities",
    type: "federal_state",
    description: "Helps low-income Maryland households pay heating bills. Includes heating assistance, crisis assistance, and weatherization services. People with disabilities and elderly households are priority.",
    amount: "$25–$750 for heating; up to $600 crisis assistance",
    how_to_apply: "Apply through your local Department of Social Services. Call 1-800-352-1446.",
    apply_url: "https://dhs.maryland.gov/office-of-home-energy-programs/",
    processing_time: "30 days; emergency processing available",
    tags: ["utilities", "energy", "heating", "low income", "maryland"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.income_monthly <= 2000 * a.household_size,
  },

  {
    id: "eusp",
    name: "Electric Universal Service Program (EUSP)",
    category: "utilities",
    type: "state",
    description: "Reduces electric bills for low-income Maryland households. Includes current bill assistance, old bill retirement, and weatherization. $34M annual fund.",
    amount: "Monthly electric bill discount; varies by income",
    how_to_apply: "Apply at your local DSS or through your electric utility.",
    apply_url: "https://energy.maryland.gov/residential/pages/reduceyourutilitybills.aspx",
    processing_time: "30 days",
    tags: ["utilities", "electric", "low income", "maryland"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.income_monthly <= 1893,
  },

  {
    id: "sstap",
    name: "Statewide Special Transportation Assistance Program (SSTAP)",
    category: "transportation",
    type: "state",
    description: "Transportation for elderly people and people with disabilities in Maryland who are not sufficiently close to public transit routes.",
    amount: "Subsidized transportation; cost varies by county",
    how_to_apply: "Contact your county's transportation coordinator or Area Agency on Aging.",
    apply_url: "https://mdot.maryland.gov/",
    processing_time: "Varies by county",
    tags: ["transportation", "maryland", "disability", "elderly"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      (a.has_disability || a.age >= 60) &&
      a.needs_transportation,
  },

  {
    id: "maryland_equips",
    name: "Maryland Equips — Free Medical Equipment",
    category: "assistive_tech",
    type: "state",
    description: "Provides free durable medical equipment and assistive technology to any Maryland resident with an illness, injury, or disability. Items include wheelchairs, hospital beds, walkers, communication devices, and more.",
    amount: "Free equipment — no income limit",
    how_to_apply: "Request equipment through your healthcare provider or at marylandequips.org.",
    apply_url: "https://www.marylandequips.org/",
    processing_time: "Varies by availability",
    tags: ["assistive tech", "equipment", "free", "maryland", "no income limit"],
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident,
  },

  {
    id: "champ",
    name: "CHAMP — Housing Modification Grants",
    category: "housing",
    type: "state",
    description: "Provides grant funding for structural modifications to rental units for Section 8/HCV voucher holders with disabilities. Covers ramps, grab bars, widened doorways, accessible bathrooms, and more.",
    amount: "Grants for structural home modifications",
    how_to_apply: "Contact your local Public Housing Authority or Maryland DHCD.",
    apply_url: "https://dhcd.maryland.gov/",
    processing_time: "Varies",
    tags: ["housing", "modification", "grant", "rental", "disability", "maryland"],
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident &&
      a.receives_housing_voucher,
  },

  {
    id: "senior_assisted_living",
    name: "Senior Assisted Living Subsidy",
    category: "housing",
    type: "state",
    description: "State supplement of approximately $1,000/month for SSI recipients age 62+ who require extra care in an assisted living facility in Maryland.",
    amount: "~$1,000/month supplement",
    how_to_apply: "Contact your local Department of Social Services.",
    apply_url: "https://dhs.maryland.gov/",
    processing_time: "30–60 days",
    tags: ["housing", "assisted living", "elderly", "maryland", "SSI"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.age >= 62 &&
      a.has_ssi &&
      a.needs_assisted_living,
  },

  {
    id: "sfhrp",
    name: "Single Family Housing Rehabilitation Program",
    category: "housing",
    type: "state",
    description: "Deferred loans for low-income homeowners to make home repairs, including disability-related modifications like roof replacement, structural repairs, and accessibility upgrades.",
    amount: "Deferred loan — repaid when home is sold",
    how_to_apply: "Apply through Maryland DHCD: dhcd.maryland.gov",
    apply_url: "https://dhcd.maryland.gov/Residents/Pages/singlefamily/default.aspx",
    processing_time: "60–90 days",
    tags: ["housing", "home repair", "homeowner", "loan", "maryland"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.is_homeowner &&
      a.income_monthly <= 4000,
  },

  {
    id: "chip",
    name: "Maryland Children's Health Insurance Program (MCHIP)",
    category: "healthcare",
    type: "state",
    description: "Low-cost or free health insurance for children in Maryland families who earn too much for Medicaid but can't afford private insurance. Covers children with disabilities.",
    amount: "Low or no premium; comprehensive coverage",
    how_to_apply: "Apply at Maryland Health Connection: 1-855-642-8572",
    apply_url: "https://www.marylandhealthconnection.gov/",
    processing_time: "45 days",
    tags: ["healthcare", "children", "maryland", "insurance"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_children_under_19 &&
      a.income_monthly <= 5400,
  },

  {
    id: "dda_eligibility",
    name: "DDA Eligibility Determination (Gateway to DDA Services)",
    category: "home_care",
    type: "state",
    description: "First step to accessing all DDA services. Determines if a person qualifies for developmental disability services in Maryland. Required before accessing the Community Pathways Waiver or other DDA programs.",
    amount: "Free determination process",
    how_to_apply: "Apply at health.maryland.gov/dda or call the DDA at 410-402-8600.",
    apply_url: "https://health.maryland.gov/dda/Pages/DDA_Eligibility_Application_Process.aspx",
    processing_time: "60–90 days",
    tags: ["developmental disability", "DDA", "maryland", "determination"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_developmental_disability,
  },

  // ─── NONPROFIT & PRIVATE ORGANIZATIONS ───────────────────────────────────

  {
    id: "disability_rights_md",
    name: "Disability Rights Maryland",
    category: "legal",
    type: "nonprofit",
    description: "Free legal advocacy for Marylanders with disabilities. Covers Social Security appeals, civil rights, housing discrimination, employment rights, and access to public benefits.",
    amount: "Free legal services",
    how_to_apply: "Call 1-800-233-7201 or visit disabilityrightsmd.org",
    apply_url: "https://www.disabilityrightsmd.org/",
    processing_time: "Varies by case",
    tags: ["legal", "advocacy", "free", "nonprofit", "rights"],
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident,
  },

  {
    id: "arc_maryland",
    name: "The Arc Maryland",
    category: "support_services",
    type: "nonprofit",
    description: "Statewide advocacy and support organization for individuals with intellectual and developmental disabilities and their families. Provides resource navigation, policy advocacy, and community inclusion programs.",
    amount: "Free navigation and advocacy services",
    how_to_apply: "Contact The Arc Maryland at 410-821-1098 or arcmd.org",
    apply_url: "https://arcmd.org/",
    processing_time: "Varies",
    tags: ["IDD", "intellectual disability", "developmental disability", "nonprofit", "advocacy"],
    eligibility: (a) =>
      a.has_developmental_disability || a.has_intellectual_disability,
  },

  {
    id: "maryland_legal_aid",
    name: "Maryland Legal Aid",
    category: "legal",
    type: "nonprofit",
    description: "Free civil legal services for income-eligible Marylanders with disabilities. Areas include housing, healthcare access, public benefits denials, family law, and disability rights.",
    amount: "Free legal services",
    how_to_apply: "Call 1-800-999-8904 or apply at mdlab.org",
    apply_url: "https://www.mdlab.org/",
    processing_time: "Varies",
    tags: ["legal", "free", "nonprofit", "low income", "housing", "benefits"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.income_monthly <= 2500,
  },

  {
    id: "catholic_charities_md",
    name: "Catholic Charities of Maryland",
    category: "emergency",
    type: "nonprofit",
    description: "Emergency financial assistance for rent, utilities, food, and other needs. Serves all people regardless of faith. Programs available across Maryland including Baltimore and surrounding counties.",
    amount: "Emergency assistance — varies by need and location",
    how_to_apply: "Call 410-547-5087 or visit catholiccharities-md.org",
    apply_url: "https://www.catholiccharities-md.org/",
    processing_time: "Same day to 1 week",
    tags: ["emergency", "rent", "utilities", "food", "nonprofit", "maryland"],
    eligibility: (a) =>
      a.is_maryland_resident,
  },

  {
    id: "salvation_army_md",
    name: "Salvation Army Maryland",
    category: "emergency",
    type: "nonprofit",
    description: "Emergency financial assistance for rent, utilities, food, and clothing. Available through local Salvation Army corps locations throughout Maryland.",
    amount: "Emergency assistance — varies",
    how_to_apply: "Contact your local Salvation Army or call 1-800-725-2769",
    apply_url: "https://www.salvationarmyusa.org/usn/",
    processing_time: "Same day",
    tags: ["emergency", "food", "rent", "utilities", "nonprofit"],
    eligibility: (a) =>
      a.is_maryland_resident,
  },

  {
    id: "maryland_food_bank",
    name: "Maryland Food Bank",
    category: "food",
    type: "nonprofit",
    description: "Free food distribution through a network of 1,300+ partner agencies including food pantries, soup kitchens, and shelters across Maryland. No income documentation required at many locations.",
    amount: "Free food",
    how_to_apply: "Find a pantry near you at mdfoodbank.org or call 410-737-8282",
    apply_url: "https://www.mdfoodbank.org/",
    processing_time: "Immediate",
    tags: ["food", "free", "nonprofit", "pantry", "no documentation"],
    eligibility: (a) =>
      a.is_maryland_resident,
  },

  {
    id: "map_211",
    name: "Maryland Access Point (MAP) / 211 Maryland",
    category: "navigation",
    type: "state_nonprofit",
    description: "Free information and referral service connecting Marylanders to thousands of health, human services, and disability programs. Call 211 to speak with a specialist who can identify benefits you may qualify for.",
    amount: "Free navigation service",
    how_to_apply: "Call 2-1-1 or 1-800-422-0009, or visit 211md.org",
    apply_url: "https://211md.org/",
    processing_time: "Immediate",
    tags: ["navigation", "referral", "free", "helpline", "all disabilities"],
    eligibility: (a) =>
      a.is_maryland_resident,
  },

  {
    id: "weinberg_foundation",
    name: "Harry & Jeanette Weinberg Foundation Grants",
    category: "grants",
    type: "private",
    description: "Major private foundation funding nonprofit programs in Maryland that serve people with disabilities, elderly adults, and low-income populations. Grants go to organizations, which then provide direct services.",
    amount: "Varies — grants to nonprofits serving Maryland residents",
    how_to_apply: "Apply through Weinberg-funded nonprofits; see hjweinbergfoundation.org for grantee directory",
    apply_url: "https://hjweinbergfoundation.org/",
    processing_time: "Varies by organization",
    tags: ["grants", "private", "maryland", "nonprofit funded"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      (a.has_disability || a.age >= 65 || a.income_monthly <= 2500),
  },

  {
    id: "medbank",
    name: "Maryland MedBank — Medication Access",
    category: "healthcare",
    type: "nonprofit",
    description: "Helps uninsured and underinsured Marylanders access free or low-cost prescription medications through pharmaceutical patient assistance programs.",
    amount: "Free or low-cost medications",
    how_to_apply: "Contact Maryland MedBank or your local health department.",
    apply_url: "https://www.mdmedbank.org/",
    processing_time: "Varies by medication",
    tags: ["medication", "prescription", "healthcare", "nonprofit", "uninsured"],
    eligibility: (a) =>
      a.is_maryland_resident &&
      (!a.has_insurance || a.income_monthly <= 2500),
  },

];

// ─── CATEGORY METADATA ────────────────────────────────────────────────────────

const CATEGORIES = {
  income:           { label: "Cash Assistance",        color: "emerald",  icon: "💵" },
  healthcare:       { label: "Healthcare",              color: "blue",     icon: "🏥" },
  home_care:        { label: "Home & Community Care",  color: "violet",   icon: "🏠" },
  housing:          { label: "Housing",                 color: "amber",    icon: "🏘️" },
  food:             { label: "Food Assistance",         color: "orange",   icon: "🥦" },
  employment:       { label: "Employment & Training",  color: "cyan",     icon: "💼" },
  utilities:        { label: "Utilities",               color: "yellow",   icon: "⚡" },
  transportation:   { label: "Transportation",          color: "indigo",   icon: "🚌" },
  assistive_tech:   { label: "Assistive Technology",   color: "teal",     icon: "♿" },
  savings:          { label: "Savings & Tax Benefits", color: "lime",     icon: "🏦" },
  legal:            { label: "Legal & Advocacy",       color: "red",      icon: "⚖️" },
  support_services: { label: "Support Services",       color: "pink",     icon: "🤝" },
  emergency:        { label: "Emergency Assistance",   color: "rose",     icon: "🆘" },
  navigation:       { label: "Benefit Navigation",     color: "slate",    icon: "🧭" },
  grants:           { label: "Grants & Foundations",   color: "purple",   icon: "🎁" },
};
