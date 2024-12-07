import React, { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import TodoList from "~/components/TodoList";
import { Form, useLoaderData, useActionData } from "react-router";
import FormTodo from "~/components/forms/FormTodo";
import { todoSchema } from "~/schema/TodoSchema";
import { data } from "react-router";
import { toast } from "react-toastify";

export async function loader() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`);
  return res.json();
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  if (request.method === "DELETE") {
    const idTodo = formData.get("idTodo");
    await fetch(`${import.meta.env.VITE_API_URL}/todos/${idTodo}`, {
      method: "DELETE",
    });
    return {
      message: "Todo deleted successfully",
      status: 201,
    };
  }

  if (request.method === "PUT") {
    const idTodo = formData.get("idTodo");
    const description = formData.get("description");
    const status = formData.get("status") === "true";

    const parsedData = todoSchema.safeParse({
      description,
      status,
    });

    if (!parsedData.success) {
      return data(
        {
          errors: parsedData.error.issues,
        },
        { status: 400 }
      );
    }

    const todoData = parsedData.data;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${idTodo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });

    if (res.status === 200) {
      return {
        message: "Todo updated successfully",
        status: 200,
      };
    }
  }

  const description = formData.get("description");
  const status = formData.get("status") === "true";

  const parsedData = todoSchema.safeParse({
    description,
    status,
  });

  if (!parsedData.success) {
    return data(
      {
        errors: parsedData.error.issues,
      },
      { status: 400 }
    );
  }

  const todoData = parsedData.data;

  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoData),
  });

  if (res.status === 201) {
    return {
      message: "Todo added successfully",
      status: 201,
    };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (actionData?.status === 201 || actionData?.status === 200) {
      toast.success(actionData.message);
    }
  }, [actionData]);

  const totalTodos = loaderData.length;
  const completedTodos = loaderData.filter((todo: any) => todo.status).length;
  const pendingTodos = totalTodos - completedTodos;

  const filteredTodos = loaderData.filter((todo: any) => {
    // First apply status filter
    const statusMatch =
      filter === "all"
        ? true
        : filter === "completed"
        ? todo.status
        : !todo.status;

    // Then apply search filter only if search has 3 or more characters
    const searchMatch =
      search.length < 3 ||
      todo.description.toLowerCase().includes(search.toLowerCase());

    // Item must match both filters
    return statusMatch && searchMatch;
  });

  return (
    <div className="mt-20 container mx-auto p-2 lg:p-0">
      <div className="flex flex-col lg:flex-row gap-4 mt-4 p-2 lg:p-4">
        <div className="w-full lg:w-1/4">
          <div className="lg:fixed lg:top-20 lg:w-[17%] flex flex-col gap-4">
            <h1>
              Todo is your notes! You can add, update and delete your todos.
            </h1>
            <FormTodo />
            <hr />
            <h1 className="font-bold inline-flex justify-between items-center">
              Todo <span>{totalTodos}</span>
            </h1>
            <h1 className="font-bold inline-flex justify-between items-center text-gray-400">
              Completed <span>{completedTodos}</span>
            </h1>
            <h1 className="font-bold inline-flex justify-between items-center text-red-400">
              Pending <span>{pendingTodos}</span>
            </h1>
            <hr />
            <h1>Filter</h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`${
                  filter === "all"
                    ? "bg-white/50 text-blue-200"
                    : "bg-white/20 hover:bg-white/50"
                } p-2 rounded-md transition-colors`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`${
                  filter === "completed"
                    ? "bg-white/50 text-blue-200"
                    : "bg-white/20 hover:bg-white/50"
                } p-2 rounded-md transition-colors`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`${
                  filter === "pending"
                    ? "bg-white/50 text-blue-200"
                    : "bg-white/20 hover:bg-white/50"
                } p-2 rounded-md transition-colors`}
              >
                Pending
              </button>
            </div>
            <hr />
            <h1>Search</h1>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Search after 3 character..."
                className="p-2 border rounded-md bg-white/20 placeholder:text-gray-600 focus:bg-white/50 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search.length > 0 && search.length < 3 && (
                <span className="text-sm text-red-400">
                  Please enter at least 3 characters to search
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 w-full lg:w-3/4 self-start">
          <TodoList todos={filteredTodos} />
        </div>
      </div>
    </div>
  );
}
