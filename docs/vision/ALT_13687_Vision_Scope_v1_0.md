# ALT-13687 — Product Vision & Scope v1.0

**Status:** ZAMKNIĘTE (Proof Object — referencyjny)  
**Typ dokumentu:** Definicja produktu — logika koncepcyjna i znaczenie systemowe  
**Relacja:** Fundament teoretyczny dla ActProof (Produkt 1) i CFO MCP (Produkt 2)  
**Data:** Styczeń 2026

---

## 1. Wizja jednym zdaniem

**ALT-13687 to dowód, że prostsza ścieżka często istnieje — nawet gdy system "działa poprawnie".**

---

## 2. Problem koncepcyjny

| Obserwacja | Błędny wniosek | Prawdziwy wniosek |
|------------|----------------|-------------------|
| System działa poprawnie | "Nie ma problemu" | Koszt może rosnąć mimo poprawności |
| Algorytm daje wyniki | "Trajektoria jest optymalna" | Może istnieć krótsza ścieżka |
| Greedy działa lokalnie | "Kontynuuj tę strategię" | Lokalna poprawność ≠ globalna efektywność |
| Brak awarii | "System jest zdrowy" | Brak awarii ≠ niski koszt sterowania |

**Luka:** Brak formalnego dowodu, że "działający system" może być najdroższą możliwą trajektorią.

---

## 3. Co ALT-13687 udowadnia

### 3.1 Twierdzenie (empiryczne)

> System może pozostawać przez bardzo długi czas w stanie lokalnie poprawnym, generując wysoki koszt sterowania, mimo że istnieje znacznie prostsza i krótsza ścieżka rozwiązania.

### 3.2 Dowód

| Element | Wartość |
|---------|---------|
| **Środowisko** | Równoważenie sum liczb pierwszych (Retrograde Balancing) |
| **Przypadek testowy** | p = 13,687 |
| **Trajektoria greedy** | τ_greedy = 97 kroków |
| **Trajektoria alternatywna** | τ_optimal = 7 kroków (po ablacji p = 13,681) |
| **GTI (Greedy Trap Index)** | 97 - 7 = 90 |

### 3.3 Metoda

- Minimalny, w pełni kontrolowalny model algorytmiczny
- Bez założeń ontologicznych
- Bez heurystyk domenowych
- Czysta matematyka jako "laboratorium"

---

## 4. Czego ALT-13687 NIE twierdzi

| NIE twierdzi | Wyjaśnienie |
|--------------|-------------|
| ❌ Istnieje "złoty algorytm" | To dowód istnienia, nie propozycja rozwiązania |
| ❌ Odkryto nową własność liczb pierwszych | Liczby pierwsze to tylko środowisko testowe |
| ❌ Greedy jest błędny z definicji | Greedy może być dobry — ale nie zawsze |
| ❌ Każdą sytuację da się rozwiązać szybciej | Niektóre trajektorie są optymalne |

**ALT-13687 pokazuje wyłącznie:**

> Utrzymywanie lokalnie racjonalnej trajektorii może być systemowo najdroższą decyzją.

---

## 5. Teza robocza (wersja kanoniczna)

> **Jeżeli system długo działa poprawnie, ale jego koszt sterowania rośnie, należy domyślnie założyć istnienie prostszej trajektorii, a nie zwiększać wysiłek utrzymania obecnej.**

Ta teza jest:
- Bezpośrednio używalna projektowo
- Niezależna od domeny
- Falsyfikowalna empirycznie

---

## 6. Rola w ekosystemie

### 6.1 ALT-13687 jako Proof Object

