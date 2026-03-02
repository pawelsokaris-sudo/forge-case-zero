# ActProof Demo Runbook v0.1

**Czas trwania:** 15–20 minut  
**Cel:** Udowodnić scenariusz `heavy → CC↑ → diagnosis → swap → CC↓`

---

## Wymagania wstępne

- Docker + Docker Compose zainstalowane
- Porty wolne: 3000, 4000, 5000, 8080
- Terminal z dostępem do katalogu demo

---

## Faza 0: Setup (2 min)

### 0.1 Sklonuj / wejdź do repo
```bash
cd actproof-demo
```

### 0.2 Zbuduj obrazy
```bash
docker-compose build
```

### 0.3 Wyczyść poprzednie evidence
```bash
rm -f evidence/*.json
```

---

## Faza 1: Start systemu w trybie HEAVY (1 min)

### 1.1 Uruchom wszystkie serwisy
```bash
SERVICEX_VARIANT=heavy docker-compose up -d
```

### 1.2 Sprawdź status
```bash
docker-compose ps
```

**Oczekiwany wynik:** Wszystkie serwisy `Up`

### 1.3 Weryfikacja wariantu ServiceX
```bash
curl http://localhost:3000/health
```

**Oczekiwany wynik:**
```json
{"status":"healthy","variant":"heavy"}
```

---

## Faza 2: Obserwacja baseline (3 min)

CFO zbiera próbki przez `BASELINE_WINDOW_SEC` (domyślnie 120s = 2 min).

### 2.1 Obserwuj logi CFO
```bash
docker logs -f actproof-cfo
```

**Oczekiwane logi:**
```
[CFO] Baseline phase: 115s remaining
[CFO] Poll: variant=heavy, CC=45.23, p99=520ms, err=7.8%
...
[CFO] Baseline computed: CC0_global=42.50
```

### 2.2 Sprawdź czy baseline zapisany
```bash
cat evidence/baseline.json | jq '.cc0_global'
```

**Oczekiwany wynik:** Wartość CC0 (np. `40-60` dla heavy)

### 2.3 Sprawdź time series
```bash
cat evidence/cc_timeseries.json | jq 'length'
```

**Oczekiwany wynik:** Rosnąca liczba próbek

---

## Faza 3: Detekcja CC_TREND_HIGH (3-5 min)

Po baseline, CFO monitoruje czy `mean(CC) > 1.5 × CC0` przez 60s.

### 3.1 Kontynuuj obserwację logów CFO
```bash
docker logs -f actproof-cfo
```

**Oczekiwane logi (gdy CC przekracza próg):**
```
[CFO] CC check: mean=48.50, threshold=63.75, baseline=42.50
[CFO] CC breach detected, starting hold timer
...
[CFO] === EMITTING DIAGNOSIS ===
[CFO] Diagnosis sent to Action Engine: 200
```

### 3.2 Sprawdź plik diagnozy
```bash
ls evidence/diagnosis_*.json
cat evidence/diagnosis_*.json | jq '.type, .recommended_action.type'
```

**Oczekiwany wynik:**
```
"CC_TREND_HIGH"
"SWAP_VARIANT"
```

---

## Faza 4: Action Engine wykonuje swap (1 min)

### 4.1 Sprawdź logi Action Engine
```bash
docker logs actproof-action-engine
```

**Oczekiwane logi:**
```
[AE] Received diagnosis: diag-..., type: CC_TREND_HIGH
[AE] Translated command: {"type":"SWAP_VARIANT",...}
[AE] === ACTION SUCCESS ===
```

### 4.2 Sprawdź ActionResult
```bash
ls evidence/action_result_*.json
cat evidence/action_result_*.json | jq '.status, .action_type'
```

**Oczekiwany wynik:**
```
"SUCCESS"
"SWAP_VARIANT"
```

---

## Faza 5: Manualny swap (jeśli automatyczny nie zadziałał) (2 min)

Jeśli SO nie ma dostępu do Docker socket, wykonaj swap ręcznie:

### 5.1 Zatrzymaj heavy, uruchom light
```bash
docker-compose stop servicex
SERVICEX_VARIANT=light docker-compose up -d --build servicex
```

