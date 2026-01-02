import { NextResponse } from "next/server";
import ConnectDB from "@/lib/db";
import Issues from "@/models/Issues";

export async function GET(req) {
  try {
    await ConnectDB();
    const statsResult = await Issues.aggregate([
      {
        $facet: {
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
          totalReports: [{ $count: "count" }],
          resolvedThisMonth: [
            {
              $match: {
                status: "resolved",
                updatedAt: {
                  $gte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                  ),
                },
              },
            },
            { $count: "count" },
          ],
        },
      },
    ]);

    const monthlyData = await Issues.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }, // Since start of year
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          reports: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentIssues = await Issues.find({ isArchived: false })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("reportedBy", "name")
      .lean();

    // --- DATA FORMATTING FOR FRONTEND ---
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = monthNames.map((name, index) => {
      const found = monthlyData.find((m) => m._id === index + 1);
      return { name, reports: found ? found.reports : 0 };
    });

    const statusObj = statsResult[0].statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return NextResponse.json({
      stats: {
        total: statsResult[0].totalReports[0]?.count || 0,
        pending: statusObj.pending || 0,
        resolved: statusObj.resolved || 0,
        inProgress: statusObj["in-progress"] || 0,
        resolvedThisMonth: statsResult[0].resolvedThisMonth[0]?.count || 0,
      },
      chartData,
      recentIssues,
    });
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pulse data" },
      { status: 500 }
    );
  }
}
