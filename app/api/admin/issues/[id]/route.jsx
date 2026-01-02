import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issues from "@/models/Issues";

export async function GET(req, { params }) {
  try {
    const { id } = await params; 
    await connectDB();

    const issue = await Issues.findById(id)
      .populate("reportedBy", "name email")
      .populate("comments.createdBy", "name");

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(issue, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}


export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    let updateQuery = { ...body, updatedAt: new Date() };

    if (body.comment) {
      updateQuery = { 
        $push: { comments: body.comment }, 
        updatedAt: new Date() 
      };
    }

    const updatedIssue = await Issues.findByIdAndUpdate(
      id,
      updateQuery,
      { new: true, runValidators: true }
    )
    .populate("reportedBy", "name email")
    .populate("comments.createdBy", "name"); 

    if (!updatedIssue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json(updatedIssue, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectDB(); 

    const deleted = await Issues.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}