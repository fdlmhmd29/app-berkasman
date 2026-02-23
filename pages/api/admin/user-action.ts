import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "Super Admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const { id } = req.query;
  const userId = Array.isArray(id) ? id[0] : id;

  if (!userId) {
    return res.status(400).json({ error: "ID user tidak valid" });
  }

  // UPDATE USER
  if (req.method === "PUT") {
    const { name, role } = req.body;
    try {
      await db
        .update(users)
        .set({ name, role })
        .where(eq(users.id, userId));
      return res.status(200).json({ message: "User berhasil diperbarui" });
    } catch (error) {
      return res.status(500).json({ error: "Gagal memperbarui user" });
    }
  }

  // DELETE USER
  if (req.method === "DELETE") {
    try {
      // Cegah admin menghapus dirinya sendiri
      if (userId === session.user.id) {
        return res
          .status(400)
          .json({ error: "Anda tidak bisa menghapus akun sendiri" });
      }

      await db.delete(users).where(eq(users.id, userId));
      return res.status(200).json({ message: "User berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ error: "Gagal menghapus user" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
