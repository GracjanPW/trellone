"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./type";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data:InputType) :Promise<ReturnType> =>{
  const {userId, orgId} = await auth();

  if (!userId || !orgId) {
    return {
      error:"Unauthorised"
    }
  }
  const {id} = data;

  let board;
  try {
    board = await db.board.delete({
      where:{
        id,
        orgId
      }
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