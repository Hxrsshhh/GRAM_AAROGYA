export async function getDashboardData() {
  const res = await fetch("/api/dashboard", {
    method: "GET",
    credentials: "include", // send session cookies
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
}
