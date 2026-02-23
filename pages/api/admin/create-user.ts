import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Skema validasi yang sinkron dengan UI dan Database
const formSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  role: z
    .enum(["Super Admin", "Admin Dokumen", "Admin Buku", "Reviewer"])
    .refine((value) => value !== undefined, {
      message: "Silakan pilih role pengguna yang valid",
    }),
});

type ResponseData = {
  error?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  // Hanya izinkan metode POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    // 1. Proteksi: Cek apakah yang memanggil adalah Super Admin
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== "Super Admin") {
      return res.status(403).json({
        error:
          "Terlarang: Anda tidak memiliki izin untuk membuat pengguna baru.",
      });
    }

    // 2. Validasi Input menggunakan Zod
    const validatedData = formSchema.parse(req.body);

    // 3. Cek Duplikasi Email (Case Insensitive)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Email ini sudah terdaftar dalam sistem." });
    }

    // 4. Hashing Password (Salt round 10 adalah standar industri)
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // 5. Simpan ke Database Neon
    await db.insert(users).values({
      name: validatedData.name,
      email: validatedData.email.toLowerCase(), // Simpan dalam lowercase untuk konsistensi
      password: hashedPassword,
      role: validatedData.role,
    });

    return res.status(201).json({ message: "Akun pengguna berhasil dibuat!" });
  } catch (error: unknown) {
    // Handling error validasi Zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }

    // Handling error umum (Database, Network, dll)
    console.error("[CREATE_USER_API_ERROR]:", error);
    return res
      .status(500)
      .json({ error: "Terjadi kesalahan internal pada server." });
  }
}
