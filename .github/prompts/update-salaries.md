You are refreshing the Australian public-school teacher salaries dataset in this repo. Today is **{{TODAY}}**.

## The dataset

`data.js` defines `window.SALARY_DATA`, an array of 8 jurisdictions (NSW, VIC, QLD, WA, SA, TAS, ACT, NT). Each entry has this shape:

```
{
  code, name, system,
  verifiedOn,   // ISO date — max of sources[*].accessed for this jurisdiction
  ea: { name, status, commenced, expires, published, notes },
  graduate: { classification, schedule: [{ date, salary, increase, sourceId }] },
  top:      { classification, schedule: [{ date, salary, increase, sourceId }] },
  sources:  [{ id, url, accessed, published, usedFor }]
}
```

`status` is one of `"current"`, `"expired-in-negotiation"`, `"in-negotiation"`.

`schedule` is historical + agreed-future rates back to 2022. "graduate" = step 1 of entry-level classroom teacher. "top" = highest step reachable without promotion to HAT/LT/leadership.

`sources[].id` uses the convention `"<lowercode>-src-<n>"` (1-based). When adding a new source, continue the sequence from the highest existing `n`.

`schedule[].sourceId` points to the `sources[].id` that documents that salary figure.

`verifiedOn` is the ISO date of the most recent source check for that jurisdiction. Update it whenever you visit at least one source for that jurisdiction.

`window.DATA_AS_OF` at the top of the file is the site's "as of" date.

`window.CHANGELOG` (at the bottom of the file) is an array of `{ date, jurisdiction, summary }` objects. The most recent entry is first.

## Your job

1. **Read `data.js`.**

2. **For each jurisdiction**, WebFetch the URLs already listed in `sources`. Verify:
   - Scheduled salaries (current and any future agreed rates) match the source
   - EA nominal expiry and status are still accurate
   - Classification names haven't changed

3. **WebSearch** `"<jurisdiction> public school teachers enterprise agreement 2026"` (and similar) to catch **new EAs** that might not yet be linked from the existing sources. If a new EA has been signed/approved:
   - Update `ea` (name, status→`"current"`, commenced, expires, published)
   - Append new scheduled rates to both `graduate.schedule` and `top.schedule` — **do not overwrite historical entries**
   - Add the new source to `sources` with a new `id` (next in the `<lowercode>-src-<n>` sequence)
   - Add a `sourceId` to each new schedule row pointing to the new source

4. **Status transitions to watch for:**
   - Was `"current"`, nominal expiry now in the past, no replacement signed → `"expired-in-negotiation"`
   - Was `"expired-in-negotiation"`, new EA approved → `"current"` + new EA block
   - Was `"current"`, bargaining announced before expiry → `"in-negotiation"`

5. **Update `accessed` dates** on every source URL you actually visited to `{{TODAY}}`.

6. **Update `verifiedOn`** for every jurisdiction whose sources you visited to `{{TODAY}}`.

7. **Update `window.DATA_AS_OF`** at the top of `data.js` to `{{TODAY}}`.

8. **Append to `window.CHANGELOG`** — prepend a new entry (most recent first) for each jurisdiction where anything material changed:
   ```js
   { date: "{{TODAY}}", jurisdiction: "XYZ", summary: "One or two sentences describing what changed and why." }
   ```
   Do not add a CHANGELOG entry for jurisdictions where nothing changed.

## Hard rules

- **Never invent figures.** If a source URL 404s, is paywalled, or you can't confidently extract a number, **leave the existing value unchanged** and append a short note to `ea.notes` flagging it for human review (e.g. `"2026-05-01: NSW DoE salary page moved, rate unverified this run."`).
- **Do not restructure the schema.** No new top-level fields, no renaming. Only update values and append to `schedule` / `sources` / `CHANGELOG`.
- **Do not delete historical schedule entries.** Past rates stay even if the source page no longer shows them.
- **Base FTE only.** Exclude super, allowances, NT remote loadings.
- If a classification is renamed mid-EA (like NSW Band→Step, ACT CT→TL, NT CT1-9→CT1-9+CT10, WA Level 3.2→3.3), record the change in `notes` and in the `increase` field of the affected schedule row — don't silently rewrite old labels.