### 5.2 Weryfikacja
```bash
curl http://localhost:3000/health
```

**Oczekiwany wynik:**
```json
{"status":"healthy","variant":"light"}
```

---

## Faza 6: Obserwacja spadku CC (3 min)

### 6.1 Obserwuj logi CFO
```bash
docker logs -f actproof-cfo
```

**Oczekiwane logi (po swapie na light):**
```
[CFO] Poll: variant=light, CC=2.45, p99=45ms, err=1.2%
```

### 6.2 Porównaj CC przed/po
```bash
python3 plot_cc.py evidence/cc_timeseries.json
```

**Oczekiwany wynik:** Wykres ASCII pokazujący:
- Wysokie CC (H) przed swapem
- Niskie CC (L) po swapie

---

## Faza 7: Weryfikacja evidence (2 min)

### 7.1 Lista wszystkich artefaktów
```bash
ls -la evidence/
```

**Wymagane pliki:**
| Plik | Opis |
|------|------|
| `baseline.json` | Baseline CC0 |
| `cc_timeseries.json` | Serie czasowe CC |
| `diagnosis_*.json` | Diagnoza CFO |
| `action_result_*.json` | Wynik Action Engine |
| `so_execution_*.json` | Log Service Orchestrator |

### 7.2 Eksport CSV do wykresu
```bash
python3 plot_cc.py evidence/cc_timeseries.json --csv > evidence/cc_chart.csv
```

### 7.3 Quick check: CC przed vs po
```bash
python3 -c "
import json
data = json.load(open('evidence/cc_timeseries.json'))
heavy = [d['cc'] for d in data if d.get('variant')=='heavy']
light = [d['cc'] for d in data if d.get('variant')=='light']
print(f'Heavy avg CC: {sum(heavy)/len(heavy):.2f}' if heavy else 'No heavy data')
print(f'Light avg CC: {sum(light)/len(light):.2f}' if light else 'No light data')
"
```

---

## Faza 8: Cleanup (1 min)

```bash
docker-compose down -v
```

---

## Definition of Done ✓

Po zakończeniu demo, sprawdź checklist:

| # | Artefakt | Sprawdzenie |
|---|----------|-------------|
| 1 | `baseline.json` | `jq '.cc0_global' evidence/baseline.json` |
| 2 | `cc_timeseries.json` | `jq 'length' evidence/cc_timeseries.json` > 50 |
| 3 | `diagnosis_*.json` | Istnieje, `type: CC_TREND_HIGH` |
| 4 | `action_result_*.json` | Istnieje, `status: SUCCESS` |
| 5 | CC↓ po swapie | `light avg CC << heavy avg CC` |

---

## Troubleshooting

### CFO nie emituje diagnozy
- Sprawdź czy baseline się wyliczył (`evidence/baseline.json`)
- Sprawdź logi: `docker logs actproof-cfo`
- Heavy może nie generować wystarczająco wysokiego CC → zmniejsz `THRESHOLD_K` do 1.2

### Action Engine zwraca BLOCKED
- Sprawdź cooldown: `docker logs actproof-action-engine`
- Sprawdź politykę czasową (Pt 16-20)

### SO nie może wykonać swap
- Docker socket niedostępny → użyj manualnego swap (Faza 5)
- Sprawdź logi: `docker logs actproof-orchestrator`

### Brak danych w evidence
- Sprawdź czy volume jest zamontowany: `docker-compose config | grep evidence`

---

## Parametry konfiguracyjne

| Parametr | Wartość demo | Opis |
|----------|--------------|------|
| `BASELINE_WINDOW_SEC` | 120 | Czas zbierania baseline |
| `THRESHOLD_K` | 1.5 | Mnożnik dla progu CC |
| `HOLD_SEC` | 60 | Czas utrzymania przekroczenia |
| `COOLDOWN_SEC` | 120 | Cooldown między interwencjami |
| `POLL_INTERVAL_SEC` | 5 | Interwał pollingu MCP |

Aby przyspieszyć demo (test mode):
```bash
BASELINE_WINDOW_SEC=60 HOLD_SEC=30 THRESHOLD_K=1.2 docker-compose up -d
```

---

**Koniec Runbooka**
