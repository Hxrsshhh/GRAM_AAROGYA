import bcrypt from "bcryptjs";
import connectToDB from "@/lib/db";
import User from "@/models/user.model";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json({ error: "All fields required" }, { status: 400 });
  }

  await connectToDB();

  const exists = await User.findOne({ email });
  if (exists) {
    return Response.json({ error: "User already exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  await User.create({
    name,
    email,
    password: hashed,
    status: "active",
    authProviders: [{ provider: "credentials", providerId: email }],
  });

  return Response.json({ success: true });
}