## Locked-in classifications (do not change without human review)

The top-of-scale and graduate classifications for each jurisdiction are **fixed** as below. Do not switch to a different step/level/tier even if a new EA introduces one or restructures the scale. If a new agreement explicitly renames or restructures the locked classification, flag it in `ea.notes` and leave the existing `classification` field alone — a human will decide whether the lock should change.

| Code | Graduate | Top of scale |
|---|---|---|
| NSW | Classroom Teacher Step 1 (Graduate accreditation) | Classroom Teacher Step 7 (Proficient accreditation) |
| VIC | Classroom Teacher Range 1 Subdivision 1 (T1-1) | Classroom Teacher Range 2 Subdivision 6 (T2-6) |
| QLD | **Band 2 Step 1** (4-year-trained graduate). Band 1 is the 3-year-trained scale — never use it for graduate teachers. | Experienced Senior Teacher Step 2 (EST2) |
| WA | Level 2.1 (four-year-trained graduate) | **Senior Teacher Classification 2 (ST2)** — introduced under the 2023 EA. Do **not** use Level 3.2 / L3CT (portfolio-gated, treated as promotion-equivalent). |
| SA | Teacher Tier 1 | Teacher Tier 9 |
| TAS | Teacher Band 1 Level 5 | **Advanced Skills Teacher Band 2 Level 3 (AST)**. Do **not** use Band 1 Level 13 — AST is the top classroom-teacher classification. |
| ACT | Teacher Level 1 (TL1) | Teacher Level 8 (TL8) |
| NT | Classroom Teacher 1 (CT1) | Classroom Teacher 9 (CT9) |

When a new EA is signed:
- **Locked classification still exists**: append new rates to the existing schedule under the locked classification. Do not rename the classification.
- **Locked classification renamed**: flag in `ea.notes` (`"2026-XX-XX: VIC renamed T2-6 to Range 2 Step 6 effective DD MMM YYYY — locked classification still applies, label updated"`) and update the `classification` field text to reflect the new name, but only after confirming the underlying step is functionally the same. Add an `increase` field note to the affected schedule row.
- **Locked classification abolished or restructured into different tiers**: do **not** silently switch to a different classification. Leave the existing data unchanged, flag prominently in `ea.notes`, and add a CHANGELOG entry asking for human review of the methodology choice.

## Excluded classifications (do not use as top-of-scale)

These are classifications that look like step increments but require selection, portfolio, formal assessment, or carry leadership/promotional duties. Treat them as out of scope for "top classroom teacher":

- **HAT / Highly Accomplished Teacher** — any jurisdiction
- **LT / Lead Teacher** — any jurisdiction
- **Learning Specialist** (VIC) / **Leading Teacher** (VIC promotional roles)
- **WA Level 3 Classroom Teacher (L3.1 / L3.2 / L3.3)** — portfolio assessment + oral examination
- **QLD HAT-certified positions**
- **NSW Highly Accomplished Teacher / Lead Teacher** (NESA separate accreditation)
- **SA Advanced Skills Teacher (AST1)** — separate selection process
- **TAS Assistant Principal, Principal**
- **ACT Highly Accomplished Teacher / Lead Teacher / executive classifications**
- **NT Senior Teacher (ST1–ST8)** — explicitly promotion-based per the EA

When the WA L3CT or similar exists at a higher rate than the locked top-of-scale, note its existence in `ea.notes` but do not include it in the comparison schedule.

## When you're done

Summarize in bullet points:
- Which jurisdictions changed and what
- Any sources that failed / were flagged for review
- Whether any new EAs were found

Edit `data.js` directly. A human will review the diff in a pull request before it ships.
