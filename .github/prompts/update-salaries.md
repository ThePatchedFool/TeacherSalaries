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

## When you're done

Summarize in bullet points:
- Which jurisdictions changed and what
- Any sources that failed / were flagged for review
- Whether any new EAs were found

Edit `data.js` directly. A human will review the diff in a pull request before it ships.
