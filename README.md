# @matrix/core

> Contratos canônicos da Matrix do Laboratório Sobral, como código (Zod).
> A **verdade tipada** derivada da verdade narrativa em [THE-MATRIX](https://github.com/paulinett1508-dev) (`contratos/`).

## Por quê existe

Antes, cada repo redefinia os contratos de troca (entity-exchange, evento, envelope) — e mover uma entidade de repo (ex. THEO nexus→SbrTask) gerava bugs. Aqui o contrato vive num lugar só; quem desalinhar **quebra a compilação**. É o que derruba o ruído (ADR-001: federação, não anexação).

## O que exporta

| Módulo | Conteúdo |
|---|---|
| `entities` | Registry tipado (HUMANS, VirtualEntity, AdUsername, codinomes) |
| `entity-exchange` | `entity-exchange@1` — TheoManifest, AdminStatus, InfraStatus, ExchangeEnvelope |
| `town-event` | `TownEvent` + tipos de convergência (xp_earned, level_up, task_completed, cycle_closed) |
| `envelope-comissao` | Envelope SbrTask → THEO de fechamento de ciclo |

```ts
import { TownEvent, EnvelopeComissao, HUMANS } from "@matrix/core";
const parsed = TownEvent.parse(raw); // valida em runtime, tipa em build
```

## Consumo

Padrão do ecossistema: **git submodule** (igual ao agnostic-core). Cada repo de runtime importa daqui e remove a duplicata local. Versão de contrato = versão do pacote; mudança de forma = bump + ADR no THE-MATRIX.

## Build

```
pnpm install
pnpm build      # tsc → dist/
pnpm typecheck
```

---
*Repo próprio, separado do agnostic-core (que é skills/inteligência aplicada). 2026-06-13.*
