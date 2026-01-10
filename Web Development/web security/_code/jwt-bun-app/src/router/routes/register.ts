import bcrypt from "bcryptjs";
import { addUser, getUserByEmail } from "./utils/users";
import { readJSON } from "../../utils/file-operations";


const registerUser = (req: Request) =>{
  const url = new URL(req.url);
  // REGISTER API
if (url.pathname === "/register" && req.method === "POST") {
  const body = await readJSON(req);

  if (!body) {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return Response.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return Response.json({ message: "User already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  addUser({
    id: crypto.randomUUID(),
    email,
    passwordHash,
  });

  return Response.json(
    { message: "User registered successfully 🎉" },
    { status: 201 },
  );
}
