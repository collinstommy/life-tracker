import type { FC } from "hono/jsx";
import { HtmlEscapedString } from "hono/utils/html";

export const Layout: FC<{ head?: HtmlEscapedString }> = ({
  children,
  head,
}) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>ToDo App</title>
        {head}
      </head>
      <body class="border bg-gray-200 px-4" hx-boost="true">
        {children}
      </body>
    </html>
  );
};
