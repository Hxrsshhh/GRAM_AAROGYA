
import connectDB from "@/lib/db";
import User from "@/models/User";
import Issues from "@/models/Issues";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  await connectDB();

  const [totalUsers, activeUsers, blockedUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isBlocked: false }),
    User.countDocuments({ isBlocked: true }),
  ]);

  const [totalReports, resolvedReports] = await Promise.all([
    Issues.countDocuments(),
    Issues.countDocuments({ status: "resolved" }),
  ]);

  const monthlyRaw = await Issues.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        reports: { $sum: 1 },
        resolved: {
          $sum: {
            $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const monthly = monthlyRaw.map((m) => ({
    month: m._id,
    reports: m.reports,
    resolved: m.resolved,
  }));

  const categories = await Issues.aggregate([
    {
      $group: {
        _id: "$category",
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        value: 1,
      },
    },
  ]);

  const recentIssuess = await Issues.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title category status priority createdAt")
    .lean();

  return Response.json({
    stats: {
      totalUsers,
      activeUsers,
      blockedUsers,
      totalReports,
      resolvedReports,
      avgResponseTime: 1.8,
    },
    charts: {
      monthly,
      categories,
    },
    recentIssuess: recentIssuess.map((i) => ({
      id: i._id,
      title: i.title,
      category: i.category,
      status: i.status,
      priority: i.priority,
      date: i.createdAt
        ? new Date(i.createdAt).toISOString().split("T")[0]
        : null,
    })),
  });
}
