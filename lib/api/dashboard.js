export async function getDashboardData() {
  const res = await fetch("/api/dashboard", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Dashboard API Error:", res.status, errorData);
    throw new Error(
      errorData.message || `Error ${res.status}: Failed to fetch`
    );
  }

  return res.json();
}
