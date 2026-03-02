# ActProof Demo Package v0.1

Minimalny, uruchamialny proof-of-concept dla systemu ActProof.

## Scenariusz demo

```
heavy → CC↑ → diagnosis → swap → CC↓
```

System pokazuje, że **Control Cost rośnie ZANIM wystąpi awaria** i że korekta topologii (swap wariantu) obniża CC.

## Architektura

```
┌─────────────────┐
│ Load Generator  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Gateway      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   ServiceX      │◄────│   CFO Lite      │ (polling MCP)
│  heavy / light  │     └────────┬────────┘
└─────────────────┘              │ diagnosis
                                 ▼
                        ┌─────────────────┐
                        │  Action Engine  │ (policy gates)
                        └────────┬────────┘
                                 │ command
                                 ▼
                        ┌─────────────────┐
                        │  Orchestrator   │ (swap execution)
                        └─────────────────┘
```

## Definicja CC (LOCK)

```
CC = latency_p99 × (error_rate + retry_rate)
```

## Quick Start

```bash
# 1. Build
docker-compose build

# 2. Start w trybie heavy
SERVICEX_VARIANT=heavy docker-compose up -d

# 3. Obserwuj (poczekaj 2-3 min na baseline, potem na diagnosis)
docker logs -f actproof-cfo

# 4. Po swapie sprawdź CC
python3 plot_cc.py evidence/cc_timeseries.json

# 5. Cleanup
docker-compose down -v
```

## Pełna instrukcja

Zobacz **[RUNBOOK.md](RUNBOOK.md)** - kompletny 15-20 minutowy przewodnik.

## Struktura katalogów

```
actproof-demo/
├── docker-compose.yml
├── RUNBOOK.md              # Demo runbook
├── README.md               # Ten plik
├── plot_cc.py              # Wizualizacja CC
├── swap.sh                 # Helper do manualnego swap
│
├── services/
│   └── servicex/           # ServiceX (heavy/light variants)
│
├── gateway/                # Gateway proxy
├── load-generator/         # Generuje ruch
├── cfo/                    # CFO Lite (CC, baseline, detection)
├── action-engine/          # Policy gates, command execution
├── orchestrator/           # Service Orchestrator (mock)
│
├── contracts/              # JSON schemas & examples
│   ├── CFODiagnosis.schema.json
│   ├── CFODiagnosis.example.json
│   ├── ActionResult.schema.json
│   └── ActionResult.example.json
│
└── evidence/               # Artefakty generowane podczas demo
    ├── baseline.json
    ├── cc_timeseries.json
    ├── diagnosis_*.json
    └── action_result_*.json
```

## Evidence (Definition of Done)

Po demo muszą istnieć:

| Artefakt | Plik | Weryfikacja |
|----------|------|-------------|
| Baseline CC0 | `evidence/baseline.json` | `jq '.cc0_global'` |
| CC time series | `evidence/cc_timeseries.json` | `jq 'length'` > 50 |
| CFODiagnosis | `evidence/diagnosis_*.json` | `type: CC_TREND_HIGH` |
| ActionResult | `evidence/action_result_*.json` | `status: SUCCESS` |
| Wykres CC | `evidence/cc_chart.csv` | Heavy >> Light |

## Role (LOCK)

| Komponent | Odpowiedzialność | NIE robi |
|-----------|------------------|----------|
| **CFO** | liczy CC/T/MCI, emituje diagnozę | nie wykonuje akcji |
| **Action Engine** | waliduje polityki, egzekwuje przez SO | nie decyduje |
| **Orchestrator** | wykonuje komendy | nie myśli |

## Detekcja (MVP)

CFO emituje `CC_TREND_HIGH` gdy:
```
mean(CC_global) > 1.5 × CC0_global przez ≥ 60s
```

## Kontrakty

### CFODiagnosis (CFO → Action Engine)
```json
{
  "diagnosis_id": "uuid",
  "type": "CC_TREND_HIGH",
  "targets": ["servicex"],
  "recommended_action": {
    "type": "SWAP_VARIANT",
    "params": { "from_variant": "heavy", "to_variant": "light" }
  },
  "evidence": { "baseline_cc": 42.5, "current_cc": 68.3, ... }
}
```

### ActionResult (Action Engine → evidence)
```json
{
  "command_id": "uuid",
  "diagnosis_id": "uuid",
  "status": "SUCCESS | FAILED | BLOCKED | DUPLICATE",
  "execution_report": { "before_state": {...}, "after_state": {...} },
  "hash": "sha256(...)"
}
```

## Zakazy (KRYTYCZNE)

- ❌ brak ML / autoscaling / heurystyk
- ❌ brak service-mesh / Istio / K8s
- ❌ brak chaos engineering

---

**ActProof Demo Package v0.1** | CC = latency × (error + retry)
