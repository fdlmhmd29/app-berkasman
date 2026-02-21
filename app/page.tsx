import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/logout-button";

export default async function HomePage() {
  // Mengambil sesi aktif dari server
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border text-center">
        {/* KONDISI 1: JIKA USER SUDAH LOGIN */}
        {session ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-green-600 mb-1">
                Berhasil Masuk!
              </h1>
              <p className="text-sm text-gray-500">
                Berikut adalah data sesi Anda:
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-left text-sm border space-y-3">
              <div>
                <span className="text-gray-500 block text-xs font-medium uppercase">
                  Nama
                </span>
                <span className="font-semibold">{session.user?.name}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs font-medium uppercase">
                  Email
                </span>
                <span className="font-semibold">{session.user?.email}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs font-medium uppercase">
                  Hak Akses (Role)
                </span>
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-bold text-xs">
                  {session.user?.role}
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              {/* Tampilkan tombol rahasia ini HANYA jika yang login adalah Super Admin */}
              {session.user?.role === "Super Admin" && (
                <div>
                  <div>
                    <Link href="/super-admin/create-user">
                      <Button variant="outline" className="w-full">
                        Tambah Pengguna Baru
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <Link href="/super-admin/users">
                      <Button variant="outline" className="w-full">
                        Lihat Daftar Pengguna
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Tombol Logout */}
              <LogoutButton />
            </div>
          </div>
        ) : (
          /* KONDISI 2: JIKA USER BELUM LOGIN (LOGOUT) */
          <div className="space-y-6">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              🔒
            </div>
            <h1 className="text-2xl font-bold">Portal Sistem Terpadu</h1>
            <p className="text-gray-500 text-sm">
              Anda saat ini sedang tidak berada dalam sesi. Silakan masuk untuk
              mengakses fitur portal.
            </p>
            <Link href="/login" className="block pt-4">
              <Button className="w-full">Menuju Halaman Login</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
