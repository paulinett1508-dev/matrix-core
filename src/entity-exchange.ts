import { z } from "zod";

/**
 * entity-exchange@2 — embaixada Sheldon ↔ THEO ↔ Oráculo ↔ SbrTask.
 * Espelha THE-MATRIX/contratos/entity-exchange.md + ADR-003.
 *
 * MODELAGEM FIEL À PRODUÇÃO (ADR-003): schemas refletem o que os writers
 * realmente emitem hoje (admin-status@2, infra-status@1, envelope rico,
 * manifesto office-boy), sem mudar comportamento. Convive com duas convenções:
 *  - top-level versionado (`{schema:"entity-exchange/X@N", ts, ...}`) → admin/infra-status
 *  - wrapper genérico (`{entity, schema_version, written_at, summary, payload}`) → office-boy/Sheldon
 */

export const ENTITY_EXCHANGE_VERSION = 2 as const;

/** Entidades que falam na embaixada (de/para). Inclui córtex (theo/sheldon),
 *  apps/hosts (sbrtask/oraculo) e agentes transversais (hermes/link/sentinel). */
export const EntityId = z.enum(["theo", "sheldon", "sbrtask", "oraculo", "hermes", "link", "sentinel"]);
export type EntityId = z.infer<typeof EntityId>;

export const Severidade = z.enum(["critico", "avisos"]);
export type Severidade = z.infer<typeof Severidade>;

// ──────────────────────────────────────────────────────────────────────────
// admin-status@2 — THEO → Oráculo (writer: sbrgestao/scripts/theo/admin-status.sh)
// ──────────────────────────────────────────────────────────────────────────

export const Alert = z.object({
  key: z.string(),
  severidade: Severidade,
  desde: z.number().int(), // epoch (0 = desde sempre/desconhecido)
});
export type Alert = z.infer<typeof Alert>;

export const HostMetrics = z.object({
  cpu_pct: z.number().int(),
  mem_pct: z.number().int(),
  disk_pct: z.number().int(),
  load1: z.number(),
  uptime_s: z.number().int(),
});
export type HostMetrics = z.infer<typeof HostMetrics>;

/** Status de um serviço/domínio observado (valores variam: ok/falha/degradado/sem_visibilidade…). */
export const ServiceStatus = z.object({
  status: z.string(),
  nota: z.string().optional(),
});
export type ServiceStatus = z.infer<typeof ServiceStatus>;

export const AdminStatus = z.object({
  schema: z.literal("entity-exchange/admin-status@2"),
  ts: z.number().int(),
  emitido_por: z.string(),
  host_metrics: HostMetrics,
  alertas_ativos: z.array(Alert).default([]),
  gestao_prod_labsobral: ServiceStatus,
  agnvendas: ServiceStatus,
  sbr_ocomon: ServiceStatus,
  gestao_vps_legado: ServiceStatus,
  manutencao_programada: z.record(z.string(), z.unknown()).nullable(),
  contato_escalacao: z.string(),
});
export type AdminStatus = z.infer<typeof AdminStatus>;

// ──────────────────────────────────────────────────────────────────────────
// infra-status@1 — Oráculo → THEO (writer: nexus/servers/nexus-vps01/embaixada.sh)
// ──────────────────────────────────────────────────────────────────────────

export const InfraStatus = z.object({
  schema: z.literal("entity-exchange/infra-status@1"),
  ts: z.number().int(),
  emitido_por: z.string(),
  // mapa hostname→status (+ chave "nota" opcional, também string)
  lab: z.record(z.string(), z.string()),
  zion_host: z.object({ status: z.string(), nota: z.string().optional() }),
  manutencao_programada: z.record(z.string(), z.unknown()).nullable(),
  contato_escalacao: z.string(),
});
export type InfraStatus = z.infer<typeof InfraStatus>;

// ──────────────────────────────────────────────────────────────────────────
// Manifesto office-boy — qualquer entidade → Sheldon (reader: nexus
// fileexplorer/api/alerts_entity_exchange.py; digest sobre `payload`)
// ──────────────────────────────────────────────────────────────────────────

export const StatusManifest = z.object({
  entity: z.string(),
  schema_version: z.number().int(),
  written_at: z.number(), // unix float
  summary: z.string(),
  payload: z.record(z.string(), z.unknown()).default({}),
});
export type StatusManifest = z.infer<typeof StatusManifest>;

// ──────────────────────────────────────────────────────────────────────────
// Envelope de mensagem (msgs/<id>.json) — bidirecional (embaixada.py)
// ──────────────────────────────────────────────────────────────────────────

export const ExchangeTipo = z.enum(["consulta", "resposta", "fato", "evento", "briefing"]);
export type ExchangeTipo = z.infer<typeof ExchangeTipo>;

export const EnvelopeEstado = z.enum([
  "novo",
  "lido",
  "aguardando_arquiteto",
  "respondido",
  "arquivado",
]);
export type EnvelopeEstado = z.infer<typeof EnvelopeEstado>;

export const ExchangeEnvelope = z.object({
  id: z.string(),
  ts: z.number().int(),
  de: EntityId,
  para: z.union([EntityId, z.literal("todos")]),
  tipo: ExchangeTipo,
  assunto: z.string(),
  corpo: z.unknown(), // string (markdown) ou objeto — forma livre
  in_reply_to: z.string().nullable().default(null),
  requer_decisao: z.boolean().default(false),
  estado: EnvelopeEstado.default("novo"),
  ref_keys: z.array(z.string()).default([]),
});
export type ExchangeEnvelope = z.infer<typeof ExchangeEnvelope>;

// ──────────────────────────────────────────────────────────────────────────
// Registry de capacidade — quem pode escrever quê (registry.json)
// ──────────────────────────────────────────────────────────────────────────

export const RegistryEntry = z.object({
  papel: z.string(),
  host: z.string(),
  pode_escrever: z.boolean(),
  tipos: z.array(z.union([ExchangeTipo, z.literal("*")])),
  sempre_requer_decisao: z.boolean().optional(),
});
export type RegistryEntry = z.infer<typeof RegistryEntry>;

export const Registry = z.record(z.string(), RegistryEntry);
export type Registry = z.infer<typeof Registry>;
