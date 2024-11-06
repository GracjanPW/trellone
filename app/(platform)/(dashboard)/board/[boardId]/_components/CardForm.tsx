"use client";

import { createCard } from "@/actions/create-card";
import FormSubmit from "@/components/form/FormSubmit";
import FormTextArea from "@/components/form/FormTextArea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFromProps {

  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

const CardForm = forwardRef<HTMLTextAreaElement, CardFromProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams()
    const formRef = useRef<ElementRef<"form">>(null);
    //const inputRef = useRef<ElementRef<"input">>(null);
    const {execute, fieldErrors} = useAction(createCard,{
      onSuccess:(res)=>{
        toast.success(`Card "${res.title}" created`)
        formRef.current?.reset();
        disableEditing();
      },
      onError:(error)=>{
        toast.error(error)
      }
    })

    const onKeyDown = (e:KeyboardEvent) =>{
      if (e.key ==="Escape" ){
        disableEditing();
      }
    }
    useEventListener("keydown", onKeyDown)
    useOnClickOutside(formRef, disableEditing)

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e)=>{
      if (e.key=== "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
    const onSubmit = (formData:FormData) =>{
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = formData.get("boardId") as string;
      execute({title,listId,boardId})
    }

    if (isEditing) {
      return (
        <form 
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextArea id={"title"} onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter a title for this card..."
            errors={fieldErrors}
            
            />
            <input
              hidden
              id="listId"
              name="listId"
              value={listId}
            />
            <input
              hidden
              id="boardId"
              name="boardId"
              value={params.boardId}
            />
            <div className="flex items-center gap-x-1">
              <FormSubmit>
                Add card
              </FormSubmit>
              <Button onClick={disableEditing} size={'sm'} variant={'ghost'}>
                <X className="w-5 h-5"/>
              </Button>
            </div>
        </form>
      )
    }
    return (
      <div className="pt-2 px-2">
        <Button
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          onClick={enableEditing}
          variant={"ghost"}
          size={"sm"}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";

export default CardForm;
