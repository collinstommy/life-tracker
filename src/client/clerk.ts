import { clerkClient } from "../features/auth";

export async function loadClerk() {
  const clerkFrontendApi = `pk_test_d2FybS1oYWRkb2NrLTI5LmNsZXJrLmFjY291bnRzLmRldiQ`;
  const clerk = new clerkClient(clerkFrontendApi);
  await clerk.load({});
}

loadClerk();
