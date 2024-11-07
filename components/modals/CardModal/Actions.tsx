"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ActionsProps {
  data: CardWithList;
}

const Actions = ({ data }: ActionsProps) => {
  const modal = useCardModal()
  const params = useParams();
  const { execute: executeCopy, isLoading: isCopyLoading } = useAction(copyCard, {
    onSuccess: (res) => {
      toast.success(`Card "${res.title}" copied`);
      modal.onClose()
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeDelete, isLoading: isDeleteLoading  } = useAction(deleteCard, {
    onSuccess: (res) => {
      toast.success(`Card "${res.title}" deleted`);
      modal.onClose()
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopy({ boardId, id: data.id });
  };
  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDelete({ boardId, id: data.id });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        disabled={isCopyLoading}
        className="w-full justify-start"
        size={"inline"}
        variant={"gray"}
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isDeleteLoading}
        className="w-full justify-start"
        size={"inline"}
        variant={"gray"}
      >
        <Trash className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};

export default Actions;
