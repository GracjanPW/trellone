"use client";

import { List } from "@prisma/client";
import {
  Popover,
  PopoverClose,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import FormSubmit from "@/components/form/FormSubmit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/delete-list";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/copy-list";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<'button'>>(null);
  const {execute: executeDelete} = useAction(deleteList,{
    onSuccess:(res)=>{
      toast.success(`List "${res.title}" deleted`)
      closeRef.current?.click();
    },
    onError:(error)=>{
      toast.error(error)
    }
  })
  const onDelete = (formData:FormData) =>{
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string;
    executeDelete({id, boardId})
  }
  const {execute: executeCopy} = useAction(copyList,{
    onSuccess:(res)=>{
      toast.success(`List "${res.title}" copied`)
      closeRef.current?.click();
    },
    onError:(error)=>{
      toast.error(error)
    }
  })
  const onCopy = (formData:FormData) =>{
    const id = formData.get("id") as string
    const boardId = formData.get("boardId") as string;
    executeCopy({id, boardId})
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant={"ghost"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List Actions
        </div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            className="w-auto h-auto absolute p-2 top-2 right-2 text-neutral-600"
            variant={"ghost"}
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant={"ghost"}
        >
          Add Card...
        </Button>
        <form action={onCopy}>
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormSubmit
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant={"ghost"}
          >
            Copy List...
          </FormSubmit>
        </form>
        <Separator />
        <form action={onDelete}>
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormSubmit
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant={"ghost"}
          >
            Delete list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ListOptions;
