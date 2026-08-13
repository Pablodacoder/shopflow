const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: { name: "Electronics", slug: "electronics" },
  });
  const books = await prisma.category.upsert({
    where: { slug: "books" },
    update: {},
    create: { name: "Books", slug: "books" },
  });

  await prisma.product.createMany({
    data: [
      {
        sku: "ELEC-001",
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        priceCents: 2499,
        stock: 50,
        categoryId: electronics.id,
      },
      {
        sku: "ELEC-002",
        name: "USB-C Hub",
        description: "7-in-1 USB-C hub",
        priceCents: 3999,
        stock: 30,
        categoryId: electronics.id,
      },
      {
        sku: "BOOK-001",
        name: "Clean Code",
        description: "A handbook of agile software craftsmanship",
        priceCents: 3299,
        stock: 20,
        categoryId: books.id,
      },
    ],
    skipDuplicates: true,
  });

  const passwordHash = await bcrypt.hash("Admin123!", 12);
  await prisma.user.upsert({
    where: { email: "admin@shopflow.dev" },
    update: {},
    create: { email: "admin@shopflow.dev", passwordHash, name: "Admin", role: "ADMIN" },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
