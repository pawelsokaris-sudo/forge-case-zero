# MASTER PLAN — Forge / Case Zero (v1.1)

**Status:** Draft → Operational Plan  
**Cel:** Zbudować proces i kręgosłup systemu Forge, tak aby rozwój był możliwy w trybie sesyjnym (Case Zero),
a każdy moduł był implementowalny wymiennie (swapable implementation), przy stałych kontraktach.

---

## 0. Zasada nadrzędna (Twoja wizja)

### 0.1 Najpierw projektujemy, potem kodujemy
Na poziomie projektowania ustalamy:
- pełne przepływy (flow)
- funkcje (capabilities)
- stany i zdarzenia (state machine + events)
- kontrakty (schemas + examples)
- zasady kontroli kosztu (CFO/CC)

Kod jest **drugorzędny** i musi być możliwy do wymiany.

### 0.2 Moduły są wymienne (Swapability Rule)
Każdy moduł (Marketplace / Orchestrator / Billing / Agent Registry / CFO Adapter) ma:
- **kontrakt publiczny** (API + eventy + schematy)
- **testy zgodności** (conformance tests)
- **co najmniej 2 implementacje**:
  - `impl/reference` (najprostsza, deterministyczna, bez magii)
  - `impl/alt` (alternatywa: inny język/stack/podejście)

Zasada: jeśli implementacja jest wymienna, to kontrakt jest prawdziwy.

---

## 0.5 Faza operacyjna Case Zero (Session System) — MUST

### 0.5.1 Repo jako pamięć systemu
Repo jest jedyną pamięcią. Sesje są stateless.

**Artefakty:**
- `/prompts/current_context.md` — pamięć startowa sesji
- `/backlog/items.md` — lista zadań
- `/evidence/sessions.md` — log wykonania
- `/docs/session_protocol.md` — protokół pracy sesji
- `/docs/decisions/` — ADR/Decision Notes

### 0.5.2 Definition of Done dla SESJI
Sesja jest DONE, jeśli:
1) powstał/zmienił się artefakt w repo (plik),
2) backlog item zmienił status,
3) dopisano wpis do `/evidence/sessions.md`,
4) zaktualizowano `/prompts/current_context.md`.

---

## 0.6 Artifact Naming Convention

### Kontrakty
```
/contracts/
  <ContractName>.v<version>.schema.json
  
Przykład:
  ServiceRegistration.v0.1.schema.json
  UsageEvent.v0.1.schema.json
  CFODiagnosis.v0.1.schema.json
```

### Przykłady (examples)
```
/examples/<ContractName>/
  happy_path.json
  error_<case>.json
  
Przykład:
  /examples/ServiceRegistration/
    happy_path.json
    error_invalid_mcp.json
    error_missing_pricing.json
```

### Flows
```
/docs/flows/
  <Letter>_<flow_name>.md
  
Przykład:
  A_register_service.md
  B_discover_compose.md
  C_execute_call.md
  D_observe_cost.md
  E_action_engine.md
  F_usage_billing.md
  G_agent_trust.md
```

### Implementacje
```
/impl/reference/<module>/
/impl/alt/<module>/

Przykład:
  /impl/reference/marketplace/
  /impl/alt/marketplace/
```

---

## 1. Faza 1 — Contracts & Flows (Design First)

### 1.1 Minimalny zestaw kontraktów v0.1 (maszynowy)
**Artefakty katalogów:**
- `/contracts/*.schema.json`
- `/examples/<contract>/*.json`
- `/docs/flows/*.md` (sekwencje + state machine)
- `/docs/glossary.md`

Kontrakty MUSZĄ być:
- wersjonowane (`v0.1`, `v0.2`…)
- testowalne (walidacja JSON schema)
- opisane przykładami (happy path + error path)

### 1.2 Przepływy, które ustalamy na starcie (Flow Lock)
Ustalamy i zapisujemy jako diagramy/sekwencje:

**Flow A: Register Service**
- twórca rejestruje mikroserwis (MCP endpointy, metadata, pricing)

**Flow B: Discover & Compose**
- orchestrator pobiera kandydatów, wybiera warianty

**Flow C: Execute / Call**
- runtime wywołuje usługę (call/route)

**Flow D: Observe Cost**
- CFO zbiera obserwacje (MCP /observe), generuje diagnozę

**Flow E: Act (Action Engine)**
- na podstawie diagnozy: SWAP_VARIANT / CONFIG_TUNE / DEGRADE_MODE

**Flow F: Usage & Billing**
- usage events → billing ledger → settlement twórców

**Flow G: Agent Trust (później, po spine)**
- rejestracja agenta, reputacja, rekomendacje usage

---

## 2. Minimal Spine v0.1 (kręgosłup E2E) — KAMIEŃ MILOWY

**Definicja Minimal Spine:**
> register → discover → call → observe CC → record usage → bill

