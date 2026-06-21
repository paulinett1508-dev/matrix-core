import { describe, it, expect } from "vitest";
import { IssueSeverity, IssueSnapshot, IssueStatus } from "./issue-status.js";

const validSnapshot = {
  repo: "paulinett1508-dev/SbrTask",
  number: 42,
  title: "Erro no login",
  state: "open",
  labels: ["bug"],
  author: "pmiranda",
  createdAt: 1718700000,
  updatedAt: 1718800000,
  ageDays: 1.2,
  url: "https://github.com/paulinett1508-dev/SbrTask/issues/42",
  severity: "critico",
};

const validStatus = {
  schema: "entity-exchange/issue-status@1",
  entity: "theo",
  ts: 1718800000,
  repos: ["sbrgestao", "SbrTask"],
  abertas: [validSnapshot],
  resumo: "1 issue crítica aberta",
};

describe("IssueSeverity", () => {
  it("aceita valores válidos", () => {
    expect(IssueSeverity.parse("critico")).toBe("critico");
    expect(IssueSeverity.parse("avisos")).toBe("avisos");
    expect(IssueSeverity.parse("normal")).toBe("normal");
  });

  it("rejeita valor fora do enum", () => {
    expect(() => IssueSeverity.parse("urgent")).toThrow();
  });
});

describe("IssueSnapshot", () => {
  it("parseia snapshot válido", () => {
    const result = IssueSnapshot.parse(validSnapshot);
    expect(result.repo).toBe("paulinett1508-dev/SbrTask");
    expect(result.severity).toBe("critico");
    expect(result.labels).toEqual(["bug"]);
  });

  it("aplica default [] para labels ausente", () => {
    const { labels: _, ...noLabels } = validSnapshot;
    const result = IssueSnapshot.parse(noLabels);
    expect(result.labels).toEqual([]);
  });

  it("rejeita snapshot sem campo obrigatório (title)", () => {
    const { title: _, ...noTitle } = validSnapshot;
    expect(() => IssueSnapshot.parse(noTitle)).toThrow();
  });

  it("rejeita number não-inteiro", () => {
    expect(() => IssueSnapshot.parse({ ...validSnapshot, number: 1.5 })).toThrow();
  });

  it("rejeita state inválido", () => {
    expect(() => IssueSnapshot.parse({ ...validSnapshot, state: "pending" })).toThrow();
  });
});

describe("IssueStatus", () => {
  it("parseia manifest válido", () => {
    const result = IssueStatus.parse(validStatus);
    expect(result.schema).toBe("entity-exchange/issue-status@1");
    expect(result.entity).toBe("theo");
    expect(result.abertas).toHaveLength(1);
  });

  it("rejeita entity fora do enum", () => {
    expect(() => IssueStatus.parse({ ...validStatus, entity: "hermes" })).toThrow();
  });

  it("rejeita schema literal errado", () => {
    expect(() =>
      IssueStatus.parse({ ...validStatus, schema: "entity-exchange/issue-status@2" })
    ).toThrow();
  });

  it("rejeita manifest sem resumo", () => {
    const { resumo: _, ...noResumo } = validStatus;
    expect(() => IssueStatus.parse(noResumo)).toThrow();
  });
});
