# ActProof — Product Vision & Scope v1.0

**Status:** LOCK (post-demo validation)  
**Typ dokumentu:** Definicja produktu — logika biznesowa i architektura koncepcyjna  
**Relacja:** Produkt 1 — warstwa kontrolna (standalone lub komponent platformy)  
**Data:** Styczeń 2026

---

## 1. Wizja jednym zdaniem

**ActProof mierzy koszt sterowania systemem — i interweniuje zanim pojawi się awaria.**

---

## 2. Problem rynkowy

| Obserwacja | Konsekwencja |
|------------|--------------|
| Systemy rozproszone nie psują się nagle | Degradacja jest procesem, nie zdarzeniem |
| Zanim system padnie, najpierw staje się drogi | Rosną retry, latency, ręczne interwencje |
| Dziś reagujemy na alert lub incydent | Czyli za późno — awaria już wystąpiła |
| Koszt utrzymania poprawności jest realny | Ale nikt go nie mierzy |

**Luka:** Brak narzędzia, które mierzy **koszt sterowania** i pozwala działać **przed awarią**.

---

## 3. Rozwiązanie: Control Cost (CC)

### 3.1 Definicja (LOCK)

```
CC = latency_p99 × (error_rate + retry_rate)
```

**Co to oznacza:**
- Im więcej opóźnień i retry — tym drożej system "udaje", że działa normalnie
- CC rośnie **zanim** pojawi się widoczna awaria
- CC to nie SLA — to **fizyka systemu**

### 3.2 Źródło definicji

→ **ADR-001: Control Cost (CC) as Primary Control Signal**

---

## 4. Aktorzy i ich cele

### 4.1 Operator systemu (SRE / Platform Team)

**Problem:** Reaguje na alerty, gasi pożary, nie ma wczesnego ostrzegania  
**Cel:** Wiedzieć o degradacji zanim klient zgłosi problem  
**ActProof daje:** CC jako early warning signal + automatyczna korekta

### 4.2 Architekt / Tech Lead

**Problem:** Nie wie, które decyzje architektoniczne generują ukryty koszt  
**Cel:** Mierzyć wpływ zmian na stabilność systemu  
**ActProof daje:** CC jako metryka jakości architektury

### 4.3 CTO / VP Engineering

**Problem:** Zespół gasi pożary zamiast budować wartość  
**Cel:** Zmniejszyć liczbę incydentów i ręcznych interwencji  
**ActProof daje:** Automatyczna stabilizacja bez zwiększania zespołu

### 4.4 Platforma (Produkt 2 — przyszły use case)

**Problem:** Potrzebuje warstwy kontrolnej dla marketplace mikroserwisów  
**Cel:** Gwarantować jakość rozwiązań bez ręcznego monitoringu  
**ActProof daje:** CC jako "waluta jakości" + automatyczny swap usług

---

## 5. Architektura logiczna