Bez tego nie zaczynamy „dużych modułów".

### 2.1 Minimal Spine komponenty
1) **Marketplace Registry (API)**: register + discover
2) **Example Service (MCP)**: /mcp/observe + /mcp/config (+ opcjonalnie /invoke)
3) **CFO Adapter**: ingest metrics → diagnosis event
4) **Billing Ledger**: zapis usage event (na razie bez fakturowania)

**Wynik:** Jeden scenariusz E2E działa na minimalnym przykładzie.

---

## 3. Faza 2 — Conformance & Swapability (wymienność w praktyce)

### 3.1 Conformance tests (wspólne dla wszystkich implementacji)
**Artefakty:**
- `/tests/conformance/`
- zestaw testów kontraktowych:
  - schema validation
  - expected behavior (na bazie examples)
  - invarianty (idempotency, cooldown, blast radius)

### 3.2 Adapter pattern (żeby podmieniać implementacje)
Każdy moduł ma interfejs w `/contracts` i implementacje w:
- `/impl/reference/<module>/`
- `/impl/alt/<module>/`

Wymienność = przełączenie konfiguracji (np. docker-compose profile / env var / module registry).

---

## 4. Faza 3 — Marketplace + Orchestrator (logika i warianty)

### 4.1 Marketplace v0.1
- registry usług
- wersjonowanie usług
- status/health
- pricing metadata (na razie statyczne)

### 4.2 Orchestrator v0.1
- wybór wariantu usług wg reguł (nie ML)
- mechanika topologii (co z czym)
- integracja z Action Engine komendami (swap/config)

---

## 5. Faza 4 — Billing / Settlement (economic layer)

### 5.1 Billing v0.1 (najpierw ledger)
- usage events → ledger
- settlement twórców (prosty model)
- brak fakturowania na starcie (może być później)

### 5.2 Quality enforcement (CC jako waluta jakości)
- CC wpływa na ranking usług (preferencja orchestratora)
- CC może wpływać na payout (opcjonalnie w v0.2)

---

## 6. Faza 5 — Agent Registry / Trust (dopiero po Spine + Billing)

**Uwaga:** Agent jest modułem zależnym od usage i quality.
Wersja v0.1 agenta ma mieć:
- rejestrację tożsamości
- powiązanie z usage (kto używał, w jakiej jakości)
- rekomendacje/attestacje (systemy mogą rekomendować agenta)

---

## 7. Faza 6 — Forge Core (generator instancji / kompozytor)

Forge Core wchodzi, gdy:
- Spine działa
- kontrakty są stabilne
- conformance tests istnieją

Wtedy Forge Core może:
- generować instancję „solution blueprint"
- generować konfiguracje runtime
- budować „projects from intent" (ale intent layer na początku jest strukturalny, nie magiczny)

---

## 8. Plan sesji (pierwsze 7 sesji)

| Sesja | Zadanie | Output |
|-------|---------|--------|
| **#1** | Utworzyć `/docs/session_protocol.md` + ustalić DoD sesji | session_protocol.md |
| **#2** | Zdefiniować katalog `/contracts` i 3 kontrakty bazowe | contracts/*.schema.json |
| **#3** | Opisać Flow Lock (A–F) w `/docs/flows/` | flows/*.md |
| **#4** | Przygotować Minimal Spine v0.1 (opis + examples) | spine_spec.md |
| **#5** | Conformance tests skeleton + schema validation | tests/conformance/ |
| **#6** | Reference impl: Marketplace registry (minimal) | impl/reference/marketplace/ |
| **#7** | Reference impl: Example Service MCP + CFO ingest mock + Billing ledger stub | impl/reference/*/ |

**Po sesji #7:** Minimal Spine działa E2E → Checkpoint walidacji

---

## 9. Ryzyka kontrolowane (i jak je ucinasz)

| Ryzyko | Mitygacja |
|--------|-----------|
| Dryf koncepcyjny | Flow Lock + kontrakty maszynowe |
| Za dużo naraz | Minimal Spine jako wymóg przed rozbudową |
| Magia w Intent Layer | Intent v0.1 = strukturalny kontrakt wejścia |
| Brak wymienności | Conformance tests + 2 implementacje (reference/alt) |
| Utrata kontekstu między sesjami | Session System (0.5) + repo jako pamięć |

---

## 10. Definition of Done dla v1.1 (tego planu)

Plan jest „prawidłowy", jeśli:
- ✅ repo ma Session System (0.5)
- ✅ istnieje Minimal Spine definicja v0.1
- ✅ kontrakty są maszynowe (schema + examples)
- ✅ conformance tests są przewidziane przed rozbudową modułów
- ✅ moduły mają formalną zasadę swapability
- ✅ artifact naming convention jest zdefiniowana (0.6)

---

**Master Plan v1.1 — OPERATIONAL**

*Następny krok: Sesja #1 — session_protocol.md*
