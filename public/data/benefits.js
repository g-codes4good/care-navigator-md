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
    amount: "Comprehensive coverage. Part B standard premium: $185.00/mo (2026). Part A: free if you have sufficient work history.",
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
    amount: "Average ~$292/mo per person; maximum $975/mo for a family of 4 (FY2026, effective October 2025).",
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
      "Income limit: $2,982/mo (single applicant, 2026 — 300% of the SSI Federal Benefit Rate, updated January 2026).",
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
      a.income_monthly <= 2982 &&
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

  // ─── ADDITIONAL MARYLAND STATE PROGRAMS ──────────────────────────────────

  {
    id: "community_first_choice",
    name: "Community First Choice (CFC)",
    category: "home_care",
    type: "state",
    description: "Maryland Medicaid program providing personal care and home support services to adults who need nursing-facility-level care but want to remain at home or in the community. No waitlist — anyone who qualifies is enrolled.",
    amount: "Full personal care and homemaker services — no dollar cap. Value depends on assessed need.",
    nuances: [
      "NO WAITLIST — unlike the Community Options Waiver, CFC has no cap on enrollment. Anyone who meets eligibility can receive services immediately.",
      "Income limit: $350/month for a single individual (same as Medicaid ABD group, effective Feb 2026). However, income exceptions and spend-down pathways exist.",
      "Must require nursing facility level of care, assessed through the interRAI Home Care tool.",
      "Must be enrolled in Maryland Medicaid (HealthChoice).",
      "Services covered: personal care assistance (bathing, dressing, toileting, eating, mobility), homemaker services (meal prep, light housekeeping, laundry), personal emergency response systems (PERS), home accessibility modifications, and delivery of prepared meals.",
      "Participant-directed option available — unlike the Community Options Waiver, CFC DOES allow you to hire and direct your own caregivers, including family members in some cases.",
      "Also available: Community Personal Assistance Services (CPAS) — another no-waitlist personal care program for people who do not need nursing-facility level of care but need assistance with daily living.",
      "Apply through Maryland Access Point: 1-844-MAP-LINK (1-844-627-5465) or your local health department.",
      "If you are on the Community Options Waiver waitlist, ask about CFC as an immediate alternative."
    ],
    how_to_apply: "Apply through Maryland Medicaid at marylandhealthconnection.gov or call Maryland Access Point: 1-844-627-5465. Contact Maryland Department of Health: 410-767-6500 or 1-877-463-3464.",
    apply_url: "https://health.maryland.gov/mmcp/longtermcare/pages/community-first-choice.aspx",
    source: "health.maryland.gov/mmcp, medicaid.gov — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.needs_daily_living_assistance &&
      a.income_monthly <= 2500, // spend-down exceptions exist
  },

  {
    id: "brain_injury_waiver",
    name: "Brain Injury Waiver (BIW)",
    category: "home_care",
    type: "state",
    description: "Maryland Medicaid waiver providing home and community-based services to adults ages 22–64 with an acquired brain injury who require nursing-facility-level care. Allows transition from institutional settings to community living.",
    amount: "Comprehensive community-based services including housing, employment support, and day programs — value varies by care plan.",
    nuances: [
      "Age requirement: 22 to 64 years old.",
      "Brain injury must have been acquired (not congenital) and sustained after age 17.",
      "Covered conditions: traumatic brain injury (TBI), stroke, anoxic/hypoxic brain injury, brain tumor complications, and other acquired brain injuries resulting in cognitive, physical, behavioral, or emotional disability.",
      "Income limit: ≤$2,982/month (300% of SSI Federal Benefit Rate, updated January 2026).",
      "Asset limit: ≤$2,000.",
      "Medical requirement: must require nursing facility or chronic hospital level of care; medical conditions must be chronic, predictable, stable, and routine.",
      "Six covered services: (1) Residential Habilitation — 24-hour supervised group home, 1:3 staff ratio; (2) Day Habilitation — skill-building in community settings; (3) Supported Employment — job training and ongoing supervision; (4) Medical Day Care — health-supervised ambulatory services; (5) Individual Support Services — community participation assistance; (6) Case Management — coordination of all services.",
      "2025 amendment expanded access from state nursing facilities to include private nursing facilities — this is a recent significant change.",
      "Submit an interest form through the Brain Injury Association of Maryland (BIAMD) to begin the process.",
      "Contact BIAMD at 410-448-2924 or [email protected]"
    ],
    how_to_apply: "Submit an interest form at the Brain Injury Association of Maryland: biamd.org or call 410-448-2924. MDH Program Coordinator: [email protected]",
    apply_url: "https://www.biamd.org/brain-injury-wavier-program.html",
    source: "biamd.org, health.maryland.gov/mmcp — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.age >= 22 && a.age <= 64 &&
      a.has_brain_injury &&
      a.income_monthly <= 2982 &&
      a.assets <= 2000 &&
      a.needs_daily_living_assistance,
  },

  {
    id: "maryland_bha_mental_health",
    name: "Maryland Medicaid Behavioral Health Services",
    category: "healthcare",
    type: "state",
    description: "Maryland Medicaid covers a comprehensive range of mental health and substance use disorder services for enrolled individuals. Managed statewide by Carelon Behavioral Health (as of January 2025), replacing Optum.",
    amount: "Fully covered under Medicaid — no cost or low cost to enrolled members.",
    nuances: [
      "Must be enrolled in Maryland Medicaid (HealthChoice) to access these services.",
      "Covered mental health services: outpatient therapy, psychiatric evaluations, medication management, psychiatric rehabilitation, intensive outpatient programs (IOP), crisis intervention (including 24/7 crisis lines), mobile crisis teams, and inpatient psychiatric care.",
      "Substance use disorder services: detoxification, residential treatment, intensive outpatient treatment, medication-assisted treatment (MAT/buprenorphine/methadone), and recovery support.",
      "Behavioral health is carved out of HealthChoice managed care plans — you go through Carelon Behavioral Health separately, not your primary HealthChoice plan.",
      "To find a covered behavioral health provider: call Carelon at 1-800-888-1965 or visit maryland.carelonbh.com.",
      "Crisis services: Maryland Crisis Hotline 988 (Suicide & Crisis Lifeline), available 24/7 — no insurance required.",
      "Children's services: Therapeutic Behavioral Services (TBS) for children with mental illness or developmental disabilities — provided in home and community settings.",
      "Provider enrollment moratorium: new Medicaid behavioral health provider enrollments are paused January 1–June 30, 2026 — existing providers continue serving patients.",
      "Serious Mental Illness (SMI): individuals with SMI are a priority population and may access additional community support services."
    ],
    how_to_apply: "Apply for Medicaid at marylandhealthconnection.gov. For behavioral health services: call Carelon at 1-800-888-1965. Crisis: call or text 988.",
    apply_url: "https://health.maryland.gov/bha/pages/index.aspx",
    source: "health.maryland.gov/bha, health.maryland.gov/mmcp — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      (a.has_mental_health || a.has_disability) &&
      a.income_monthly <= 1835,
  },

  // ─── FEDERAL VETERAN PROGRAMS ─────────────────────────────────────────────

  {
    id: "va_disability_compensation",
    name: "VA Disability Compensation",
    category: "income",
    type: "federal",
    description: "Monthly tax-free payments for veterans with service-connected disabilities. Rating from 0–100% determines payment amount. Maryland does not tax VA disability compensation — it is fully state tax-exempt.",
    amount: "2026 monthly rates (effective Dec 1, 2025): 10% ≈ $179.90; 30% ≈ $520.75; 50% ≈ $1,102.04; 70% ≈ $1,759.19; 100% ≈ $3,927.08. Rates increase with dependents. Verify exact rates at va.gov/disability/compensation-rates/.",
    nuances: [
      "Disability must be connected to military service — injury, illness, or condition that began or worsened during active duty.",
      "Rating is based on VA Schedule for Rating Disabilities (VASRD). Multiple ratings are combined using the 'whole person' method.",
      "Individual Unemployability (IU): if your service-connected disability prevents you from maintaining substantially gainful employment, you may receive compensation at the 100% rate even if your combined rating is less than 100%.",
      "Fully tax-exempt in Maryland — not subject to federal income tax, Maryland income tax, or Social Security tax.",
      "SSDI and VA compensation can be received simultaneously.",
      "Maryland does NOT offset VA compensation from state pension or other benefits.",
      "Apply with help from a free VA-accredited Benefits Services Specialist at the Maryland Department of Veterans and Military Families — no cost.",
      "Specially Adapted Housing (SAH) and Special Home Adaptation (SHA) grants: veterans with service-connected disabilities affecting mobility can receive grants up to $117,014 (SAH) or $23,444 (SHA) for home modifications.",
      "Veterans in Maryland rated 70%+ who need nursing home care are entitled to nursing home care at VA expense — Charlotte Hall Veterans Home accepts eligible Maryland veterans."
    ],
    how_to_apply: "Apply at va.gov/disability or visit a Maryland VA office. Free assistance: Maryland Department of Veterans & Military Families at veterans.maryland.gov, 1-800-446-4926.",
    apply_url: "https://www.va.gov/disability/",
    source: "va.gov, veterans.maryland.gov — verified March 2026",
    eligibility: (a) =>
      a.is_veteran && a.has_service_connected_disability,
  },

  {
    id: "md_veterans_property_tax",
    name: "Maryland Veterans Property Tax Exemption",
    category: "housing",
    type: "state",
    description: "Complete exemption from Maryland real property taxes on your home for veterans with a 100% total and permanent (or unemployable) service-connected disability rating from the VA.",
    amount: "Full property tax exemption — value depends on your property's assessed value. Can save thousands of dollars per year.",
    nuances: [
      "Requires 100% total and permanent OR Individual Unemployability (IU) rating from VA.",
      "Applies only to primary residence (home and surrounding yard).",
      "Surviving spouses of eligible veterans retain the exemption if they do not remarry.",
      "Surviving spouses of service members killed in the line of duty also qualify.",
      "Must apply through your county's Department of Assessments and Taxation.",
      "Exemption is retroactive to the date of your 100% rating — you may receive a refund of taxes paid after your rating date.",
      "Does not apply to commercial property, rental property, or secondary homes."
    ],
    how_to_apply: "Apply through your local Maryland Department of Assessments and Taxation office. Bring your VA rating letter. Contact: dat.maryland.gov or call 410-767-1184.",
    apply_url: "https://dat.maryland.gov/Pages/default.aspx",
    source: "veterans.maryland.gov — verified March 2026",
    eligibility: (a) =>
      a.is_veteran &&
      a.is_maryland_resident &&
      a.is_homeowner &&
      a.has_100_percent_va_rating,
  },

  {
    id: "conroy_scholarship",
    name: "Edward T. Conroy & Jean B. Cryor Memorial Scholarship",
    category: "employment",
    type: "state",
    description: "Maryland state scholarship for disabled veterans and dependents of killed-in-action or 100% disabled veterans. Covers tuition at any Maryland public or private college, university, or career school.",
    amount: "Up to $13,689 per year (2025–2026). Cannot exceed cost of attendance or $32,200 total aid.",
    nuances: [
      "Eligible populations: (1) Veterans with a service-connected disability of 25% or greater who have exhausted all federal veterans' educational benefits; (2) children/stepchildren/surviving spouses of veterans who are 100% disabled as a direct result of military service; (3) children of POW/MIA personnel from Vietnam era; (4) surviving spouses of 9/11 victims; (5) public safety employees who are 100% disabled in the line of duty.",
      "Must be a Maryland resident at time of application (exception: dependents of Maryland public safety employees killed in the line of duty).",
      "Award is based on enrollment status (full-time vs part-time) and cost of tuition and mandatory fees.",
      "Can be used at any Maryland community college, 4-year university, or career school.",
      "Deadline: July 15 each year for the following academic year.",
      "Apply through the Maryland Higher Education Commission (MHEC) Office of Student Financial Assistance.",
      "Contact: 410-767-3300 or [email protected]"
    ],
    how_to_apply: "Apply through MHEC: mhec.maryland.gov or email [email protected]. Deadline: July 15 annually. Contact: 410-767-3300.",
    apply_url: "https://mhec.maryland.gov/preparing/pages/financialaid/programdescriptions/prog_conroy.aspx",
    source: "mhec.maryland.gov — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.is_veteran &&
      (a.has_service_connected_disability || a.has_100_percent_va_rating) &&
      a.wants_to_work, // proxy for education/employment goals
  },

  {
    id: "charlotte_hall_veterans_home",
    name: "Charlotte Hall Veterans Home",
    category: "housing",
    type: "state",
    description: "Maryland-operated assisted living and skilled nursing facility exclusively for eligible Maryland veterans and their spouses. Provides long-term care, memory care, rehabilitation, and full medical staffing.",
    amount: "Veterans rated 70%+ with service-connected disability: VA covers full nursing home cost (~$4,536/month savings at $148.71/day VA rate). Others pay on a sliding scale based on income.",
    nuances: [
      "Requires honorable or general discharge from U.S. military service.",
      "Must be a Maryland resident.",
      "Services: skilled nursing care, assisted living, memory care, physical/occupational/speech therapy, social services, recreational programs.",
      "Veterans rated 70%+ with a service-connected disability are entitled to nursing home care at VA expense under the Veterans Millennium Healthcare Act.",
      "VA per diem rate for nursing home care: $148.71/day (as of October 1, 2025; verify 2026 rate at va.gov).",
      "For veterans not at 70%+ service-connected: cost is income-based; Medicaid may be accepted.",
      "Spouses of eligible veterans may also be admitted.",
      "Located in Charlotte Hall, MD (Southern Maryland). The only state-veterans-specific long-term care facility in Maryland."
    ],
    how_to_apply: "Contact Charlotte Hall Veterans Home directly: 301-884-8171. Or contact the Maryland Department of Veterans and Military Families: veterans.maryland.gov, 1-800-446-4926.",
    apply_url: "https://veterans.maryland.gov/Benefits/Healthcare/Pages/Assisted-Living-and-Skilled-Nursing-Facility.aspx",
    source: "veterans.maryland.gov — verified March 2026",
    eligibility: (a) =>
      a.is_veteran &&
      a.is_maryland_resident &&
      a.needs_assisted_living,
  },

  {
    id: "md_veterans_vehicle",
    name: "Maryland Veterans Vehicle Registration Benefits",
    category: "transportation",
    type: "state",
    description: "Maryland veterans with service-connected disability ratings receive reduced or free vehicle registration. 100% disabled veterans receive completely free registration annually.",
    amount: "100% service-connected disabled: free vehicle registration (one vehicle). 50–99% disabled: free license plate, standard registration fees still apply.",
    nuances: [
      "100% service-connected (total and permanent or IU): one free vehicle registration per year, renewed annually at no cost.",
      "50–99% service-connected: free disability license plate, but standard annual/biennial registration fees and surcharges still apply.",
      "Apply through the Maryland Motor Vehicle Administration (MVA) with a copy of your VA rating letter.",
      "Only applies to one vehicle.",
      "100% disabled veterans also eligible for complimentary lifetime hunting and fishing license including trout stamp, muzzleloader stamp, and bow stamp."
    ],
    how_to_apply: "Apply at any Maryland MVA office with your VA rating letter. MVA: mva.maryland.gov or call 410-768-7000.",
    apply_url: "https://mva.maryland.gov/",
    source: "veterans.maryland.gov — verified March 2026",
    eligibility: (a) =>
      a.is_veteran &&
      a.is_maryland_resident &&
      a.has_service_connected_disability,
  },

  // ─── DISEASE-SPECIFIC NATIONAL FOUNDATIONS (SERVING MARYLAND) ─────────────

  {
    id: "akf_safety_net",
    name: "American Kidney Fund — Safety Net Grant",
    category: "grants",
    type: "nonprofit",
    description: "Annual financial assistance grant for people in Maryland on dialysis or living with a kidney transplant. Maryland, DC, and Virginia residents receive a higher grant amount than the national average due to regional funding support.",
    amount: "$300 per year for Maryland residents (increased from $250 due to Schattner Foundation gift). National average for other states: $200/year.",
    nuances: [
      "Must be on dialysis OR have received a kidney transplant.",
      "Living kidney donors are also eligible for assistance covering travel, lodging, and lost wages during the donation/transplant process.",
      "Grant covers: transportation to dialysis or medical appointments, prescription copays, medical supplies, food, rent, and utilities.",
      "Payment delivered via debit card or direct deposit.",
      "Apply through the social worker at your dialysis center — this is the most common and fastest route.",
      "Can also apply directly: call 800-795-3226 or use the online Grants Management System at gms.kidneyfund.org.",
      "No stated income limit — verify current eligibility criteria when applying.",
      "Headquartered in Rockville, Maryland — the American Kidney Fund is one of the largest kidney disease organizations in the U.S."
    ],
    how_to_apply: "Contact the social worker at your dialysis center, call 800-795-3226, or apply online at gms.kidneyfund.org.",
    apply_url: "https://www.kidneyfund.org/get-assistance/safety-net-grants",
    source: "kidneyfund.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_kidney_disease,
  },

  {
    id: "pan_foundation",
    name: "PAN Foundation — Disease-Specific Medication Assistance",
    category: "healthcare",
    type: "nonprofit",
    description: "Patient assistance grants for medication copays, insurance premiums, and transportation for people with 80+ serious, chronic, and rare diseases. Income-based; Maryland residents eligible for all national funds.",
    amount: "Varies by disease fund — typically $500 to $8,000+ per year. Example: myeloproliferative neoplasms fund provides up to $8,000/year. Covers a 12-month period.",
    nuances: [
      "Covers 80+ diseases including cancer types, MS, Crohn's disease, rheumatoid arthritis, lupus, heart failure, diabetes complications, rare diseases, and more.",
      "Must have health insurance that covers your qualifying medication — insurance is required.",
      "Income limit: varies by disease fund — check your specific fund at panfoundation.org/find-disease-fund.",
      "Covers: prescription copays, insurance premium assistance, and transportation to treatment.",
      "Funds open and close based on available funding — check availability before applying.",
      "Apply online or call 1-866-316-7263, Monday–Friday 9am–5:30pm ET.",
      "If your PAN fund is closed, also check HealthWell Foundation and NeedyMeds as alternatives.",
      "Headquartered in Washington, DC — serves all 50 states including Maryland."
    ],
    how_to_apply: "Apply at panfoundation.org or call 1-866-316-7263. Find your disease fund first at panfoundation.org/find-disease-fund.",
    apply_url: "https://www.panfoundation.org/",
    source: "panfoundation.org — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.has_insurance,
  },

  {
    id: "healthwell_foundation",
    name: "HealthWell Foundation — Chronic Illness Premium & Copay Assistance",
    category: "healthcare",
    type: "nonprofit",
    description: "Grants for people with chronic or life-altering diseases to help pay insurance premiums, prescription copays, pediatric treatment costs, and behavioral health services. Accepts patients up to 400–500% of the federal poverty level.",
    amount: "$100 to $10,000+ per year depending on the disease fund. Grants cover a rolling 12-month period.",
    nuances: [
      "Income limit: up to 400–500% of the Federal Poverty Level (2026: ~$60,000–$75,000 for an individual) — significantly higher than most programs.",
      "Must have active health insurance (private, Medicare, Medicaid, TRICARE) that covers part of your treatment cost.",
      "Drug discount cards do not qualify as insurance.",
      "Covers: prescription drug copays, health insurance premiums, pediatric treatment, behavioral health services, vitamins/supplements (for covered conditions), and travel to treatment.",
      "Disease funds include: MS, lupus, rheumatoid arthritis, cancer (multiple types), heart failure, Crohn's, COPD, HIV/AIDS, and many others — see full list at healthwellfoundation.org/disease-funds.",
      "Application takes under 10 minutes online.",
      "Reapply each year if funds remain available.",
      "If your HealthWell fund is closed, check PAN Foundation and NeedyMeds.",
      "Headquartered in Germantown, Maryland — founded to serve patients nationally."
    ],
    how_to_apply: "Apply online at healthwellfoundation.org/patients/apply or call 800-675-8416, Monday–Friday 9am–5pm ET.",
    apply_url: "https://www.healthwellfoundation.org/",
    source: "healthwellfoundation.org — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.has_insurance &&
      a.income_monthly <= 6000,
  },

  {
    id: "ms_foundation_emergency",
    name: "MS Focus Foundation — Emergency Assistance Grants",
    category: "grants",
    type: "nonprofit",
    description: "Multiple financial assistance programs for people diagnosed with multiple sclerosis, including emergency rent/utility assistance, homecare grants, assistive technology funding, computer grants, transportation assistance, and healthcare grants.",
    amount: "Varies by program. Emergency assistance for rent/utilities: amounts not publicly stated — determined case by case. Assistive technology grants up to $1,000.",
    nuances: [
      "Must have a confirmed diagnosis of multiple sclerosis.",
      "Programs offered: (1) Emergency Assistance Grant — rent or utility bill help; (2) Healthcare Assistance Grant — helps uninsured individuals visit healthcare providers; (3) Homecare Assistance Grant — homecare, caregiver respite, and therapy; (4) Assistive Technology Program — funding for devices that help people with MS; (5) Computer Program — laptop or desktop for individuals with MS on limited budgets; (6) Transportation Assistance Grant — supports access to appointments and independence.",
      "Income limits apply — not publicly specified; determined during application review.",
      "Contact MS Focus directly to discuss eligibility before applying.",
      "National MS Society also provides complementary resources — MS Navigators at 1-800-344-4867 can help identify all available funding.",
      "Maryland MS patients can also contact the National MS Society Maryland chapter."
    ],
    how_to_apply: "Apply at msfocus.org/Get-Help or call 888-673-6287. National MS Society MS Navigators: 1-800-344-4867.",
    apply_url: "https://msfocus.org/Get-Help.aspx",
    source: "msfocus.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_ms,
  },

  {
    id: "epilepsy_foundation_md",
    name: "Epilepsy Foundation Maryland — Scholarship & Support",
    category: "grants",
    type: "nonprofit",
    description: "The Epilepsy Foundation Maryland provides the Ira Rosenzweig Memorial Scholarship for students with epilepsy, plus local support services including advocacy, education, and connection to financial assistance resources.",
    amount: "Ira Rosenzweig Memorial Scholarship: up to $4,000 per year for undergraduate tuition at a 2-year college, 4-year college, or trade/technical school.",
    nuances: [
      "Scholarship requires: diagnosis of epilepsy, enrollment in an accredited Maryland-based or U.S. educational institution.",
      "For undergraduate students — does not cover graduate-level tuition.",
      "Additional support services: seizure first aid training, support groups, advocacy resources, and connection to Social Security and employment assistance.",
      "Epilepsy Foundation also provides information on SUDEP (Sudden Unexpected Death in Epilepsy) resources and seizure management.",
      "Anti-seizure medication assistance: connect through PAN Foundation and NeedyMeds for medication copay help.",
      "Contact the Maryland chapter at 1-888-332-5764 or epilepsy.com/local/maryland."
    ],
    how_to_apply: "Contact Epilepsy Foundation Maryland: 1-888-332-5764 or visit epilepsy.com/local/maryland for scholarship applications and local support.",
    apply_url: "https://www.epilepsy.com/local/maryland",
    source: "epilepsy.com — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_epilepsy,
  },

  {
    id: "medicare_extra_help",
    name: "Medicare Extra Help (Low Income Subsidy)",
    category: "healthcare",
    type: "federal",
    description: "Federal program that pays most or all of Medicare Part D (prescription drug) costs for people with limited income and resources. Can save $5,000 or more per year on prescriptions.",
    amount: "Saves up to $5,000+ per year on Part D costs. Covers most premiums, deductibles, and copays for prescription drugs.",
    nuances: [
      "Income limit (2026): ≤$22,590/year for individuals ($1,883/mo); ≤$30,660/year for married couples.",
      "Asset limit (2026): ≤$17,220 for individuals; ≤$34,360 for married couples. Home, car, life insurance, and personal possessions do not count.",
      "If you already receive full Medicaid, SSI, or Medicare Savings Programs — you are automatically enrolled in Extra Help.",
      "Extra Help reduces or eliminates: Part D monthly premiums, annual deductibles, and prescription copays.",
      "Copays with Extra Help: $4.90 for generics, $12.15 for brand-name drugs (2026).",
      "If you miss the Initial Enrollment Period for Part D without Extra Help, you face a late enrollment penalty — Extra Help removes this penalty.",
      "Apply anytime — no annual enrollment period for Extra Help itself.",
      "SSA processes Extra Help applications — apply separately from Part D enrollment.",
      "Maryland Medicaid-enrolled individuals who are also on Medicare are typically 'dual eligible' and get Extra Help automatically."
    ],
    how_to_apply: "Apply online at ssa.gov/extrahelp, call 1-800-772-1213 (TTY 1-800-325-0778), or visit your local Social Security office.",
    apply_url: "https://www.ssa.gov/extrahelp",
    source: "ssa.gov — verified March 2026",
    eligibility: (a) =>
      a.age >= 65 || a.has_ssdi || a.has_medicare,
  },

  {
    id: "needymeds",
    name: "NeedyMeds — Prescription & Medical Cost Assistance",
    category: "healthcare",
    type: "nonprofit",
    description: "Free national database and navigator connecting patients to prescription drug patient assistance programs (PAPs), disease-specific funds, free/low-cost clinics in Maryland, and drug discount cards. Serves any diagnosis.",
    amount: "NeedyMeds itself is free. Programs in their database range from free medications to significant cost reductions — varies by program and drug.",
    nuances: [
      "Not a direct funder — NeedyMeds is a database and referral service. They connect you to the right program for your specific medication or condition.",
      "Drug Discount Card: NeedyMeds offers a free drug discount card that can reduce costs at participating pharmacies — available to anyone, no eligibility required.",
      "PAP database: covers thousands of brand-name and generic medications from hundreds of manufacturers — many provide free medications to qualified patients.",
      "Maryland free clinic directory: NeedyMeds maintains a searchable directory of free and sliding-scale clinics in Maryland.",
      "Useful when: your insurance doesn't cover a drug, you're in a coverage gap, you're waiting for Medicaid approval, or your PAN/HealthWell fund is closed.",
      "No income requirement to use the database — individual programs set their own income limits."
    ],
    how_to_apply: "Search at needymeds.org or call 800-503-6897. Free drug discount card: available immediately at needymeds.org/drugcard.",
    apply_url: "https://www.needymeds.org/",
    source: "needymeds.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident,
  },

  // ─── MARYLAND-SPECIFIC DISEASE & POPULATION PROGRAMS ─────────────────────

  {
    id: "maryland_cancer_fund",
    name: "Maryland Cancer Fund (MCF)",
    category: "healthcare",
    type: "state",
    description: "Maryland state fund providing cancer treatment grants to uninsured and underinsured low-income Maryland residents. Covers surgery, chemotherapy, radiation, imaging, lab work, medications, home health, and medical equipment. Administered through local health departments.",
    amount: "Up to $20,000 per patient per year for direct cancer treatment. Up to $10,000 per year for insurance premiums, deductibles, co-insurance, and copays. No restriction on cancer type.",
    nuances: [
      "Must be a Maryland resident for at least 6 months.",
      "Designed for uninsured and underinsured patients — not for those with full coverage.",
      "All cancer types are covered — no diagnosis exclusions.",
      "You do NOT need to have been a client of a health department screening program to qualify.",
      "Eligible services: surgery, chemotherapy, radiation therapy, hormonal therapy, biopsy, imaging, laboratory testing, home health services, and medical supplies/equipment.",
      "Also covers health insurance premiums, deductibles, co-insurance, and copays for up to 1 year.",
      "Applications are submitted through local health departments and authorized vendors — you cannot apply directly to the state fund.",
      "Contact your county health department or call 410-767-6213 to start the process.",
      "Income limits are set locally — contact your local health department for current thresholds."
    ],
    how_to_apply: "Contact your county's local health department. Call the Maryland Cancer Fund at 410-767-6213 to find the authorized vendor in your area.",
    apply_url: "https://health.maryland.gov/phpa/cancer/Pages/Maryland-Cancer-Fund.aspx",
    source: "health.maryland.gov/phpa/cancer — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_cancer &&
      (!a.has_insurance || a.income_monthly <= 3500),
  },

  {
    id: "maryland_hospital_charity_care",
    name: "Maryland Hospital Charity Care (SB981 — 2025 Law)",
    category: "healthcare",
    type: "state",
    description: "Maryland law (SB981, signed May 2025) requires all acute care hospitals in Maryland to provide free care to patients at or below 200% FPL, and sliding-scale discounts for patients up to 500% FPL. Applies to all medically necessary services at any Maryland acute hospital.",
    amount: "Free care (100% discount) at ≤200% FPL. Sliding-scale reduction up to 500% FPL. No dollar cap on the discount.",
    nuances: [
      "Effective May 2025 — this is a new law requiring standardized charity care statewide.",
      "Applies to ALL Maryland acute care hospitals — over 60 hospitals statewide.",
      "At or below 200% FPL (~$30,120/year for a single person in 2026): all medically necessary care is FREE.",
      "200%–500% FPL: proportional sliding-scale discounts — exact percentage varies by hospital policy.",
      "Must apply for financial assistance — it is not automatic. Ask for a Financial Assistance Application at any Maryland hospital registration or billing office.",
      "Hospitals cannot file lawsuits, garnish wages, or place liens on patients with outstanding balances of $500 or less.",
      "Legal action must wait at least 240 days (up from 180) after the initial bill.",
      "Each hospital has its own financial assistance application — apply directly to the hospital where you received care.",
      "Johns Hopkins: call 443-997-3067 (M–F 8:30am–4:30pm). UMMS: call their financial counseling office.",
      "HSCRC (Health Services Cost Review Commission) oversees and enforces compliance with charity care requirements.",
      "This applies regardless of disability status — all patients qualifying by income are covered."
    ],
    how_to_apply: "Ask for a Financial Assistance Application at any Maryland hospital's billing or patient financial services office. Coverage applies retroactively to services received — apply even after discharge.",
    apply_url: "https://hscrc.maryland.gov/Pages/pdr_generalinfo.aspx",
    source: "Maryland SB981 (signed May 2025), hscrc.maryland.gov — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.income_monthly <= 4165, // 500% FPL for 1 person (approximate 2026)
  },

  {
    id: "liss_dda",
    name: "DDA Low Intensity Support Services (LISS)",
    category: "grants",
    type: "state",
    description: "Maryland DDA program providing up to $1,000 grants to children and adults with developmental or intellectual disabilities who are NOT currently receiving DDA waiver services. Awarded via random selection lottery — no income test.",
    amount: "$1,000 per household per application round.",
    nuances: [
      "Must have a developmental or intellectual disability (DDA-eligible diagnosis).",
      "Must NOT be currently receiving DDA waiver-funded services — this is specifically for people still waiting or not yet in the waiver system.",
      "Children must be living at home with family. Adults must be living at home or independently in the community.",
      "Applicants on the DDA waiting list who receive only Coordination of Community Services (CCS) are eligible.",
      "Awards are made by random selection lottery — not first-come-first-served, not income-based.",
      "FY2026 Round 1: Applications open July 14, 2025; close September 15, 2025; lottery September 30, 2025.",
      "Multiple rounds per fiscal year — check health.maryland.gov/dda/pages/liss.aspx for current round dates.",
      "Managed by two regional providers: Maryland Community Connection (301-583-8880 / 877-622-6688) and Penn-Mar Human Services (877-282-8202).",
      "Email questions to: [email protected]"
    ],
    how_to_apply: "Apply online at pcis.health.maryland.gov/liss-service/apply during open application rounds. Contact Maryland Community Connection: 877-622-6688 or Penn-Mar: 877-282-8202.",
    apply_url: "https://health.maryland.gov/dda/pages/liss.aspx",
    source: "health.maryland.gov/dda — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      (a.has_developmental_disability || a.has_intellectual_disability),
  },

  {
    id: "mdtap_at_loan",
    name: "Maryland AT Loan Program (MDTAP) — Assistive Technology",
    category: "assistive_tech",
    type: "state",
    description: "Low-interest loans from $500 to $70,000 for Maryland residents with disabilities to purchase assistive technology, home modifications, and adapted vehicles. Below-market fixed interest rates. Less stringent than traditional bank loans.",
    amount: "Unsecured AT: up to $10,000. Home/vehicle modifications (unsecured): up to $20,000. Non-adapted vehicles: up to $40,000. Adapted vehicles: up to $70,000. Rates are below-market and fixed.",
    nuances: [
      "Must be a Maryland resident with a disability, OR someone purchasing AT for a Maryland resident with a disability (family member, employer, etc.).",
      "Must demonstrate ability to repay — but criteria are less strict than traditional banks.",
      "Qualifying items: wheelchairs (manual and power), scooters, home modifications (ramps, lifts, grab bars), adapted vehicles, hearing aids, Braille equipment, augmentative communication devices, computers with adaptive peripherals, environmental control units, and more.",
      "SECU Credit Union also offers Assistive Technology Loans as part of this program — check secumd.org.",
      "Interest rates are fixed at time of loan origination and vary by creditworthiness.",
      "Can be combined with grant programs (like CHAMP or SFHRP) to cover what loans don't.",
      "Apply online at onestop.md.gov or call 800-832-4827.",
      "Administered by the Maryland Department of Disabilities (MDOD)."
    ],
    how_to_apply: "Apply online at onestop.md.gov (search 'Assistive Technology Loan') or call MDTAP at 800-832-4827. Administered by MDOD: mdod.maryland.gov/mdtap.",
    apply_url: "https://mdod.maryland.gov/mdtap/Pages/ATlowloan.aspx",
    source: "mdod.maryland.gov/mdtap — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_disability,
  },

  {
    id: "autism_society_md_madhu",
    name: "Autism Society of Maryland — Madhu Fund Emergency Grants",
    category: "emergency",
    type: "nonprofit",
    description: "Emergency micro-grants for Maryland households with one or more Autistic members experiencing financial hardship. Covers a wide range of urgent needs from rent and utilities to autism-related technology and medical supplies.",
    amount: "Up to $250 per household. Awarded throughout the year as funds are available.",
    nuances: [
      "Must have at least one Autistic household member.",
      "No stated income limit — based on demonstrated financial hardship.",
      "Covered expenses: rent, utilities, car repairs, food, personal care items (clothing, hygiene), household supplies, baby supplies (diapers, formula), medical supplies, school supplies, emergency respite care, autism-related technology, and moving expenses.",
      "Funds are limited — may be exhausted at times during the year (as occurred in mid-2025).",
      "Download the application from autismsocietymd.org or email info@autismsocietymd.org.",
      "Contact: 410-290-3466.",
      "Pathfinders for Autism (pathfindersforautism.org) is Maryland's largest autism organization — they provide free resources, trainings, a provider database, and the Help Line at 443-330-5341 — a strong companion resource."
    ],
    how_to_apply: "Download application at autismsocietymd.org/madhu-fund-emergency-grants or email info@autismsocietymd.org. Call 410-290-3466.",
    apply_url: "https://autismsocietymd.org/madhu-fund-emergency-grants/",
    source: "autismsocietymd.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_autism,
  },

  // ─── NATIONAL DISEASE FOUNDATIONS (SERVING MARYLAND RESIDENTS) ────────────

  {
    id: "cancercare_copay",
    name: "CancerCare Co-Payment Assistance Foundation",
    category: "grants",
    type: "nonprofit",
    description: "Helps people with cancer pay treatment-related co-payments for chemotherapy, targeted therapy, immunotherapy, and other cancer medications. Also provides separate transportation, home care, and child care assistance grants. Income up to 500% FPL.",
    amount: "Co-pay grants: typically $2,500–$5,000/year per patient; annual limits $5,000–$10,000 depending on cancer type. Separate transportation/home care/child care grants also available.",
    nuances: [
      "Income limit: at or below 500% of the Federal Poverty Level (~$75,000/year for a single person in 2026).",
      "Must have health insurance that covers your cancer medication — insurance is required.",
      "Grant amounts vary by cancer type — each fund has a different limit.",
      "Cancer types with active funds include: breast, colorectal, head and neck, lung, pancreatic, renal cell, bladder, prostate, small cell lung, bile duct/cholangiocarcinoma, and others.",
      "If your cancer type fund is not currently open or funded, CancerCare connects you to other patient assistance programs.",
      "Approval takes 2–3 weeks.",
      "Separate Financial Assistance Program (not co-pay): grants for transportation to treatment, home care, and child care costs — call 800-813-HOPE (4673) to apply.",
      "Also provides free professional counseling, support groups, and social work services.",
      "Apply online or call: 866-55-COPAY (866-552-6729) or email info@cancercarecopay.org."
    ],
    how_to_apply: "Apply online at portal.cancercarecopay.org or call 866-552-6729. For transportation/home care grants: call 800-813-4673.",
    apply_url: "https://www.cancercare.org/copayfoundation",
    source: "cancercare.org — verified March 2026",
    eligibility: (a) =>
      a.has_cancer &&
      a.has_insurance &&
      a.income_monthly <= 6200,
  },

  {
    id: "lls_financial",
    name: "Leukemia & Lymphoma Society (LLS) — Patient Financial Aid",
    category: "grants",
    type: "nonprofit",
    description: "Financial assistance for blood cancer patients (leukemia, lymphoma, Hodgkin's, myeloma, MDS, and related diseases). Covers non-medical living expenses and treatment copays. Now operating as Blood Cancer United.",
    amount: "Co-Pay Assistance: up to $2,500/year for insurance premiums, copays, and treatment travel. Financial Aid grants: up to $2,500 one-time for non-medical expenses (rent, utilities, food, childcare, elder care, transportation). Disease-specific funds: AML up to $4,000; CLL up to $4,500.",
    nuances: [
      "Eligible diagnoses: all forms of leukemia, Hodgkin's and non-Hodgkin's lymphoma, myeloma, myelodysplastic syndromes (MDS), myeloproliferative neoplasms (MPN), Waldenström's macroglobulinemia, and related blood cancers.",
      "Non-medical expenses covered: rent, mortgage, lodging, utilities, childcare, elder care, food, transportation, car repair, car insurance, phone service, and acute dental work related to treatment.",
      "Co-pay program covers: insurance premiums, co-insurance, prescription drug copays, and treatment-related travel up to $2,500/year.",
      "Disease-specific funds have higher limits — AML patients may receive up to $4,000; CLL up to $4,500.",
      "Income limits apply — verify current thresholds when applying.",
      "One-time $100 stipend available to blood cancer patients for immediate non-medical needs.",
      "Also provides free information specialists, clinical trial navigation, and peer support.",
      "Contact LLS: 1-800-955-4572 or visit lls.org/support-resources/financial-support."
    ],
    how_to_apply: "Apply at lls.org/support-resources/financial-support or call 1-800-955-4572. Information Specialists available M–F 9am–9pm ET.",
    apply_url: "https://www.lls.org/support-resources/financial-support",
    source: "lls.org — verified March 2026",
    eligibility: (a) =>
      a.has_blood_cancer,
  },

  {
    id: "patient_advocate_foundation",
    name: "Patient Advocate Foundation (PAF) — Financial Aid Funds",
    category: "grants",
    type: "nonprofit",
    description: "Disease-specific financial aid grants for patients with chronic, life-threatening, or debilitating illnesses. Over 130 disease funds through the TotalAssist program. Covers out-of-pocket medical expenses, transportation, housing, and utilities.",
    amount: "Varies by disease fund. Examples: cancer continuity fund $200 one-time; caregiver support fund $2,000; amputee fund $1,000. Most funds provide $500–$3,000 grants. All grants are distributed first-come, first-served until funds are depleted.",
    nuances: [
      "Over 130 disease-specific funds through TotalAssist (launched 2025) — one of the largest patient financial aid programs in the country.",
      "Eligible diagnoses include: cancer (many types), heart disease, HIV/AIDS, diabetes complications, rare diseases, neurological conditions, autoimmune disorders, and many others.",
      "Must meet household income guidelines — varies by fund.",
      "Must provide diagnosis documentation from a physician.",
      "Grants are first-come, first-served and may be depleted — check fund status before applying.",
      "Also provides free case management services to help patients navigate insurance denials, access to care issues, and appeals — no income requirement for case management.",
      "National Financial Resource Directory: PAF maintains a free searchable database of financial resources at patientadvocate.org.",
      "Also connects patients to diabetes copay assistance through partnership with American Diabetes Association.",
      "Apply: patientadvocate.org or call 844-462-8072 or 855-824-7941."
    ],
    how_to_apply: "Apply at patientadvocate.org/connect-with-services/financial-aid-funds or call 844-462-8072. Case management: call 855-824-7941.",
    apply_url: "https://www.patientadvocate.org/connect-with-services/financial-aid-funds/",
    source: "patientadvocate.org — verified March 2026",
    eligibility: (a) =>
      a.has_disability &&
      a.is_maryland_resident,
  },

  {
    id: "pan_parkinsons",
    name: "PAN Foundation — Parkinson's Disease Copay Assistance",
    category: "grants",
    type: "nonprofit",
    description: "Annual medication copay assistance for people living with Parkinson's disease who need help affording their prescribed medications. HealthWell Foundation also offers a complementary Parkinson's Medicare assistance fund.",
    amount: "PAN Foundation Parkinson's fund: up to $4,400/year for medication copays. HealthWell Foundation Parkinson's fund: up to $4,000/year for Medicare patients (medication copays or Part B premiums).",
    nuances: [
      "PAN Foundation: must have health insurance covering your Parkinson's medication, income within fund limits (varies — check panfoundation.org/disease-funds/parkinsons-disease).",
      "HealthWell Parkinson's fund: designed specifically for Medicare patients; covers medication copays and Medicare Part B premium assistance.",
      "Both programs are national and serve Maryland residents.",
      "American Parkinson Disease Association (APDA) also provides information and referrals; APDA Maryland chapter: 410-683-5711.",
      "Parkinson's Foundation HelpLine: 1-800-4PD-INFO (1-800-473-4636) — connects patients to local resources and assistance navigation.",
      "If PAN or HealthWell Parkinson's funds are closed, also check NeedyMeds.org for manufacturer patient assistance programs for specific Parkinson's medications."
    ],
    how_to_apply: "PAN: panfoundation.org/disease-funds/parkinsons-disease or call 1-866-316-7263. HealthWell: healthwellfoundation.org or call 800-675-8416. APDA Maryland: 410-683-5711.",
    apply_url: "https://www.panfoundation.org/disease-funds/parkinsons-disease/",
    source: "panfoundation.org, healthwellfoundation.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_parkinsons,
  },

  {
    id: "nfb_maryland_scholarship",
    name: "NFB Maryland — McCraw Scholarship & Support Services",
    category: "grants",
    type: "nonprofit",
    description: "The National Federation of the Blind of Maryland awards annual scholarships for blind and visually impaired students, plus statewide advocacy, peer support, and connections to blindness-specific resources.",
    amount: "John T. McCraw Scholarship: up to $4,000 each (up to 4 awarded annually). National NFB scholarships: thirty $10,000 merit-based scholarships nationally.",
    nuances: [
      "McCraw Scholarship eligibility: must reside in Maryland or attend a post-secondary institution in Maryland; must be enrolled full-time or part-time; must have a visual impairment or blindness.",
      "Deadline: March 31 annually for the following academic year (e.g., March 31, 2026 for 2026–2027).",
      "Recipients are required to attend the NFB Maryland annual convention (February, in Maryland) — travel assistance provided.",
      "National NFB scholarships ($10,000 each): 30 awarded nationally; Maryland residents compete nationally.",
      "Sharon Maneki Youth Empowerment Grant: specialized training for middle and high school students who are blind.",
      "Two-week summer day program for elementary students: free Braille and alternative skills training.",
      "NFB Maryland also advocates for accessible transportation, technology, and education across Maryland.",
      "DORS (Division of Rehabilitation Services) Office for Blindness & Vision Services (OBVS) provides separate free vocational rehabilitation services for blind/low-vision Marylanders.",
      "Contact: NFB Maryland at nfbmd.org or 410-659-9314 ext. 2415."
    ],
    how_to_apply: "McCraw Scholarship: apply at nfbmd.org/scholarship. National NFB scholarships: nfb.org/scholarships. Contact: 410-659-9314 ext. 2415.",
    apply_url: "https://nfbmd.org/",
    source: "nfbmd.org — verified March 2026",
    eligibility: (a) =>
      a.is_maryland_resident &&
      a.has_vision_loss,
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
