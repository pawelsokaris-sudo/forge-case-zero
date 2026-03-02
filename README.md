# Forge

**A session-based build system for LLM-driven projects with cost-of-control diagnostics**

> Design first. Build contracts. Swap implementations. Measure the cost of control.

---

## What is Forge?

Forge is a platform for building business systems — a *machine for building machines*. It combines:

- **Marketplace** — registry of composable microservices with MCP endpoints
- **ActProof** — control cost measurement for every service (CC as a quality signal)
- **CFO (Cognitive Function Officer)** — diagnostic layer for AI agent cognitive impedance
- **Orchestrator** — composes services into solutions, swaps variants based on CC
- **Billing** — usage-based settlement for service creators
- **Agent** — AI acting as *client advocate*, not company representative

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Design First** | Contracts and flows before code. Code is secondary and must be swappable. |
| **Swapability Rule** | Every module has 2+ implementations + conformance tests. If you can swap it, the contract is real. |
| **Minimal Spine** | Register → Discover → Call → Observe CC → Record Usage → Bill. This must work E2E before anything else. |
| **Session System** | Repository is the only memory. Each session is stateless. |
| **CC as Currency** | Control cost drives service ranking, variant selection, and quality enforcement. |

---

## Theoretical Foundations (LOCKED)

| Foundation | Key Insight |
|-----------|-------------|
| **ALT-13687** | A system can operate correctly while following the most expensive possible trajectory. A simpler path often exists. |
| **Case Zero** | AI stability comes from acknowledging tension, not eliminating it. Alignment through partnership, not coercion. |
| **ActProof** | `CC = latency × (error_rate + retry_rate)` — deterministic, auditable, no ML in the control loop. |

> If the system works but control cost is rising — don't fix it. Change the trajectory.

---

## Repository Structure

```
forge-case-zero/
├── MASTER_PLAN.md                  # Operational plan v1.1 (7 phases, 7 sessions)
├── README.md                       # This file
│
├── prompts/                        # Session System (external memory for LLM)
│   └── current_context.md          # Bootstrap context for each session
│
├── backlog/
│   └── backlog.md                  # Task list (8 items)
│
├── evidence/
│   └── sessions.md                 # Session log (session #0 complete)
│
├── docs/
│   ├── vision/                     # Vision documents (LOCKED)
│   │   ├── ALT_13687_Vision_Scope_v1_0.md
│   │   ├── ActProof_Product_Vision_Scope_v1_0.md
│   │   ├── Forge_System_Vision_v1_1.md
│   │   └── Platform_Vision_Scope_v0_1.md
│   ├── adr/                        # Architecture Decision Records
│   ├── specs/                      # Technical specifications
│   ├── contracts/                  # Legacy contracts (pre-migration)
│   ├── flows/                      # Flow diagrams A–G (TODO)
│   └── decisions/                  # Decision notes
│
├── contracts/                      # Versioned contracts v0.1+ (JSON Schema)
├── examples/                       # Contract examples (happy path + error)
│
├── impl/
│   ├── reference/                  # Reference implementations
│   └── alt/                        # Alternative implementations
│
├── tests/
│   └── conformance/                # Contract conformance tests
│
└── src/
    └── actproof/                   # ActProof Demo Package (Docker, LOCKED)
        ├── cfo/                    # Cognitive Function Officer service
        ├── action-engine/          # Action Engine service
        ├── orchestrator/           # Orchestration service
        ├── gateway/                # API Gateway
        ├── load-generator/         # Load testing tool
        ├── services/servicex/      # Example MCP service
        └── docker-compose.yml      # Full stack deployment
```

---

## Quick Start (ActProof Demo)

```bash
cd src/actproof
docker-compose up
```

This launches the full CC monitoring stack: Gateway → ServiceX → CFO → Orchestrator, with a load generator producing traffic. Watch control cost metrics in real time.

---

## Session System

Forge uses a **session-based development model** designed for working with LLMs:

1. **Start session**: Read `prompts/current_context.md` + pick task from `backlog/backlog.md`
2. **Work**: Produce artifacts (specs, contracts, code, tests)
3. **Close session**: Update `evidence/sessions.md`, `backlog/backlog.md`, `prompts/current_context.md`

**Definition of Done** for a session:
- [ ] An artifact was created or changed in the repo
- [ ] A backlog item changed status
- [ ] `evidence/sessions.md` was updated
- [ ] `prompts/current_context.md` was updated

See [MASTER_PLAN.md](MASTER_PLAN.md) for the full operational plan.

---

## Roadmap (MASTER_PLAN v1.1)

| Phase | Goal | Key Output |
|:-----:|------|-----------|
| **0** | Initialization | ✅ Vision docs, ADR, Demo Package, Session System |
| **1** | Contracts & Flows | `contracts/*.schema.json` + `docs/flows/*.md` |
| **2** | Minimal Spine | Register → Discover → Call → Observe → Bill (E2E) |
| **3** | Conformance & Swapability | `tests/conformance/` + adapter pattern |
| **4** | Marketplace + Orchestrator | Service registry, variant selection |
| **5** | Billing & Settlement | Usage events → ledger → creator payouts |
| **6** | Agent Registry & Trust | Identity, reputation, attestation |
| **7** | Forge Core | Platform instance generator |

---

## Related Repositories

| Repository | Description |
|-----------|-------------|
| [**ActProof-DS**](https://github.com/pawelsokaris-sudo/ActProof-DS) | Diagnostic Science — formal CC definitions, empirical validation on AlphaGo, LLM monitoring PoC |

---

## Author

**Paweł Łuczak**
Sokaris Oprogramowanie · Independent Researcher
29 years of production software engineering.

---

## License

This repository contains architectural documentation and reference implementations.
ActProof components are MIT licensed. See individual directories for details.
