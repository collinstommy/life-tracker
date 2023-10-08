import { FC } from "hono/jsx";

export const Container: FC = ({ children }) => {
  return (
    <div class="flex h-full flex-col items-center border bg-gray-200 px-4 py-2">
      {children}
    </div>
  );
};

export const Tag: FC = ({ children }) => (
  <li class="flex items-center rounded-md bg-gray-300 px-3 py-1 text-sm">
    {children}
  </li>
);
