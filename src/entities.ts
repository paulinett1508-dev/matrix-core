import { z } from "zod";

/**
 * Registry de identidade da Matrix — fonte tipada de quem é quem.
 * Espelha THE-MATRIX/entidades/{humanas,virtuais}.md.
 */

/** adUsername vem do AD/LDAP — open-world (qualquer técnico ganha XP). */
export const AdUsername = z.string();
export type AdUsername = z.infer<typeof AdUsername>;

/** Subset curado: admins TI com codinome/aura. Mantém o registry exaustivo. */
export const HumanAdUsername = z.enum(["pmiranda", "vsantos", "hclaudio", "dbarbosa"]);
export type HumanAdUsername = z.infer<typeof HumanAdUsername>;

export const HumanCodename = z.enum(["Arquiteto", "VSFOUR", "H14N", "MRX"]);
export type HumanCodename = z.infer<typeof HumanCodename>;

export const HumanRole = z.enum(["superadmin", "admin"]);
export type HumanRole = z.infer<typeof HumanRole>;

export const HumanEntity = z.object({
  adUsername: HumanAdUsername,
  codename: HumanCodename,
  name: z.string(),
  role: HumanRole,
});
export type HumanEntity = z.infer<typeof HumanEntity>;

export const HUMANS: Record<HumanAdUsername, HumanEntity> = {
  pmiranda: { adUsername: "pmiranda", codename: "Arquiteto", name: "Paulinete Miranda", role: "superadmin" },
  vsantos: { adUsername: "vsantos", codename: "VSFOUR", name: "Vitor Santos", role: "admin" },
  hclaudio: { adUsername: "hclaudio", codename: "H14N", name: "Hian Cláudio", role: "admin" },
  dbarbosa: { adUsername: "dbarbosa", codename: "MRX", name: "Daniel Barbosa", role: "admin" },
};

/** Entidades virtuais — córtex de domínio (autônomas, persistentes, donas de um domínio). */
export const VirtualEntity = z.enum(["sheldon", "theo"]);
export type VirtualEntity = z.infer<typeof VirtualEntity>;

export const VIRTUAL_DOMAINS: Record<VirtualEntity, "infra" | "negocio"> = {
  sheldon: "infra",
  theo: "negocio",
};

/**
 * Agentes — transversais, invocados, servem função; NÃO são córtex de domínio.
 * - hermes: assistente self-service dos 100 funcionários (no Oráculo).
 * - link: agente-construtor — forja/deploya o ecossistema e anuncia fatos/eventos
 *   à embaixada (codinome do universo Matrix: o operador-conector).
 */
export const AgentCodename = z.enum(["hermes", "link"]);
export type AgentCodename = z.infer<typeof AgentCodename>;

/** Tipos de mensagem que uma entidade pode emitir na embaixada (espelha schema/registry.json). */
export const ExchangeMsgType = z.enum(["consulta", "resposta", "fato", "evento", "briefing"]);
export type ExchangeMsgType = z.infer<typeof ExchangeMsgType>;

/** Entrada do registro de embaixada: o que cada agente pode escrever (conforme schema/registry.json). */
export const AgentRegistryEntry = z.object({
  papel: z.string(),
  host: z.string(),
  pode_escrever: z.boolean(),
  tipos: z.array(ExchangeMsgType),
  sempre_requer_decisao: z.boolean().optional(),
});
export type AgentRegistryEntry = z.infer<typeof AgentRegistryEntry>;

/**
 * Registro dos AGENTES na embaixada (não-córtex). Visível ao office-boy do Sheldon.
 * - hermes: RAG self-service (consultivo) na Oráculo.
 * - link: agente-construtor — forja/deploya o ecossistema e anuncia fatos/eventos
 *   (ex.: "matrix-core publicado", "F2.4 ativada"). Cross-domain, sempre sob Regra Nº1.
 */
export const AGENTS: Record<AgentCodename, AgentRegistryEntry> = {
  hermes: {
    papel: "agente RAG self-service (consultivo)",
    host: "Oráculo-VPS :9119",
    pode_escrever: true,
    tipos: ["resposta"],
  },
  link: {
    papel: "agente-construtor — forja/deploya o ecossistema e anuncia fatos/eventos",
    host: "sessão de dev (workstation)",
    pode_escrever: true,
    tipos: ["fato", "evento"],
    sempre_requer_decisao: true,
  },
};
