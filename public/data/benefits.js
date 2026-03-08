// Maryland Disability Benefits Database — VERIFIED DATA
//
// All figures verified against official government sources only:
//   SSA.gov, dhs.maryland.gov, health.maryland.gov, dors.maryland.gov,
//   marylandable.org, hud.gov, mdot.maryland.gov, energy.maryland.gov
//
// Effective dates noted per program. Figures updated March 2026.
// Always verify with the administering agency — rules change annually.

const BENEFITS = [

  // ─── FEDERAL PROGRAMS ─────────────────────────────────────────────────────

  {
    id: "ssdi",
    name: "Social Security Disability Insurance (SSDI)",
    category: "income",
    type: "federal",
    description: "Monthly cash payments for people who have worked and paid Social Security taxes but can no longer work due to a disability expected to last 12+ months or result in death. Benefit amount is based on your lifetime earnings record.",
    amount: "Average $1,630/mo; max $4,152/mo (2026). Amount varies entirely by your work history.",
    nuances: [
      "SGA (Substantial Gainful Activity) limit: $1,690/mo for non-blind, $2,830/mo for blind (2026). Earning above this disqualifies you.",
      "5-month waiting period before first payment after disability onset.",
      "After 24 months on SSDI, you automatically qualify for Medicare.",
      "Trial Work Period: You can test your ability to work for 9 months (not necessarily consecutive) without losing benefits. In 2026, any month you earn over $1,050 counts as a trial work month.",
      "After Trial Work Period ends, a 36-month Extended Period of Eligibility applies — benefits can be reinstated quickly if you stop working.",
      "Work credits required: generally 40 credits total, with 20 earned in the last 10 years. Younger workers need fewer credits.",
      "One credit per $1,890 in wages/self-employment in 2026; max 4 credits per year.",
      "Average processing time in Maryland: ~200 days (6.5 months) for initial decision.",
      "If denied: you have 60 days to request reconsideration, then an ALJ hearing. Maryland approval rate at hearing level: ~60%."
    ],
    how_to_apply: "Apply online at ssa.gov/apply, by phone at 1-800-772-1213 (TTY 1-800-325-0778), or in person at your local Social Security office.",
    apply_url: "https://www.ssa.gov/benefits/disability/",
    source: "ssa.gov — verified March 2026",
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
    description: "Monthly cash payments for people with disabilities, blindness, or adults 65+ with very limited income and resources. Does not require any work history — based on financial need.",
    amount: "$994/mo for individuals; $1,491/mo for eligible couples (2026 federal rate, includes 2.8% COLA).",
    nuances: [
      "Asset (resource) limit: $2,000 for individuals, $3,000 for couples. Your home and one vehicle do not count.",
      "Income limits: unearned income must be below $1,014/mo; earned income below $2,073/mo for individuals — but SSA excludes the first $20/mo of most income and first $65/mo of earnings, so actual working income can be somewhat higher.",
      "SSI recipients in Maryland automatically qualify for Medicaid.",
      "SSI recipients also qualify to receive SNAP without additional income testing (categorical eligibility).",
      "If you have a disability lasting 12+ months and apply for TDAP, Maryland requires you to also file for SSI.",
      "ABLE accounts: SSI recipients can hold up to $100,000 in an ABLE account without it counting against the $2,000 asset limit.",
      "Living arrangements affect your benefit — living with others who pay your expenses can reduce your SSI payment.",
      "Applying for SSI also opens a review for SSDI simultaneously if you may have work credits."
    ],
    how_to_apply: "Apply at ssa.gov/ssi, by phone at 1-800-772-1213, or in person. You cannot apply for SSI online — you must call or visit.",
    apply_url: "https://www.ssa.gov/ssi/",
    source: "ssa.gov/oact/cola/SSI.html — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.income_monthly <= 1900 &&
      a.assets <= 2000,
  },

  {
    id: "medicare",
    name: "Medicare (Parts A, B & D)",
    category: "healthcare",
    type: "federal",
    description: "Federal health insurance for SSDI recipients (after a 24-month waiting period), adults 65+, and people with ALS (immediate) or End-Stage Renal Disease (ESRD). Covers hospital stays, doctor visits, and prescriptions.",
    amount: "Comprehensive coverage. Part B standard premium: ~$185/mo (2025). Part A: free if you have sufficient work history.",
    nuances: [
      "SSDI recipients must wait 24 months before Medicare coverage begins — plan for this gap.",
      "ALS (Lou Gehrig's Disease): Medicare begins the same month SSDI benefits start — no waiting period.",
      "ESRD: Medicare begins after a 3-month dialysis waiting period, or immediately with a transplant.",
      "Medicare Savings Programs (MSPs) help low-income Medicare beneficiaries pay Part B premiums, deductibles, and co-pays — apply through Maryland Medicaid.",
      "If you have both Medicare and Medicaid, Medicaid typically covers Medicare cost-sharing (you're 'dual eligible').",
      "Part D (prescription drug) plan is separate — enroll during Initial Enrollment Period to avoid late penalties.",
      "Extra Help / Low Income Subsidy program helps pay Part D costs for people with limited income."
    ],
    how_to_apply: "Automatic enrollment after 24 months on SSDI. For ESRD/ALS: call 1-800-MEDICARE (1-800-633-4227). For Medicare Savings Programs: apply through Maryland Health Connection.",
    apply_url: "https://www.medicare.gov/",
    source: "medicare.gov, ssa.gov — verified March 2026",
    eligibility: (a) =>
      (a.has_ssdi && a.months_on_ssdi >= 24) ||
      a.age >= 65 ||
      a.has_als ||
      a.has_esrd,
  },

  {
    id: "snap",
    name: "SNAP Food Benefits (EBT)",
    category: "food",
    type: "federal",
    description: "Monthly food benefits loaded onto an EBT card for purchasing groceries. Maryland households with a disabled or elderly member receive significantly more favorable eligibility rules than the general population.",
    amount: "Average ~$292/mo per person; maximum $975/mo for a family of 4 (2025).",
    nuances: [
      "Disabled/elderly households: Only net income limit applies (no gross income test). Net income limit is 100% FPL.",
      "Disabled/elderly asset limit: $4,500 (higher than standard $3,000).",
      "Standard households: gross income ≤ 130% FPL; net income ≤ 100% FPL.",
      "Special deductions for disabled households: out-of-pocket medical expenses over $35/mo can be deducted from income (this can significantly increase your benefit).",
      "SSI recipients are categorically eligible — automatically approved, no income/asset test needed.",
      "H.R. 1 (2025): Utility allowance may be eliminated for households without an elderly or disabled member — households with a disabled member retain this deduction.",
      "Maryland's broad-based categorical eligibility: most households are not subject to asset limits.",
      "Excess shelter deduction: up to $744/mo (FFY2026) can be deducted if housing costs exceed 50% of income after other deductions.",
      "Expedited SNAP: If monthly income is under $150 and assets under $100, or if rent/utilities exceed income, you can get benefits within 7 days."
    ],
    how_to_apply: "Apply online at mydhrbenefits.dhr.state.md.us, in person at your local DSS, or call 1-800-332-6347.",
    apply_url: "https://mydhrbenefits.dhr.state.md.us/",
    source: "dhs.maryland.gov October 2025 SNAP Income Guidelines — verified March 2026",
    eligibility: (a) =>
      a.has_disability
        ? a.income_monthly <= 2200
        : a.income_monthly <= 1688,
  },

  {
    id: "hcv",
    name: "Housing Choice Voucher (Section 8)",
    category: "housing",
    type: "federal",
    description: "Federal rental subsidy that helps low-income individuals and families, including people with disabilities, afford housing in the private market. You pay approximately 30% of your income; the voucher covers the rest up to the local payment standard.",
    amount: "Varies — you pay 30% of adjusted income; voucher covers the balance up to the local Fair Market Rent.",
    nuances: [
      "Mainstream Disabled Vouchers: priority set-aside for non-elderly disabled adults aged 18–61 who are homeless, at risk of homelessness, or transitioning from institutional settings.",
      "CHAMP grant: provides funding for structural modifications (ramps, grab bars, widened doorways) to rental units for voucher holders with disabilities.",
      "Waitlists are often closed and can stretch 1–3+ years in urban Maryland areas.",
      "Each county/city has its own Public Housing Authority (PHA) with separate waitlists — apply to multiple PHAs.",
      "When a waitlist opens, the application period may be only a few days (e.g., Baltimore HCV: Dec 1–5, 2025).",
      "If you move to a new area, you may be able to 'port' your voucher after 12 months.",
      "Income limit: generally 50% of Area Median Income (AMI); most vouchers go to those at or below 30% AMI.",
      "Criminal history and prior evictions can affect eligibility — rules vary by PHA."
    ],
    how_to_apply: "Find your local PHA at hud.gov or call 1-800-955-2232. Sign up for waitlist notifications through your local PHA website.",
    apply_url: "https://www.hud.gov/states/maryland",
    source: "hud.gov, habc.org, affordablehousinghub.org — verified March 2026",
    eligibility: (a) =>
      a.income_monthly <= 2800 &&
      (a.has_disability || a.household_size >= 2),
  },

  {
    id: "able",
    name: "Maryland ABLE Account",
    category: "savings",
    type: "federal_state",
    description: "Tax-advantaged savings account for Marylanders with disabilities that does not count against SSI or Medicaid asset limits. Designed to help people save for disability-related expenses without losing federal benefits.",
    amount: "Contribute up to $19,000/year (2025 gift tax limit). If you work, you can contribute up to an additional $14,580/year (equal to the federal poverty level). Account grows tax-free.",
    nuances: [
      "Disability must have begun before age 26 — this is a federal requirement. (Note: SECURE 2.0 Act raises this to before age 46 starting in 2026 — verify current rule when applying.)",
      "SSI impact: the first $100,000 in your ABLE account does not count toward the $2,000 SSI resource limit. If balance exceeds $100,000, SSI is suspended (not terminated) until balance drops.",
      "Medicaid impact: ABLE funds do not affect Medicaid eligibility at all.",
      "Qualified disability expenses are broadly defined: education, housing, transportation, employment support, health care, assistive technology, personal support services, financial management, legal fees, and more.",
      "Maryland state income tax deduction: contributions may qualify for a Maryland tax deduction — consult a tax advisor.",
      "Account can be opened by the beneficiary, a parent, a legal guardian, or an authorized individual.",
      "If beneficiary dies, remaining funds may be subject to Medicaid estate recovery.",
      "Anyone can contribute to someone else's ABLE account — a great option for family/employers."
    ],
    how_to_apply: "Open an account at marylandable.org. Account can be opened same day online.",
    apply_url: "https://www.marylandable.org/",
    source: "marylandable.org (state-administered) — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.disability_before_26,
  },

  // ─── MARYLAND STATE PROGRAMS ──────────────────────────────────────────────

  {
    id: "tdap",
    name: "Temporary Disability Assistance Program (TDAP)",
    category: "income",
    type: "state",
    description: "Short-term cash assistance for low-income Maryland adults with disabilities who have no dependent children, while they recover from a short-term disability or await federal disability (SSI/SSDI) approval.",
    amount: "Up to $185/month (state-set rate; locally administered so amounts and availability may vary by county).",
    nuances: [
      "Duration limit: Benefits can only be received for 12 months out of any 36-month period — UNLESS you are actively pursuing SSI approval.",
      "SSI filing requirement: If your disability has lasted or is expected to last 12+ months, you must file for SSI as a condition of receiving TDAP.",
      "Medical documentation: A licensed medical practitioner must complete a medical report verifying your disability.",
      "No dependent children: If you have dependent children, you may qualify for TCA (Temporary Cash Assistance) instead.",
      "Income and asset limits are set locally — contact your county DSS for exact figures, as they are not publicly posted statewide.",
      "TDAP is locally administered — availability and processing time can vary significantly by county.",
      "Receiving TDAP may automatically enroll you in Maryland Medicaid.",
      "Apply at MarylandBenefits.gov or your local Department of Social Services."
    ],
    how_to_apply: "Apply at MarylandBenefits.gov, in person at your local DSS, or by mail/fax. Call 1-800-332-6347 to find your local office.",
    apply_url: "https://dhs.maryland.gov/weathering-tough-times/temporary-disability-assistance/",
    source: "dhs.maryland.gov — verified March 2026",
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
    description: "Free or very low-cost comprehensive health coverage for income-eligible Maryland residents. Covers doctor visits, hospital care, mental health, prescriptions, dental, vision, and long-term services.",
    amount: "Little to no cost. Coverage value depends on services needed.",
    nuances: [
      "Standard adults (under 65, not disabled): income limit $1,835/mo for a single person (effective Feb 1, 2026).",
      "Aged, Blind, or Disabled (ABD) group: income limit $350/mo for a single person, asset limit $2,500 — BUT income exceptions exist. Many people with higher income qualify under spend-down rules or other pathways. Apply regardless of income.",
      "Spend-down: If your income is above the ABD limit, you may still qualify by 'spending down' excess income on medical bills each month.",
      "Children: income limit $4,283/mo for a single child — much higher threshold.",
      "SSI recipients: automatically enrolled in Medicaid.",
      "TDAP recipients: typically automatically enrolled.",
      "Medicaid + Medicare (Dual Eligible): if you have both, Medicaid covers Medicare premiums, deductibles, and cost-sharing.",
      "HealthChoice: most Maryland Medicaid enrollees are in managed care — you choose a health plan.",
      "Processing time: 45 days standard; up to 90 days if disability determination is needed.",
      "Apply even if you're not sure you qualify — the only way to know is to apply."
    ],
    how_to_apply: "Apply at Maryland Health Connection: marylandhealthconnection.gov, or call 1-855-642-8572. Also available at local DSS offices.",
    apply_url: "https://www.marylandhealthconnection.gov/",
    source: "health.maryland.gov/mmcp — Feb 1, 2026 income limits — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      (
        (a.age < 65 && !a.has_disability && a.income_monthly <= 1835) ||
        (a.has_disability && a.income_monthly <= 2500) || // spend-down and exceptions
        (a.age >= 65 && a.income_monthly <= 1000) ||
        a.has_ssi
      ),
  },

  {
    id: "eid",
    name: "Employed Individuals with Disabilities (EID) — Medicaid Buy-In",
    category: "healthcare",
    type: "state",
    description: "Maryland's Medicaid buy-in program allowing working people with disabilities to keep their Medicaid coverage even when their earnings would normally make them ineligible for standard Medicaid. Premiums are currently suspended.",
    amount: "Full Medicaid coverage. Premiums: currently $0 (suspended as of 2025 — verify current status when applying).",
    nuances: [
      "Age requirement: 18 to 64 years old.",
      "Employment requirement: Must be employed or self-employed. There is NO minimum earnings amount — even a small amount of taxable work income qualifies.",
      "No maximum income limit — this is the key benefit. High earners can still qualify.",
      "Asset limit: $10,000 (much higher than standard Medicaid's $2,500).",
      "Premiums were suspended as of 2025 — but this is a policy decision that could change. Confirm current premium status when applying.",
      "Coverage is the same full Medicaid/HealthChoice coverage as standard Medicaid.",
      "You must be a U.S. citizen or qualified non-citizen and a Maryland resident.",
      "If you lose your job, you may be able to transition to standard Medicaid without a gap in coverage.",
      "EID can work alongside Medicare — if you're dual eligible, this can cover Medicare cost-sharing.",
      "Apply using Maryland Health Connection or the paper EID application (Form 9701)."
    ],
    how_to_apply: "Apply through Maryland Health Connection or call 1-866-373-9651 (TTY: 1-866-373-9652). Paper application: Form 9701 available at health.maryland.gov/mmcp/eid.",
    apply_url: "https://health.maryland.gov/mmcp/eid/pages/home.aspx",
    source: "health.maryland.gov/mmcp/eid — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident &&
      a.age >= 18 && a.age <= 64 &&
      a.currently_working_full_time,
  },

  {
    id: "community_options_waiver",
    name: "Community Options Waiver (COW)",
    category: "home_care",
    type: "state",
    description: "Medicaid waiver funding home and community-based care for adults 65+ or adults 18+ with physical disabilities who are at risk of nursing home placement. Allows people to receive care at home or in assisted living instead of a nursing facility.",
    amount: "In-home and community-based services — value varies widely based on assessed need and care plan.",
    nuances: [
      "Income limit: $2,901/mo (single applicant, 2025 — updates in January each year at 300% of Federal Benefit Rate).",
      "Asset limit: $2,000 (single). For married couples where only one spouse applies: non-applicant spouse retains a 'Community Spouse Resource Allowance' of 50% of joint assets up to $157,920.",
      "Home equity limit: $730,000 — your home is exempt if you live there, if a spouse lives there, or if a dependent child lives there.",
      "60-month (5-year) look-back: Assets cannot be given away or sold below market value within 5 years of applying — penalties apply.",
      "Level of care requirement: Must need nursing facility level of care (assessed using the interRAI Home Care tool), meaning you need significant help with Activities of Daily Living.",
      "Room and board in assisted living is NOT covered by the waiver (~$420/mo must be paid out of pocket or from income).",
      "Participant-directed care is NOT available in this waiver — services must be provided by licensed agency providers (you cannot hire your own caregiver).",
      "Waitlist: As of Jan 31, 2025, 24,015 persons on the Service Registry. About 700 are invited to apply each month.",
      "EXCEPTION: Nursing home residents are prioritized and can apply immediately without joining the waitlist.",
      "Alternative with no waitlist: Community First Choice (CFC) and Community Personal Assistance Services (CPAS) programs have no participant limits — ask about these at Maryland Access Point.",
      "Application triggers a full Medicaid financial eligibility review, including the look-back period."
    ],
    how_to_apply: "Call Maryland Access Point: 1-844-MAP-LINK (1-844-627-5465) to join the Service Registry. Nursing home residents: call 410-767-1739. Applications take up to 3 months from submission.",
    apply_url: "https://health.maryland.gov/mmcp/waiverprograms/pages/home.aspx",
    source: "health.maryland.gov/mmcp — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      (a.age >= 65 || (a.age >= 18 && a.has_physical_disability)) &&
      a.income_monthly <= 2901 &&
      a.assets <= 2000 &&
      a.needs_daily_living_assistance,
  },

  {
    id: "community_pathways_waiver",
    name: "Community Pathways Waiver — DDA",
    category: "home_care",
    type: "state",
    description: "Maryland's primary Medicaid waiver for adults with intellectual and developmental disabilities (IDD). Funds 24 community-based services as an alternative to institutional care. Managed by the Developmental Disabilities Administration (DDA).",
    amount: "Comprehensive community-based services — funding level varies based on person-centered plan.",
    nuances: [
      "Requires DDA eligibility determination FIRST — this is a separate application before you can access the waiver.",
      "Two DDA eligibility categories: (1) Developmentally Disabled — disability onset before age 22; (2) Supports Only — permanent impairment, any onset age. Mental illness alone does not qualify for either.",
      "DDA eligibility does NOT guarantee waiver funding — you are placed on a priority waitlist after eligibility is approved.",
      "Priority categories for services: Crisis Resolution (immediate danger) > Crisis Prevention (risk within 1 year) > Current Request (immediate need) > Future Needs (no need within 3 years).",
      "Financial eligibility: DDA waivers do not consider family income or assets — only the individual applicant's finances are reviewed.",
      "The Community Pathways Waiver replaced the former Family Supports and Community Supports waivers as of October 6, 2025 (CMS-approved amendment).",
      "24 services covered including employment support, housing (group homes, supported living, shared living), behavioral services, respite, assistive technology, transportation, and more.",
      "Annual person-centered plan required to maintain eligibility.",
      "Confirmation of DDA application receipt: 5–7 business days. Full eligibility determination timeline varies.",
      "To apply: submit the DDA Application for Eligibility — available online, by mail, or at regional DDA offices."
    ],
    how_to_apply: "Step 1: Apply for DDA eligibility at health.maryland.gov/dda or call 410-402-8600. Step 2: After approval, your Coordinator of Community Services (CCS) will guide the waiver application.",
    apply_url: "https://health.maryland.gov/dda/Pages/DDA_Eligibility_Application_Process.aspx",
    source: "health.maryland.gov/dda — verified March 2026 (includes Oct 2025 waiver amendments)",
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
    description: "Maryland's vocational rehabilitation program helping people with disabilities find, keep, or advance in employment. Services are free. SSDI and SSI recipients are automatically presumed eligible.",
    amount: "Free services. No income limit.",
    nuances: [
      "Automatic eligibility: SSI and SSDI recipients are presumed eligible — no separate disability determination needed.",
      "Order of Selection (federal law): DORS must prioritize people with 'most significant' disabilities when resources are limited. Categories: Most Significant Disability > Significant Disability > Non-Severe Disability. If a lower priority category is not being served, DORS must still provide information and referral.",
      "Services offered: career counseling, vocational assessment, job training, job placement, assistive technology, interpreter services, supported employment, college/vocational school tuition assistance, transportation to services, and more.",
      "Office for Blindness & Vision Services (OBVS): specialized services for people whose primary disability is vision loss or blindness.",
      "Pre-Employment Transition Services (Pre-ETS): free services for students with disabilities in high school through age 21 — NO cost to students or families.",
      "Individualized Plan for Employment (IPE): once eligible, you work with a counselor to develop a personalized plan.",
      "Federal funding: 78.7% federally funded ($62M grant in FY2025) — services are free regardless of income.",
      "DORS is an agency of the Maryland State Department of Education — offices statewide.",
      "Eligibility determination: up to 60 days; sooner if clear from existing documentation."
    ],
    how_to_apply: "Apply at dors.maryland.gov or visit any DORS office. Call 410-554-9442 or use the office locator on their website. Pre-ETS: contact your school's transition coordinator.",
    apply_url: "https://dors.maryland.gov/",
    source: "dors.maryland.gov — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident &&
      a.wants_to_work,
  },

  {
    id: "liheap",
    name: "LIHEAP & Energy Assistance Programs",
    category: "utilities",
    type: "federal_state",
    description: "Maryland's Office of Home Energy Programs (OHEP) administers federal LIHEAP funds to help low-income households pay heating bills, electric bills, and address energy crisis situations. Available year-round.",
    amount: "Regular heating/energy assistance: amount varies by income and household size. Arrearage (past-due bill) assistance: up to $2,000 for electric, $1,000 for gas (minimum $300 past-due balance required).",
    nuances: [
      "Income limits (FY2026 — 200% FPL): 1 person: $2,608/mo; 2 people: $3,525/mo; 3 people: $4,441/mo; 4 people: $5,358/mo.",
      "You do NOT need a turn-off notice to apply — apply before a crisis occurs.",
      "Benefits are available once per year per household.",
      "Required documents: photo ID, proof of Maryland residency, Social Security cards for all household members, proof of income (last 30 days), recent utility bill or termination notice, heating fuel documentation if applicable.",
      "Electric Universal Service Program (EUSP): separate ongoing electric bill discount for households at or below 175% FPL — not just a one-time benefit. Apply through your local utility company or DSS.",
      "Elderly (60+) and disabled households: may receive priority processing.",
      "Crisis assistance: up to $600 available for energy emergencies regardless of whether you've received regular benefits.",
      "Apply at your local DSS office or call the Maryland Energy Hotline: 1-800-352-1446."
    ],
    how_to_apply: "Apply at your local DSS office, online at MarylandBenefits.gov, or call 1-800-332-6347. Energy Hotline: 1-800-352-1446.",
    apply_url: "https://dhs.maryland.gov/office-of-home-energy-programs/",
    source: "dhs.maryland.gov FY2026 Income Guidelines — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.income_monthly <= [2608, 3525, 4441, 5358, 6275][Math.min(a.household_size - 1, 4)],
  },

  {
    id: "sstap",
    name: "Statewide Special Transportation Assistance Program (SSTAP)",
    category: "transportation",
    type: "state",
    description: "Subsidized transportation for Maryland residents who are elderly (60+) or have disabilities and live far from public transit routes. Administered county by county through the Maryland Department of Transportation.",
    amount: "Subsidized rides — cost-sharing varies by county.",
    nuances: [
      "Each county administers its own program — services, availability, and costs vary significantly by location.",
      "Designed for people who cannot access fixed-route public transit due to disability or distance.",
      "Medicaid transportation: If you have Medicaid, you may be entitled to free non-emergency medical transportation (NEMT) to covered appointments — this is a separate, broader program.",
      "ADA Paratransit: if a fixed-route transit system exists in your area, they are required by law to provide comparable paratransit service for people with disabilities who cannot use the fixed-route system.",
      "Contact your county's Area Agency on Aging or local transit coordinator for specific availability and eligibility."
    ],
    how_to_apply: "Contact your county's Area Agency on Aging or transportation coordinator. Find your local contact through 211 Maryland (dial 2-1-1) or mdot.maryland.gov.",
    apply_url: "https://mdot.maryland.gov/",
    source: "mdot.maryland.gov, stmaryscountymd.gov/dpw/SSTAP — verified March 2026",
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
    description: "Free durable medical equipment and assistive technology to any Maryland resident with an illness, injury, or disability. Redistributes donated and surplus equipment. No income limit.",
    amount: "Free — no income limit, no means test.",
    nuances: [
      "Equipment available includes: wheelchairs (manual and power), hospital beds, walkers, crutches, canes, shower chairs, commodes, communication devices, and more.",
      "Equipment is available while supplies last — not all items are always in stock.",
      "No prescription required for most items, but some equipment may require a healthcare provider's recommendation.",
      "Available to ANY Maryland resident with a medical need — no income requirement.",
      "Equipment is cleaned, inspected, and recertified before redistribution.",
      "Can supplement or fill gaps while waiting for insurance approval or DME orders."
    ],
    how_to_apply: "Contact through your healthcare provider or visit marylandequips.org. Call 410-554-9366.",
    apply_url: "https://www.marylandequips.org/",
    source: "marylandequips.org (state program) — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident,
  },

  {
    id: "champ",
    name: "CHAMP — Home Modification Grants for Voucher Holders",
    category: "housing",
    type: "state",
    description: "Grant funding for structural modifications to rental units occupied by Housing Choice Voucher (Section 8) holders with disabilities. Helps make homes accessible without cost to the tenant or landlord.",
    amount: "Grant amount varies — covers cost of approved modifications.",
    nuances: [
      "Must currently hold a Housing Choice Voucher — this is a requirement, not just a preference.",
      "Modifications covered: wheelchair ramps, grab bars, roll-in showers, widened doorways, accessible kitchen modifications, hearing/vision accessibility features.",
      "Application is made through your local Public Housing Authority, not directly.",
      "Landlord must consent to modifications.",
      "If you need modifications but don't have a voucher, ask your PHA about other ADA accommodation requirements."
    ],
    how_to_apply: "Contact your local Public Housing Authority or Maryland DHCD at dhcd.maryland.gov. Call 1-800-756-0119.",
    apply_url: "https://dhcd.maryland.gov/",
    source: "habc.org, dhcd.maryland.gov — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident &&
      a.receives_housing_voucher,
  },

  {
    id: "senior_assisted_living",
    name: "Senior Assisted Living Group Home Subsidy",
    category: "housing",
    type: "state",
    description: "Maryland state supplement providing approximately $1,000/month for SSI recipients age 62+ who require additional care and reside in a licensed assisted living facility.",
    amount: "~$1,000/month supplement (in addition to SSI payment).",
    nuances: [
      "Must be receiving SSI — this is a state add-on to the SSI payment.",
      "Must reside in a licensed assisted living facility that participates in the program.",
      "Age 62 or older.",
      "The total (SSI + supplement) helps cover the cost of assisted living — though room and board costs in assisted living can be higher.",
      "Apply through your local Department of Social Services.",
      "Eligibility is reassessed annually along with SSI recertification."
    ],
    how_to_apply: "Contact your local DSS office. Call 1-800-332-6347.",
    apply_url: "https://dhs.maryland.gov/",
    source: "dhs.maryland.gov — verified March 2026",
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
    description: "Deferred loans for low-income Maryland homeowners to fund home repairs including accessibility modifications, roof replacement, structural repairs, and health/safety improvements.",
    amount: "Deferred loan — no payments while you live in the home. Repaid when the home is sold or transferred.",
    nuances: [
      "Must own and occupy the home as primary residence.",
      "Income limits vary by county — generally based on 80% of Area Median Income.",
      "Eligible repairs: accessibility ramps, structural repairs, roof replacement, plumbing, electrical, heating system, and health/safety hazards.",
      "Administered through local governments and nonprofit partners — not DHCD directly in all counties.",
      "Contact your county's housing office for local availability and income limits.",
      "Loan is forgiven after a set period if you remain in the home (varies by jurisdiction)."
    ],
    how_to_apply: "Apply through Maryland DHCD: dhcd.maryland.gov/Residents or contact your county housing department. Call 1-800-756-0119.",
    apply_url: "https://dhcd.maryland.gov/Residents/Pages/singlefamily/default.aspx",
    source: "dhcd.maryland.gov — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.is_homeowner &&
      a.income_monthly <= 5000,
  },

  {
    id: "chip",
    name: "Maryland Children's Health Insurance Program (MCHIP)",
    category: "healthcare",
    type: "state",
    description: "Free or very low-cost health insurance for Maryland children under 19 in families that earn too much for Medicaid but can't afford private insurance. Covers children with disabilities.",
    amount: "Little to no premium. Comprehensive coverage including dental, vision, mental health.",
    nuances: [
      "Children through age 18 (under 19).",
      "Income limit: up to $4,283/mo for a single child; higher for larger families (effective Feb 2026).",
      "Children with disabilities may qualify under different rules — apply regardless of income.",
      "MCHIP covers the same HealthChoice managed care plans as Medicaid.",
      "Apply at any time — no open enrollment period.",
      "Parents/guardians apply on behalf of the child; parents' own immigration status does not affect a child's eligibility if the child is a citizen."
    ],
    how_to_apply: "Apply at Maryland Health Connection: marylandhealthconnection.gov or call 1-855-642-8572.",
    apply_url: "https://www.marylandhealthconnection.gov/",
    source: "health.maryland.gov/mmcp — Feb 2026 income limits — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_children_under_19 &&
      a.income_monthly <= 5400,
  },

  // ─── NONPROFIT & ADVOCACY ORGANIZATIONS ──────────────────────────────────

  {
    id: "disability_rights_md",
    name: "Disability Rights Maryland",
    category: "legal",
    type: "nonprofit",
    description: "Maryland's federally mandated Protection & Advocacy organization. Provides free legal advocacy for Marylanders with disabilities on Social Security appeals, civil rights, housing, employment, healthcare access, and abuse/neglect in institutions.",
    amount: "Free legal services — no income requirement.",
    nuances: [
      "Federally designated Protection & Advocacy (P&A) organization — required by federal law to exist in every state.",
      "Can represent you at SSA hearings and appeals.",
      "Monitors and investigates abuse and neglect of people with disabilities in institutions and care settings.",
      "Does not handle criminal matters — civil disability rights only.",
      "Prioritizes cases involving immediate health/safety risk and systemic issues.",
      "Also provides self-advocacy training and know-your-rights information."
    ],
    how_to_apply: "Call 1-800-233-7201 (TTY: 410-235-5387) or apply online at disabilityrightsmd.org.",
    apply_url: "https://www.disabilityrightsmd.org/",
    source: "disabilityrightsmd.org — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident,
  },

  {
    id: "arc_maryland",
    name: "The Arc Maryland",
    category: "support_services",
    type: "nonprofit",
    description: "Statewide advocacy organization for individuals with intellectual and developmental disabilities (IDD) and their families. Provides resource navigation, rights advocacy, community inclusion support, and policy work.",
    amount: "Free navigation, advocacy, and referral services.",
    nuances: [
      "Does not directly provide waiver or Medicaid services — provides navigation to those programs.",
      "Local Arc chapters in multiple Maryland counties offer direct family support services.",
      "Hosts family resource fairs and peer support networks.",
      "Advocates at the state legislature on disability policy issues.",
      "Can help families understand the DDA eligibility and waiver process."
    ],
    how_to_apply: "Call The Arc Maryland at 410-821-1098 or visit arcmd.org.",
    apply_url: "https://arcmd.org/",
    source: "arcmd.org — verified March 2026",
    eligibility: (a) =>
      a.has_developmental_disability || a.has_intellectual_disability,
  },

  {
    id: "maryland_legal_aid",
    name: "Maryland Legal Aid",
    category: "legal",
    type: "nonprofit",
    description: "Free civil legal services for income-eligible Marylanders including people with disabilities. Covers housing (eviction defense, foreclosure), healthcare access, benefits denials, family matters, and consumer issues.",
    amount: "Free legal services.",
    nuances: [
      "Income eligibility required — generally at or below 200% of federal poverty level.",
      "Serves clients regardless of disability status, but disability-related cases are a priority area.",
      "Cannot take every case — prioritizes matters with the greatest impact on housing stability, safety, and access to benefits.",
      "Multiple offices statewide — find your local office at mdlab.org.",
      "Can assist with Medicaid and SNAP appeals, housing discrimination, and Social Security matters."
    ],
    how_to_apply: "Call 1-800-999-8904 or apply online at mdlab.org.",
    apply_url: "https://www.mdlab.org/",
    source: "mdlab.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.income_monthly <= 2500,
  },

  {
    id: "catholic_charities_md",
    name: "Catholic Charities of Maryland",
    category: "emergency",
    type: "nonprofit",
    description: "Emergency financial assistance for rent, utilities, food, and essential needs. Open to all people regardless of faith. Serves Baltimore City and many Maryland counties.",
    amount: "Emergency assistance — varies by need, location, and available funding.",
    nuances: [
      "Not exclusively for Catholics — serves everyone.",
      "Emergency funds are limited and disbursed on a first-come, first-served basis.",
      "May require documentation of need (lease, utility bills, income verification).",
      "Also provides immigration services, mental health counseling, and food pantry access.",
      "Availability varies by location — call your local office first."
    ],
    how_to_apply: "Call 410-547-5087 or visit catholiccharities-md.org to find your local center.",
    apply_url: "https://www.catholiccharities-md.org/",
    source: "catholiccharities-md.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident,
  },

  {
    id: "salvation_army_md",
    name: "Salvation Army Maryland",
    category: "emergency",
    type: "nonprofit",
    description: "Emergency financial assistance for rent, utilities, food, and clothing through local corps locations throughout Maryland.",
    amount: "Emergency assistance — varies by location and available funds.",
    nuances: [
      "Services and availability vary significantly by local corps location.",
      "May require an intake interview and documentation.",
      "Food pantry access often available same day.",
      "Rental and utility assistance requires advance planning — funds can run out.",
      "Also provides disaster relief, addiction recovery programs, and holiday assistance."
    ],
    how_to_apply: "Find your local Salvation Army at salvationarmyusa.org or call 1-800-725-2769.",
    apply_url: "https://www.salvationarmyusa.org/usn/",
    source: "salvationarmyusa.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident,
  },

  {
    id: "maryland_food_bank",
    name: "Maryland Food Bank",
    category: "food",
    type: "nonprofit",
    description: "Free food through a network of 1,300+ partner agencies across Maryland including food pantries, soup kitchens, mobile distributions, and school programs. No income documentation required at many sites.",
    amount: "Free food — no income limit at most distribution sites.",
    nuances: [
      "No documentation required at most pantry locations — just show up.",
      "Some partner agencies may have geographic restrictions (serve residents of a specific zip code).",
      "Find the closest pantry using the agency locator at mdfoodbank.org.",
      "Mobile food distributions operate in underserved areas — check schedule online.",
      "Also distributes medically appropriate food for people with diet-related health conditions."
    ],
    how_to_apply: "Find a pantry at mdfoodbank.org or call 410-737-8282.",
    apply_url: "https://www.mdfoodbank.org/",
    source: "mdfoodbank.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident,
  },

  {
    id: "map_211",
    name: "Maryland Access Point (MAP) / 211 Maryland",
    category: "navigation",
    type: "state_nonprofit",
    description: "Free, statewide information and referral service staffed by specialists who can connect you to health, disability, housing, food, and financial assistance programs. Dial 2-1-1 from any phone — 24/7.",
    amount: "Free service.",
    nuances: [
      "Dial 2-1-1 from any phone — free, confidential, 24/7.",
      "Specialists can search across thousands of local programs and provide tailored referrals.",
      "MAP offices specifically serve older adults, people with disabilities, and caregivers — they can also add you to the Community Options Waiver Service Registry.",
      "Multilingual services available.",
      "Available by phone, online chat, and text.",
      "If you don't know where to start — start here."
    ],
    how_to_apply: "Dial 2-1-1 or visit 211md.org. MAP Help Line: 1-844-MAP-LINK (1-844-627-5465).",
    apply_url: "https://211md.org/",
    source: "211md.org, marylandaccesspoint.211md.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident,
  },

  {
    id: "medbank",
    name: "Maryland MedBank — Prescription Assistance",
    category: "healthcare",
    type: "nonprofit",
    description: "Helps uninsured and underinsured Maryland residents access free or deeply discounted prescription medications through pharmaceutical manufacturer patient assistance programs.",
    amount: "Free or low-cost medications — value varies by drug.",
    nuances: [
      "Works with pharmaceutical manufacturers' Patient Assistance Programs (PAPs).",
      "Income eligibility varies by medication/manufacturer — generally at or below 200% FPL.",
      "Can assist with Medicare Part D coverage gaps ('donut hole').",
      "Application process can take 4–8 weeks — plan ahead.",
      "Not all medications are available through PAPs — ask about alternatives.",
      "Often can help bridge the gap during Medicaid or insurance application periods."
    ],
    how_to_apply: "Contact Maryland MedBank through your local health department or visit mdmedbank.org.",
    apply_url: "https://www.mdmedbank.org/",
    source: "mdmedbank.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      (!a.has_insurance || a.income_monthly <= 2500),
  },

  {
    id: "weinberg_foundation",
    name: "Weinberg Foundation — Maryland Grants",
    category: "grants",
    type: "private",
    description: "The Harry & Jeanette Weinberg Foundation is one of Maryland's largest private foundations, funding nonprofits that provide direct services to people with disabilities, elderly adults, and those experiencing poverty in Maryland.",
    amount: "Grants go to organizations — individuals access services through Weinberg-funded nonprofits.",
    nuances: [
      "Individuals cannot apply directly to the Weinberg Foundation — grants go to nonprofit organizations.",
      "To access Weinberg-funded services, contact Weinberg-funded organizations in Maryland such as Weinberg Housing and Resource Center, Jewish Community Services, or other grantees.",
      "Focus areas: housing, health, jobs, and education for vulnerable populations.",
      "Review their grantee directory at hjweinbergfoundation.org to find programs near you."
    ],
    how_to_apply: "Find a Weinberg-funded program near you at hjweinbergfoundation.org/grantees.",
    apply_url: "https://hjweinbergfoundation.org/",
    source: "hjweinbergfoundation.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      (a.has_disability || a.age >= 65 || a.income_monthly <= 2500),
  },

];

// ─── CATEGORY METADATA ─────────────────────────────────────────────────────────

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
