import { Form, Link, useActionData } from "react-router";
import { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { fieldError } from "~/utils/FieldError";

type Todo = {
  id: string;
  description: string;
  status: boolean;
};

type DataProps = {
  todos: Todo[];
};

export default function TodoList({ todos }: DataProps) {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.status === 200) {
      setEditingTodo(null);
    }
  }, [actionData]);

  const descriptionError = fieldError("description", actionData?.errors);

  return (
    <>
      {todos?.map((todo) => (
        <div
          key={todo.id}
          className="bg-white/20 shadow-md rounded-lg p-4 flex flex-col justify-between gap-4 hover:bg-white/50 h-[150px]"
        >
          {editingTodo?.id === todo.id ? (
            <Form method="put" className="flex flex-col gap-2 h-full">
              <input type="hidden" name="idTodo" value={todo.id} />
              <textarea
                name="description"
                defaultValue={todo.description}
                className="p-2 border rounded-md resize-none flex-grow"
              />
              {descriptionError && (
                <span className="text-red-500 text-sm">{descriptionError}</span>
              )}
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    name="status"
                    id={`status-${todo.id}`}
                    defaultChecked={todo.status}
                    value="true"
                    className="p-2 border rounded"
                  />
                  <label htmlFor={`status-${todo.id}`}>Completed</label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="py-1 px-4 rounded-md bg-green-600 text-xs text-white"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTodo(null)}
                    className="py-1 px-4 rounded-md bg-gray-600 text-xs text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          ) : (
            <>
              <p className="">{todo.description}</p>
              <div className="flex justify-between items-center gap-2">
                <p
                  className={`py-1 px-4 rounded-md ${
                    todo.status ? "bg-gray-800" : "bg-red-400"
                  } w-fit text-xs`}
                >
                  {todo.status ? "Completed" : "Pending"}
                </p>
                <div className="flex items-center gap-4">
                  <button onClick={() => setEditingTodo(todo)}>
                    <FaEdit className="w-4 h-4 text-blue-400 hover:scale-110 duration-500" />
                  </button>
                  <Link to={`/todos/${todo.id}`}>
                    <FaEye className="w-4 h-4 text-green-400 hover:scale-110 duration-500" />
                  </Link>
                  <Form method="delete" className="flex items-center">
                    <input type="hidden" name="idTodo" value={todo.id} />
                    <button type="submit">
                      <FaTrash className="w-4 h-4 text-red-400 hover:scale-110 duration-500" />
                    </button>
                  </Form>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
}
