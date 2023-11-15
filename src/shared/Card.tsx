import { FC } from "hono/jsx";

export const Card: FC<{ className?: string }> = ({ children, className }) => (
  <div
    class={`flex flex-col rounded-md bg-white px-4 py-4 shadow-sm shadow-gray-200 ${className}`}
  >
    {children}
  </div>
);
