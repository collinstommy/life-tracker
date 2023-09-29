import { Hono } from "hono";
import type { FC } from "hono/jsx";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const AddTodo = () => {
  return (
    <form
      hx-post="/todo"
      hx-target="#todo"
      hx-swap="beforebegin"
      // _="on htmx:afterRequest reset() me"
      // {...{ "hx-on::after-request": "this.reset()" }}
      hx-on="htmx:afterRequest:this.reset()"
      class="mb-4"
    >
      <div class="mb-2">
        <input
          name="title"
          type="text"
          class="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900"
        />
      </div>
      <button
        class="rounded-lg bg-blue-700 px-5 py-2 text-center text-white hover:bg-blue-800"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

const Item = ({ title, id }: { title: string; id: string }) => (
  <p
    hx-delete={`/todo/${id}`}
    hx-swap="outerHTML"
    class="row my-1 mb-2 flex items-center justify-between rounded-lg border bg-gray-100 px-4 py-1 text-lg text-gray-600"
  >
    {title}
    <button class="font-medium">Delete</button>
  </p>
);

export const Todo: FC = () => (
  <div>
    <h1 class="mb-4 text-4xl font-bold">Todo</h1>
    <AddTodo />
    <div id="todo"></div>
  </div>
);

export const todoApi = new Hono();

todoApi.post(
  "/todo",
  zValidator(
    "form",
    z.object({
      title: z.string().min(1),
    }),
  ),
  async (c) => {
    const { title } = c.req.valid("form");
    const id = crypto.randomUUID();
    return c.html(<Item title={title} id={id} />);
  },
);

todoApi.delete("/todo/:id", (c) => {
  const id = c.req.param("id");
  c.status(200);
  return c.body(null);
});
