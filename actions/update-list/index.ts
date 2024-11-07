"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./type";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";

const handler = async (data:InputType) :Promise<ReturnType> =>{
  const {userId, orgId} = await auth();

  if (!userId || !orgId) {
    return {
      error:"Unauthorised"
    }
  }
  const {title, id, boardId} = data;

  let list;
  try {
    list = await db.list.update({
      where:{
        id,
        boardId,
        board:{
          orgId   
        }
        
      },
      data:{
        title
      }
    })
  } catch {
    return {
      error:"List update failed."
    }
  }
  revalidatePath(`/board/${boardId}`)
  return {data:list}
}

export const updateList = createSafeAction(UpdateList, handler)