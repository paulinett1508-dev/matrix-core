// Gera JSON Schema dos contratos para consumo poliglota (ex. Python/Sheldon).
// Fonte de verdade = os schemas Zod; isto é só a tradução publicável.
import { writeFileSync, mkdirSync } from "node:fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  TheoManifest,
  AdminStatus,
  InfraStatus,
  ExchangeEnvelope,
} from "../dist/entity-exchange.js";
import { TownEvent } from "../dist/town-event.js";
import { EnvelopeComissao } from "../dist/envelope-comissao.js";

const out = new URL("../schema/", import.meta.url);
mkdirSync(out, { recursive: true });

const contracts = {
  "theo-manifest": TheoManifest,
  "admin-status": AdminStatus,
  "infra-status": InfraStatus,
  "exchange-envelope": ExchangeEnvelope,
  "town-event": TownEvent,
  "envelope-comissao": EnvelopeComissao,
};

for (const [name, schema] of Object.entries(contracts)) {
  const json = zodToJsonSchema(schema, { name, $refStrategy: "none" });
  writeFileSync(new URL(`${name}.json`, out), JSON.stringify(json, null, 2) + "\n");
  console.log(`schema/${name}.json`);
}
