// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.contact.createMany({
    data: [
      {
        phoneNumber: "123456",
        email: "lorraine@hillvalley.edu",
        linkPrecedence: "primary",
      },
      {
        phoneNumber: "123456",
        email: "mcfly@hillvalley.edu",
        linkedId: 1,
        linkPrecedence: "secondary",
      },
      {
        phoneNumber: "919191",
        email: "george@hillvalley.edu",
        linkPrecedence: "primary",
      },
      {
        phoneNumber: "717171",
        email: "biffsucks@hillvalley.edu",
        linkPrecedence: "primary",
      },
      {
        phoneNumber: "717171",
        email: "george@hillvalley.edu",
        linkedId: 3,
        linkPrecedence: "secondary",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
