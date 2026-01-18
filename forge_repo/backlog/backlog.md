# Forge — Backlog

**Ostatnia aktualizacja:** Styczeń 2026

---

## Legenda

- 🔴 Wysoki priorytet
- 🟡 Średni priorytet
- 🟢 Niski priorytet
- ✅ Zamknięte
- 🔄 W trakcie
- ❌ Do zrobienia

---

## Backlog Items

### #1 🔴 ❌ Marketplace API — Specyfikacja

**Cel:** Zdefiniować jak mikroserwisy rejestrują się w marketplace i jak są odkrywane.

**Output:**
- `docs/specs/Marketplace_API_Spec_v0.1.md`
- `docs/contracts/ServiceRegistration.schema.json`
- `docs/contracts/ServiceDiscovery.schema.json`

**Zależności:** Brak

**Estymacja:** 1 sesja

---

### #2 🔴 ❌ Billing API — Specyfikacja

**Cel:** Zdefiniować jak rozliczane jest użycie mikroserwisów.

**Output:**
- `docs/specs/Billing_API_Spec_v0.1.md`
- `docs/contracts/UsageEvent.schema.json`
- `docs/contracts/Settlement.schema.json`

**Zależności:** #1 (Marketplace)

**Estymacja:** 1 sesja

---

### #3 🟡 ❌ CFO MCP — Specyfikacja

**Cel:** Zdefiniować jak mierzyć MCI agentów AI i jak interweniować.

**Output:**
- `docs/specs/CFO_MCP_Spec_v0.1.md`
- `docs/contracts/AgentDiagnosis.schema.json`

**Zależności:** Case Zero (masz)

**Estymacja:** 1 sesja

---

### #4 🟡 ❌ Orchestrator — Prototyp

**Cel:** Zbudować prosty orchestrator komponujący system z mikroserwisów.

**Output:**
- `src/orchestrator/` — działający kod
- `docs/specs/Orchestrator_Spec_v0.1.md`

**Zależności:** #1 (Marketplace)

**Estymacja:** 2 sesje

---

### #5 🟡 ❌ Agent klienta — Prototyp

**Cel:** Zbudować prototyp agenta z integracją CFO MCP.

**Output:**
- `src/agent/` — działający kod
- Przykładowy flow: klient → agent → zamówienie

**Zależności:** #3 (CFO MCP)

**Estymacja:** 2 sesje

---

### #6 🟢 ❌ Panel operatora — Mockup

**Cel:** Zaprojektować dashboard pokazujący CC i MCI.

**Output:**
- `docs/ux/Dashboard_Mockup_v0.1.md`
- Wireframes lub prosty HTML

**Zależności:** #1, #3

**Estymacja:** 1 sesja

---

### #7 🟢 ❌ Forge Core — Architektura

**Cel:** Zdefiniować jak Forge tworzy instancje platform.

**Output:**
- `docs/specs/Forge_Core_Spec_v0.1.md`
- Diagram architektury

**Zależności:** #1, #2, #4

**Estymacja:** 1-2 sesje

---

### #8 🟢 ❌ Przykładowy mikroserwis — Zamówienia

**Cel:** Zbudować referencyjny mikroserwis zgodny z Marketplace API.

**Output:**
- `src/marketplace/examples/orders-service/`
- Dokumentacja: jak zbudować własny mikroserwis

**Zależności:** #1

**Estymacja:** 1 sesja

---

## Proponowana kolejność (pierwsze 5 sesji)

| Sesja | Zadanie | Output |
|-------|---------|--------|
| 1 | #1 Marketplace API | Specyfikacja + kontrakty |
| 2 | #2 Billing API | Specyfikacja + kontrakty |
| 3 | #3 CFO MCP | Specyfikacja + kontrakty |
| 4 | #8 Przykładowy mikroserwis | Działający kod |
| 5 | #4 Orchestrator (start) | Prototyp |

Po sesji 5: **ewaluacja** — czy proces działa? Czy postęp jest realny?

---

## Zamknięte

*(przenieś tutaj zamknięte zadania)*

---

*Aktualizuj po każdej sesji.*
