

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

export const fetchCivicIssues = async () => {
  try {
    const response = await fetch("/api/issues", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Failed to fetch");

    const result = await response.json();
    const rawIssues = Array.isArray(result) ? result : result.data || [];

    return rawIssues
      .map((issue) => {
        const lat = parseFloat(issue.location.latitude || issue.location.lat);
        const lng = parseFloat(issue.location.longitude || issue.location.lng);

        if (isNaN(lat) || isNaN(lng)) return null;

        return {
          id: issue._id,
          title: issue.title,
          category: issue.category,
          status: issue.status,
          description: issue.description || "",
          lat: lat,
          lng: lng,
          address: issue.location.address,
          reportedAt: formatRelativeTime(issue.created_at),
          imageUrl: issue.images || null,
        };
      })
      .filter((issue) => issue !== null);
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "Recently";

  const now = new Date();
  const reported = new Date(dateString);

  if (isNaN(reported.getTime())) return "Recently";

  const diffInMs = now - reported;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    return diffInMins <= 1 ? "Just now" : `${diffInMins} mins ago`;
  }
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return diffInDays === 1 ? "Yesterday" : `${diffInDays} days ago`;
};
