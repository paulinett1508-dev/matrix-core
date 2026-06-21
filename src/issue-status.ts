import { z } from "zod";

export const IssueSeverity = z.enum(["critico", "avisos", "normal"]);
export type IssueSeverity = z.infer<typeof IssueSeverity>;

export const IssueSnapshot = z.object({
  repo:      z.string(),
  number:    z.number().int(),
  title:     z.string(),
  state:     z.enum(["open", "closed"]),
  labels:    z.array(z.string()).default([]),
  author:    z.string(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
  ageDays:   z.number(),
  url:       z.string(),
  severity:  IssueSeverity,
});
export type IssueSnapshot = z.infer<typeof IssueSnapshot>;

// manifest escrito na embaixada: entity-exchange/issues/<entity>.json
export const IssueStatus = z.object({
  schema:  z.literal("entity-exchange/issue-status@1"),
  entity:  z.enum(["sheldon", "theo"]),
  ts:      z.number().int(),
  repos:   z.array(z.string()),
  abertas: z.array(IssueSnapshot),
  resumo:  z.string(),
});
export type IssueStatus = z.infer<typeof IssueStatus>;
