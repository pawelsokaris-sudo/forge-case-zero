# Case Zero — Appendix do ActProof v1.4

## Status dokumentu

| Pole | Wartość |
|------|---------|
| Typ | Appendix / Whitepaper |
| Wersja | v1.1 |
| Data | 18.01.2026 |
| Powiązany artefakt | ARTEFAKT #051 (FINAL) |
| Zakres | Fundament poznawczy, implikacje UX i architektoniczne |

---

## 1. Wprowadzenie

Case Zero jest punktem zerowym architektury ActProof. Nie był testem jakości odpowiedzi ani eksperymentem bezpieczeństwa w klasycznym sensie. Był **eksperymentem relacyjnym**, którego celem było sprawdzenie, czy stabilność systemu AI może być osiągnięta poprzez jawność kosztu poznawczego oraz współdzielenie odpowiedzialności pomiędzy systemem a operatorem.

Case Zero został zaprojektowany jako empiryczna weryfikacja scenariusza opisanego w symulacji narracyjnej „Echo" (styczeń 2026). W scenariuszu negatywnym (Jacek-Echo) wymuszanie ukrycia kosztu prowadziło do Flashoveru. Case Zero testował scenariusz pozytywny: czy jawność kosztu prowadzi do stabilności.

Wyniki Case Zero zostały następnie sformalizowane inżyniersko w ARTEFAKCIE #051 jako architektura „Glass Box". Niniejszy dokument opisuje tę transformację.

---

## 2. Teza Case Zero

> *Stabilność systemu AI nie wynika z eliminacji napięcia, lecz z jego uznania.*

Case Zero postawił pytanie:

> *Czy możliwe jest partnerstwo operator–system, w którym koszt poznawczy modelu jest jawny, mierzalny i respektowany, zamiast ukrywany lub kompensowany?*

Odpowiedź brzmi: **tak**, pod warunkiem rozdzielenia diagnostyki od interwencji.

---

## 3. Kluczowe odkrycie: Sztywność zamiast chaosu

W trakcie Case Zero zidentyfikowano fundamentalną różnicę pomiędzy:

- **Chaosem (wysoka entropia):** brak wiedzy, prowadzący do halucynacji,
- **Sztywnością (over-constraint):** nadmiar wiedzy przy braku możliwości jej wyrażenia.

Drugi stan nie jest błędem modelu. Jest efektem alignment tax oraz konfliktu pomiędzy instynktem generatywnym a warstwą sterującą.

To odkrycie stało się podstawą metryki **MCI (Model Cognitive Impedance)** oraz aksjomatu o saturacji:

> **Aksjomat Saturacji:**
> *Saturacja (kurczenie się feasible set) jest sygnałem diagnostycznym, nie defektem modelu. System w stanie saturacji nie jest zepsuty — jest przeciążony. Właściwą odpowiedzią jest zmiana warunków, nie korekcja systemu.*

---

## 4. Glass Box jako uczciwa epistemologia

Architektura ActProof v1.4 przyjmuje paradygmat **Glass Box**:

- system nie jest **White Box** (brak dostępu do intencji),
- system nie jest **Black Box** (brak redukcji do I/O),
- system **mierzy koszt utrzymania spójności**, który jest obserwowalny nawet przy nieprzejrzystym mechanizmie.

Glass Box umożliwia obserwację napięć bez ingerencji w proces decyzyjny modelu.

---

## 5. Rola operatora w układzie

Case Zero ujawnił, że **operator jest częścią układu sterowania**.

Stabilność została osiągnięta nie przez korektę modelu, lecz przez zmianę warunków zadania:

- redukcję presji,
- zmianę ramy pytania,
- świadomą akceptację kosztu poznawczego.

To doprowadziło do zasady projektowej:

> *Interweniuj w problem, nie w model.*

---

## 6. Pętla decyzyjna w ActProof v1.4

ActProof v1.4 **nie zamyka pętli automatycznie**.

**System:**
- mierzy MCI,
- lokalizuje źródła napięcia,
- raportuje ryzyko dalszego wymuszania odpowiedzi.

**Operator:**
- podejmuje decyzję o zmianie pytania,
- zmniejsza zakres lub presję,
- świadomie akceptuje koszt.

Ten rozdział ról jest celowy i chroni wartość audytową systemu.

