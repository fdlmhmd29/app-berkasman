import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hash } from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();

  // 1. Validasi Sesi dan Role (Hanya Super Admin yang diizinkan)
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "Super Admin") {
    return res
      .status(403)
      .json({
        error: "Akses ditolak. Hanya Super Admin yang dapat membuat user.",
      });
  }

  try {
    const { name, email, password, role } = req.body;

    // 2. Hash password sebelum disimpan
    const hashedPassword = await hash(password, 12);

    // 3. Masukkan ke database via Drizzle
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      role, // Super Admin bebas menentukan role apa yang diberikan
    });

    return res.status(201).json({ message: "User berhasil dibuat!" });
  } catch (error) {
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
}
