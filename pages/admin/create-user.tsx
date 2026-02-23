import { useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { UserPlus, ChevronLeft, Loader2, ShieldCheck } from "lucide-react";

const ROLES = [
  "Super Admin",
  "Admin Dokumen",
  "Admin Buku",
  "Reviewer",
] as const;

const formSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  role: z.enum(ROLES, {
    message: "Silakan pilih role pengguna",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Reviewer",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || "Gagal membuat pengguna");

      setMessage({
        type: "success",
        text: "Akun pengguna baru berhasil dibuat dan disimpan ke database.",
      });
      form.reset();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      setMessage({ type: "error", text: message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Beranda
        </Link>

        <Card className="shadow-lg border-slate-200 overflow-hidden">
          <CardHeader className="border-b bg-white p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
                  <UserPlus className="w-5 h-5 text-primary" /> Tambah Pengguna
                  Baru
                </CardTitle>
                <CardDescription>
                  Daftarkan personel baru ke dalam sistem Portal Berkasman.
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-100 flex gap-1"
              >
                <ShieldCheck className="w-3 h-3" /> Admin Auth
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {message && (
              <Alert
                className={`mb-6 animate-in fade-in ${message.type === "success" ? "border-green-200 bg-green-50 text-green-800" : ""}`}
                variant={message.type === "error" ? "destructive" : "default"}
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Nama Lengkap
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nama user..."
                              {...field}
                              className="focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Alamat Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="user@berkasman.com"
                            {...field}
                            className="focus-visible:ring-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Level Akses (Role)
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="focus-visible:ring-primary">
                              <SelectValue placeholder="Pilih Role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Reviewer">
                              Reviewer (Pemeriksa)
                            </SelectItem>
                            <SelectItem value="Admin Dokumen">
                              Admin Dokumen
                            </SelectItem>
                            <SelectItem value="Admin Buku">
                              Admin Buku
                            </SelectItem>
                            <SelectItem value="Super Admin">
                              Super Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">
                            Password Akses
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Min. 6 karakter"
                              {...field}
                              className="focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button
                    type="submit"
                    className="min-w-37.5 font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Daftarkan Pengguna"
                    )}
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
  if (!session || session.user.role !== "Super Admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
};
