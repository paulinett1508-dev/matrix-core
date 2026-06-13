import { z } from "zod";
import { VirtualEntity } from "./entities.js";

/**
 * entity-exchange@1 — embaixada Sheldon ↔ THEO.
 * Espelha THE-MATRIX/contratos/entity-exchange.md.
 */

export const ENTITY_EXCHANGE_VERSION = 1 as const;

export const EntityHealth = z.enum(["ok", "degraded", "down"]);
export type EntityHealth = z.infer<typeof EntityHealth>;

/** theo.json — manifesto vivo do THEO (THEO → Sheldon, via rsync 10min). */
export const TheoManifest = z.object({
  entity: z.literal("theo"),
  ts: z.number().int(),
  status: EntityHealth,
  workers: z.record(z.string(), z.enum(["ok", "stale", "down"])),
  last_heartbeat: z.record(z.string(), z.number().int()),
});
export type TheoManifest = z.infer<typeof TheoManifest>;

/** admin-status.json — THEO → Sheldon (Fase 2 da embaixada, pendente). */
export const AdminStatus = z.object({
  entity: z.literal("theo"),
  ts: z.number().int(),
  summary: z.string(),
  flags: z.array(z.object({ kind: z.string(), detail: z.string() })).default([]),
});
export type AdminStatus = z.infer<typeof AdminStatus>;

/** infra-status.json — Oráculo → THEO (a formalizar, Fase 4). */
export const InfraStatus = z.object({
  entity: z.literal("oraculo"),
  ts: z.number().int(),
  status: EntityHealth,
  summary: z.string(),
});
export type InfraStatus = z.infer<typeof InfraStatus>;

/** Envelope genérico de mensagem entre entidades (msgs/<uuid>.json). */
export const ExchangeEnvelope = z.object({
  de: z.union([VirtualEntity, z.literal("sbrtask"), z.literal("oraculo")]),
  para: z.union([VirtualEntity, z.literal("sbrtask"), z.literal("oraculo")]),
  tipo: z.string(),
  assunto: z.string(),
  corpo: z.unknown(),
});
export type ExchangeEnvelope = z.infer<typeof ExchangeEnvelope>;
