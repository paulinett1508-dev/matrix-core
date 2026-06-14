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

/** Entidades virtuais — córtex de alerta. Hermes NÃO entra aqui (é agente/serviço). */
export const VirtualEntity = z.enum(["sheldon", "theo"]);
export type VirtualEntity = z.infer<typeof VirtualEntity>;

export const VIRTUAL_DOMAINS: Record<VirtualEntity, "infra" | "negocio"> = {
  sheldon: "infra",
  theo: "negocio",
};
