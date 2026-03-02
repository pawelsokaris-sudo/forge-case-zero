# [Nazwa Robocza] — Platform Vision & Scope v0.1

**Status:** Draft  
**Typ dokumentu:** Koncepcja biznesowa i architektura logiczna  
**Relacja:** Produkt 2 — nadbudowa nad ActProof (Produkt 1)  
**Data:** Styczeń 2026

---

## 1. Wizja jednym zdaniem

**Platforma, która zamienia intencję klienta w działające rozwiązanie — skomponowane z mikroserwisów, automatycznie optymalizowane i rozliczane.**

---

## 2. Problem rynkowy

| Aktor | Problem dziś |
|-------|--------------|
| **Klient** | Chce rozwiązanie, nie chce budować. Nie wie jakich usług potrzebuje, nie chce nimi zarządzać. |
| **Twórca mikroserwisu** | Ma działającą usługę, ale nie ma dystrybucji. Nie wie jak dotrzeć do klientów. Nie ma infrastruktury rozliczeniowej. |
| **Integrator** | Ręcznie komponuje rozwiązania, ręcznie monitoruje, ręcznie rozlicza. Skalowanie = więcej ludzi. |

**Luka:** Nie istnieje platforma, która łączy te trzy strony z wbudowaną kontrolą kosztów i automatycznym rozliczaniem.

---

## 3. Aktorzy i ich cele

### 3.1 Klient (zamawiający rozwiązanie)

**Wchodzi z:** opisem / projektem / konsultacją  
**Wychodzi z:** działającym rozwiązaniem  
**Płaci za:** efekt (nie za poszczególne usługi)  
**Nie chce:** zarządzać infrastrukturą, wybierać mikroserwisów, debugować integracji

### 3.2 Twórca mikroserwisu

**Wchodzi z:** działającą usługą (eksponowaną przez MCP)  
**Wychodzi z:** przychodem pasywnym  
**Zarabia za:** użycie swojej usługi przez rozwiązania klientów  
**Nie chce:** szukać klientów, budować infrastruktury billingowej, monitorować SLA

### 3.3 Platforma (operator)

**Dostarcza:** kompozycję, runtime, kontrolę, rozliczenia  
**Zarabia na:** prowizji od transakcji + subskrypcji premium  
**Gwarantuje:** że rozwiązanie działa efektywnie (nie "drogo udaje")

---

## 4. Przepływ: Od intencji do działającego rozwiązania

```
KLIENT                    PLATFORMA                           TWÓRCY
   │                          │                                  │
   │  "Potrzebuję X"          │                                  │
   ├─────────────────────────►│                                  │
   │                          │                                  │
   │                    ┌─────▼─────┐                            │
   │                    │  INTENT   │ (projekt/opis/konsultacja) │
   │                    │  PARSER   │                            │
   │                    └─────┬─────┘                            │
   │                          │ cel + wymagania                  │
   │                          ▼                                  │
   │                    ┌───────────┐    ┌──────────────────┐    │
   │                    │  SERVICE  │◄───│    MARKETPLACE   │◄───┤
   │                    │ORCHESTRAT.│    │ (tysiące μsvc)   │    │
   │                    └─────┬─────┘    └──────────────────┘    │
   │                          │ topologia                        │
   │                          ▼                                  │
   │                    ┌───────────┐                            │
   │                    │  RUNTIME  │ (μsvc + MCP + bufory)      │
   │                    └─────┬─────┘                            │
   │                          │ metryki                          │
   │                          ▼                                  │
   │                    ┌───────────┐                            │
   │                    │ ACTPROOF  │ ◄── PRODUKT 1 (LOCK)       │
   │                    │   (CFO)   │                            │
   │                    └─────┬─────┘                            │
   │                          │ CC↑ → diagnoza                   │
   │                          ▼                                  │
   │                    ┌───────────┐                            │
   │                    │  ACTION   │                            │
   │                    │  ENGINE   │ → swap / rekonfiguracja    │
   │                    └─────┬─────┘                            │
   │                          │                                  │
   │                          ▼                                  │
   │                    ┌───────────┐                            │
   │  rachunek          │  BILLING  │    prowizja ───────────────►
   │◄─────────────────  │           │                            │
   │                    └───────────┘                            │
```

