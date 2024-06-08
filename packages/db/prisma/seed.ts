import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword1 = await bcrypt.hash("alice", 10);
  const hashedPassword2 = await bcrypt.hash("bob", 10);

  const alice = await prisma.user.upsert({
    where: { number: "9999999999" },
    update: {},
    create: {
      number: "9999999999",
      password: hashedPassword1,
      name: "alice",
      Balance:{
        create: {
          amount: 10000,
          locked: 0,
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
    },
  });
  const bob = await prisma.user.upsert({
    where: { number: "9999999998" },
    update: {},
    create: {
      number: "9999999998",
      password: hashedPassword2,
      name: "bob",
      Balance: {
        create: {
          amount: 10000,
          locked: 0,
        },
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
    },
  });
  console.log({ alice, bob });
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
