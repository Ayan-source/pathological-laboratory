import "dotenv/config";
import { prisma } from "../src/lib/db";
import {
  PERMISSION_CODES,
  ROLE_PERMISSIONS,
} from "../src/lib/permissions";
import { UserRole } from "../src/app/generated/prisma/enums";

function permissionName(code: string): string {
  const [resource, verb] = code.split(".");
  const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return `${label(resource)} ${label(verb ?? "")}`.trim();
}

const TEST_CATEGORIES = [
  { name: "Hematology", description: "Blood counts, coagulation and related tests" },
  { name: "Biochemistry", description: "Chemistry panels, enzymes, lipids, glucose" },
  { name: "Microbiology", description: "Culture, sensitivity and microscopy" },
  { name: "Serology", description: "Serological and immunological testing" },
  { name: "Urinalysis", description: "Routine and microscopic urine examination" },
  { name: "Immunology", description: "Immune markers and hormone assays" },
];

async function seedLabSettings(): Promise<void> {
  const existing = await prisma.labSettings.findFirst();
  if (existing) {
    console.log("LabSettings already present, skipping");
    return;
  }
  await prisma.labSettings.create({
    data: {
      labName: "Pathology Laboratory",
      currency: "PKR",
    },
  });
  console.log("Created default LabSettings");
}

async function seedPermissions(): Promise<void> {
  const permissionIds = new Map<string, string>();
  for (const code of PERMISSION_CODES) {
    const permission = await prisma.permission.upsert({
      where: { code },
      update: { name: permissionName(code) },
      create: { code, name: permissionName(code) },
    });
    permissionIds.set(code, permission.id);
  }
  console.log(`Synced ${permissionIds.size} permissions`);

  for (const role of Object.values(UserRole)) {
    const codes = ROLE_PERMISSIONS[role];
    for (const code of codes) {
      const permissionId = permissionIds.get(code);
      if (!permissionId) throw new Error(`Permission not found: ${code}`);
      await prisma.rolePermission.upsert({
        where: { role_permissionId: { role, permissionId } },
        update: {},
        create: { role, permissionId },
      });
    }
    console.log(`Synced ${codes.length} permissions for role ${role}`);
  }
}

async function seedTestCategories(): Promise<void> {
  for (const category of TEST_CATEGORIES) {
    await prisma.testCategory.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
    });
  }
  console.log(`Synced ${TEST_CATEGORIES.length} test categories`);
}

async function seedReportTemplate(): Promise<void> {
  const existing = await prisma.reportTemplate.findFirst({
    where: { isDefault: true },
  });
  if (existing) {
    console.log("Default report template already present, skipping");
    return;
  }
  await prisma.reportTemplate.create({
    data: {
      name: "Default Report Template",
      description: "Standard pathology report layout",
      isDefault: true,
      configuration: {
        sections: [
          "header",
          "patient",
          "orderInfo",
          "results",
          "pathologist",
          "footer",
        ],
        header: { showLogo: true, showLabInfo: true },
        resultColumns: ["parameter", "value", "unit", "referenceRange", "flag"],
        footer: {
          showSignature: true,
          disclaimer:
            "This report relates only to the samples received for this examination.",
        },
      },
    },
  });
  console.log("Created default report template");
}

async function main(): Promise<void> {
  await seedLabSettings();
  await seedPermissions();
  await seedTestCategories();
  await seedReportTemplate();
  console.log("Seed completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
