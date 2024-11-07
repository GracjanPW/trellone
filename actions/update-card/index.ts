"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./type";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";

const handler = async (data:InputType) :Promise<ReturnType> =>{
  const {userId, orgId} = await auth();

  if (!userId || !orgId) {
    return {
      error:"Unauthorised"
    }
  }
  const {id, boardId, ...values} = data;

  let card;
  try {
    card = await db.card.update({
      where:{
        id,
        list:{
          board:{
            orgId,
            id:boardId
          }
        }
      },
      data:{
        ...values
      }
    })
  } catch {
    return {
      error:"Card update failed."
    }
  }
  revalidatePath(`/board/${boardId}`)
  return {data:card}
}

export const updateCard = createSafeAction(UpdateCard, handler)