---

## 5. Komponenty platformy

### 5.1 Intent Layer (do zbudowania)

| Aspekt | Opis |
|--------|------|
| **Wejście** | Projekt / opis tekstowy / konsultacja z ekspertem |
| **Wyjście** | Wymagania funkcjonalne + niefunkcjonalne |
| **Status** | Koncepcja — wymaga specyfikacji |

### 5.2 Service Orchestrator (do zbudowania)

| Aspekt | Opis |
|--------|------|
| **Rola** | Komponuje rozwiązanie z dostępnych mikroserwisów |
| **Wejście** | Wymagania z Intent Layer |
| **Wyjście** | Topologia (które usługi, jak połączone, jaka konfiguracja) |
| **Relacja z ActProof** | SO wykonuje komendy Action Engine (SWAP_VARIANT, CONFIG_TUNE) |
| **Status** | Interfejs zdefiniowany w ActProof (ADR-003), logika do zbudowania |

### 5.3 Marketplace mikroserwisów (do zbudowania)

| Aspekt | Opis |
|--------|------|
| **Zawartość** | Tysiące mikroserwisów od zewnętrznych twórców |
| **Interfejs** | MCP (Minimal Control Protocol) — ustandaryzowany |
| **Wymagania dla twórcy** | Ekspozycja /mcp/observe (metryki), /mcp/config (konfiguracja) |
| **Status** | Kontrakt MCP istnieje w dokumentacji ActProof, marketplace do zbudowania |

### 5.4 ActProof — PRODUKT 1 (LOCK)

| Aspekt | Opis |
|--------|------|
| **Rola** | Monitoruje CC, wykrywa degradację, emituje diagnozy |
| **Wejście** | Metryki z mikroserwisów (przez MCP /observe) |
| **Wyjście** | CFODiagnosis → Action Engine |
| **Status** | ✅ LOCK — demo działa, dokumentacja kompletna |

**Odniesienia do istniejącej dokumentacji:**

- Definicja CC: `CC = latency_p99 × (error_rate + retry_rate)` — **ADR-001**
- Brak ML/heurystyk: **ADR-002**
- Separacja ról CFO/AE/SO: **ADR-003**
- Kontrakt CFODiagnosis: **contracts/CFODiagnosis.schema.json**
- Kontrakt ActionResult: **contracts/ActionResult.schema.json**
- Demo flow: **RUNBOOK.md**

### 5.5 Action Engine (LOCK)

| Aspekt | Opis |
|--------|------|
| **Rola** | Waliduje polityki, tłumaczy diagnozy na komendy, wykonuje przez SO |
| **Polityki MVP** | Time, Cooldown, Blast Radius, Idempotency |
| **Komendy MVP** | SWAP_VARIANT, CONFIG_TUNE, BUFFER_ENABLE, DEGRADE_MODE |
| **Status** | ✅ LOCK — specyfikacja i demo gotowe |

**Odniesienia:**

- Command Spec: **ActProof_Action_Engine_Command_Spec_v0_1.docx**
- Rollback jako nowa diagnoza: **ADR-005**

### 5.6 Billing / Settlement (do zbudowania)

| Aspekt | Opis |
|--------|------|
| **Rola** | Rozlicza użycie mikroserwisów, wypłaca twórcom, fakturuje klientów |
| **Model** | usage × stawka × [jakość?] |
| **Dane wejściowe** | Logi użycia z runtime + CC jako wskaźnik jakości |
| **Status** | Koncepcja — wymaga specyfikacji |

---

## 6. Model rozliczeń (draft)

### 6.1 Klient płaci za:

| Element | Model |
|---------|-------|
| Działające rozwiązanie | Subskrypcja lub pay-per-use |
| Zasoby (compute, storage) | Pass-through lub wliczone |
| Premium SLA | Opcjonalny tier |

### 6.2 Twórca otrzymuje:

