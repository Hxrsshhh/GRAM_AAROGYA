export async function getAllIssues() {
  const res = await fetch("/api/issues", {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch issues");
  }
  return res.json();
}

export async function getIssueById(id) {
  const res = await fetch(`/api/issues/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch issue");
  }
  const data = await res.json();
  return data.issue;
}

export async function createComment(issueId, text) {
  const res = await fetch(`/api/issues/${issueId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to post comment");
  }
  return await res.json();
}

export async function getCommentsByIssueId(issueId) {
  const res = await fetch(`/api/issues/${issueId}/comments`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch comments");
  }
  const data = await res.json();
  return data.comments;
}
