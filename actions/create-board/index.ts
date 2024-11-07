"use server";


import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

const handler = async (data:InputType): Promise<ReturnType> =>{
  const {userId, orgId} = await auth();
  if (!userId || !orgId) {
    return {
      error:"Unathorized",
    }
  }
  const {title, image} = data;

  const [
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHTML,
    imageUserName
  ] = image.split("|")

  if (!imageId||!imageThumbUrl||!imageFullUrl||!imageLinkHTML||!imageUserName){
    return {
      error:"Missing fields, Failed to create board."
    }
  }

  let board;
  try {
    board = await db.board.create({
      data:{
        orgId,
        title,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
      }
    })
    await createAuditLog({
      entityId:board.id,
      entityTitle:board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE
    })
  } catch {
    return {
      error: "Operation Failed"
    }
  }
  revalidatePath(`/board/${board.id}`);
  return {data:board}
}

export const createBoard = createSafeAction(CreateBoard, handler)