| Element | Model |
|---------|-------|
| Użycie jego mikroserwisu | usage × stawka (ustawiana przez twórcę) |
| Bonus za jakość? | Niski CC = wyższa wypłata? (do decyzji) |
| Kara za degradację? | Wysoki CC = obniżona stawka? (do decyzji) |

### 6.3 Platforma zarabia na:

| Element | Model |
|---------|-------|
| Prowizja od transakcji | % od każdego użycia mikroserwisu |
| Subskrypcja premium | Wyższe SLA, priorytetowe wsparcie |
| Usługi dodatkowe | Konsultacje, custom orchestration |

---

## 7. Rola ActProof w modelu biznesowym

ActProof nie jest tylko warstwą techniczną. **CC staje się walutą jakości:**

| Scenariusz | Efekt biznesowy |
|------------|-----------------|
| Mikroserwis ma niski CC | Preferowany w orchestracji, wyższa wypłata dla twórcy |
| Mikroserwis ma wysoki CC | Automatyczny swap na alternatywę, niższa wypłata |
| Rozwiązanie ma rosnący CC | Platforma interweniuje zanim klient zauważy problem |
| Klient płaci za efekt | Nie płaci za "drogie udawanie" |

**ActProof = mechanizm wymuszający jakość w marketplace.**

---

## 8. Co jest LOCK vs. do zbudowania

| Komponent | Status | Dokumentacja |
|-----------|--------|--------------|
| ActProof CFO | ✅ LOCK | ADR-001, ADR-002, CFO Lite Spec |
| Action Engine | ✅ LOCK | ADR-003, ADR-005, Command Spec |
| Kontrakty JSON | ✅ LOCK | contracts/*.json |
| Demo flow | ✅ LOCK | RUNBOOK.md, docker-compose |
| MCP interface | ✅ Zdefiniowany | /mcp/observe w ServiceX |
| Service Orchestrator | ⚠️ Interfejs LOCK, logika TBD | ADR-003 |
| Intent Layer | ❌ Koncepcja | — |
| Marketplace | ❌ Koncepcja | — |
| Billing | ❌ Koncepcja | — |

---

## 9. Otwarte pytania (do decyzji)

| # | Pytanie | Wpływ |
|---|---------|-------|
| 1 | Nazwa platformy (Produkt 2)? | Branding, komunikacja |
| 2 | Czy twórca ustawia cenę sam, czy platforma? | Model ekonomiczny |
| 3 | Czy CC wpływa na wypłatę twórcy? | Incentive alignment |
| 4 | Jak wygląda Intent Layer? (AI? Konsultant? Formularz?) | UX, skalowanie |
| 5 | Czy klient widzi skład rozwiązania (które μsvc)? | Transparentność |
| 6 | Jak obsłużyć vendor lock-in twórcy? (usługa znika) | Ryzyko operacyjne |
| 7 | Kto odpowiada za dane klienta? (GDPR, privacy) | Compliance |

---

## 10. Następne kroki (rekomendacja)

| Krok | Priorytet | Output |
|------|-----------|--------|
| 1. Decyzja: nazwa Produktu 2 | Wysoki | Branding |
| 2. Specyfikacja Billing v0.1 | Wysoki | Model rozliczeń |
| 3. Specyfikacja Intent Layer v0.1 | Średni | Interfejs klient → platforma |
| 4. Specyfikacja Marketplace v0.1 | Średni | Wymagania dla twórców |
| 5. Pitch deck Produkt 2 | Wysoki | Materiał dla VC |

---

## 11. Relacja do istniejącej dokumentacji ActProof

| Dokument ActProof | Rola w Produkcie 2 |
|-------------------|-------------------|
| **ADR Pack v0.1** | Fundament architektoniczny — bez zmian |
| **CFO Lite Spec** | Silnik CC dla platformy |
| **Action Engine Spec** | Warstwa wykonawcza dla SO |
| **Demo Package** | Proof-of-concept warstwy kontrolnej |
| **Pitch CTO/VC** | Nadal aktualny dla Produktu 1 (ActProof standalone) |
| **MCP decision doc** | MCP staje się standardem marketplace |

---

**Dokument roboczy — do iteracji.**
