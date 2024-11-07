"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./type";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorised",
    };
  }
  const { items, boardId } = data;

  let cards;
  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            board:{
              orgId,
            }
          },
        },
        data: {
          order: card.order,
          listId: card.listId
        },
      })
    );
    cards = await db.$transaction(transaction);
  } catch {
    return {
      error: "Card reorder failed.",
    };
  }
  revalidatePath(`/board/${boardId}`);
  return { data: cards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
