import { describe, it, expect } from "vitest";
import { PostureSeverity, PostureFinding, RepoPosture, PostureStatus } from "./posture-status.js";

const validFinding = {
  kind: "secret_hardcoded",
  severidade: "critico",
  path: "scripts/dvr-check.py:28",
  detalhe: "RTSP/DVR — RTS***SS (redigido)",
  ref_key: "nexus-labsobral|scripts/dvr-check.py|sha:ab12cd",
};

const validRepo = {
  repo: "nexus-labsobral",
  visibilidade: "private",
  score: 60,
  achados_abertos: [validFinding],
  ultimaVarredura: 1718800000,
};

const validStatus = {
  schema: "entity-exchange/posture-status@1",
  entity: "sentinel",
  ts: 1718800000,
  repos: [validRepo],
  resumo: "1 repo com achado crítico aberto",
};

describe("PostureSeverity", () => {
  it("aceita valores válidos", () => {
    expect(PostureSeverity.parse("critico")).toBe("critico");
    expect(PostureSeverity.parse("normal")).toBe("normal");
  });
  it("rejeita valor fora do enum", () => {
    expect(() => PostureSeverity.parse("urgent")).toThrow();
  });
});

describe("PostureFinding", () => {
  it("parseia achado válido", () => {
    const r = PostureFinding.parse(validFinding);
    expect(r.kind).toBe("secret_hardcoded");
    expect(r.ref_key).toContain("dvr-check");
  });
  it("rejeita kind inválido", () => {
    expect(() => PostureFinding.parse({ ...validFinding, kind: "virus" })).toThrow();
  });
  it("rejeita achado sem ref_key", () => {
    const { ref_key: _, ...sem } = validFinding;
    expect(() => PostureFinding.parse(sem)).toThrow();
  });
});

describe("RepoPosture", () => {
  it("parseia repo válido", () => {
    const r = RepoPosture.parse(validRepo);
    expect(r.score).toBe(60);
    expect(r.achados_abertos).toHaveLength(1);
  });
  it("aplica default [] para achados_abertos ausente", () => {
    const { achados_abertos: _, ...sem } = validRepo;
    expect(RepoPosture.parse(sem).achados_abertos).toEqual([]);
  });
  it("rejeita score fora de 0..100", () => {
    expect(() => RepoPosture.parse({ ...validRepo, score: 140 })).toThrow();
  });
  it("rejeita visibilidade inválida", () => {
    expect(() => RepoPosture.parse({ ...validRepo, visibilidade: "internal" })).toThrow();
  });
});

describe("PostureStatus", () => {
  it("parseia manifest válido", () => {
    const r = PostureStatus.parse(validStatus);
    expect(r.schema).toBe("entity-exchange/posture-status@1");
    expect(r.entity).toBe("sentinel");
  });
  it("rejeita entity diferente de sentinel", () => {
    expect(() => PostureStatus.parse({ ...validStatus, entity: "sheldon" })).toThrow();
  });
  it("rejeita schema literal errado", () => {
    expect(() => PostureStatus.parse({ ...validStatus, schema: "entity-exchange/posture-status@2" })).toThrow();
  });
});
