# Forge

**Maszyna do tworzenia systemów biznesowych**

---

## Quick Start

### Rozpoczęcie sesji z Claude

1. Otwórz `/prompts/current_context.md`
2. Skopiuj treść do nowego chatu
3. Dodaj opis zadania z `/backlog/backlog.md`
4. Pracuj

### Po sesji

1. Zapisz outputy do odpowiednich katalogów
2. Zaktualizuj `/evidence/sessions.md`
3. Zaktualizuj `/backlog/backlog.md`
4. Zaktualizuj `/prompts/current_context.md`

---

## Struktura repozytorium

```
forge/
├── MASTER_PLAN.md              # Plan projektu v1.1
├── README.md                   # Ten plik
│
├── prompts/                    # Session System
│   └── current_context.md      # Pamięć dla sesji
│
├── backlog/
│   └── backlog.md              # Lista zadań
│
├── evidence/
│   └── sessions.md             # Log sesji
│
├── docs/
│   ├── vision/                 # Dokumenty Vision (LOCK)
│   ├── adr/                    # Architecture Decision Records
│   ├── specs/                  # Specyfikacje techniczne
│   ├── contracts/              # Kontrakty (stare, do migracji)
│   ├── flows/                  # Flow diagrams (DO ZROBIENIA)
│   └── decisions/              # Decision Notes
│
├── contracts/                  # Kontrakty v0.1+ (schema.json)
├── examples/                   # Przykłady dla kontraktów
│
├── tests/
│   └── conformance/            # Testy zgodności
│
├── impl/
│   ├── reference/              # Implementacje referencyjne
│   └── alt/                    # Implementacje alternatywne
│
└── src/
    └── actproof/               # ActProof Demo (LOCK)
```

---

## Zasady (Master Plan v1.1)

1. **Design First** — najpierw kontrakty i flows, potem kod
2. **Swapability Rule** — każdy moduł ma 2 implementacje
3. **Minimal Spine** — bramka przed dużymi modułami
4. **Session System** — repo jako jedyna pamięć

---

## Fundamenty (LOCK)

- ALT-13687: "Prostsza ścieżka często istnieje"
- Case Zero: "Alignment przez partnerstwo"
- ActProof: CC jako metryka kontroli
- Forge Vision v1.1: Pełna wizja platformy

---

## Status

**Faza:** 0 (inicjalizacja) ✅  
**Następna sesja:** #1 — Session Protocol

---

*Forge. Kujemy systemy biznesowe.*
