# Forge — Session Template

## Jak rozpocząć sesję z Claude

### Krok 1: Skopiuj ten prompt

```
Pracujemy nad projektem Forge — platformą do tworzenia systemów biznesowych.

Przeczytaj kontekst projektu:
[WKLEJ ZAWARTOŚĆ prompts/current_context.md]

Aktualne zadanie z backlogu:
[WKLEJ OPIS ZADANIA z backlog/backlog.md]

Kontynuuj pracę nad tym zadaniem.
```

### Krok 2: Załącz pliki jeśli potrzebne

Jeśli zadanie wymaga istniejących plików (specs, kontrakty, kod), załącz je do rozmowy.

### Krok 3: Po zakończeniu sesji

1. **Zapisz outputy** do odpowiednich katalogów
2. **Zaktualizuj** `evidence/sessions.md`
3. **Zaktualizuj** `backlog/backlog.md` (zmień status zadania)
4. **Zaktualizuj** `prompts/current_context.md` jeśli zmieniło się coś istotnego

---

## Przykład rozpoczęcia sesji #1

```
Pracujemy nad projektem Forge — platformą do tworzenia systemów biznesowych.

Przeczytaj kontekst projektu:

# Forge — Current Context
[...pełna treść current_context.md...]

Aktualne zadanie z backlogu:

### #1 🔴 ❌ Marketplace API — Specyfikacja

**Cel:** Zdefiniować jak mikroserwisy rejestrują się w marketplace i jak są odkrywane.

**Output:**
- docs/specs/Marketplace_API_Spec_v0.1.md
- docs/contracts/ServiceRegistration.schema.json
- docs/contracts/ServiceDiscovery.schema.json

Kontynuuj pracę nad tym zadaniem.
```

---

## Zasady sesji

1. **Jedno zadanie na sesję** — lepiej zamknąć jedno niż zacząć trzy
2. **Outputy muszą być zapisywalne** — kod, dokumenty, kontrakty
3. **Aktualizuj kontekst** — następna sesja zależy od tego
4. **Mierz postęp** — czy backlog się kurczy?

---

## Sygnały ostrzegawcze (wysoki CC sesji)

- Dużo powtarzania tego samego
- Sesja idzie w bok od zadania
- Output nie pasuje do poprzednich
- Trzeba wyjaśniać podstawy od nowa

Jeśli to się dzieje → **zmień trajektorię**:
- Lepszy kontekst
- Mniejsze zadanie
- Więcej załączonych plików
