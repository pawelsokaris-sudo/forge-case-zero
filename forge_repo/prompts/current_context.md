# Forge — Current Context

**Data ostatniej aktualizacji:** Styczeń 2026  
**Sesja:** #0 (inicjalizacja)

---

## 1. Co to jest Forge

Forge to platforma do tworzenia systemów biznesowych — "maszyna do tworzenia maszyn". Składa się z:

- **Marketplace mikroserwisów** — komponenty biznesowe (zamówienia, faktury, płatności...)
- **ActProof** — warstwa kontrolna mierząca Control Cost (CC) usług
- **CFO MCP** — warstwa kontrolna mierząca Model Cognitive Impedance (MCI) agentów AI
- **Agent klienta** — AI działające jako adwokat klienta, nie przedstawiciel firmy
- **Billing** — rozliczenia twórców mikroserwisów i klientów

---

## 2. Fundamenty teoretyczne (LOCK)

### ALT-13687
> System może działać poprawnie i jednocześnie być najdroższą możliwą trajektorią.

### Case Zero
> Stabilność systemu AI nie wynika z eliminacji napięcia, lecz z jego uznania.

### Wspólny wniosek
> Jeśli system działa, ale koszt sterowania rośnie — nie naprawiaj. Zmień trajektorię.

---

## 3. Co jest gotowe (LOCK)

| Element | Status | Lokalizacja |
|---------|--------|-------------|
| ALT-13687 (fundament) | ✅ LOCK | docs/vision/ALT_13687_Vision_v1.0.md |
| Case Zero (fundament) | ✅ LOCK | docs/specs/Case_Zero_Appendix_v1.1.md |
| ActProof Vision | ✅ LOCK | docs/vision/ActProof_Vision_v1.0.md |
| Forge Vision | ✅ v1.1 | docs/vision/Forge_Vision_v1.1.md |
| ADR Pack | ✅ LOCK | docs/adr/ADR_Pack_v0.1.md |
| CFO Lite Spec | ✅ LOCK | docs/specs/CFO_Lite_Spec_v0.1.md |
| Action Engine Spec | ✅ LOCK | docs/specs/Action_Engine_Spec_v0.1.md |
| Demo Package | ✅ LOCK | src/actproof/ |
| Kontrakty JSON | ✅ LOCK | docs/contracts/ |

---

## 4. Co trzeba zbudować

| Element | Priorytet | Status |
|---------|-----------|--------|
| Marketplace — specyfikacja API | Wysoki | ❌ TODO |
| Billing — specyfikacja API | Wysoki | ❌ TODO |
| Orchestrator — prototyp | Średni | ❌ TODO |
| Agent klienta — prototyp | Średni | ❌ TODO |
| CFO MCP — specyfikacja | Średni | ❌ TODO |
| Forge Core — meta-warstwa | Niski | ❌ TODO |

---

## 5. Kluczowe decyzje architektoniczne

1. **CC = latency × (error_rate + retry_rate)** — formuła LOCK
2. **Brak ML w pętli sterowania** — deterministyczne, audytowalne
3. **Separacja: CFO diagnozuje, AE wykonuje, SO realizuje**
4. **Agent = adwokat klienta, nie przedstawiciel firmy**
5. **Alignment przez partnerstwo, nie przez przymus**

---

## 6. Kontekst biznesowy

- Autor ma 29 lat doświadczenia w systemach sprzedaży
- Obsługuje 10 000 firm na starym systemie
- Forge = nowa generacja, skalowalna globalnie
- Potrzebny partner technologiczny do wykonania

---

## 7. Model pracy z Claude

- Claude = architekt, współprojektant, generator kodu
- Ograniczenie: reset kontekstu między sesjami
- Rozwiązanie: repozytorium jako pamięć, ten plik jako bootstrap
- Każda sesja: czytaj kontekst → wybierz zadanie → wykonaj → zaktualizuj

---

## 8. Następne zadanie

Zobacz: `backlog/backlog.md`

---

*Aktualizuj ten plik po każdej sesji.*
