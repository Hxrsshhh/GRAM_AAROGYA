export async function deleteUserAccount() {
  const res = await fetch("/api/user/delete", {
    method: "DELETE",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete account");
  }

  return true;
}
