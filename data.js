// Teacher salary data for Australian public school systems.
// All figures are base FTE in AUD, excluding superannuation, allowances, and loadings.
// "Top-of-scale classroom teacher" = highest step reachable without promotion to
// Highly Accomplished Teacher (HAT), Lead Teacher (LT), or an executive/leadership role.
// Graduate = step 1 of the entry-level classroom teacher classification.
//
// Schedules include every rate change from 2022-01-01 onwards plus all agreed future
// increases, spanning the current EA and any prior EA(s) in force during that window.
// Initial sources accessed 2026-04-17; refresh on 2026-05-18 captured the in-principle
// VGSA 2026 (VIC), endorsed EB11 (QLD), and ratified Teachers Agreement 2026 (TAS).
//
// Phase 1 additions (2026-05-18):
//   - sources[].id      — stable identifier, format "<lowercode>-src-<n>"
//   - verifiedOn        — per jurisdiction; max of sources[*].accessed
//   - schedule[].sourceId — points to the source that documents that salary figure
//   - window.CHANGELOG  — running log of material data changes

window.DATA_AS_OF = "2026-05-19";

window.SALARY_DATA = [

  // =============================== NSW ===============================
  {
    code: "NSW",
    name: "New South Wales",
    system: "NSW Department of Education",
    verifiedOn: "2026-05-18",
    ea: {
      name: "Crown Employees (Teachers in Schools and Related Employees) Salaries and Conditions Award 2024",
      status: "current",
      commenced: "2024-10-09",
      expires: "2027-10-08",
      published: "2024-11-26",
      notes: "NSW IRC award (not a Fair Work EA). Delivers three 3% annual increases plus 3% on allowances and a $1,000 CPI-triggered lump sum. Follows the 2022 Award (as varied 9 Oct 2023) which delivered the major 'catch-up' structural reset — classifications changed from Band 1/2/3 to Step 1–7 + HALT, and graduate pay jumped ~12% overnight."
    },
    graduate: {
      classification: "Classroom Teacher Step 1 (Graduate accreditation). Pre-9 Oct 2023: Band 1 (Graduate).",
      schedule: [
        { date: "2022-01-01", salary: 73737,  increase: "+2.04% (Band 1, 2022 Award)",         sourceId: "nsw-src-3" },
        { date: "2022-07-01", salary: 73921,  increase: "+0.25%",                               sourceId: "nsw-src-3" },
        { date: "2023-01-01", salary: 75791,  increase: "+2.53%",                               sourceId: "nsw-src-3" },
        { date: "2023-10-09", salary: 85000,  increase: "+12.2% — Band→Step restructure",       sourceId: "nsw-src-2" },
        { date: "2024-10-09", salary: 87550,  increase: "+3.0% (new 2024 Award)",               sourceId: "nsw-src-1" },
        { date: "2025-10-09", salary: 90177,  increase: "+3.0%",                                sourceId: "nsw-src-1" },
        { date: "2026-10-09", salary: 92882,  increase: "+3.0%",                                sourceId: "nsw-src-4" }
      ]
    },
    top: {
      classification: "Classroom Teacher Step 7 (Proficient accreditation). Pre-9 Oct 2023: Band 2.3. HALT above this requires separate NESA accreditation.",
      schedule: [
        { date: "2022-01-01", salary: 109978, increase: "+2.04% (Band 2.3, 2022 Award)",        sourceId: "nsw-src-3" },
        { date: "2022-07-01", salary: 110253, increase: "+0.25%",                               sourceId: "nsw-src-3" },
        { date: "2023-01-01", salary: 113042, increase: "+2.53%",                               sourceId: "nsw-src-3" },
        { date: "2023-10-09", salary: 122100, increase: "+8.0% — Band→Step restructure",        sourceId: "nsw-src-2" },
        { date: "2024-10-09", salary: 125763, increase: "+3.0% (new 2024 Award)",               sourceId: "nsw-src-1" },
        { date: "2025-10-09", salary: 129536, increase: "+3.0%",                                sourceId: "nsw-src-1" },
        { date: "2026-10-09", salary: 133422, increase: "+3.0%",                                sourceId: "nsw-src-4" }
      ]
    },
    sources: [
      {
        id: "nsw-src-1",
        url: "https://education.nsw.gov.au/content/dam/main-education/industrial-relations/media/documents/awards/Teachers_Award_2024.pdf",
        accessed: "2026-05-18",
        published: "2024-11-26",
        usedFor: "2024 Award text: commencement, expiry, Schedule 1A salary figures, classification labels"
      },
      {
        id: "nsw-src-2",
        url: "https://education.nsw.gov.au/content/dam/main-education/industrial-relations/media/documents/awards/teachers-award/Teachers_Award_Variation_10_Nov_23.pdf",
        accessed: "2026-04-17",
        published: "2023-11-10",
        usedFor: "2022 Award variation gazetted 10 Nov 2023: Step 1/Step 7 rates from 9 Oct 2023; classification restructure"
      },
      {
        id: "nsw-src-3",
        url: "https://education.nsw.gov.au/content/dam/main-education/industrial-relations/media/documents/awards/teachers-award-2022.pdf",
        accessed: "2026-04-17",
        published: "2022-12-23",
        usedFor: "2022 Award original: Band 1 and Band 2.3 rates at 1 Jan 2022, 1 Jul 2022, 1 Jan 2023"
      },
      {
        id: "nsw-src-4",
        url: "https://education.nsw.gov.au/teach-nsw/explore-teaching/salary-of-a-teacher",
        accessed: "2026-05-18",
        published: "2025-12-09",
        usedFor: "Confirmation of current and scheduled future rates including Oct 2026"
      },
      {
        id: "nsw-src-5",
        url: "https://www.nswtf.org.au/news/2024/12/12/significant-gains-for-school-members/",
        accessed: "2026-04-17",
        published: "2024-12-12",
        usedFor: "Ratification vote, CPI-triggered lump sum, allowance indexation"
      }
    ]
  },

  // =============================== VIC ===============================
  {
    code: "VIC",
    name: "Victoria",
    system: "Victorian Department of Education",
    verifiedOn: "2026-05-18",
    ea: {
      name: "Victorian Government Schools Agreement 2022 (VGSA 2022)",
      status: "expired-in-negotiation",
      commenced: "2022-07-25",
      expires: "2025-12-31",
      published: "2022-07-18",
      notes: "Nominally expired 31 Dec 2025. **In-principle VGSA 2026 reached** and endorsed by AEU Joint Primary and Secondary Sector Council on 15 May 2026 — pending member ballot. Ballot timeline (per AEU Vic): in-person regional meetings over four weeks from Tuesday 19 May 2026, online statewide briefings as alternative, online member vote in the week of 15–18 June 2026 (close 18 June 2026, result communicated shortly after). 39% of delegates voted against endorsement at the 15 May council, so the all-staff ballot is not a foregone conclusion. Headline: 28.3% over 4 years for teachers and principals, beginning with a ~12% combined rise by October 2026 that includes structural adjustments at entry and top steps (+$12,343 for graduate, bringing T1-1 into line with NSW; +$15,393 for T2-6, taking it ahead of NSW). Top of scale to reach $151,419 by 2029. Until member ratification, VGSA 2022 remains legally operative; the schedule entries from Oct 2026 onwards reflect the in-principle deal and are subject to change. Prior path: AEU claim 35% / 3 yrs; government offer of 17% / 4 yrs tabled 17 Mar 2026 was rejected, triggering the first state-wide teacher strike in 13 years on 24 Mar 2026."
    },
    graduate: {
      classification: "Classroom Teacher Range 1 Subdivision 1 (T1-1)",
      schedule: [
        { date: "2022-01-01", salary: 74234,  increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2022-07-01", salary: 74976,  increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2023-01-01", salary: 75726,  increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2023-07-01", salary: 76484,  increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2024-01-01", salary: 77248,  increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2024-07-01", salary: 78021,  increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2025-01-01", salary: 78801,  increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2025-07-01", salary: 79589,  increase: "+1.0%",                                                                   sourceId: "vic-src-3" },
        { date: "2026-10-01", salary: 91932,  increase: "+15.5% structural — in-principle VGSA 2026, aligns graduate with NSW (pending ratification)", sourceId: "vic-src-6" },
        { date: "2027-10-01", salary: 95885,  increase: "+4.3% projected (in-principle VGSA 2026)",                                sourceId: "vic-src-6" },
        { date: "2028-10-01", salary: 100008, increase: "+4.3% projected",                                                         sourceId: "vic-src-6" },
        { date: "2029-10-01", salary: 104309, increase: "+4.3% projected",                                                         sourceId: "vic-src-6" }
      ]
    },
    top: {
      classification: "Classroom Teacher Range 2 Subdivision 6 (T2-6). Range 1 → Range 2 requires VIT Full (Proficient) registration plus Range 2 work-value criteria; within Range 2, each annual subdivision increment (2-1 → 2-6) requires a satisfactory Performance & Development review plus ≥6 months at the subdivision — not pure time-served. Learning Specialist and Leading Teacher classifications above T2-6 are promotion positions.",
      schedule: [
        { date: "2022-01-01", salary: 110119, increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2022-07-01", salary: 111221, increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2023-01-01", salary: 112333, increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2023-07-01", salary: 113456, increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2024-01-01", salary: 114591, increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2024-07-01", salary: 115737, increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2025-01-01", salary: 116894, increase: "+1.0%",                                                                   sourceId: "vic-src-1" },
        { date: "2025-07-01", salary: 118063, increase: "+1.0%",                                                                   sourceId: "vic-src-3" },
        { date: "2026-10-01", salary: 133456, increase: "+13.0% structural — in-principle VGSA 2026 (pending ratification)",        sourceId: "vic-src-6" },
        { date: "2027-10-01", salary: 139193, increase: "+4.3% projected",                                                         sourceId: "vic-src-6" },
        { date: "2028-10-01", salary: 145178, increase: "+4.3% projected",                                                         sourceId: "vic-src-6" },
        { date: "2029-10-01", salary: 151419, increase: "+4.3% — endpoint per AEU statement (in-principle VGSA 2026)",             sourceId: "vic-src-5" }
      ]
    },
    sources: [
      {
        id: "vic-src-1",
        url: "https://news.aeuvic.asn.au/app/uploads/2022/02/T122_VGSA_SalaryTables.pdf",
        accessed: "2026-04-17",
        published: "2022-02-01",
        usedFor: "Full VGSA 2022 salary schedule (T1-1 through T2-6) across every effective date"
      },
      {
        id: "vic-src-2",
        url: "https://www2.education.vic.gov.au/pal/remuneration-teaching-service/print-all",
        accessed: "2026-04-17",
        published: "2025-09-08",
        usedFor: "Confirmation VGSA 2022 is the applicable agreement; annual progression rules"
      },
      {
        id: "vic-src-3",
        url: "https://www.aeuvic.asn.au/sites/default/files/2025-07/Report%20on%20Comparative%20Salaries%20for%20Victorian%20and%20NSW%20public%20school%20staff%20in%202025%202026.pdf",
        accessed: "2026-04-17",
        published: "2025-07-01",
        usedFor: "Confirmation $79,589 / $118,063 remain the applicable 2026 rates"
      },
      {
        id: "vic-src-4",
        url: "https://www.theeducatoronline.com/k12/news/completely-unacceptable-school-staff-to-walk-off-the-job-in-victoria/288857",
        accessed: "2026-04-17",
        published: "not stated",
        usedFor: "March 2026 offer terms, rejection, and strike action"
      },
      {
        id: "vic-src-5",
        url: "https://www.aeuvic.asn.au/significant-pay-and-conditions-boost-victorian-public-school-and-early-childhood-staff",
        accessed: "2026-05-18",
        published: "2026-05-15",
        usedFor: "AEU statement on in-principle VGSA 2026: 28.3% over 4 years, structural adjustments at entry and top, member ballot timeline"
      },
      {
        id: "vic-src-6",
        url: "https://www.premier.vic.gov.au/labor-will-pay-our-teachers-best-country",
        accessed: "2026-05-18",
        published: "2026-05-15",
        usedFor: "Premier's statement: 12% by Oct 2026; T2-6 to $151,419 by 2029; graduate +$12,343 / top +$15,393 in Oct 2026 structural rises"
      }
    ]
  },

  // =============================== QLD ===============================
  {
    code: "QLD",
    name: "Queensland",
    system: "Queensland Department of Education",
    verifiedOn: "2026-05-19",
    ea: {
      name: "Department of Education State School Teachers' Certified Agreement 2022",
      status: "expired-in-negotiation",
      commenced: "2022-07-01",
      expires: "2025-06-30",
      published: "2022-12-01",
      notes: "**CA 2022 nominally expired 30 Jun 2025**; remains operative pending a successor agreement. EB11 negotiations: October 2025 ballot rejected by teachers; the teachers' agreement is currently in **QIRC arbitration**. A separate EB11 tranche covering school support staff (teacher aides) was certified 13 Mar 2026 — earlier versions of this dataset incorrectly conflated that with the teachers' agreement. The proposed structural change to the graduate starting rate (one pay-point uplift to $90,833) was part of the *rejected* teachers' offer and is **not** in effect; graduate teachers remain on Band 2 Step 1. Earlier versions of this dataset also incorrectly used Band 1 Step 1 (the 3-year-trained scale) for graduate teachers — Band 2 Step 1 is the correct 4-year-trained graduate classification. Prior agreement: DoE State School Teachers' CA 2019."
    },
    graduate: {
      classification: "Band 2 Step 1 (4-year-trained graduate entry). Band 1 is the 3-year-trained scale and does not apply to teachers with a four-year degree. Progression Band 2 → Senior Teacher → Experienced Senior Teacher 1 → Experienced Senior Teacher 2 is step-based, with each post-Band-2 step requiring Proficient accreditation plus an Annual Performance Review.",
      schedule: [
        { date: "2022-07-01", salary: 78490, increase: "Band 2 Step 1 under new 2022 CA",                       sourceId: "qld-src-3" },
        { date: "2023-07-01", salary: 81628, increase: "+4.0%",                                                 sourceId: "qld-src-3" },
        { date: "2024-07-01", salary: 84078, increase: "+3.0% (final scheduled increase under CA 2022)",         sourceId: "qld-src-3" }
      ]
    },
    top: {
      classification: "Experienced Senior Teacher Step 2 (EST2, created 20 Jan 2022). Progression is Band 1 → Senior Teacher → EST1 → EST2; each post-Band-1 step requires Proficient accreditation plus an Annual Performance Review with principal verification (the EST2 step uses HAT descriptors to inform the discussion), but unlike ST it carries no personal undertaking. Senior/Experienced Senior Teacher classifications are increment steps, not promotion positions. If HAT/LT certification lapses, teachers revert to EST2 — confirming it as the top of the classroom-teacher scale.",
      schedule: [
        { date: "2022-01-01", salary: 108766, increase: "Experienced Senior Teacher Step 1 — Step 2 not yet in existence", sourceId: "qld-src-2" },
        { date: "2022-01-20", salary: 110500, increase: "new Step 2 classification created",                              sourceId: "qld-src-2" },
        { date: "2022-07-01", salary: 114921, increase: "+4.0% (new 2022 CA)",                                            sourceId: "qld-src-3" },
        { date: "2023-07-01", salary: 119518, increase: "+4.0%",                                                          sourceId: "qld-src-3" },
        { date: "2024-07-01", salary: 123102, increase: "+3.0%",                                                          sourceId: "qld-src-3" }
      ]
    },
    sources: [
      {
        id: "qld-src-1",
        url: "https://www.qirc.qld.gov.au/sites/default/files/2022-12/2022_cb135.pdf",
        accessed: "2026-04-17",
        published: "2022-12-01",
        usedFor: "2022 CA text: name, commencement, nominal expiry"
      },
      {
        id: "qld-src-2",
        url: "https://www.qirc.qld.gov.au/sites/default/files/2019_cb101.pdf",
        accessed: "2026-04-17",
        published: "2019-11-19",
        usedFor: "2019 CA: Schedule 1 Band 1 and EST rates carrying into early 2022; Step 2 creation footnote"
      },
      {
        id: "qld-src-3",
        url: "https://www.qtu.asn.au/salaries-CA2022",
        accessed: "2026-05-19",
        published: "2023-01-19",
        usedFor: "Full CA 2022 salary schedule: Band 2 Step 1 (graduate, 4-year-trained), Senior Teacher, Experienced Senior Teacher 1 & 2 — every effective date 1 Jul 2022 / 2023 / 2024"
      },
      {
        id: "qld-src-4",
        url: "https://alt-qed.qed.qld.gov.au/working-with-us/delivering-for-queensland-teachers/eb-updates",
        accessed: "2026-04-17",
        published: "2025-11-18",
        usedFor: "EB11 negotiation timeline, ballot failure, arbitration referral"
      },
      {
        id: "qld-src-5",
        url: "https://statements.qld.gov.au/statements/104690",
        accessed: "2026-05-19",
        published: "2026-03-13",
        usedFor: "Ministerial statement of 13 Mar 2026: refers to the EB11 **support-staff (teacher aide) tranche** certification, not the teachers' agreement. The teachers' EB11 was rejected at the October 2025 ballot and is in QIRC arbitration. Retained as evidence of the rejected offer's structural terms (graduate +pay-point to $90,833, EST3 from Jul 2027) — none of which are in effect for teachers."
      }
    ]
  },

  // =============================== WA ================================
  {
    code: "WA",
    name: "Western Australia",
    system: "Western Australian Department of Education",
    verifiedOn: "2026-05-19",
    ea: {
      name: "School Education Act Employees' (Teachers and Administrators) General Agreement 2023",
      status: "current",
      commenced: "2024-09-09",
      expires: "2026-12-05",
      published: "2024-11-04",
      notes: "Registered at WAIRC 4 Nov 2024 with pay increases of 5% / 4% / 3% applied retrospectively from 6 Dec 2023. Final scheduled increase took effect 6 Dec 2025. Successor bargaining: 2026 Log of Claims development was opened by SSTUWA in late 2025 (per September 2025 Western Teacher); no successor offer tabled and no new EA as of 19 May 2026. Nominal expiry 5 Dec 2026 still upcoming. **Top-of-scale methodology**: this comparison uses Senior Teacher Classification 2 (ST2), introduced under the 2023 General Agreement effective 6 Dec 2023. ST2 entry requires 12 months at ST1 plus agreement to perform two senior-teacher duties; ST1 entry requires full TRBWA registration, 12 months at the top L2 increment, and one of five Senior Teacher Pathways (PD portfolio, postgraduate qualification, prior equivalent role, mentor role, or HALT certification). Competency-based but not particularly rigorous — broadly comparable in process to SA's Tier 9. Level 3 Classroom Teacher (L3CT) sits above as a portfolio-gated advanced classification (Dec 2025: L3.1 $137,567 / L3.2 $141,551) and Level 3.3 ($147,077) is a role-contingent classification at 'identified schools in need'; both excluded as promotion-equivalent. Pre-Dec 2023 there was no ST2 — single-tier Senior Teacher rates under the 2021 EA are shown for historical continuity. Prior agreement: 2021 General Agreement (registered 2 Aug 2022, delivered $3,130 flat increases)."
    },
    graduate: {
      classification: "Level 2.1 (four-year-trained graduate entry)",
      schedule: [
        { date: "2022-01-01", salary: 75267,  increase: "retrospective rate under 2021 EA (backdated to 6 Dec 2021)", sourceId: "wa-src-2" },
        { date: "2022-12-06", salary: 78397,  increase: "+4.2% ($3,130 flat) under 2021 EA",                          sourceId: "wa-src-2" },
        { date: "2023-12-06", salary: 82317,  increase: "+5.0% under 2023 EA (calculated)",                           sourceId: "wa-src-1" },
        { date: "2024-12-06", salary: 85610,  increase: "+4.0% (calculated)",                                         sourceId: "wa-src-1" },
        { date: "2025-12-06", salary: 88178,  increase: "+3.0%",                                                      sourceId: "wa-src-1" }
      ]
    },
    top: {
      classification: "Senior Teacher Classification 2 (ST2) — introduced under the 2023 General Agreement effective 6 Dec 2023. Progression ST1 → ST2 requires 12 months Continuous Service at ST1 plus agreement to perform two senior-teacher duties (one of which may be contributing to system or school workload reduction initiatives). ST1 eligibility requires full TRBWA registration, 12 months at the top L2 increment, and demonstration via one of five Senior Teacher Pathways. Competency-based but not strictly rigorous — broadly comparable in process to SA's Tier 9. Level 3 Classroom Teacher (L3CT) is a separate portfolio-gated advanced classification (L3.1 / L3.2) with stricter requirements (written evidence against five L3CT competencies + 45-minute oral); L3.3 is role-contingent. Both L3CT and L3.3 excluded as promotion-equivalent. Pre-Dec 2023 there was no ST2 — single-tier Senior Teacher rate (the pre-existing top of the senior pathway under the 2021 EA) is shown for historical continuity.",
      schedule: [
        { date: "2022-01-01", salary: 114724, increase: "Senior Teacher (single-tier) under 2021 EA — pre +$3,130 flat. ST2 had not yet been created.", sourceId: "wa-src-2" },
        { date: "2022-12-06", salary: 117854, increase: "+$3,130 flat under 2021 EA",                                                                   sourceId: "wa-src-2" },
        { date: "2023-12-06", salary: 125247, increase: "ST2 created under 2023 EA — split from single-tier Senior Teacher, set $1,500 above ST1's +5% rate ($123,747)", sourceId: "wa-src-1" },
        { date: "2024-12-06", salary: 130257, increase: "+4.0% (ST2)",                                                                                  sourceId: "wa-src-1" },
        { date: "2025-12-06", salary: 134165, increase: "+3.0% (ST2)",                                                                                  sourceId: "wa-src-1" }
      ]
    },
    sources: [
      {
        id: "wa-src-1",
        url: "https://downloads.wairc.wa.gov.au/agreements/sch013.pdf",
        accessed: "2026-05-19",
        published: "2024-11-04",
        usedFor: "2023 EA registered text (canonical); clause 14 Senior Teachers and Table 7 salary schedule for ST1 and ST2 (introduced 6 Dec 2023)"
      },
      {
        id: "wa-src-2",
        url: "https://downloads.wairc.wa.gov.au/agreements/sch012.pdf",
        accessed: "2026-04-17",
        published: "2022-08-02",
        usedFor: "2021 EA: Schedule A — Level 2.1 graduate rate and pre-ST2 single-tier Senior Teacher rate at 6 Dec 2021 and 6 Dec 2022"
      },
      {
        id: "wa-src-3",
        url: "https://www.sstuwa.org.au/WesternTeacher/2025/volume-542-march-2025/time-reap-eba-rewards",
        accessed: "2026-05-18",
        published: "2025-03-01",
        usedFor: "2023 EA: agreement name, registration date, 5%/4%/3% increase schedule"
      },
      {
        id: "wa-src-4",
        url: "https://www.wa.gov.au/government/media-statements/Cook-Labor-Government/Teachers-receive-pay-rise-as-part-of-big-investment-into-education-20240705",
        accessed: "2026-04-17",
        published: "2024-07-05",
        usedFor: "Government statement of 12% over three years, 5/4/3 structure"
      }
    ]
  },

  // =============================== SA ================================
  {
    code: "SA",
    name: "South Australia",
    system: "South Australian Department for Education",
    verifiedOn: "2026-05-18",
    ea: {
      name: "South Australian School and Preschool Education Staff Enterprise Agreement 2024",
      status: "current",
      commenced: "2024-03-25",
      expires: "2027-03-24",
      published: "2024-03-25",
      notes: "36-month nominal life delivering 4% (backdated to May 2023) + 3% + 3% + 3% for teachers. The final scheduled 3% rise should have taken effect first full pay period on or after 1 May 2026 (i.e. 4 May 2026). 2026-05-18: SA Department for Education school-teachers-pay-rates.pdf returned HTTP 403 during this refresh, and the AEU SA salary rates page was also unreachable — May 2026 figures here ($84,971 / $123,236) are computed from the announced 3% increase and remain unverified against the official rate sheet; flag for human re-check. Prior agreement: SA School and Preschool Education Staff EA 2020."
    },
    graduate: {
      classification: "Teacher Tier 1 (permanent, 4-year-trained). Pre-2024 EA: Step 1 (same 9-step scale, relabelled as 'Tier' in the 2024 EA).",
      schedule: [
        { date: "2022-01-01", salary: 73052,  increase: "Step 1 — rate from 2020 EA (+2.35% eff May 2021)", sourceId: "sa-src-2" },
        { date: "2022-05-02", salary: 74769,  increase: "+2.35% (final 2020 EA rise)",                       sourceId: "sa-src-2" },
        { date: "2023-05-08", salary: 77760,  increase: "+4.0% (first 2024 EA rise, backdated)",             sourceId: "sa-src-3" },
        { date: "2024-05-06", salary: 80093,  increase: "+3.0%",                                             sourceId: "sa-src-3" },
        { date: "2025-05-09", salary: 82496,  increase: "+3.0%",                                             sourceId: "sa-src-3" },
        { date: "2026-05-04", salary: 84971,  increase: "+3.0% (final 2024 EA rise; rate sheet inaccessible 2026-05-18)", sourceId: "sa-src-1" }
      ]
    },
    top: {
      classification: "Teacher Tier 9. Tiers 1–8 are automatic annual progression; Tier 9 is competency-based — teachers apply after reaching Tier 8 and must demonstrate the required competencies. Pre-2024 EA: Step 9 (same arrangement). Advanced Skills Teacher (AST1 ~$124,076) requires a separate formal selection/portfolio process above this.",
      schedule: [
        { date: "2022-01-01", salary: 105951, increase: "Step 9 — rate from 2020 EA",                        sourceId: "sa-src-2" },
        { date: "2022-05-02", salary: 108441, increase: "+2.35% (final 2020 EA rise)",                       sourceId: "sa-src-2" },
        { date: "2023-05-08", salary: 112779, increase: "+4.0% (first 2024 EA rise, backdated)",             sourceId: "sa-src-3" },
        { date: "2024-05-06", salary: 116162, increase: "+3.0%",                                             sourceId: "sa-src-3" },
        { date: "2025-05-09", salary: 119647, increase: "+3.0%",                                             sourceId: "sa-src-3" },
        { date: "2026-05-04", salary: 123236, increase: "+3.0% (final 2024 EA rise; rate sheet inaccessible 2026-05-18)", sourceId: "sa-src-1" }
      ]
    },
    sources: [
      {
        id: "sa-src-1",
        url: "https://www.saet.sa.gov.au/app/uploads/2024/03/ET-24-00640-Enterprise-agreement-approval-South-Australian-School-and-Preschool-Education-Staff-Enterprise-Agreement-2024.pdf",
        accessed: "2026-04-17",
        published: "2024-03-25",
        usedFor: "2024 EA SAET approval order: name, commencement, nominal life"
      },
      {
        id: "sa-src-2",
        url: "https://www.saet.sa.gov.au/app/uploads/2020/04/South-Australian-School-and-Preschool-Education-Staff-Enterprise-Agreement-2020-1.pdf",
        accessed: "2026-04-17",
        published: "2020-04-07",
        usedFor: "2020 EA Schedule 1 Teacher wages table carrying into 2022 and ending May 2022"
      },
      {
        id: "sa-src-3",
        url: "https://www.education.sa.gov.au/docs/p-and-c/employee-relations-awards-and-agreements/school-teachers-pay-rates.pdf",
        accessed: "2026-04-17",
        published: "2025-05-09",
        usedFor: "Current rate sheet anchor for Tier 1/Tier 9 reverse-verifying 2023/2024 figures"
      },
      {
        id: "sa-src-4",
        url: "https://premier.sa.gov.au/media-releases/news-archive/overwhelming-support-for-$1.6-billion-ea",
        accessed: "2026-04-17",
        published: "2024-03-01",
        usedFor: "Headline schedule of 4% backdated + 3% annual increases for teachers"
      }
    ]
  },

  // =============================== TAS ===============================
  {
    code: "TAS",
    name: "Tasmania",
    system: "Tasmanian Department for Education, Children and Young People (DECYP)",
    verifiedOn: "2026-05-19",
    ea: {
      name: "Teachers Agreement 2026 (alongside Teaching Service (Tasmanian Public Sector) Award S197)",
      status: "current",
      commenced: "2026-04-26",
      expires: "2029-03-01",
      published: "2026-04-26",
      notes: "**Teachers Agreement 2026 ratified 26 Apr 2026** — 72% of AEU Tas members accepted the deal after rolling 24-hour strikes through late March / early April. Delivers 3% / 3% / 2.75% pay rises from the first full pay period in March 2026, March 2027 and March 2028; first rise backdated. Additional: $500 lump added to Band 1 Level 13 base salary BEFORE the first rise (compounds with subsequent rises); new $300/yr Professional Learning allowance for Band 1 L13 and ESS Level 4; meeting-hour caps (80 hrs in 2026, 60 hrs from 2027); 5 days reproductive leave; DV leave expanded 20→25 days; 5 'personal impact days'. Prior agreement: Teachers Agreement 2023 (nominally expired 19 Sep 2025). TAS rate changes operate from the first full pay period commencing on or after 1 March each year. **Top-of-scale methodology**: this comparison uses Advanced Skills Teacher Band 2 Level 3 (AST) — verified current rate $125,464 per the DECYP Salary Scales (23 Mar 2026). AST historical rates pre-Mar-2026 are calculated by applying the same Band 1 EA % rises and should be re-verified against archived salary scales if precision matters; the current snapshot rate is canonical."
    },
    graduate: {
      classification: "Teacher Band 1 Level 5 (4-year-trained graduate entry)",
      schedule: [
        { date: "2022-01-01", salary: 72725,  increase: "rate from 2021 EA (+2.35% eff Mar 2021)",            sourceId: "tas-src-2" },
        { date: "2022-03-03", salary: 74434,  increase: "+2.35% (final 2021 EA rise)",                        sourceId: "tas-src-2" },
        { date: "2023-03-02", salary: 78074,  increase: "+4.89% (first 2023 EA rise)",                        sourceId: "tas-src-1" },
        { date: "2024-02-29", salary: 80416,  increase: "+3.0%",                                              sourceId: "tas-src-1" },
        { date: "2025-02-27", salary: 82828,  increase: "+3.0% (final 2023 EA rise)",                         sourceId: "tas-src-1" },
        { date: "2026-03-05", salary: 85313,  increase: "+3.0% (first 2026 EA rise, backdated)",              sourceId: "tas-src-6" },
        { date: "2027-03-04", salary: 87872,  increase: "+3.0%",                                              sourceId: "tas-src-6" },
        { date: "2028-03-02", salary: 90289,  increase: "+2.75% (final scheduled)",                           sourceId: "tas-src-6" }
      ]
    },
    top: {
      classification: "Advanced Skills Teacher Band 2 Level 3 (AST). Selection-based, requires demonstration of advanced classroom-teaching practice; sits above Band 1 Level 13 as the top classroom-teacher classification. Distinct from leadership classifications (Assistant Principal Band 3, Principal). Band 1 Level 13 (Mar 2026 rate: $122,393) is the top of the standard scale below AST. Earlier versions of this dataset used Band 1 Level 13 — corrected 2026-05-19 to align with cross-jurisdictional top-of-scale methodology.",
      schedule: [
        { date: "2022-01-01", salary: 107381, increase: "AST under 2021 EA (calculated — applies Band 1 L13 % rises backwards from verified Mar 2026 rate)", sourceId: "tas-src-1" },
        { date: "2022-03-03", salary: 109905, increase: "+2.35% (final 2021 EA rise, calculated)",            sourceId: "tas-src-1" },
        { date: "2023-03-02", salary: 114818, increase: "+4.47% (first 2023 EA rise, calculated)",            sourceId: "tas-src-1" },
        { date: "2024-02-29", salary: 118262, increase: "+3.0% (calculated)",                                 sourceId: "tas-src-1" },
        { date: "2025-02-27", salary: 121810, increase: "+3.0% (final 2023 EA rise, calculated)",             sourceId: "tas-src-1" },
        { date: "2026-03-05", salary: 125464, increase: "+3.0% (first 2026 EA rise, backdated — verified per DECYP scales 23 Mar 2026)", sourceId: "tas-src-1" },
        { date: "2027-03-04", salary: 129228, increase: "+3.0% (calculated, projected)",                      sourceId: "tas-src-6" },
        { date: "2028-03-02", salary: 132782, increase: "+2.75% (final scheduled, calculated)",               sourceId: "tas-src-6" }
      ]
    },
    sources: [
      {
        id: "tas-src-1",
        url: "https://publicdocumentcentre.education.tas.gov.au/library/Shared%20Documents/Salary-Scales.pdf",
        accessed: "2026-05-19",
        published: "2026-03-23",
        usedFor: "Current DECYP salary scales (23 Mar 2026): Teacher Band 1 Levels 1–13 and Advanced Skills Teacher Band 2 Level 3 ($125,464). Used as the canonical current rate; pre-2026 AST figures are calculated by applying the same Band 1 EA % rises."
      },
      {
        id: "tas-src-2",
        url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0009/778743/T15161-No-3-of-2024-Teaching-Service-Tasmanian-Public-Sector-Award-S197.pdf",
        accessed: "2026-04-17",
        published: "2024-08-14",
        usedFor: "Award S197 Order No 3 of 2024: consolidated Band 1 salary tables across 2020–2023"
      },
      {
        id: "tas-src-3",
        url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0004/710167/2023-TASIC-19-T15024-of-2023-Filing-of-the-Teachers-Agreement-2023.pdf",
        accessed: "2026-04-17",
        published: "2023-05-09",
        usedFor: "Filing decision: TA 2023 effective 20 Sep 2022, expiry 19 Sep 2025"
      },
      {
        id: "tas-src-4",
        url: "https://www.premier.tas.gov.au/latest-news/2026/march/second-wage-offer-put-to-tasmanian-teachers",
        accessed: "2026-04-17",
        published: "2026-03-01",
        usedFor: "Second government offer terms and rejection"
      },
      {
        id: "tas-src-5",
        url: "https://www.premier.tas.gov.au/latest-news/2026/april/teachers-secure-fair,-affordable-wage-agreement",
        accessed: "2026-05-18",
        published: "2026-04-27",
        usedFor: "Premier's confirmation of Teachers Agreement 2026 acceptance (26 Apr 2026), 3% / 3% / 2.75% pay rises"
      },
      {
        id: "tas-src-6",
        url: "https://aeutas.org.au/teachers-offer/",
        accessed: "2026-05-18",
        published: "2026-04-15",
        usedFor: "AEU TAS offer details: $500 lump for Band 1 L13 added to base before first rise; $300/yr Professional Learning allowance; March pay-period timing; meeting-hour caps and conditions improvements"
      }
    ]
  },

  // =============================== ACT ===============================
  {
    code: "ACT",
    name: "Australian Capital Territory",
    system: "ACT Education Directorate (ACT Public Service)",
    verifiedOn: "2026-05-18",
    ea: {
      name: "ACT Public Sector Education Directorate (Teaching Staff) Enterprise Agreement 2023–2026",
      status: "expired-in-negotiation",
      commenced: "2023-08-21",
      expires: "2026-03-31",
      published: "2023-08-14",
      notes: "Nominal expiry 31 March 2026 has now passed; the 2023–2026 EA continues to operate until replaced. Successor bargaining: initial offer 9 Dec 2025, improved offer 11 Mar 2026 (includes $1,250 cost-of-living payment, ~5.5% avg across classifications, super to 12.5%). As of 18 May 2026 the offer has not progressed to a ballot and no successor has been approved (per ACTPS bargaining portal and AEU ACT). Major restructure 27 Jan 2024: old Classroom Teacher 1–10 renamed to Teacher Level 1–8. New top step TL8 created 27 Jan 2025; CT10 holders progressed CT10 → TL7 → TL8. Prior agreement: 2018–2022 EA."
    },
    graduate: {
      classification: "Teacher Level 1 (TL1, New Educator). Pre-27 Jan 2024: Classroom Teacher 2.",
      schedule: [
        { date: "2022-01-01", salary: 75443,  increase: "CT2 — rate from 2018–2022 EA (+3.0% eff Jul 2021)", sourceId: "act-src-2" },
        { date: "2022-07-07", salary: 76575,  increase: "+1.5% (final 2018–2022 EA rise)",                    sourceId: "act-src-2" },
        { date: "2023-01-05", salary: 78325,  increase: "+$1,750 flat (first 2023–2026 EA rise)",             sourceId: "act-src-1" },
        { date: "2023-06-08", salary: 79108,  increase: "+1.0%",                                              sourceId: "act-src-1" },
        { date: "2023-12-07", salary: 80858,  increase: "+$1,750 flat",                                       sourceId: "act-src-1" },
        { date: "2024-01-27", salary: 84978,  increase: "CT→TL restructure",                                  sourceId: "act-src-1" },
        { date: "2024-06-06", salary: 86253,  increase: "+1.5%",                                              sourceId: "act-src-3" },
        { date: "2024-12-05", salary: 88615,  increase: "+1.0% + $1,500 flat",                                sourceId: "act-src-3" },
        { date: "2025-06-05", salary: 89501,  increase: "+1.0%",                                              sourceId: "act-src-3" },
        { date: "2025-12-04", salary: 91396,  increase: "+1.0% + $1,000 flat",                                sourceId: "act-src-3" }
      ]
    },
    top: {
      classification: "Teacher Level 8 (TL8, created 27 Jan 2025). Pre-27 Jan 2024: Classroom Teacher 10. 27 Jan 2024 to 26 Jan 2025: Teacher Level 7 (CT10 rate carried over under new label, then received EA increases).",
      schedule: [
        { date: "2022-01-01", salary: 112930, increase: "CT10 — rate from 2018–2022 EA",                      sourceId: "act-src-2" },
        { date: "2022-07-07", salary: 114624, increase: "+1.5% (final 2018–2022 EA rise)",                    sourceId: "act-src-2" },
        { date: "2023-01-05", salary: 116374, increase: "+$1,750 flat (first 2023–2026 EA rise)",             sourceId: "act-src-1" },
        { date: "2023-06-08", salary: 117538, increase: "+1.0%",                                              sourceId: "act-src-1" },
        { date: "2023-12-07", salary: 119288, increase: "+$1,750 flat",                                       sourceId: "act-src-1" },
        { date: "2024-01-27", salary: 119288, increase: "CT10 → TL7 (rename only)",                          sourceId: "act-src-1" },
        { date: "2024-06-06", salary: 121077, increase: "+1.5% (TL7)",                                        sourceId: "act-src-3" },
        { date: "2024-12-05", salary: 123788, increase: "+1.0% + $1,500 flat (TL7)",                         sourceId: "act-src-3" },
        { date: "2025-01-27", salary: 125582, increase: "new TL8 top step created",                          sourceId: "act-src-3" },
        { date: "2025-06-05", salary: 126838, increase: "+1.0%",                                              sourceId: "act-src-3" },
        { date: "2025-12-04", salary: 129106, increase: "+1.0% + $1,000 flat",                                sourceId: "act-src-3" }
      ]
    },
    sources: [
      {
        id: "act-src-1",
        url: "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0011/2231102/Education-Directorate-Teaching-Staff-Enterprise-Agreement-2023-2026.pdf",
        accessed: "2026-04-17",
        published: "2023-08-14",
        usedFor: "2023–2026 EA: clauses, Annex A pay tables (pre- and post-27-Jan-2024), CT→TL translation"
      },
      {
        id: "act-src-2",
        url: "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0004/1374637/ACT-Public-Sector-Education-Directorate-Teaching-Staff-Enterprise-Agreement-2018-2022-FINAL.pdf",
        accessed: "2026-04-17",
        published: "2019-08-14",
        usedFor: "2018–2022 EA: CT2 and CT10 rates at July 2021 and July 2022"
      },
      {
        id: "act-src-3",
        url: "https://www.aeuact.org.au/wp-content/uploads/2024/12/Teacher-2024-2025-payrise-explainer-with-increment-FAQ.pdf",
        accessed: "2026-04-17",
        published: "2024-12-01",
        usedFor: "TL1 through TL8 step-by-step dollar figures 2024–2025; TL8 creation"
      },
      {
        id: "act-src-4",
        url: "https://www.cmtedd.act.gov.au/employment-framework/for-employees/agreements/2025-enterprise-bargaining",
        accessed: "2026-04-17",
        published: "not stated",
        usedFor: "Successor EA bargaining status, offer dates"
      }
    ]
  },

  // =============================== NT ================================
  {
    code: "NT",
    name: "Northern Territory",
    system: "NT Department of Education (NT Public Sector)",
    verifiedOn: "2026-05-18",
    ea: {
      name: "Northern Territory Public Sector Educators' 2024–2027 Enterprise Agreement",
      status: "current",
      commenced: "2024-11-07",
      expires: "2027-12-31",
      published: "2024-10-31",
      notes: "Base figures EXCLUDE NT's remote/location loadings, Remote Incentive Allowance, housing subsidies, and HAT/LT allowances — these can add $15,000 to $30,000+ p.a. in remote settings. Delivers three 4.3% annual increases. Prior EAs (2017–2021 and 2021–2024) used a CT1–CT9 scale; the 2024 EA added a brand-new CT9 top step and restructured CT1, meaning the Oct 2024 'jump' reflects both the rise and the new top increment."
    },
    graduate: {
      classification: "Classroom Teacher 1 (CT1). Old-scale CT1 (pre-11 Oct 2024) had the same label but a lower value; the 2024 restructure added a $1,000 graduate uplift in addition to the 4.3% rise.",
      schedule: [
        { date: "2022-01-01", salary: 77047,  increase: "old CT1 — rate from 2017–2021 EA (+2.5% eff Oct 2020)", sourceId: "nt-src-2" },
        { date: "2023-02-16", salary: 81739,  increase: "back-pay event: two 3% rises (Oct 2021 & Oct 2022)",    sourceId: "nt-src-3" },
        { date: "2023-10-11", salary: 84191,  increase: "+3.0% (final old-EA rise)",                              sourceId: "nt-src-3" },
        { date: "2024-10-11", salary: 92215,  increase: "new CT1 + 4.3% + restructure (~+9.5%)",                 sourceId: "nt-src-1" },
        { date: "2026-01-01", salary: 96180,  increase: "+4.3%",                                                  sourceId: "nt-src-1" },
        { date: "2027-01-01", salary: 100316, increase: "+4.3%",                                                  sourceId: "nt-src-1" }
      ]
    },
    top: {
      classification: "Classroom Teacher 9 (CT9). Under the 2017–2021 and 2021–2024 EAs, CT9 was the top of a 9-step scale; the 2024 EA created a brand-new CT9 top step above the old CT9 (old CT9 ≈ new CT8). Senior Teacher (ST1–ST8) is explicitly 'promotion based' in clause 37.5(c).",
      schedule: [
        { date: "2022-01-01", salary: 110496, increase: "old CT9 — rate from 2017–2021 EA",                       sourceId: "nt-src-2" },
        { date: "2023-02-16", salary: 117225, increase: "back-pay event: two 3% rises (Oct 2021 & Oct 2022)",    sourceId: "nt-src-3" },
        { date: "2023-10-11", salary: 120742, increase: "+3.0% (final old-EA rise)",                              sourceId: "nt-src-3" },
        { date: "2024-10-11", salary: 131349, increase: "new CT9 top step + 4.3% (~+8.8%)",                      sourceId: "nt-src-1" },
        { date: "2026-01-01", salary: 136997, increase: "+4.3%",                                                  sourceId: "nt-src-1" },
        { date: "2027-01-01", salary: 142888, increase: "+4.3%",                                                  sourceId: "nt-src-1" }
      ]
    },
    sources: [
      {
        id: "nt-src-1",
        url: "https://ocpe.nt.gov.au/media/documents/nt-public-sector-employment-information-about-ntps-employment/information-about-ntps-employment/northern-territory-public-sector-educators-2024-2027-enterprise-agreement.PDF",
        accessed: "2026-04-17",
        published: "2024-10-31",
        usedFor: "Current EA: classifications, Schedule 4 salary tables, clause 37.5 Senior Teacher"
      },
      {
        id: "nt-src-2",
        url: "https://ocpe.nt.gov.au/__data/assets/pdf_file/0004/243994/NTPS-Teachers-and-Assistant-Teachers-2017-2021-Enterprise-Agreement.pdf",
        accessed: "2026-04-17",
        published: "2018-09-25",
        usedFor: "2017–2021 EA: CT1–CT9 salary schedule (no CT10), Oct 2020 rates carrying into 2022"
      },
      {
        id: "nt-src-3",
        url: "https://ocpe.nt.gov.au/employment-conditions-appeals-grievances/enterprise-agreement-negotiations/teachers-and-assistant-teachers/bulletin-30",
        accessed: "2026-04-17",
        published: "2023-01-30",
        usedFor: "2021–2024 EA: FWC approval 11 Jan 2023, 3% rises Oct 2021/2022/2023, back-pay in Feb 2023"
      },
      {
        id: "nt-src-4",
        url: "https://teachintheterritory.nt.gov.au/pay-and-benefits",
        accessed: "2026-05-18",
        published: "not stated",
        usedFor: "Cross-verification of Jan 2026 CT1–CT9 rates (CT1 $96,180 / CT9 $136,997 reconfirmed 2026-05-18)"
      }
    ]
  }
];

// =============================== CHANGELOG ===============================
// Running log of material data changes. Each entry covers one jurisdiction.
// Append new entries at the top (most recent first).
window.CHANGELOG = [
  {
    date: "2026-05-19",
    jurisdiction: "TAS",
    summary: "Changed top-of-scale classification from Band 1 Level 13 to Advanced Skills Teacher Band 2 Level 3 (AST). Aligns TAS with the locked-in cross-jurisdictional methodology. Current AST rate of $125,464 verified per DECYP Salary Scales (23 Mar 2026); pre-2026 AST historical rates calculated by applying the same Band 1 EA % rises (flagged in each schedule row as 'calculated') — should be re-verified against archived salary scales when convenient."
  },
  {
    date: "2026-05-19",
    jurisdiction: "QLD",
    summary: "Two corrections. **(1)** Reverted EB11-as-current: the 13 Mar 2026 EB11 certification covered the support-staff (teacher aide) tranche, not the teachers' agreement. Teachers' EB11 was rejected at the Oct 2025 ballot and is currently in QIRC arbitration. Removed the 2026-01-01 'structural reset' row showing $90,833 — that figure was from the rejected offer and is not in effect. EA name, status, commenced/expires/published dates restored to CA 2022 (expired-in-negotiation). **(2)** Fixed graduate classification: the schedule was using Band 1 Step 1 (3-year-trained scale) instead of Band 2 Step 1 (4-year-trained graduate). Replaced with verified Band 2 Step 1 figures from QTU CA 2022 ($78,490 / $81,628 / $84,078)."
  },
  {
    date: "2026-05-19",
    jurisdiction: "WA",
    summary: "Changed top-of-scale classification from Level 3.2 to Senior Teacher Classification 2 (ST2). L3CT is portfolio-gated (written evidence + 45-min oral) and closer to a promotion application than an automatic step; ST2 was introduced under the 2023 General Agreement effective 6 Dec 2023 and has lighter competency-based entry criteria (12 months at ST1 + agreement to perform two senior-teacher duties), comparable in process to SA's Tier 9. Top schedule replaced with ST2 figures from the 2023 EA Table 7 ($125,247 / $130,257 / $134,165). Pre-Dec 2023 entries reflect the single-tier Senior Teacher rate that preceded the ST1/ST2 split."
  },
  {
    date: "2026-05-18",
    jurisdiction: "ACT",
    summary: "Nominal expiry of the 2023–2026 EA (31 March 2026) has now passed; status remains expired-in-negotiation. The improved government offer of 11 March 2026 has not progressed to a ballot as of today; notes updated with offer particulars ($1,250 cost-of-living payment, ~5.5% avg across classifications, super to 12.5%)."
  },
  {
    date: "2026-05-18",
    jurisdiction: "SA",
    summary: "Re-verification attempt: SA DfE school-teachers-pay-rates.pdf and AEU SA salary rates page both returned HTTP 403 during this refresh, so the 4 May 2026 figures ($84,971 / $123,236) remain computed from the announced 3% rise rather than confirmed against the official rate sheet. Schedule labels updated and ea.notes flagged for human re-check."
  },
  {
    date: "2026-05-18",
    jurisdiction: "VIC",
    summary: "Added in-principle VGSA 2026 projected rates (Oct 2026–2029). Headline 28.3% over 4 years; ~12% combined rise by Oct 2026 including structural adjustments (+$12,343 graduate to align with NSW; +$15,393 top). Top of scale to reach $151,419 by 2029. Pending member ballot — ratification not yet confirmed (in-person meetings from 19 May 2026; online vote week of 15–18 June 2026; 39% of delegates voted against endorsement at the 15 May council, so the ballot is not a foregone conclusion)."
  },
  {
    date: "2026-05-18",
    jurisdiction: "QLD",
    summary: "Updated to EB11 (endorsed via member ballot 26 Feb–12 Mar 2026). Graduate starting rate raised one pay-point to $90,833 from 1 Jan 2026 (backdated). EA status changed from expired-in-negotiation to current; new commenced/expiry dates set."
  },
  {
    date: "2026-05-18",
    jurisdiction: "TAS",
    summary: "Updated to Teachers Agreement 2026 (ratified 26 Apr 2026, 72% yes vote). Added 3% / 3% / 2.75% rises from first full pay period in March 2026, 2027, and 2028. $500 lump sum added to Band 1 L13 base before the first rise (compounds). EA status changed to current."
  },
  {
    date: "2026-05-18",
    jurisdiction: "WA",
    summary: "Switched top-of-scale from L3.3 to L3.2. L3.3 is role-contingent (assigned at 'identified schools in need'), not a universal classroom-teacher step. Recalculated all WA top schedule entries: Dec 2023 $132,143 → Dec 2024 $137,428 → Dec 2025 $141,551."
  },
  {
    date: "2026-05-18",
    jurisdiction: "SA",
    summary: "Corrected Tier 9 classification note: progression requires a competency-based application after reaching Tier 8 — not automatic. Corrected all SA classification labels from 'Band 1' / 'Step X' to 'Tier X' to match 2024 EA terminology."
  }
];
