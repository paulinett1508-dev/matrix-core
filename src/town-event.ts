import { z } from "zod";
import { AdUsername } from "./entities.js";

/**
 * TownEvent — evento que alimenta a cidade do TokenTown.
 * Espelha THE-MATRIX/contratos/town-event.md.
 * Fonte de verdade migrada de tokentown/packages/shared (Fase 2).
 */

export const AgentId = z.enum(["builder", "reviewer", "architect", "scout", "fixer", "scribe"]);
export type AgentId = z.infer<typeof AgentId>;

export const DistrictId = z.enum([
  "town-square",
  "frontend-district",
  "backend-district",
  "build-district",
  "test-district",
  "ops-district",
]);
export type DistrictId = z.infer<typeof DistrictId>;

export const EventType = z.enum([
  // dev telemetry (existentes)
  "file_saved",
  "git_branch_changed",
  "build_started",
  "build_finished",
  "test_run",
  "agent_action",
  "skill_used",
  "tick",
  // convergência SBRTASK (novos)
  "xp_earned",
  "level_up",
  "task_completed",
  "cycle_closed",
]);
export type EventType = z.infer<typeof EventType>;

export const SlaStatus = z.enum(["within", "over_20", "over_50", "excedida"]);
export type SlaStatus = z.infer<typeof SlaStatus>;

export const TownEvent = z.object({
  id: z.string(),
  ts: z.number(),
  type: EventType,
  workspace: z.string(),
  agent: AgentId.optional(),
  skillId: z.string().optional(),
  district: DistrictId.optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
});
export type TownEvent = z.infer<typeof TownEvent>;

/** Payloads tipados dos eventos de convergência. */
export const XpEarnedPayload = z.object({
  entity: AdUsername,
  amount: z.number(),
  category: z.string(),
  world: z.enum(["github", "campo", "legado"]),
});
export type XpEarnedPayload = z.infer<typeof XpEarnedPayload>;

export const LevelUpPayload = z.object({
  entity: AdUsername,
  level: z.number().int(),
});
export type LevelUpPayload = z.infer<typeof LevelUpPayload>;

export const TaskCompletedPayload = z.object({
  entity: AdUsername,
  slaStatus: SlaStatus,
});
export type TaskCompletedPayload = z.infer<typeof TaskCompletedPayload>;

/** R$ visível para todos — decisão do Arquiteto (2026-06-12). */
export const CycleClosedPayload = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/),
  entity: AdUsername,
  tier: z.enum(["bronze", "silver", "gold", "platinum", "elite"]),
  commissionAmt: z.number(),
});
export type CycleClosedPayload = z.infer<typeof CycleClosedPayload>;
