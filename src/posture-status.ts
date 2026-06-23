import { z } from "zod";

/**
 * Postura de segurança/compliance/convergência por repo — emitida pelo Sentinel
 * (guardião) na embaixada. Espelha o padrão de issue-status@1.
 *
 * Lei: `detalhe` NUNCA carrega o segredo cru — sempre redigido. O `ref_key` é a
 * chave estável para dedup e para outras entidades referenciarem (não-duplicar).
 */

export const PostureSeverity = z.enum(["critico", "avisos", "normal"]);
export type PostureSeverity = z.infer<typeof PostureSeverity>;

export const PostureFindingKind = z.enum([
  "secret_hardcoded",
  "secret_exposto",
  "repo_publico_com_segredo",
  "compliance_gap",
  "drift",
]);
export type PostureFindingKind = z.infer<typeof PostureFindingKind>;

export const PostureFinding = z.object({
  kind:       PostureFindingKind,
  severidade: PostureSeverity,
  path:       z.string(),          // "arquivo:linha" ou id de regra de compliance
  detalhe:    z.string(),          // redigido — NUNCA o valor do segredo
  ref_key:    z.string(),          // chave estável (dedup + referenciar-não-duplicar)
});
export type PostureFinding = z.infer<typeof PostureFinding>;

export const RepoPosture = z.object({
  repo:            z.string(),
  visibilidade:    z.enum(["public", "private"]),
  score:           z.number().min(0).max(100),   // 100 = postura limpa
  achados_abertos: z.array(PostureFinding).default([]),
  ultimaVarredura: z.number().int(),
});
export type RepoPosture = z.infer<typeof RepoPosture>;

// manifest escrito na embaixada: entity-exchange/posture/sentinel.json
export const PostureStatus = z.object({
  schema: z.literal("entity-exchange/posture-status@1"),
  entity: z.literal("sentinel"),
  ts:     z.number().int(),
  repos:  z.array(RepoPosture),
  resumo: z.string(),
});
export type PostureStatus = z.infer<typeof PostureStatus>;
