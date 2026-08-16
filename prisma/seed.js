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
        imageUrl: "https://us.maxgaming.com/bilder/artiklar/zoom/22269_1.jpg?m=1661864590",
      },
      {
        sku: "ELEC-002",
        name: "USB-C Hub",
        description: "7-in-1 USB-C hub",
        priceCents: 3999,
        stock: 30,
        categoryId: electronics.id,
        imageUrl: "https://www.hypershop.com/cdn/shop/files/hyperdrive-next-7-port-usb-c-hub-2532792.webp?v=1762811868&width=600",
      },
      {
        sku: "ELEC-003",
        name: "PS6",
        description: "Gaming Console",
        priceCents: 100000,
        stock: 29,
        categoryId: electronics.id,
        imageUrl: "https://infonegocios.com.py/images/resize/613748.webp?fm=webp",
      },
      {
        sku: "BOOK-001",
        name: "Clean Code",
        description: "A handbook of agile software craftsmanship",
        priceCents: 3299,
        stock: 20,
        categoryId: books.id,
        imageUrl: "https://gumliz.com/itm/elitebook/wp-content/uploads/sites/9/2026/04/image-1187.jpeg",
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
