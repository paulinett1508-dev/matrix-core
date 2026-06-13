import { z } from "zod";

/**
 * Registry de identidade da Matrix — fonte tipada de quem é quem.
 * Espelha THE-MATRIX/entidades/{humanas,virtuais}.md.
 */

export const AdUsername = z.enum(["pmiranda", "vsantos", "hclaudio", "dbarbosa"]);
export type AdUsername = z.infer<typeof AdUsername>;

export const HumanCodename = z.enum(["Arquiteto", "VSFOUR", "H14N", "MRX"]);
export type HumanCodename = z.infer<typeof HumanCodename>;

export const HumanRole = z.enum(["superadmin", "admin"]);
export type HumanRole = z.infer<typeof HumanRole>;

export const HumanEntity = z.object({
  adUsername: AdUsername,
  codename: HumanCodename,
  name: z.string(),
  role: HumanRole,
});
export type HumanEntity = z.infer<typeof HumanEntity>;

export const HUMANS: Record<AdUsername, HumanEntity> = {
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
