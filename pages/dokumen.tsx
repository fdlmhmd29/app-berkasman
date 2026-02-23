import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Clock3, FileCheck2, Save } from "lucide-react";

const receiveBookSchema = z.object({
  receivedFrom: z.string().min(2, "Wajib diisi"),
  senderName: z.string().min(2, "Wajib diisi"),
  documentContent: z.string().min(10, "Isi dokumen minimal 10 karakter"),
  checklistValid: z.boolean().refine((value) => value, "Checklist wajib dicentang"),
});

type ReceiveBookValues = z.infer<typeof receiveBookSchema>;

export default function DokumenPage() {
  const form = useForm<ReceiveBookValues>({
    resolver: zodResolver(receiveBookSchema),
    defaultValues: {
      receivedFrom: "",
      senderName: "",
      documentContent: "",
      checklistValid: false,
    },
  });

  const receivedDate = useMemo(() => new Date().toLocaleString("id-ID"), []);

  const onSubmit = (values: ReceiveBookValues) => {
    console.log("[DRAFT_RECEIVE_BOOK]", values);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="space-y-3">
          <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/20">Admin Dokumen</Badge>
          <h1 className="text-3xl font-semibold">Form Terima Buku</h1>
          <p className="text-sm text-slate-300">
            Catat semua buku masuk dengan detail penerimaan, kelengkapan isi dokumen, dan validasi data.
          </p>
        </header>

        <Card className="border-slate-800 bg-slate-900 text-slate-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileCheck2 className="h-5 w-5 text-cyan-400" /> Detail Penerimaan Dokumen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Tanggal Terima (Otomatis)</Label>
                <div className="h-10 rounded-md border border-slate-700 bg-slate-950/80 px-3 flex items-center text-sm text-slate-200">
                  <Clock3 className="mr-2 h-4 w-4 text-cyan-400" /> {receivedDate}
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="receivedFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diterima dari siapa?</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Contoh: Bagian Pengiriman PT ABC"
                            className="bg-slate-950 border-slate-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Siapa pengirimnya?</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nama pengirim"
                            className="bg-slate-950 border-slate-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="documentContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konten / Isi dokumen ada apa saja?</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="min-h-32 w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-sm"
                          placeholder="Contoh: Cover, daftar isi, bab pembahasan, lampiran, dll..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="checklistValid"
                  render={({ field }) => (
                    <FormItem className="rounded-md border border-slate-700 p-4 bg-slate-950/70">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(event) => field.onChange(event.target.checked)}
                          className="h-5 w-5 accent-cyan-500"
                        />
                        <div>
                          <p className="font-medium">Saya yakin data penerimaan sudah benar.</p>
                          <p className="text-xs text-slate-400">Checklist ini wajib sebelum menyimpan data.</p>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button type="button" variant="outline" className="border-slate-700 text-slate-200">
                    Save Draft
                  </Button>
                  <Button type="submit" className="bg-cyan-500 text-slate-950 hover:bg-cyan-400">
                    <Save className="h-4 w-4 mr-2" /> Save
                  </Button>
                  <Button type="button" variant="ghost" className="text-slate-300 hover:bg-slate-800">
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
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

  return { props: {} };
};
