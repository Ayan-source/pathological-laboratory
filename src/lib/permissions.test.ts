import { describe, expect, it } from "vitest";
import { UserRole } from "../app/generated/prisma/enums";
import {
  hasPermission,
  isAdmin,
  PERMISSION_CODES,
  ROLE_PERMISSIONS,
  type PermissionCode,
} from "./permissions";

const ALL_ROLES = Object.values(UserRole);

describe("permission codes", () => {
  it("covers the PRD RBAC-002 permission list", () => {
    const required = [
      "patients.read",
      "patients.create",
      "patients.update",
      "orders.read",
      "orders.create",
      "orders.update",
      "billing.read",
      "billing.create",
      "results.read",
      "results.create",
      "results.verify",
      "reports.read",
      "reports.generate",
      "reports.print",
      "inventory.read",
      "inventory.manage",
      "admin.users",
      "admin.settings",
      "admin.audit_logs",
    ];
    for (const code of required) {
      expect(PERMISSION_CODES).toContain(code);
    }
  });

  it("has no duplicate codes", () => {
    expect(new Set(PERMISSION_CODES).size).toBe(PERMISSION_CODES.length);
  });
});

describe("role permission matrix", () => {
  it("grants permissions to every role", () => {
    for (const role of ALL_ROLES) {
      expect(ROLE_PERMISSIONS[role].length).toBeGreaterThan(0);
    }
  });

  it("grants ADMIN every permission", () => {
    expect([...ROLE_PERMISSIONS[UserRole.ADMIN]].sort()).toEqual(
      [...PERMISSION_CODES].sort(),
    );
  });

  it("only references known permission codes", () => {
    for (const role of ALL_ROLES) {
      for (const code of ROLE_PERMISSIONS[role]) {
        expect(PERMISSION_CODES).toContain(code);
      }
    }
  });

  it("denies RECEPTIONIST admin and verification permissions", () => {
    const receptionist = ROLE_PERMISSIONS[UserRole.RECEPTIONIST];
    expect(receptionist.some((c) => c.startsWith("admin."))).toBe(false);
    expect(receptionist).not.toContain("results.verify");
    expect(receptionist).not.toContain("inventory.manage");
  });

  it("denies TECHNICIAN result verification", () => {
    expect(ROLE_PERMISSIONS[UserRole.TECHNICIAN]).not.toContain(
      "results.verify",
    );
  });

  it("grants PATHOLOGIST verification and report generation", () => {
    const pathologist = ROLE_PERMISSIONS[UserRole.PATHOLOGIST];
    expect(pathologist).toContain("results.verify");
    expect(pathologist).toContain("reports.generate");
  });

  it("keeps INVENTORY_MANAGER out of patient and result data", () => {
    const manager = ROLE_PERMISSIONS[UserRole.INVENTORY_MANAGER];
    expect(manager.some((c) => c.startsWith("patients."))).toBe(false);
    expect(manager.some((c) => c.startsWith("results."))).toBe(false);
    expect(manager.some((c) => c.startsWith("admin."))).toBe(false);
  });
});

describe("hasPermission", () => {
  it("returns true for granted permissions", () => {
    expect(
      hasPermission(UserRole.PATHOLOGIST, "results.verify"),
    ).toBe(true);
  });

  it("returns false for denied permissions", () => {
    expect(hasPermission(UserRole.TECHNICIAN, "results.verify")).toBe(false);
    expect(
      hasPermission(UserRole.RECEPTIONIST, "admin.users" as PermissionCode),
    ).toBe(false);
  });
});

describe("isAdmin", () => {
  it("identifies only ADMIN as admin", () => {
    expect(isAdmin(UserRole.ADMIN)).toBe(true);
    expect(isAdmin(UserRole.RECEPTIONIST)).toBe(false);
    expect(isAdmin(UserRole.TECHNICIAN)).toBe(false);
    expect(isAdmin(UserRole.PATHOLOGIST)).toBe(false);
    expect(isAdmin(UserRole.INVENTORY_MANAGER)).toBe(false);
  });
});
