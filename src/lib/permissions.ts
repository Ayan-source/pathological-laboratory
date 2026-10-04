import { UserRole } from "../app/generated/prisma/enums";

export const PERMISSION_CODES = [
  "patients.read",
  "patients.create",
  "patients.update",

  "orders.read",
  "orders.create",
  "orders.update",

  "samples.read",
  "samples.create",
  "samples.update",

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

  "suppliers.read",
  "suppliers.manage",

  "purchases.read",
  "purchases.create",

  "analytics.read",

  "admin.users",
  "admin.settings",
  "admin.audit_logs",
] as const;

export type PermissionCode = (typeof PERMISSION_CODES)[number];

const ALL_PERMISSIONS: readonly PermissionCode[] = PERMISSION_CODES;

export const ROLE_PERMISSIONS: Record<UserRole, readonly PermissionCode[]> = {
  [UserRole.ADMIN]: ALL_PERMISSIONS,

  [UserRole.RECEPTIONIST]: [
    "patients.read",
    "patients.create",
    "patients.update",
    "orders.read",
    "orders.create",
    "orders.update",
    "samples.read",
    "billing.read",
    "billing.create",
    "results.read",
    "reports.read",
    "reports.print",
    "analytics.read",
  ],

  [UserRole.TECHNICIAN]: [
    "patients.read",
    "orders.read",
    "samples.read",
    "samples.create",
    "samples.update",
    "results.read",
    "results.create",
    "reports.read",
  ],

  [UserRole.PATHOLOGIST]: [
    "patients.read",
    "orders.read",
    "samples.read",
    "results.read",
    "results.verify",
    "reports.read",
    "reports.generate",
    "reports.print",
    "analytics.read",
  ],

  [UserRole.INVENTORY_MANAGER]: [
    "inventory.read",
    "inventory.manage",
    "suppliers.read",
    "suppliers.manage",
    "purchases.read",
    "purchases.create",
    "analytics.read",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: PermissionCode,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function isAdmin(role: UserRole): boolean {
  return role === UserRole.ADMIN;
}
