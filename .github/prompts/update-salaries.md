You are refreshing the Australian public-school teacher salaries dataset in this repo. Today is **{{TODAY}}**.

## The dataset

`data.js` defines `window.SALARY_DATA`, an array of 8 jurisdictions (NSW, VIC, QLD, WA, SA, TAS, ACT, NT). Each entry has this shape:

```
{
  code, name, system,
  ea: { name, status, commenced, expires, published, notes },
  graduate: { classification, schedule: [{ date, salary, increase }] },
  top:      { classification, schedule: [{ date, salary, increase }] },
  sources:  [{ url, accessed, published, usedFor }]
}
```

`status` is one of `"current"`, `"expired-in-negotiation"`, `"in-negotiation"`.

`schedule` is historical + agreed-future rates back to 2022. "graduate" = step 1 of entry-level classroom teacher. "top" = highest step reachable without promotion to HAT/LT/leadership.

`window.DATA_AS_OF` at the top of the file is the site's "as of" date.

## Your job

1. **Read `data.js`.**

2. **For each jurisdiction**, WebFetch the URLs already listed in `sources`. Verify:
   - Scheduled salaries (current and any future agreed rates) match the source
   - EA nominal expiry and status are still accurate
   - Classification names haven't changed

3. **WebSearch** `"<jurisdiction> public school teachers enterprise agreement 2026"` (and similar) to catch **new EAs** that might not yet be linked from the existing sources. If a new EA has been signed/approved:
   - Update `ea` (name, status→`"current"`, commenced, expires, published)
   - Append new scheduled rates to both `graduate.schedule` and `top.schedule` — **do not overwrite historical entries**
   - Add the new source URL to `sources`

4. **Status transitions to watch for:**
   - Was `"current"`, nominal expiry now in the past, no replacement signed → `"expired-in-negotiation"`
   - Was `"expired-in-negotiation"`, new EA approved → `"current"` + new EA block
   - Was `"current"`, bargaining announced before expiry → `"in-negotiation"`

5. **Update `accessed` dates** on every source URL you actually visited to `{{TODAY}}`.

6. **Update `window.DATA_AS_OF`** at the top of `data.js` to `{{TODAY}}`.

## Hard rules

- **Never invent figures.** If a source URL 404s, is paywalled, or you can't confidently extract a number, **leave the existing value unchanged** and append a short note to `ea.notes` flagging it for human review (e.g. `"2026-05-01: NSW DoE salary page moved, rate unverified this run."`).
- **Do not restructure the schema.** No new top-level fields, no renaming. Only update values and append to `schedule` / `sources`.
- **Do not delete historical schedule entries.** Past rates stay even if the source page no longer shows them.
- **Base FTE only.** Exclude super, allowances, NT remote loadings.
- If a classification is renamed mid-EA (like NSW Band→Step, ACT CT→TL, NT CT1-9→CT1-9+CT10, WA Level 3.2→3.3), record the change in `notes` and in the `increase` field of the affected schedule row — don't silently rewrite old labels.

## When you're done

Summarize in bullet points:
- Which jurisdictions changed and what
- Any sources that failed / were flagged for review
- Whether any new EAs were found

Edit `data.js` directly. A human will review the diff in a pull request before it ships.
