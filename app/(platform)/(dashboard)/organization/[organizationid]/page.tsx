
import { db } from "@/lib/db";
import { Board } from "./_components/Board";
import Form from "./_components/Form";

const OrganizationIdPage = async () => {
  const boards = await db.board.findMany();
  return (
    <div>
      <Form/>
      <div className="space-y-2">
        {boards.map((board) => (
          <Board id={board.id} key={board.id} title={board.title} />
        ))}
      </div>
    </div>
  );
};
export default OrganizationIdPage;
