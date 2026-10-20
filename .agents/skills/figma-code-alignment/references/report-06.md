# Report 06 template — final token audit

Copy this structure into `docs/token-audit/06-final-token-audit.md`. Replace placeholders with evidence from reports 01–05 and the current run date.

---

```markdown
# 06 — Final design token audit

**Product:** [from tokens.json fileName]
**Figma:** [URL with fileKey]
**Repository:** [repo name]
**Audit date:** [YYYY-MM-DD]

**Source reports:**
- [01-figma-token-inventory.md](./01-figma-token-inventory.md)
- [02-code-token-inventory.md](./02-code-token-inventory.md)
- [03-token-mapping.md](./03-token-mapping.md)
- [04-token-comparison.md](./04-token-comparison.md)
- [05-component-usage-audit.md](./05-component-usage-audit.md)

**Method notes:** [Figma MCP live inventory + code scanner + agent review. Unclear ≠ Mismatch.]

**Sibling check:** `npm run design:check` → [PASS | FAIL — reason]

---

## 1. Executive summary

[3–6 bullets: overall alignment, strongest areas, material gaps, recommended priority]

---

## 2. Overall alignment assessment

| Area | Assessment |
| --- | --- |
| Primitives | |
| Semantic/component colors | |
| Dimensions | |
| Typography | |
| Shadows / elevation | |
| Motion / z-index | |
| Component consumption | |

**Verdict:** [one paragraph]

---

## 3. Coverage by category

Matching = Match + Partial match (non-conflicting values). Mismatches = Mismatch only.

| Category | Figma tokens | Matching code tokens | Mismatches | Missing in code | Missing in Figma | Unclear |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Color — primitives | | | | | | |
| Color — semantic/component | | | | | | |
| Spacing | | | | | | |
| Border radius | | | | | | |
| Sizing | | | | | | |
| Opacity | | | | | | |
| Shadows / elevation | | | | | | |
| Typography (text styles) | | | | | | |
| Font family / primitives | | | | | | |
| Motion / duration | | | | | | |
| Z-index | | | | | | |
| Breakpoints | | | | | | |
| Border width | | | | | | |
| Foundations labels (non-variables) | | | | | | |
| Runtime / code-only | | | | | | |

---

## 4. Confirmed matches

[Table or bullet list with examples and evidence pointers to 01/04]

---

## 5. Confirmed mismatches

[Only Mismatch status from 04 — not Unclear, not Partial]

---

## 6. Tokens missing from code

[From 04 Missing in code]

---

## 7. Tokens missing from Figma

[From 04 Missing in Figma]

---

## 8. Naming inconsistencies

[From 03/04 — path vs kebab, badge shorthand, Foundations labels, --theme-*]

---

## 9. Alias and semantic-token inconsistencies

[Figma aliases vs resolved HEX; primitive use in UI; unused semantic tokens]

---

## 10. Theme and mode discrepancies

[Light/Dark mechanisms; --theme-* bypass; fallbacks; scheme switching]

---

## 11. Hardcoded values

[From 05 — hex, px, opacity, font, shadows]

---

## 12. Component usage issues

[Summary table from 05 by issue class]

---

## 13. Accessibility risks

[Risk flags only — not measured WCAG scores]

---

## 14. Highest-risk findings

| Rank | ID | Why highest |
| --- | --- | --- |
| 1 | F-XX | |
| … | | |

---

## 15. Recommended remediation plan

Evidence-backed only. Phases optional:

### Phase A — Confirm and document
### Phase B — Usage hygiene (code)
### Phase C — Contract completeness
### Phase D — Guardrails

---

## Findings register

| ID | Severity | Finding | Evidence | Impact | Recommended action |
| --- | --- | --- | --- | --- | --- |
| F-01 | Critical/High/Medium/Low | | | | |

---

## Appendix — Status math (report 04)

| Status | Count |
| --- | ---: |
| Match | |
| Partial match | |
| Mismatch | |
| Missing in code | |
| Missing in Figma | |
| Unclear | |

---

## Appendix — Audit trail

| Step | Doc |
| --- | --- |
| Figma inventory | 01 |
| Code inventory | 02 |
| Proposed mapping | 03 |
| Statused comparison | 04 |
| Component usage | 05 |
| Final synthesis | 06 |
```
