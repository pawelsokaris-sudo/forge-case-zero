# ActProof – Recorded Demo Presentation (v0.1)

**Format:** nagranie + slajdy  
**Czas:** ~4 min 30 s  
**Styl:** spokojny, rzeczowy, bez entuzjazmu  
**Cel:** pokazać fizykę systemu, nie technologię

---

## 🎞️ SLIDE 1 — Tytuł (0:00–0:20)

**Slajd (tekst):**
```
ActProof
Control before failure
```

**Narracja:**

„Większość systemów nie psuje się nagle.  
Najpierw stają się drogie w utrzymaniu.  
Dopiero potem — padają."

*(pauza: 2s)*

„ActProof mierzy ten koszt.  
Zanim pojawi się awaria."

---

## 🎞️ SLIDE 2 — Problem (0:20–0:50)

**Slajd:**
```
Systems fail late.
Cost grows early.
```

**Narracja:**

„Dziś reagujemy dopiero wtedy, gdy pojawi się błąd.  
Alert. Incydent."

„Ale wcześniej — system już płaci cenę.  
Retry. Latency. Ręczne interwencje."

*(pauza: 1s)*

„Ten koszt jest realny.  
Tylko nikt go nie mierzy."

---

## 🎞️ SLIDE 3 — Minimalna architektura demo (0:50–1:20)

**Slajd:**
```
Gateway → ServiceX (light / heavy)
             ↓
          ActProof
```

**Narracja:**

„To demo jest celowo proste."

„Jeden gateway.  
Jedna usługa.  
Dwa warianty implementacji."

*(pauza: 1s)*

„Nie ma ML.  
Nie ma autoscalingu.  
Jest tylko — pomiar kosztu sterowania."

---

## 🎞️ SLIDE 4 — Control Cost (1:20–1:50)

**Slajd:**
```
Control Cost (CC)
latency × retries
```

**Narracja:**

„Control Cost — to koszt utrzymania systemu w stanie poprawnym."

„Im więcej opóźnień i retry —  
tym drożej system udaje, że działa normalnie."

*(pauza: 1s)*

„To nie jest SLA.  
To jest fizyka."

---

## 🎞️ SLIDE 5 — Baseline (1:50–2:15)

**Slajd:**
```
[Wykres: stabilny CC]
```

**Narracja:**

„System startuje w wariancie lekkim.  
Wszystko działa poprawnie."

*(pauza: 1s)*

„ActProof wyznacza baseline.  
Normalny koszt sterowania."

---

## 🎞️ SLIDE 6 — Degradacja bez awarii (2:15–2:50)

**Slajd:**
```
[Wykres: CC rośnie]
```

**Narracja:**

„Teraz zmieniamy implementację usługi.  
Wariant ciężki."

„Funkcjonalnie — wszystko nadal działa.  
Nie ma awarii.  
Nie ma alertów."

*(pauza: 2s)*

„Ale koszt sterowania —  
zaczyna gwałtownie rosnąć."

---

## 🎞️ SLIDE 7 — Diagnoza (2:50–3:20)

**Slajd:**
```
Diagnosis: CC trend ↑
```

**Narracja:**

„ActProof nie naprawia systemu.  
On tylko — diagnozuje."

*(pauza: 1s)*

„Widzimy trend.  
System jeszcze działa.  
Ale strukturalnie — staje się drogi."

---

## 🎞️ SLIDE 8 — Interwencja (3:20–3:50)

**Slajd:**
```
Action: swap heavy → light
```

**Narracja:**

„System wykonuje jedną, prostą interwencję.  
Zmieniamy topologię — nie skalę."

*(pauza: 1s)*

„Nie naprawiamy kodu.  
Usuwamy źródło kosztu."

---

## 🎞️ SLIDE 9 — Dowód (3:50–4:15)

**Slajd:**
```
[Wykres: CC wraca do baseline]
```

**Narracja:**

„Koszt sterowania — spada.  
System wraca do stabilnego stanu."

*(pauza: 1s)*

„Nie dlatego, że się zepsuł.  
Tylko dlatego — że przestał być drogi."

---

## 🎞️ SLIDE 10 — Zamykanie (4:15–4:30)

**Slajd:**
```
Control before failure.
```

**Narracja:**

„System jeszcze działał.  
My już wiedzieliśmy, że jest drogi."

*(pauza: 2s)*

„To jest różnica.  
Między obserwacją — a sterowaniem."

---

# 🎬 WSKAZÓWKI NAGRANIOWE

| Aspekt | Zalecenie |
|--------|-----------|
| **Głos** | spokojny, niski, bez przyspieszania |
| **Pauzy** | celowe — nie bój się ciszy |
| **Dygresje** | zero tłumaczeń technicznych |
| **Czas** | max 4:30 (lepiej krócej niż dłużej) |

---

# ✅ To nagranie spełnia 3 cele naraz

- ✔ demo technologii  
- ✔ pitch CTO  
- ✔ proof-of-concept dla VC

**Bez MCP. Bez tłumaczeń. Bez obrony.**

---

# 📝 NOTATKI REDAKCYJNE

## Wprowadzone zmiany:

| Slajd | Zmiana | Uzasadnienie |
|-------|--------|--------------|
| 1 | Rozbicie długiego zdania na trzy krótsze | Lepszy oddech, naturalny rytm |
| 2 | Dodanie pauzy przed puentą | Wzmocnienie pointy |
| 3 | Rozbicie listy negacji na osobne linie | Każdy element = jeden oddech |
| 4 | Usunięcie „tylko" przed „udaje" | Zbędne słowo, lepszy flow |
| 6 | Wydzielenie „Wariant ciężki" jako osobne zdanie | Dramaturgiczny nacisk |
| 7 | Dodanie „tylko" jako izolowanego akcentu | Wzmocnienie kontrastu roli CFO |
| 9 | Rozbicie ostatniego zdania | Puenta wymaga pauzy |
| 10 | Wydzielenie „Między obserwacją — a sterowaniem" | Finałowa pointa, wymaga ciszy |

## [Voice Suggestions] — do rozważenia:

1. **Slide 4** — fraza „udaje, że działa normalnie" może brzmieć lekko potocznie. Alternatywa: „symuluje normalną pracę" (bardziej formalnie) lub zostawić (bardziej ludzko).

2. **Slide 6** — słowo „gwałtownie" wymaga wyraźnej artykulacji. Można zastąpić: „szybko" lub „wyraźnie" jeśli sprawia trudność.

3. **Slide 10** — finałowa pauza 2s jest kluczowa. Nie skracać.

---

**Dokument gotowy do nagrania 1:1.**
