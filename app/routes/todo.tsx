import { Link } from "react-router";
import type { Route } from "./+types/todo";

export async function loader({ params }: Route.LoaderArgs) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/todos/${params.id}`);
  return res.json();
}

export default function Todo({ loaderData }: Route.ComponentProps) {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Link to="/" viewTransition>
        Go Back
      </Link>
      <p className="font-bold">{loaderData.description}</p>
      <p>{loaderData.status === true ? "Completed" : "Pending"}</p>
    </div>
  );
}
