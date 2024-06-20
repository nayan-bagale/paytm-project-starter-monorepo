"use server";

import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function p2pSendMoney(number: string, amount: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      message: "User not logged in",
    };
  }
  try {
    const sender = await db.user.findFirst({
      where: {
        id: Number(session.user.id),
      },
    });
    if (!sender) {
      return {
        message: "User not found",
      };
    }

    const receiver = await db.user.findFirst({
      where: {
        number: number,
      },
    });

    if (!receiver) {
      return {
        message: "Receiver not found",
        data: receiver,
      };
    }

    await db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT * FROM balance WHERE userId = ${sender.id} FOR UPDATE`;

      const senderBalance = await tx.balance.findUnique({
        where: {
          userId: sender.id,
        },
      });

      if (
        senderBalance &&
        senderBalance.amount &&
        senderBalance.amount < Number(amount)
      ) {
        return {
          message: "Insufficient funds",
        };
      }
      await tx.balance.update({
        where: {
          userId: sender.id,
        },
        data: {
          amount: {
            decrement: Number(amount),
          },
        },
      }),
        await tx.balance.update({
          where: {
            userId: receiver.id,
          },
          data: {
            amount: {
              increment: Number(amount),
            },
          },
        }),
        await tx.p2PTransaction.create({
          data: {
            senderId: sender.id,
            receiverId: receiver.id,
            amount: Number(amount),
            timestamp: new Date(),
          },
        });
    });

    return {
      message: "Money sent successfully",
    };
  } catch (e: unknown) {
    return {
      message: "Error sending money",
    };
  }
}
