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

export const toggleUpvote = async (id) => {
  const response = await fetch(`/api/issues/${id}/upvote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to toggle upvote");
  }

  return response.json();
};
