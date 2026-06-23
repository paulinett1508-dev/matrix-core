// Gera JSON Schema dos contratos para consumo poliglota (ex. Python/Sheldon).
// Fonte de verdade = os schemas Zod; isto é só a tradução publicável.
import { writeFileSync, mkdirSync } from "node:fs";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  AdminStatus,
  InfraStatus,
  ExchangeEnvelope,
  StatusManifest,
  Registry,
} from "../dist/esm/entity-exchange.js";
import { TownEvent } from "../dist/esm/town-event.js";
import { EnvelopeComissao } from "../dist/esm/envelope-comissao.js";
import { IssueStatus } from "../dist/esm/issue-status.js";
import { PostureStatus } from "../dist/esm/posture-status.js";

const out = new URL("../schema/", import.meta.url);
mkdirSync(out, { recursive: true });

const contracts = {
  "admin-status": AdminStatus,
  "infra-status": InfraStatus,
  "exchange-envelope": ExchangeEnvelope,
  "status-manifest": StatusManifest,
  "registry": Registry,
  "town-event": TownEvent,
  "envelope-comissao": EnvelopeComissao,
  "issue-status": IssueStatus,
  "posture-status": PostureStatus,
};

for (const [name, schema] of Object.entries(contracts)) {
  const json = zodToJsonSchema(schema, { name, $refStrategy: "none" });
  writeFileSync(new URL(`${name}.json`, out), JSON.stringify(json, null, 2) + "\n");
  console.log(`schema/${name}.json`);
}
