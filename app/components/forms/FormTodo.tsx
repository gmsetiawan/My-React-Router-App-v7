import React, { useEffect } from "react";
import { Form, useActionData } from "react-router";
import { toast } from "react-toastify";
import { fieldError } from "~/utils/FieldError";

export default function FormTodo() {
  const actionData = useActionData();
  const errors = actionData?.errors;

  useEffect(() => {
    if (actionData && !errors) {
      const form = document.querySelector("form");
      if (form) {
        form.reset();
        form.querySelector("textarea")?.focus();
      }
    }
  }, [actionData]);

  const descriptionError = fieldError("description", errors);

  return (
    <div className="w-full">
      <Form method="post" className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            className="p-2 border rounded-md resize-none"
            rows={5}
            placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, officiis!"
          ></textarea>
          {descriptionError && (
            <span className="text-red-500 text-sm">{descriptionError}</span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="checkbox"
            name="status"
            id="status"
            value="true"
            className="p-2 border rounded"
          />
          <label htmlFor="status">Status</label>
        </div>
        <button type="submit" className="p-2 bg-blue-500 rounded-md">
          Save
        </button>
      </Form>
    </div>
  );
}
