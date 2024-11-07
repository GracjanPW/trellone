"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./type";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorised",
    };
  }
  const { id, boardId } = data;

  let card;
  try {
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });
    if (!cardToCopy) {
      return {
        error: "Card not found",
      };
    }
    const lastList = await db.card.findFirst({
      where: { listId:cardToCopy.listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    card = await db.card.create({
      data: {
        listId:cardToCopy.listId,
        title: `${cardToCopy.title} - Copy`,
        order: newOrder,
        description: cardToCopy.description
      },
    });
    await createAuditLog({
      entityId:card.id,
      entityTitle:card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE
    })
  } catch {
    return {
      error: "Card copy failed.",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);
