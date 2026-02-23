import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LogoutButton from "@/components/logout-button";
import { BookOpenText, FileCheck2, ShieldCheck } from "lucide-react";

const roleOverview: Record<string, string> = {
  "Admin Dokumen": "Menerima berkas buku masuk, validasi checklist, dan pengelolaan draft.",
  "Admin Buku": "Mengatur pencatatan proses cetak buku, status produksi, dan catatan perbaikan.",
  "Super Admin": "Mengatur akses pengguna sekaligus memelihara kategori buku.",
};

export default async function HomePage() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    console.error("[HOME_SESSION_ERROR]", error);
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-xl border-slate-800 bg-slate-900/80 text-slate-100">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto rounded-2xl bg-cyan-500/10 p-3 w-fit">
              <ShieldCheck className="h-8 w-8 text-cyan-400" />
            </div>
            <CardTitle className="text-2xl">Berkasman Management</CardTitle>
            <p className="text-sm text-slate-300">
              Platform pencatatan dokumen dan manajemen proses cetak buku.
            </p>
          </CardHeader>
          <CardContent>
            <Link href="/login" className="block">
              <Button className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                Masuk ke Sistem
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-3">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/20">
                Dashboard Operasional
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight">Halo, {session.user?.name}</h1>
              <p className="text-sm text-slate-300 max-w-2xl">
                {roleOverview[session.user?.role ?? ""] ??
                  "Kelola seluruh aktivitas administrasi dokumen dan buku dari satu panel terpadu."}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm">
              <p className="text-slate-400">Role Aktif</p>
              <p className="font-semibold text-cyan-300">{session.user?.role}</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-slate-800 bg-slate-900 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileCheck2 className="h-5 w-5 text-cyan-400" /> Form Penerimaan Buku
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>
                Admin Dokumen mencatat penerimaan buku, asal pengirim, kelengkapan isi dokumen, dan validasi checklist data.
              </p>
              <Link href="/dokumen">
                <Button className="w-full">Buka Modul Dokumen</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpenText className="h-5 w-5 text-emerald-400" /> Log Produksi Buku
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>
                Admin Buku mengelola kategori, PIC, tanggal cetak, status pekerjaan, dan catatan perbaikan berbasis rich text.
              </p>
              <Link href="/buku">
                <Button className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400">Buka Modul Buku</Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <div className="pt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
