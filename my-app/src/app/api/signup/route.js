import db from "@/lib/db";

export async function POST(request) {
  try {
    const data = await request.json();

    const { username, email, password } = data;

    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, password]
    );

    return Response.json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Signup failed" }, { status: 500 });
  }
}