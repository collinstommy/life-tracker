import ClerkClient from "@clerk/clerk-js";

export async function loadClerk() {
  const clerkFrontendApi = `pk_test_d2FybS1oYWRkb2NrLTI5LmNsZXJrLmFjY291bnRzLmRldiQ`;
  const clerk = new ClerkClient(clerkFrontendApi);
  await clerk.load({});
}

// loadClerk();
