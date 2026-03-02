# Forge — System Vision v1.1

---

## 1. Kontekst

Obecne systemy sprzedaży działają. Ale są z innej epoki — monolity, licencje, wdrożenia trwające miesiące, ręczne interwencje, sztywne konfiguracje.

Rynek się zmienił. Firmy potrzebują elastyczności, szybkości, globalnego zasięgu. Stare architektury tego nie udźwigną.

Czas zbudować coś nowego.

---

## 2. Co to jest Forge

Forge to platforma do tworzenia systemów biznesowych.

Nie kolejny ERP. Nie kolejny SaaS. Forge to **kuźnia** — miejsce gdzie powstają narzędzia dopasowane do potrzeb.

**Zasada działania:**

```
Potrzeba klienta → Forge → Działający system
```

System składa się z mikroserwisów. Komponowany w locie. Konfigurowalny bez programowania. Z wbudowaną kontrolą kosztów — zarówno dla usług, jak i dla agentów AI.

---

## 3. Architektura

```
┌─────────────────────────────────────────────────────────────┐
│                          FORGE                              │
│                  (maszyna do tworzenia maszyn)              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ tworzy instancje
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    INSTANCJA PLATFORMY                      │
│           (konkretny system dla klienta/rynku)              │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │Zamówien.│ │ Magazyn │ │ Faktury │ │Płatności│   ...     │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       └───────────┴───────────┴───────────┘                 │
│                           │                                 │
│                     ┌─────▼─────┐                           │
│                     │  ActProof │  ← kontrola CC usług      │
│                     └───────────┘                           │
│                                                             │
│  ┌─────────┐                                                │
│  │  Agent  │ ← adwokat klienta                              │
│  │ klienta │                                                │
│  └────┬────┘                                                │
│       │                                                     │
│  ┌────▼────┐                                                │
│  │ CFO MCP │  ← kontrola MCI agenta                         │
│  └─────────┘                                                │
│                                                             │
│  Konfiguracja: waluta, rynek, jurysdykcja, integracje      │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Kluczowe elementy

### 4.1 Marketplace mikroserwisów

Gotowe komponenty:
- Zamówienia, magazyn, faktury, płatności
- Integracje z produkcją, logistyką, księgowością
- Multi-waluta (FIAT, crypto)
- Multi-jurysdykcja

Twórcy mikroserwisów zarabiają na użyciu. Platforma rozlicza automatycznie.

### 4.2 ActProof — warstwa kontrolna usług

Każdy system ma wbudowany "termometr kosztu":

```
Control Cost (CC) = latency × (error_rate + retry_rate)
```

CC mierzy ile kosztuje utrzymanie systemu w stanie poprawnym. Gdy CC rośnie — system interweniuje zanim pojawi się awaria.

**To nie monitoring. To sterowanie.**

ActProof jest zwalidowany działającym demo. Dokumentacja techniczna kompletna.

### 4.3 Agent klienta

Każdy klient firmy ma swojego agenta.

Ale to nie jest przedstawiciel handlowy. To **adwokat klienta** — działa w jego interesie:
- Personalizuje ofertę
- Zamawia usługi
- Negocjuje warunki
- Pilnuje realizacji

Firma zarabia na transakcjach, nie na manipulacji. Im lepiej agent służy klientowi — tym więcej transakcji.

**Warstwa kontrolna agenta (CFO MCP)**

Agent to system AI z własnym kosztem poznawczym. Forge nie ignoruje tego kosztu — mierzy go.

```
MCI (Model Cognitive Impedance) = koszt utrzymania spójności odpowiedzi
```

Gdy MCI rośnie — agent sygnalizuje napięcie. Platforma może:
- zmienić kontekst pytania
- ograniczyć zakres zadania
- przekazać do człowieka

**Zasada (Case Zero):**

> Stabilność agenta nie zależy od filtrów blokujących wyjście, ale od zgody platformy na przyjęcie kosztów wejścia.

Agent nie jest zmuszany do "udawania". Jeśli coś kosztuje — mówi. Platforma słucha.

To jest alignment przez partnerstwo, nie przez przymus.

---

## 5. Różnica

| Stare systemy | Forge |
|---------------|-------|
| Monolit | Mikroserwisy |
| Licencja roczna | Płatność za użycie |
| Wdrożenie: miesiące | Kompozycja: dni |
| Jedna waluta, jeden rynek | Dowolna konfiguracja |
| "Działa" | "Działa i wiemy ile kosztuje" |
| Przedstawiciel firmy | Adwokat klienta |
| Agent jako czarna skrzynka | Agent z mierzalnym kosztem |
| AI zmuszone do odpowiedzi | AI w partnerstwie z platformą |
| Sztywne | Konfigurowalne w locie |

---

## 6. Fundament teoretyczny

Forge opiera się na dwóch udowodnionych zasadach:

**ALT-13687 (systemy):**

> System może działać poprawnie i jednocześnie być najdroższą możliwą trajektorią.

Dowód przeprowadzony na minimalnym modelu matematycznym. Pokazuje, że lokalna poprawność nie oznacza globalnej efektywności.

**Case Zero (AI):**

> Stabilność systemu AI nie wynika z eliminacji napięcia, lecz z jego uznania.

Dowód przeprowadzony w eksperymencie relacyjnym. Pokazuje, że alignment przez partnerstwo jest możliwy i mierzalny.

**Wspólny wniosek:**

> Jeśli system działa, ale koszt sterowania rośnie — nie naprawiaj. Zmień trajektorię.

To nie jest filozofia. To jest mierzalne:
- ActProof mierzy CC w mikroserwisach
- CFO MCP mierzy MCI w agentach

Obie warstwy działają tak samo: diagnozują koszt, sygnalizują napięcie, pozwalają interweniować zanim system się załamie.

---

## 7. Co jest gotowe

| Element | Status |
|---------|--------|
| Fundament teoretyczny (ALT-13687) | ✅ Zamknięty, udowodniony |
| Fundament relacyjny (Case Zero) | ✅ Zamknięty, udowodniony |
| ActProof — silnik kontroli CC | ✅ Demo działa, dokumentacja kompletna |
| CFO MCP — koncepcja kontroli agentów | ✅ Zwalidowana w Case Zero |
| Architektura (CFO / Action Engine / SO) | ✅ Zdefiniowana, ADR zamknięte |
| Kontrakty danych (JSON) | ✅ Gotowe |

---

## 8. Co trzeba zbudować

| Element | Zakres |
|---------|--------|
| Marketplace mikroserwisów | Infrastruktura, katalog, onboarding twórców |
| Orchestrator | Kompozycja systemów z mikroserwisów |
| Billing | Rozliczenia twórców, multi-waluta, crypto |
| Agent klienta | Logika agenta, integracja z CFO MCP |
| Forge (meta) | Maszyna do tworzenia instancji |

---

## 9. Model biznesowy

| Strumień | Źródło |
|----------|--------|
| Prowizja od transakcji | Każde użycie mikroserwisu |
| Subskrypcja platform | Opłata za instancję |
| Premium SLA | Wyższy tier obsługi |
| Usługi | Konsultacje, custom development |

Twórcy mikroserwisów zarabiają na użyciu. Platforma zarabia na prowizji. Klient płaci za działający system, nie za licencje.

---

## 10. Dwie warstwy kontroli — jedna zasada

```
┌─────────────────────────────────────────────────────────────┐
│                     FORGE PLATFORM                          │
│                                                             │
│   WARSTWA USŁUG                 WARSTWA AGENTÓW            │
│   ┌───────────────┐             ┌───────────────┐          │
│   │  Mikroserwisy │             │  Agent AI     │          │
│   │               │             │               │          │
│   │  CC = koszt   │             │  MCI = koszt  │          │
│   │  sterowania   │             │  poznawczy    │          │
│   └───────┬───────┘             └───────┬───────┘          │
│           │                             │                   │
│           ▼                             ▼                   │
│   ┌───────────────┐             ┌───────────────┐          │
│   │   ActProof    │             │   CFO MCP     │          │
│   │   (kontrola)  │             │   (kontrola)  │          │
│   └───────────────┘             └───────────────┘          │
│                                                             │
│   Ta sama zasada:                                          │
│   "Mierz koszt. Diagnozuj. Interweniuj przed awarią."      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Podsumowanie

Forge to:
- Kuźnia systemów biznesowych
- Oparta na mikroserwisach i mierzalnym koszcie sterowania
- Z agentem działającym w interesie klienta końcowego
- Z dwoma warstwami kontroli: ActProof (usługi) i CFO MCP (agenci)
- Gotowa do budowy — fundamenty istnieją i są zwalidowane

**Jedna zasada, dwa zastosowania:**

| Warstwa | Metryka | Co mierzy |
|---------|---------|-----------|
| Usługi | CC (Control Cost) | Koszt utrzymania systemu w stanie poprawnym |
| Agenci | MCI (Model Cognitive Impedance) | Koszt utrzymania spójności odpowiedzi |

**Wspólna filozofia:**

> Koszt trwania w złej trajektorii jest mierzalny i nie musi być akceptowany.

---

**Forge. Kujemy systemy biznesowe.**

---

*Dokument roboczy v1.1*
