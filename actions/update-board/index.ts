"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./type";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";

const handler = async (data:InputType) :Promise<ReturnType> =>{
  const {userId, orgId} = await auth();

  if (!userId || !orgId) {
    return {
      error:"Unauthorised"
    }
  }
  const {title, id} = data;

  let board;
  try {
    board = await db.board.update({
      where:{
        id,
        orgId
      },
      data:{
        title
      }
    })
  } catch {
    return {
      error:"Board update failed."
    }
  }
  revalidatePath(`/board/${id}`)
  return {data:board}
}

export const updateBoard = createSafeAction(UpdateBoard, handler)