```
┌─────────────────────────────────────────────────────────────────┐
│                        ALT-13687                                │
│                    (Proof of Simpler Path)                      │
│                                                                 │
│   "Prostsza ścieżka często istnieje"                           │
│   "Koszt trwania w złej trajektorii jest mierzalny"            │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ uzasadnia
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │      ACTPROOF        │      │      CFO MCP         │        │
│  │     (Produkt 1)      │      │     (Produkt 2)      │        │
│  │                      │      │                      │        │
│  │  Mierzy CC           │      │  Ocenia trajektorię  │        │
│  │  Wykrywa degradację  │      │  agenta w czasie     │        │
│  │  Koryguje topologię  │      │  Decyduje o zmianie  │        │
│  │                      │      │  strategii           │        │
│  └──────────────────────┘      └──────────────────────┘        │
│                                                                 │
│            Systemy rozproszone          Agenci LLM             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Relacja z ActProof (Produkt 1)

| Koncept ActProof | Uzasadnienie z ALT-13687 |
|------------------|--------------------------|
| **Control Cost (CC)** | Koszt trwania w trajektorii jest mierzalny |
| **Baseline + trend** | Rosnący CC = sygnał ALT-stanu |
| **SWAP_VARIANT** | Zmiana trajektorii, nie naprawa obecnej |
| **Brak ML** | Decyzja oparta na CC, nie na predykcji |

### 6.3 Relacja z CFO MCP (Produkt 2)

| Funkcja CFO MCP | Uzasadnienie z ALT-13687 |
|-----------------|--------------------------|
| Nie steruje decyzjami agenta | Agent może "działać poprawnie" i być drogi |
| Ocenia opłacalność trajektorii w czasie | Rosnący koszt przy poprawnych wynikach = ALT-stan |
| Zmiana strategii / restart / eskalacja | Prostsza ścieżka może istnieć |
| Nie mikrozarządza logiką zadania | Problem jest trajektoryjny, nie punktowy |

---

## 7. Znaczenie dla warstwy Latent Tension (T)

ALT-13687 jest czystym przykładem mechanizmu **Latent Tension**:

| Metryka | Interpretacja ALT-13687 |
|---------|-------------------------|
| **Wysokie τ** | Wysoki czas relaksacji — system "utknął" |
| **Klastry rekordów** | Obszary strukturalnej kruchości |
| **Istnienie krótkiej ścieżki** | Napięcie jest trajektoryjne, nie konieczne |

**Wniosek:** T (Fragility) w ActProof mierzy to, co ALT-13687 demonstruje — ukryty koszt "działania poprawnie".

---

## 8. Zasada projektowa (do przeniesienia 1:1)

> **Jeżeli agent "działa", ale wymaga coraz więcej podtrzymywania, to nie jest argument za dalszym działaniem, tylko sygnał do zmiany trajektorii.**

ALT-13687 dostarcza **empirycznego uzasadnienia** tej zasady.

### Zastosowanie w praktyce:

| Obserwacja | Błędna reakcja | Poprawna reakcja |
|------------|----------------|------------------|
| Agent działa, CC rośnie | "Dodaj więcej retry" | "Zmień trajektorię" |
| System działa, latency rośnie | "Skaluj horyzontalnie" | "Sprawdź czy istnieje prostsza ścieżka" |
| Proces trwa długo, ale daje wyniki | "Poczekaj" | "Oceń koszt trwania vs. restart" |

---

## 9. Konkluzja końcowa

ALT-13687 zamyka dyskusję typu:

> "A może inaczej się nie da?"

**Odpowiedź:**

> Często da się inaczej.  
> Nie zawsze wiemy jak od razu.  
> Ale koszt trwania w złej trajektorii jest mierzalny i nie musi być akceptowany.

---

## 10. Co ALT-13687 umożliwia

| Obszar | Umożliwia |
|--------|-----------|
| **Projektowanie systemów** | CC jako pierwszoplanowy sygnał, nie metryka pomocnicza |
| **Projektowanie agentów** | Warstwa CFO nad agentem, nie w agencie |
| **Uzasadnienie ActProof** | Formalny dowód, że problem istnieje |
| **Komunikacja z CTO/VC** | "To nie teoria — mamy dowód matematyczny" |

---

## 11. Dokumentacja powiązana

| Dokument | Relacja do ALT-13687 |
|----------|---------------------|
| **Raport Techniczny v1.1** | Pełny opis eksperymentu, GTI, Parity Theorem |
| **Technical Specification v1.0** | Definicje T, MCI, mechanika Greedy Trap |
| **ADR-001** | CC jako główna wielkość sterowania — uzasadnione przez ALT-13687 |
| **ADR-002** | Brak ML — decyzja oparta na mierzalnym koszcie, nie predykcji |
| **ActProof Vision & Scope v1.0** | Produkt implementujący zasadę ALT-13687 |
| **Platform Vision & Scope v0.1** | CFO MCP jako warstwa oceny trajektorii agenta |

---

## 12. Status i przeznaczenie

| Aspekt | Wartość |
|--------|---------|
| **Status** | ZAMKNIĘTE — dowód kompletny |
| **Typ** | Proof Object — referencyjny |
| **Przeznaczenie** | Uzasadnienie teoretyczne, nie implementacja |
| **Modyfikacje** | Brak — dokument stabilny |

---

## 13. Podsumowanie

**ALT-13687 to:**
- Dowód istnienia prostszych ścieżek w systemach "działających poprawnie"
- Fundament teoretyczny dla Control Cost jako metryki pierwszoplanowej
- Uzasadnienie dla warstwy kontrolnej (ActProof, CFO MCP)
- Zamknięty eksperyment, nie propozycja algorytmu

**ALT-13687 NIE jest:**
- Nową teorią liczb pierwszych
- Algorytmem optymalizacji
- Heurystyką domenową
- Otwartym problemem badawczym

**Jednym zdaniem:**

> ALT-13687 = Proof that simpler paths often exist.

---

## 14. Trzy produkty — jedna filozofia

```
┌─────────────────────────────────────────────────────────────────┐
│                        ALT-13687                                │
│              "Prostsza ścieżka często istnieje"                 │
│                      (FUNDAMENT)                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
            ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│      ACTPROOF         │       │   PLATFORMA (P2)      │
│     (Produkt 1)       │       │   Marketplace +       │
│                       │       │   CFO MCP             │
│  Warstwa kontrolna    │       │                       │
│  dla systemów         │       │  Warstwa kontrolna    │
│  rozproszonych        │       │  dla agentów i        │
│                       │       │  mikroserwisów        │
│  CC = koszt sterowania│       │                       │
│  Interwencja przed    │       │  CC = waluta jakości  │
│  awarią               │       │  Billing + routing    │
└───────────────────────┘       └───────────────────────┘
```

**Wspólna zasada:**

> Koszt trwania w złej trajektorii jest mierzalny.  
> Nie musi być akceptowany.

---

**ALT-13687 Product Vision & Scope v1.0 | ZAMKNIĘTE | Referencyjne**
