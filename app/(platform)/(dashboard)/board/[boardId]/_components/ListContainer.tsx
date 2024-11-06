"use client"

import { ListWithCards } from "@/types";
import ListForm from "./ListForm";


interface ListContainerProps {
  boardId: string;
  data: ListWithCards[]
}

const ListContainer = ({boardId, data}:ListContainerProps) => {
  return (
    <ol>
      <ListForm />
      <div className="flex-shrink-0 w-1"/>
    </ol>
  )
}

export default ListContainer