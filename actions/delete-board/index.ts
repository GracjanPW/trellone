"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./type";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE, ACTION } from "@prisma/client";
import { decrementAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data:InputType) :Promise<ReturnType> =>{
  const {userId, orgId} = await auth();

  if (!userId || !orgId) {
    return {
      error:"Unauthorised"
    }
  }
  const isPro = await checkSubscription();

  const {id} = data;

  let board;
  try {
    board = await db.board.delete({
      where:{
        id,
        orgId
      }
    })
    if (!isPro) await decrementAvailableCount()
    await createAuditLog({
      entityId:board.id,
      entityTitle:board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE
    })
  } catch {
    return {
      error:"Board delete failed."
    }
  }
  revalidatePath(`/organization/${orgId}`)
  redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)