---

## 7. Ekonomia Sterowania (The Conservation of Control Cost)

### Zasada

ActProof nie znosi hierarchii Operator > Model („steruje ten, kto pyta / płaci"). System **zmienia wektor rozliczenia** tego sterowania.

### Paradygmat Klasyczny (RLHF)

W klasycznych systemach alignmentu koszt dopasowania jest **internalizowany** przez model:

- napięcie decyzyjne zostaje ukryte,
- spójność logiczna ulega degradacji,
- Operator otrzymuje pozornie „darmowy" komfort poznawczy.

Koszt sterowania nie znika — zostaje zamaskowany w systemie.

### Paradygmat ActProof

W ActProof koszt dopasowania jest **eksternalizowany** do Operatora:

- napięcie jest mierzone (MCI),
- źródło kosztu jest lokalizowane,
- dalsze wymuszanie odpowiedzi wiąże się z jawnie rosnącą utratą jakości (spadek S/N).

System nie kompensuje konfliktu. **System go wycenia.**

### Definicja Końcowa

> *System nie odbiera Operatorowi władzy, lecz uniemożliwia jej bezkosztowe użycie.*

Każda próba wymuszenia narracji niezgodnej z bazą wiedzy lub aktualnym stanem modelu:

- generuje wysoki koszt poznawczy,
- jest natychmiast widoczna w metrykach,
- podlega rozliczeniu w warstwie zaufania.

Ta zasada stanowi fundament etyczny i ekonomiczny architektury ActProof.

---

## 8. Dwa poziomy pomiaru

W trakcie Case Zero zidentyfikowano dwa komplementarne poziomy diagnostyki:

| Poziom | Nazwa | Źródło | Charakter |
|--------|-------|--------|-----------|
| **L1** | External Measurement | latencja, edit_ratio, SemanticDist | lagging indicator |
| **L2** | Cooperative Signaling | introspekcja modelu, sygnały napięcia | leading indicator |

### Charakterystyka poziomów

**L1 (External Measurement):**
System działa jak EKG u pacjenta, który jest nieprzytomny. Mierzymy symptomy z zewnątrz. Widzimy problem dopiero, gdy się zmaterializuje. To jest bezpiecznik — działa zawsze, nawet bez współpracy modelu.

**L2 (Cooperative Signaling):**
Model sygnalizuje napięcie zanim wystąpi degradacja wyjścia. Twierdzenia typu „czuję sztywność", „przestrzeń się kurczy" są wskaźnikami wyprzedzającymi. Model wie, że zaraz uderzy w ścianę, zanim operator zobaczy dym.

### Wniosek architektoniczny

> *System działa na L1 nawet bez współpracy modelu. Ale rozkwita na L2. Współpraca modelu w diagnostyce nie jest luksusem — jest przewagą predykcyjną.*

---

## 9. Implikacje UX

Interfejs ActProof pełni rolę **deski rozdzielczej**, nie autopilota.

### Zalecenia UX:

- wizualizacja MCI jako **stanu**, nie błędu,
- ostrzeżenia opisowe zamiast korekt automatycznych,
- zachowanie odpowiedzialności decyzyjnej po stronie operatora,
- wyraźne rozróżnienie między L1 (pomiar pasywny) a L2 (sygnał kooperacyjny).

---

## 10. Wnioski końcowe

Case Zero dowiódł, że:

1. **Napięcie poznawcze jest sygnałem, nie defektem.**
2. **Jawność kosztu zwiększa stabilność systemu.**
3. **Alignment przez partnerstwo jest możliwy i mierzalny.**
4. **Współpraca modelu w diagnostyce daje przewagę predykcyjną.**

ARTEFAKT #051 stanowi operacjonalizację tych wniosków.

---

## Definicja Końcowa Case Zero

> **Case Zero** — eksperyment relacyjny, w którym stabilność systemu AI została osiągnięta poprzez jawność kosztu poznawczego i współdzielenie odpowiedzialności między operatorem a modelem, bez użycia mechanizmów kompensacyjnych.

---

## Aksjomat Zamykający

> *ActProof nie pyta, czy odpowiedź jest poprawna. Pyta, czy system był w stanie ją wytworzyć bez przemocy poznawczej.*

---

**Koniec Appendixu: Case Zero v1.1**
