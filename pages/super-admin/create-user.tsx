import { useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

// 1. Definisikan Skema Validasi dengan Zod
const formSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  role: z.enum(["Super Admin", "Admin Dokumen", "Admin Buku", "Reviewer"], {
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

  // 2. Inisialisasi Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Reviewer", // Default role yang paling rendah risikonya
    },
  });

  // 3. Fungsi Submit ke API
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

      if (!response.ok) {
        throw new Error(result.error || "Gagal membuat pengguna");
      }

      setMessage({ type: "success", text: "Pengguna berhasil ditambahkan!" });
      form.reset(); // Kosongkan form setelah sukses
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8 mt-10 bg-white border rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Tambah Pengguna Baru</h1>

      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Field Nama */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan nama..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="nama@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Sementara</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Field Role (Dropdown) */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hak Akses (Role)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hak akses" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Reviewer">Reviewer</SelectItem>
                    <SelectItem value="Admin Dokumen">Admin Dokumen</SelectItem>
                    <SelectItem value="Admin Buku">Admin Buku</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Buat Pengguna"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// 4. Proteksi Halaman (Hanya Super Admin)
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== "Super Admin") {
    return {
      redirect: {
        destination: "/", // Tendang ke halaman utama atau login jika bukan Super Admin
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
