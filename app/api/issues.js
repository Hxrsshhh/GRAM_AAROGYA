export async function getAllIssues() {
  const res = await fetch("/api/issues", {
    method: "GET",
    cache: "no-store", // always fresh
  });

  if (!res.ok) {
    throw new Error("Failed to fetch issues");
  }

  return res.json();
}