```
┌─────────────────────────────────────────────────────────────────┐
│                     MONITOROWANY SYSTEM                         │
│                                                                 │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                 │
│   │ Service  │◄──►│ Service  │◄──►│ Service  │                 │
│   │    A     │    │    B     │    │    C     │                 │
│   └────┬─────┘    └────┬─────┘    └────┬─────┘                 │
│        │               │               │                        │
│        └───────────────┴───────────────┘                        │
│                        │ MCP /observe                           │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       ACTPROOF                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    CFO LITE                              │   │
│  │                                                          │   │
│  │  • Polling MCP /observe (per service)                   │   │
│  │  • Baseline computation (faza A)                        │   │
│  │  • CC calculation: latency × (error + retry)            │   │
│  │  • Detection: mean(CC) > k × CC0 przez hold_sec         │   │
│  │  • Emit: CFODiagnosis                                   │   │
│  │                                                          │   │
│  │  NIE: wykonuje akcje, decyduje, używa ML                │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │ CFODiagnosis                      │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   ACTION ENGINE                          │   │
│  │                                                          │   │
│  │  • Policy Gates: Time, Cooldown, Blast Radius, Idempot. │   │
│  │  • Translate diagnosis → command                        │   │
│  │  • Execute via Service Orchestrator                     │   │
│  │  • Emit: ActionResult (auditable evidence)              │   │
│  │                                                          │   │
│  │  NIE: diagnozuje, decyduje strategicznie, myśli         │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │ Command                           │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SERVICE ORCHESTRATOR                          │
│                                                                 │
│  • Wykonuje: SWAP_VARIANT, CONFIG_TUNE, BUFFER_ENABLE, ...     │
│  • Raportuje wynik                                              │
│  • NIE: kwestionuje sens komendy, podejmuje decyzje            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Komponenty (LOCK)

### 6.1 CFO Lite

| Aspekt | Opis |
|--------|------|
| **Rola** | Diagnoza systemu — liczy CC, wykrywa trendy, emituje diagnozy |
| **Wejście** | Metryki z MCP /observe (latency_p99, error_rate, retry_rate) |
| **Wyjście** | CFODiagnosis (JSON) |
| **Czego NIE robi** | Nie wykonuje akcji, nie decyduje, nie używa ML |

**Algorytm detekcji (MVP):**
```
IF mean(CC_global) > k × CC0_global FOR hold_sec
THEN emit Diagnosis(CC_TREND_HIGH)
```

**Dokumentacja:** CFO Lite Implement Spec v0.1

### 6.2 Action Engine

| Aspekt | Opis |
|--------|------|
| **Rola** | Walidacja polityk + egzekucja komend przez SO |
| **Wejście** | CFODiagnosis |
| **Wyjście** | ActionResult (JSON, auditable, z hash SHA-256) |
| **Czego NIE robi** | Nie diagnozuje, nie podejmuje decyzji strategicznych |

**Policy Gates (MVP):**

| Polityka | Opis |
|----------|------|
| Time Policy | Blokada zmian w określonych oknach (np. Pt 16-20) |
| Cooldown Policy | Min. odstęp między interwencjami |
| Blast Radius Policy | Max 1 usługa / 1 akcja naraz |
| Idempotency Policy | Ta sama diagnoza = brak re-egzekucji |

**Komendy (MVP):**

| Komenda | Efekt |
|---------|-------|
| SWAP_VARIANT | Zmiana wariantu implementacji (heavy → light) |
| CONFIG_TUNE | Zmiana parametrów runtime (bez restartu) |
| BUFFER_ENABLE | Aktywacja bufora / kolejki |
| DEGRADE_MODE | Przełączenie w tryb degradacji |

**Dokumentacja:** Action Engine Command Spec v0.1

### 6.3 Service Orchestrator

| Aspekt | Opis |
|--------|------|
| **Rola** | Czyste wykonanie techniczne |
| **Wejście** | Command z Action Engine |
| **Wyjście** | Execution result |
| **Czego NIE robi** | Nie kwestionuje, nie myśli, nie decyduje |

**Dokumentacja:** ADR-003 (interfejs zdefiniowany, implementacja zależna od środowiska)

---

## 7. Kontrakty danych (LOCK)

### 7.1 CFODiagnosis (CFO → Action Engine)

```json
{
  "diagnosis_id": "uuid",
  "tenant_id": "string",
  "timestamp": "ISO-8601",
  "type": "CC_TREND_HIGH | HIGH_FRAGILITY | GREEDY_TRAP",
  "targets": ["service_logical_id"],
  "recommended_action": {
    "type": "SWAP_VARIANT | CONFIG_TUNE | BUFFER_ENABLE | DEGRADE_MODE",
    "params": {}
  },
  "evidence": {
    "baseline_cc": 42.5,
    "current_cc": 68.3,
    "cc_formula": "latency_p99 × (error_rate + retry_rate)",
    "threshold_cc": 63.75,
    "breach_duration_seconds": 60,
    "cc_series": [...],
    "mcp_observe_snapshot": {...}
  }
}
```

**Dokumentacja:** contracts/CFODiagnosis.schema.json

### 7.2 ActionResult (Action Engine → evidence)

```json
{
  "command_id": "uuid",
  "diagnosis_id": "uuid",
  "tenant_id": "string",
  "action_type": "SWAP_VARIANT",
  "status": "SUCCESS | FAILED | BLOCKED | DUPLICATE",
  "executed_at": "ISO-8601",
  "execution_report": {
    "before_state": {...},
    "after_state": {...},
    "rollback_available": true
  },
  "hash": "sha256(...)"
}
```

**Dokumentacja:** contracts/ActionResult.schema.json

### 7.3 MCP /observe (Service → CFO)

```json
{
  "service_logical_id": "servicex",
  "current_variant": "heavy",
  "timestamp": "ISO-8601",
  "status": "ready | degraded | unhealthy",
  "metrics": {
    "latency_p99": 520,
    "retry_rate": 0.042,
    "error_rate": 0.046,
    "queue_depth": 0,
    "request_count_window": 287
  },
  "events": []
}
```

---

## 8. Kluczowe decyzje architektoniczne (LOCK)

| ADR | Decyzja | Konsekwencja |
|-----|---------|--------------|
| **ADR-001** | CC jako główna wielkość sterowania | Early warning niezależny od awarii |
| **ADR-002** | Brak ML i heurystyk (v0.1) | Każda decyzja audytowalna i odtwarzalna |
| **ADR-003** | Twardy rozdział CFO / AE / SO | Brak "agentowego skrętu", jasny audit trail |
| **ADR-004** | MCP poza narracją pitchu | Pitch skupia się na fizyce, nie implementacji |
| **ADR-005** | Rollback jako nowa diagnoza | Jedno źródło prawdy (CFO), spójność pętli |

**Dokumentacja:** ADR Pack v0.1

---

## 9. Czego ActProof NIE robi (granice produktu)

| Nie robi | Dlaczego |
|----------|----------|
| ❌ ML / AIOps / heurystyki predykcyjne | Nieprzewidywalność, brak audytowalności |
| ❌ Autoscaling | CC mierzy koszt, nie zasoby |
| ❌ Chaos engineering | ActProof obserwuje, nie wstrzykuje awarie |
| ❌ Service mesh / Istio / K8s specifics | Agnostyczny wobec infrastruktury |
| ❌ Decyzje biznesowe | ActProof diagnozuje i wykonuje, nie strategizuje |

---

## 10. Dowód działania (LOCK)

### 10.1 Demo scenario

```
heavy → CC↑ → diagnosis → swap → CC↓
```

**Przebieg:**
1. System startuje w wariancie "heavy"
2. CFO wyznacza baseline CC0
3. CC rośnie (brak awarii, brak alertów)
4. CFO emituje CC_TREND_HIGH
5. Action Engine wykonuje SWAP_VARIANT → light
6. CC spada do baseline

### 10.2 Evidence (artefakty)

| Artefakt | Plik | Weryfikacja |
|----------|------|-------------|
| Baseline CC0 | evidence/baseline.json | `jq '.cc0_global'` |
| CC time series | evidence/cc_timeseries.json | `jq 'length'` > 50 |
| Diagnoza | evidence/diagnosis_*.json | type: CC_TREND_HIGH |
| ActionResult | evidence/action_result_*.json | status: SUCCESS |
| Wykres CC | plot_cc.py output | heavy >> light |

**Dokumentacja:** RUNBOOK.md, Demo Package v0.1

---

## 11. Parametry konfiguracyjne (MVP defaults)

| Parametr | Wartość | Opis |
|----------|---------|------|
| poll_interval_sec | 5 | Interwał pollingu MCP |
| baseline_window_sec | 600 | Czas zbierania baseline (10 min) |
| threshold_k | 1.5 | Mnożnik dla progu CC |
| hold_sec | 60 | Czas utrzymania przekroczenia |
| cooldown_sec | 600 | Cooldown między interwencjami |

---

## 12. Tryby wdrożenia

### 12.1 Standalone (Produkt 1)

ActProof jako samodzielne narzędzie dla istniejących systemów:

```
[Istniejący system] ──MCP──► [ActProof] ──► [Istniejący orchestrator]
```

**Dla kogo:** Zespoły SRE, Platform Teams, organizacje z własnymi systemami

### 12.2 Embedded (w Produkcie 2)

ActProof jako warstwa kontrolna platformy marketplace:

```
[Marketplace μsvc] ──MCP──► [ActProof] ──► [Platform Orchestrator] ──► [Billing]
```

**Dla kogo:** Platforma jako operator, CC jako waluta jakości

---

## 13. Roadmap koncepcyjny

| Faza | Zawartość | Status |
|------|-----------|--------|
| **v0.1 (MVP)** | CC, baseline, CC_TREND_HIGH, SWAP_VARIANT | ✅ LOCK |
| **v0.2** | T (Fragility) — reakcja CC na perturbację | Zdefiniowane, nie zaimplementowane |
| **v0.3** | MCI (Metabolic Cost Index) — przepływ kompensacji | Zdefiniowane, nie zaimplementowane |
| **v1.0** | Production-ready, multi-tenant, persistence | Planowane |

**T i MCI zdefiniowane w:** Technical Specification v1.0, Raport Techniczny v1.1

---

## 14. Dokumentacja produktu (indeks)

| Dokument | Rola | Status |
|----------|------|--------|
| **ADR Pack v0.1** | Decyzje architektoniczne | LOCK |
| **CFO Lite Implement Spec v0.1** | Specyfikacja CFO | LOCK |
| **Action Engine Command Spec v0.1** | Specyfikacja AE | LOCK |
| **Demo Package v0.1** | Działający PoC | LOCK |
| **RUNBOOK.md** | Instrukcja demo | LOCK |
| **contracts/*.json** | Schematy danych | LOCK |
| **Technical Specification v1.0** | Pełna specyfikacja techniczna | Reference |
| **MVP Implementation Notes v1.1.1** | Notatki implementacyjne | Reference |
| **Pitch CTO/VC** | Materiały prezentacyjne | LOCK |
| **Demo Script v0.1** | Skrypt do nagrania | LOCK |

---

## 15. Podsumowanie

**ActProof to:**
- Warstwa kontrolna dla systemów rozproszonych
- Oparta na Control Cost (CC) — mierzalnym koszcie sterowania
- Bez ML, bez heurystyk — deterministyczna i audytowalna
- Trzy komponenty z twardym rozdziałem ról (CFO / AE / SO)
- Zwalidowana działającym demo

**ActProof NIE jest:**
- Narzędziem do monitoringu (to nie Prometheus/Grafana)
- Narzędziem do autoscalingu (to nie HPA/KEDA)
- Platformą chaos engineering (to nie Chaos Monkey)
- Agentem AI (to nie autonomiczny system)

**Jednym zdaniem:**

> System jeszcze działał. My już wiedzieliśmy, że jest drogi.  
> To jest różnica między obserwacją a sterowaniem.

---

**ActProof Product Vision & Scope v1.0 | LOCK**
