import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpenCheck, FileText, PlusCircle, WandSparkles } from "lucide-react";

type BookStatus = "Sedang Dicetak" | "Perbaikan" | "Selesai";

const defaultCategories = ["Pertek", "Rintek", "RKL-RPL", "UKL-UPL", "AMDAL", "IMPLE"];

const initialLogs = [
  {
    id: "BK-001",
    title: "Laporan AMDAL Proyek Utara",
    category: "AMDAL",
    pic: "Deni Saputra",
    copies: 120,
    company: "PT Maju Hijau",
    printDate: "2026-02-10",
    estimateDoneDate: "2026-02-20",
    note: "Pengecekan awal kualitas warna cover.",
    status: "Sedang Dicetak" as BookStatus,
  },
  {
    id: "BK-002",
    title: "Dokumen RKL-RPL Kawasan Timur",
    category: "RKL-RPL",
    pic: "Wulan Pertiwi",
    copies: 80,
    company: "PT Delta Sejahtera",
    printDate: "2026-02-12",
    estimateDoneDate: "2026-02-19",
    note: "Perbaikan nomenklatur lampiran BAB 3.",
    status: "Perbaikan" as BookStatus,
  },
];

export default function BukuPage({ role }: { role: string }) {
  const [categories, setCategories] = useState(defaultCategories);
  const [newCategory, setNewCategory] = useState("");
  const [status, setStatus] = useState<BookStatus>("Sedang Dicetak");
  const [revisionNotes, setRevisionNotes] = useState("");

  const canManageCategory = role === "Super Admin";

  const addCategory = () => {
    const sanitized = newCategory.trim().toUpperCase();
    if (!sanitized || categories.includes(sanitized)) return;
    setCategories((prev) => [...prev, sanitized]);
    setNewCategory("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-3">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/20">Admin Buku</Badge>
          <h1 className="text-3xl font-semibold">Log Produksi Buku</h1>
          <p className="text-sm text-slate-300 max-w-3xl">
            Kelola data buku yang dicetak, kategori, penanggung jawab, timeline pengerjaan, serta catatan revisi berbasis rich text.
          </p>
        </header>

        <section className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 border-slate-800 bg-slate-900 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpenCheck className="h-5 w-5 text-emerald-400" /> Form Input Log Buku
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kategori Buku</Label>
                  <Select defaultValue={defaultCategories[0]}>
                    <SelectTrigger className="bg-slate-950 border-slate-700">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Judul Buku</Label>
                  <Input className="bg-slate-950 border-slate-700" placeholder="Masukkan judul buku" />
                </div>

                <div className="space-y-2">
                  <Label>PIC Buku</Label>
                  <Input className="bg-slate-950 border-slate-700" placeholder="Nama PIC" />
                </div>

                <div className="space-y-2">
                  <Label>Cetak Berapa Buku</Label>
                  <Input type="number" className="bg-slate-950 border-slate-700" placeholder="0" />
                </div>

                <div className="space-y-2">
                  <Label>Nama Perusahaan</Label>
                  <Input className="bg-slate-950 border-slate-700" placeholder="Nama perusahaan" />
                </div>

                <div className="space-y-2">
                  <Label>Tanggal Cetak</Label>
                  <Input type="date" className="bg-slate-950 border-slate-700" />
                </div>

                <div className="space-y-2">
                  <Label>Perkiraan Selesai Cetak</Label>
                  <Input type="date" className="bg-slate-950 border-slate-700" />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(value: BookStatus) => setStatus(value)}>
                    <SelectTrigger className="bg-slate-950 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sedang Dicetak">Sedang Dicetak</SelectItem>
                      <SelectItem value="Perbaikan">Perbaikan</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Catatan Umum</Label>
                <textarea
                  className="min-h-24 w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-sm"
                  placeholder="Catatan tambahan produksi"
                />
              </div>

              <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-base">Catatan Perbaikan (Rich Text Sederhana)</Label>
                  <div className="flex gap-2 text-xs">
                    <Button type="button" size="sm" variant="outline" className="border-slate-700 text-slate-200">• Bullet List</Button>
                    <Button type="button" size="sm" variant="outline" className="border-slate-700 text-slate-200">B Bold</Button>
                  </div>
                </div>
                <textarea
                  className="min-h-28 w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-sm"
                  placeholder="- Revisi judul\n- Koreksi angka tabel"
                  value={revisionNotes}
                  onChange={(event) => {
                    const value = event.target.value;
                    setRevisionNotes(value);
                    if (value.trim().length > 0) {
                      setStatus("Perbaikan");
                    }
                  }}
                />
                <p className="text-xs text-slate-400">
                  Saat ada isi pada catatan perbaikan, status otomatis berubah menjadi <strong>Perbaikan</strong>.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">Simpan Log Buku</Button>
                <Button variant="outline" className="border-slate-700 text-slate-200">Simpan sebagai Draft</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900 text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PlusCircle className="h-5 w-5 text-emerald-400" /> Manajemen Kategori
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-300">
                Hanya <span className="font-semibold">Super Admin</span> yang dapat menambah kategori buku.
              </p>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder="Kategori baru"
                  className="bg-slate-950 border-slate-700"
                  disabled={!canManageCategory}
                />
                <Button onClick={addCategory} disabled={!canManageCategory}>
                  Tambah
                </Button>
              </div>
              {!canManageCategory && (
                <p className="text-xs text-amber-300">Mode baca-saja: login sebagai Super Admin untuk menambah kategori.</p>
              )}

              <div className="pt-2 space-y-2">
                {categories.map((category) => (
                  <div key={category} className="rounded-md border border-slate-700 px-3 py-2 text-sm flex items-center justify-between">
                    <span>{category}</span>
                    <WandSparkles className="h-4 w-4 text-emerald-300" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="border-slate-800 bg-slate-900 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-emerald-400" /> Riwayat Log Buku
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {initialLogs.map((log) => (
              <div key={log.id} className="rounded-lg border border-slate-700 bg-slate-950/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{log.title}</h3>
                  <Badge
                    className={
                      log.status === "Perbaikan"
                        ? "bg-amber-500/20 text-amber-300 border-amber-400/20"
                        : log.status === "Selesai"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/20"
                          : "bg-cyan-500/20 text-cyan-300 border-cyan-400/20"
                    }
                  >
                    {log.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-300 mt-1">
                  {log.id} • {log.category} • PIC: {log.pic} • Cetak: {log.copies} buku • {log.company}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Tanggal Cetak: {log.printDate} • Estimasi Selesai: {log.estimateDoneDate}
                </p>
                <p className="text-sm mt-2 text-slate-200">{log.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      role: session.user.role,
    },
  };
};
