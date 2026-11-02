/**
 * Lightweight checks for explore category order helpers.
 * (Avoids Vite-style extensionless imports under plain Node ESM.)
 */
import assert from "node:assert/strict";

const DOMAIN_CODE_TO_CATEGORY_SLUG = {
  Education: "education",
  Insurance: "insurance",
  Logistics: "logistics",
  DigitalEngineering: "digital-engineering",
};

const resolveExploreCategoryKey = ({ serviceId = null, domainCode = null } = {}) => {
  const service = String(serviceId || "").trim();
  if (service) return service.toLowerCase();
  const domain = String(domainCode || "").trim();
  if (!domain) return null;
  return DOMAIN_CODE_TO_CATEGORY_SLUG[domain] || domain;
};

const extractNumericSolutionId = (capabilityOrId) => {
  if (capabilityOrId == null) return null;
  if (typeof capabilityOrId === "number" && Number.isFinite(capabilityOrId)) {
    return capabilityOrId;
  }
  const raw =
    typeof capabilityOrId === "object"
      ? capabilityOrId.id ?? capabilityOrId.ID
      : capabilityOrId;
  const match = String(raw || "").match(/(\d+)$/);
  return match ? Number(match[1]) : null;
};

const moveItemInList = (list, fromIndex, toIndex) => {
  if (!Array.isArray(list)) return [];
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length ||
    fromIndex === toIndex
  ) {
    return [...list];
  }
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
};

const applyCapabilityOrder = (capabilities, orderedIds) => {
  const list = Array.isArray(capabilities) ? [...capabilities] : [];
  if (!Array.isArray(orderedIds) || orderedIds.length === 0) return list;
  const byId = new Map(list.map((item) => [String(item.id), item]));
  const used = new Set();
  const ordered = [];
  orderedIds.forEach((id) => {
    const key = String(id);
    const item = byId.get(key);
    if (item) {
      ordered.push(item);
      used.add(key);
    }
  });
  list.forEach((item) => {
    if (!used.has(String(item.id))) ordered.push(item);
  });
  return ordered;
};

assert.equal(
  resolveExploreCategoryKey({ serviceId: "digital-engineering" }),
  "digital-engineering",
);
assert.equal(resolveExploreCategoryKey({ domainCode: "Insurance" }), "insurance");
assert.equal(resolveExploreCategoryKey({}), null);
assert.equal(extractNumericSolutionId("api-104"), 104);
assert.deepEqual(moveItemInList(["a", "b", "c"], 0, 2), ["b", "c", "a"]);
assert.deepEqual(
  applyCapabilityOrder(
    [{ id: "api-1" }, { id: "api-2" }, { id: "api-3" }],
    ["api-3", "api-1"],
  ).map((item) => item.id),
  ["api-3", "api-1", "api-2"],
);

console.log("exploreCategoryOrder helpers: ok");
