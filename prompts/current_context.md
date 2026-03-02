# Forge — Current Context

**Ostatnia aktualizacja:** Styczeń 2026  
**Sesja:** #0 (inicjalizacja)  
**Master Plan:** v1.1

---

## 1. Co to jest Forge

Forge to platforma do tworzenia systemów biznesowych — "maszyna do tworzenia maszyn".

**Kluczowe zasady:**
- Najpierw projektujemy (flows, kontrakty), potem kodujemy
- Każdy moduł jest wymienny (swapability rule)
- Kod jest drugorzędny — kontrakt jest prawdą

---

## 2. Fundamenty teoretyczne (LOCK)

### ALT-13687 (systemy)
> System może działać poprawnie i jednocześnie być najdroższą możliwą trajektorią.

### Case Zero (AI)
> Stabilność systemu AI nie wynika z eliminacji napięcia, lecz z jego uznania.

### Wspólny wniosek
> Jeśli system działa, ale koszt sterowania rośnie — nie naprawiaj. Zmień trajektorię.

---

## 3. Architektura wysokopoziomowa

```
┌─────────────────────────────────────────────────────────────┐
│                          FORGE                              │
│                  (maszyna do tworzenia maszyn)              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MINIMAL SPINE v0.1                       │
│                                                             │
│  register → discover → call → observe CC → record usage → bill │
│                                                             │
│  Komponenty:                                                │
│  • Marketplace Registry (register + discover)              │
│  • Example Service (MCP: /observe, /config)                │
│  • CFO Adapter (ingest → diagnosis)                        │
│  • Billing Ledger (usage events)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Flow Lock (przepływy do zaprojektowania)

| Flow | Nazwa | Opis |
|------|-------|------|
| A | Register Service | Twórca rejestruje mikroserwis |
| B | Discover & Compose | Orchestrator wybiera warianty |
| C | Execute / Call | Runtime wywołuje usługę |
| D | Observe Cost | CFO zbiera metryki, generuje diagnozę |
| E | Act (Action Engine) | SWAP_VARIANT / CONFIG_TUNE / DEGRADE_MODE |
| F | Usage & Billing | Usage events → ledger → settlement |
| G | Agent Trust | (później) Rejestracja agenta, reputacja |

---

## 5. Swapability Rule

Każdy moduł ma:
- **Kontrakt publiczny** (API + eventy + schematy)
- **Testy zgodności** (conformance tests)
- **2 implementacje:** `impl/reference` + `impl/alt`

> Jeśli implementacja jest wymienna, to kontrakt jest prawdziwy.

---

## 6. Co jest gotowe (LOCK)

| Element | Status | Lokalizacja |
|---------|--------|-------------|
| ALT-13687 | ✅ LOCK | docs/vision/ALT_13687_Vision_v1.0.md |
| Case Zero | ✅ LOCK | docs/specs/Case_Zero_Appendix_v1.1.md |
| Forge Vision | ✅ LOCK | docs/vision/Forge_Vision_v1.1.md |
| ActProof Demo | ✅ LOCK | src/actproof/ |
| Master Plan | ✅ v1.1 | MASTER_PLAN.md |

---

## 7. Aktualny cel: Minimal Spine v0.1

**Definicja:**
> register → discover → call → observe CC → record usage → bill

**Warunek:** Dopóki Spine nie działa, nie budujemy dużych modułów.

---

## 8. Plan najbliższych sesji

| Sesja | Zadanie | Output |
|-------|---------|--------|
| **#1** | Session Protocol + DoD | docs/session_protocol.md |
| **#2** | 3 kontrakty bazowe | contracts/*.schema.json |
| **#3** | Flow Lock (A–F) | docs/flows/*.md |
| **#4** | Minimal Spine spec | docs/spine_spec.md |
| **#5** | Conformance tests skeleton | tests/conformance/ |
| **#6** | Marketplace reference impl | impl/reference/marketplace/ |
| **#7** | Service + CFO + Billing stubs | impl/reference/*/ |

---

## 9. Session System

### Repo jako pamięć
- `/prompts/current_context.md` — ten plik
- `/backlog/items.md` — lista zadań
- `/evidence/sessions.md` — log sesji
- `/docs/session_protocol.md` — protokół (do stworzenia w sesji #1)

### Definition of Done dla sesji
Sesja jest DONE, jeśli:
1. Powstał/zmienił się artefakt w repo
2. Backlog item zmienił status
3. Dopisano wpis do sessions.md
4. Zaktualizowano current_context.md

---

## 10. Artifact Naming Convention

```
/contracts/
  <ContractName>.v<version>.schema.json

/examples/<ContractName>/
  happy_path.json
  error_<case>.json

/docs/flows/
  <Letter>_<flow_name>.md

/impl/reference/<module>/
/impl/alt/<module>/
```

---

## 11. Następna sesja

**Sesja #1:** Utworzyć `/docs/session_protocol.md` + ustalić DoD sesji

---

*Aktualizuj ten plik po każdej sesji.*
