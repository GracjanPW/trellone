import { deleteBoard } from "@/actions/delete-board";
import FormDelete from "./FormDelete";

interface BoardProps {
  id: string;
  title: string;
}

export const Board = ({ id, title }: BoardProps) => {
    const deleteBoardWithId = deleteBoard.bind(null, id)
  return (
    <form action={deleteBoardWithId} className="flex items-center gap-x-2">
      <p>Board name: {title}</p>
      <FormDelete/>
    </form>
  );
};
