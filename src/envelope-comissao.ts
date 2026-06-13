import { z } from "zod";
import { AdUsername } from "./entities.js";

/**
 * Envelope de comissão — SbrTask → THEO ao fechar ciclo.
 * Espelha THE-MATRIX/contratos/envelope-comissao.md.
 * Origem: sbrtask commissionController.ts.
 */

export const Tier = z.enum(["bronze", "silver", "gold", "platinum", "elite"]);
export type Tier = z.infer<typeof Tier>;

export const TecnicoComissao = z.object({
  adUsername: AdUsername,
  name: z.string(),
  xp: z.number().int(),
  tier: Tier,
  commissionAmt: z.number(),
});
export type TecnicoComissao = z.infer<typeof TecnicoComissao>;

export const EnvelopeComissao = z.object({
  de: z.literal("sbrtask"),
  para: z.literal("theo"),
  tipo: z.literal("comissionamento_ciclo"),
  assunto: z.string(),
  corpo: z.object({
    periodo: z.string().regex(/^\d{4}-\d{2}$/),
    tecnicos: z.array(TecnicoComissao),
  }),
});
export type EnvelopeComissao = z.infer<typeof EnvelopeComissao>;
