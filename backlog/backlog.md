# Forge — Backlog

**Ostatnia aktualizacja:** Styczeń 2026  
**Master Plan:** v1.1

---

## Legenda

- 🔴 Wysoki priorytet (blokuje inne)
- 🟡 Średni priorytet
- 🟢 Niski priorytet
- ✅ Zamknięte
- 🔄 W trakcie
- ❌ Do zrobienia

---

## Faza 0: Session System (MUST)

| # | Zadanie | Status | Output |
|---|---------|--------|--------|
| 0.1 | Session Protocol + DoD | ❌ | docs/session_protocol.md |

---

## Faza 1: Contracts & Flows (Design First)

| # | Zadanie | Status | Zależność | Output |
|---|---------|--------|-----------|--------|
| 1.1 | 3 kontrakty bazowe (registry/discovery/usage) | ❌ | 0.1 | contracts/*.schema.json |
| 1.2 | Examples dla kontraktów | ❌ | 1.1 | examples/*/*.json |
| 1.3 | Flow A: Register Service | ❌ | 1.1 | docs/flows/A_register_service.md |
| 1.4 | Flow B: Discover & Compose | ❌ | 1.1 | docs/flows/B_discover_compose.md |
| 1.5 | Flow C: Execute / Call | ❌ | 1.1 | docs/flows/C_execute_call.md |
| 1.6 | Flow D: Observe Cost | ❌ | 1.1 | docs/flows/D_observe_cost.md |
| 1.7 | Flow E: Act (Action Engine) | ❌ | 1.1 | docs/flows/E_action_engine.md |
| 1.8 | Flow F: Usage & Billing | ❌ | 1.1 | docs/flows/F_usage_billing.md |
| 1.9 | Glossary | ❌ | 1.1-1.8 | docs/glossary.md |

---

## Faza 2: Minimal Spine v0.1

| # | Zadanie | Status | Zależność | Output |
|---|---------|--------|-----------|--------|
| 2.1 | Minimal Spine spec | ❌ | Faza 1 | docs/spine_spec.md |
| 2.2 | Conformance tests skeleton | ❌ | 2.1 | tests/conformance/ |
| 2.3 | Schema validation tests | ❌ | 2.2 | tests/conformance/schema/ |

---

## Faza 3: Reference Implementation

| # | Zadanie | Status | Zależność | Output |
|---|---------|--------|-----------|--------|
| 3.1 | Marketplace Registry (reference) | ❌ | 2.3 | impl/reference/marketplace/ |
| 3.2 | Example Service MCP | ❌ | 2.3 | impl/reference/example-service/ |
| 3.3 | CFO Adapter (ingest mock) | ❌ | 3.2 | impl/reference/cfo-adapter/ |
| 3.4 | Billing Ledger (stub) | ❌ | 3.2 | impl/reference/billing/ |
| 3.5 | Spine E2E integration | ❌ | 3.1-3.4 | docker-compose + test |

---

## Faza 4: Alt Implementation (Swapability Proof)

| # | Zadanie | Status | Zależność | Output |
|---|---------|--------|-----------|--------|
| 4.1 | Marketplace (alt impl) | ❌ | 3.5 | impl/alt/marketplace/ |
| 4.2 | Conformance tests pass dla alt | ❌ | 4.1 | test results |

---

## Faza 5: Marketplace + Orchestrator

| # | Zadanie | Status | Zależność | Output |
|---|---------|--------|-----------|--------|
| 5.1 | Marketplace v0.1 (pełna) | ❌ | Faza 4 | impl/reference/marketplace/ |
| 5.2 | Orchestrator v0.1 | ❌ | 5.1 | impl/reference/orchestrator/ |

---

## Faza 6: Billing / Settlement

| # | Zadanie | Status | Zależność | Output |
|---|---------|--------|-----------|--------|
| 6.1 | Billing v0.1 (ledger) | ❌ | Faza 5 | impl/reference/billing/ |
| 6.2 | Settlement logic | ❌ | 6.1 | impl/reference/billing/ |
| 6.3 | CC jako waluta jakości | ❌ | 6.2 | docs/quality_enforcement.md |

---

## Faza 7: Agent Registry / Trust

| # | Zadanie | Status | Zależność | Output |
|---|---------|--------|-----------|--------|
| 7.1 | Agent Registry spec | ❌ | Faza 6 | docs/specs/agent_registry.md |
| 7.2 | Agent Registry impl | ❌ | 7.1 | impl/reference/agent-registry/ |
| 7.3 | CFO MCP dla agentów | ❌ | 7.2 | impl/reference/cfo-mcp/ |

---

## Faza 8: Forge Core

| # | Zadanie | Status | Zależność | Output |
|---|---------|--------|-----------|--------|
| 8.1 | Instance Template spec | ❌ | Faza 7 | docs/specs/instance_template.md |
| 8.2 | Configuration Engine | ❌ | 8.1 | src/forge-core/ |
| 8.3 | Instance Generator | ❌ | 8.2 | src/forge-core/ |

---

## Pierwsze 7 sesji (szczegółowo)

| Sesja | Zadanie | Backlog # | Output |
|-------|---------|-----------|--------|
| **#1** | Session Protocol + DoD | 0.1 | docs/session_protocol.md |
| **#2** | 3 kontrakty bazowe | 1.1 | contracts/*.schema.json |
| **#3** | Flow Lock (A–F) | 1.3-1.8 | docs/flows/*.md |
| **#4** | Minimal Spine spec | 2.1 | docs/spine_spec.md |
| **#5** | Conformance tests skeleton | 2.2, 2.3 | tests/conformance/ |
| **#6** | Marketplace reference impl | 3.1 | impl/reference/marketplace/ |
| **#7** | Service + CFO + Billing stubs | 3.2-3.4 | impl/reference/*/ |

**Checkpoint po sesji #7:** Minimal Spine E2E działa

---

## Zamknięte

| # | Zadanie | Data | Output |
|---|---------|------|--------|
| - | Sesja #0 (inicjalizacja) | 18.01.2026 | Struktura repo, Vision docs, Master Plan v1.1 |

---

*Aktualizuj po każdej sesji.*
