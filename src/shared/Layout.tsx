import type { FC } from "hono/jsx";
import { html } from "hono/html";

// const Clerk: FC = () => (
// <script>
//   const clerkFrontendApi = `pk_test_d2FybS1oYWRkb2NrLTI5LmNsZXJrLmFjY291bnRzLmRldiQ`;
//   const frontendApi = 'warm-haddock-29.clerk.accounts.dev';
//   const version = '@latest';
//   const script = document.createElement('script');
//   script.setAttribute('data-clerk-frontend-api', frontendApi);
//   script.setAttribute('data-clerk-publishable-key', clerkFrontendApi);
//   script.async = true;
//   script.src = `https://${frontendApi}/npm/@clerk/clerk-js${version}/dist/clerk.browser.js`;

//   // Adds listener to initialize ClerkJS after it's loaded
//   script.addEventListener('load', async function () {
//     const clerk = window.Clerk;
//     await clerk.load({
//       // Set load options here...
//     });
//   });
//   document.body.appendChild(script);
// </script>)

export const Layout: FC = ({ children }) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        {/* <Clerk /> */}
        <title>ToDo App</title>
      </head>
      <body class="border bg-gray-200 px-4" hx-boost="true">
        <div id="user-button"></div>
        {children}
      </body>
    </html>
  );
};
