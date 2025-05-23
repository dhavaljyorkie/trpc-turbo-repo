import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "../../utils/trpc";

export function Greeting() {
  const greeting = useQuery(trpc.greeting.queryOptions({ name: "tRPC user" }));
  const getUser = useQuery(trpc.getUser.queryOptions({ id: "12345" }));
  const createUser = useMutation(trpc.createUser.mutationOptions());
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <span>{greeting.data?.text}</span>
      <span>{getUser.data?.text}</span>
      {createUser.isPending && <span>Creating User....</span>}
      {!createUser.isPending && createUser.data?.messageL && (
        <span>{createUser.data?.messageL}</span>
      )}
      <button
        onClick={() =>
          createUser.mutate({
            name: "tRPC user",
          })
        }
      >
        Create user
      </button>
    </div>
  );
}
