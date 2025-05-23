import "./styles.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/trpc";
import { Greeting } from "./welcome";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <Greeting />
      </div>
    </QueryClientProvider>
  );
}
