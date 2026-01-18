# Forge — Repozytorium

## Struktura katalogów

```
forge/
│
├── README.md                    # Opis projektu, quick start
│
├── docs/                        # Dokumentacja
│   ├── vision/                  # Dokumenty wizji
│   │   ├── Forge_Vision_v1.1.md
│   │   ├── ActProof_Vision_v1.0.md
│   │   ├── ALT_13687_Vision_v1.0.md
│   │   └── Platform_Vision_v0.1.md
│   │
│   ├── adr/                     # Architecture Decision Records
│   │   └── ADR_Pack_v0.1.md
│   │
│   ├── specs/                   # Specyfikacje techniczne
│   │   ├── CFO_Lite_Spec_v0.1.md
│   │   ├── Action_Engine_Spec_v0.1.md
│   │   └── Case_Zero_Appendix_v1.1.md
│   │
│   └── contracts/               # Kontrakty danych (JSON Schema)
│       ├── CFODiagnosis.schema.json
│       └── ActionResult.schema.json
│
├── src/                         # Kod źródłowy
│   ├── actproof/                # ActProof (z demo package)
│   │   ├── cfo/
│   │   ├── action-engine/
│   │   ├── orchestrator/
│   │   └── docker-compose.yml
│   │
│   ├── marketplace/             # [DO ZBUDOWANIA]
│   ├── billing/                 # [DO ZBUDOWANIA]
│   ├── agent/                   # [DO ZBUDOWANIA]
│   └── forge-core/              # [DO ZBUDOWANIA]
│
├── prompts/                     # Kontekst dla sesji z Claude
│   ├── current_context.md       # Aktualny stan projektu
│   ├── session_template.md      # Szablon rozpoczęcia sesji
│   └── history/                 # Archiwum kontekstów
│
├── evidence/                    # Dowody postępu
│   ├── sessions.md              # Log sesji
│   └── demos/                   # Nagrania, screenshoty
│
└── backlog/                     # Zadania
    ├── backlog.md               # Lista zadań
    └── completed/               # Zamknięte zadania
```

---

## Jak używać

### Rozpoczęcie sesji z Claude:

1. Otwórz `prompts/current_context.md`
2. Skopiuj treść do Claude
3. Dodaj: "Kontynuuj od backlog item #X"

### Po sesji:

1. Zapisz outputy do odpowiednich katalogów
2. Zaktualizuj `evidence/sessions.md`
3. Zaktualizuj `backlog/backlog.md`
4. Zaktualizuj `prompts/current_context.md` dla następnej sesji

---

## Pliki startowe

Repozytorium powinno zawierać na start:
- [ ] Wszystkie dokumenty Vision (masz je)
- [ ] ADR Pack v0.1 (masz)
- [ ] Demo Package ActProof (masz)
- [ ] Kontrakty JSON (masz)
- [ ] Ten README
- [ ] current_context.md (wygeneruję)
- [ ] backlog.md (wygeneruję)
- [ ] sessions.md (wygeneruję)
