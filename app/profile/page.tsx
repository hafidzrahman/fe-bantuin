"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import PublicLayout from "@/components/layouts/PublicLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  TbUser,
  TbBriefcase,
  TbEdit,
  TbMail,
  TbPhone,
  TbSchool,
  TbId,
  TbStar,
  TbTrophy,
  TbShoppingCart,
  TbCoin,
  TbPackage,
} from "react-icons/tb";

// Interface untuk statistik seller (sama seperti di halaman stats)
interface SellerStats {
  stats: {
    totalServices: number;
    activeOrders: number;
    completedOrders: number;
    totalRevenue: number;
  };
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // State untuk Seller Stats
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  // Fetch Seller Stats hanya jika user adalah seller
  useEffect(() => {
    const fetchSellerStats = async () => {
      if (user?.isSeller) {
        setLoadingStats(true);
        try {
          const token = localStorage.getItem("access_token");
          const res = await fetch("/api/users/seller/stats", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data.success) {
            setSellerStats(data.data);
          }
        } catch (error) {
          console.error("Gagal mengambil statistik seller", error);
        } finally {
          setLoadingStats(false);
        }
      }
    };

    if (user) {
      fetchSellerStats();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PublicLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* 1. Profile Header Card */}
          <Card className="mb-8 border-none shadow-md overflow-hidden">
            <div className="h-32 bg-linear-to-r from-primary to-secondary relative">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-grid-white/10" />
            </div>
            <CardContent className="relative pt-0 px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage
                    src={user.profilePicture || ""}
                    alt={user.fullName}
                  />
                  <AvatarFallback className="text-4xl bg-primary text-white">
                    {getInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1 mt-4 md:mt-0 md:mb-2">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.fullName}
                    </h1>
                    {user.isVerified && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 border-blue-200 w-fit"
                      >
                        Terverifikasi
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0 md:mb-2">
                  <Button
                    onClick={() => router.push("/buyer/settings")}
                    variant="outline"
                  >
                    <TbEdit className="mr-2 h-4 w-4" /> Edit Profil
                  </Button>
                  {user.isSeller && (
                    <Button onClick={() => router.push("/seller/dashboard")}>
                      Dashboard Penyedia
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Tabs Section */}
          <Tabs defaultValue="pengguna" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="pengguna" className="gap-2">
                <TbUser className="h-4 w-4" /> Profil Pengguna
              </TabsTrigger>
              <TabsTrigger value="penyedia" className="gap-2">
                <TbBriefcase className="h-4 w-4" /> Profil Penyedia
              </TabsTrigger>
            </TabsList>

            {/* --- TAB 1: PENGGUNA (BUYER) --- */}
            <TabsContent
              value="pengguna"
              className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info Akademik */}
                <Card className="md:col-span-1 h-fit">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TbSchool className="text-primary" /> Info Akademik
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        NIM
                      </p>
                      <p className="font-medium flex items-center gap-2">
                        <TbId className="text-gray-400" />
                        {user.nim || "-"}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Jurusan
                      </p>
                      <p className="font-medium">{user.major || "-"}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">
                        Angkatan
                      </p>
                      <p className="font-medium">{user.batch || "-"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Bio & Kontak */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Informasi Pribadi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <TbMail className="h-4 w-4" />
                          <span className="text-sm font-medium">Email</span>
                        </div>
                        <p className="text-foreground">{user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <TbPhone className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Nomor Telepon
                          </span>
                        </div>
                        <p className="text-foreground">
                          {user.phoneNumber || "Belum diatur"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg border">
                      <h4 className="text-sm font-semibold mb-2 text-foreground">
                        Bio / Deskripsi Diri
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {user.bio ||
                          "Belum ada deskripsi diri. Tambahkan di pengaturan profil."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* --- TAB 2: PENYEDIA (SELLER) --- */}
            <TabsContent
              value="penyedia"
              className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2"
            >
              {user.isSeller ? (
                <>
                  {/* Seller Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6 flex flex-col gap-2">
                        <span className="text-muted-foreground text-xs uppercase font-bold">
                          Rating
                        </span>
                        <div className="flex items-center gap-2">
                          <TbStar className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                          <span className="text-3xl font-bold">
                            {Number(user.avgRating).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Dari {user.totalReviews} ulasan
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 flex flex-col gap-2">
                        <span className="text-muted-foreground text-xs uppercase font-bold">
                          Pesanan Selesai
                        </span>
                        <div className="flex items-center gap-2">
                          <TbTrophy className="h-6 w-6 text-primary" />
                          <span className="text-3xl font-bold">
                            {user.totalOrdersCompleted}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total Proyek Sukses
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 flex flex-col gap-2">
                        <span className="text-muted-foreground text-xs uppercase font-bold">
                          Total Pendapatan
                        </span>
                        <div className="flex items-center gap-2">
                          <TbCoin className="h-6 w-6 text-green-600" />
                          <span className="text-2xl font-bold truncate">
                            {loadingStats
                              ? "..."
                              : sellerStats
                              ? formatCurrency(sellerStats.stats.totalRevenue)
                              : "Rp 0"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Pendapatan Bersih
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6 flex flex-col gap-2">
                        <span className="text-muted-foreground text-xs uppercase font-bold">
                          Jasa Aktif
                        </span>
                        <div className="flex items-center gap-2">
                          <TbPackage className="h-6 w-6 text-blue-600" />
                          <span className="text-3xl font-bold">
                            {loadingStats
                              ? "..."
                              : sellerStats?.stats.totalServices || 0}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Layanan Ditawarkan
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Shortcut to Seller Dashboard */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <h3 className="text-xl font-bold text-primary mb-2">
                        Kelola Bisnis Jasa Anda
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-lg">
                        Akses dashboard penyedia untuk mengelola pesanan masuk,
                        mengedit layanan, dan melihat analitik mendalam.
                      </p>
                      <Button
                        size="lg"
                        onClick={() => router.push("/seller/dashboard")}
                      >
                        Buka Dashboard Penyedia
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                // Tampilan Jika Bukan Seller
                <Card className="border-dashed border-2">
                  <CardContent className="py-16 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <TbBriefcase className="h-10 w-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Anda Belum Menjadi Penyedia Jasa
                    </h2>
                    <p className="text-muted-foreground max-w-md mb-8">
                      Daftar sekarang untuk mulai menawarkan keahlian Anda
                      kepada ribuan mahasiswa UIN Suska Riau dan dapatkan
                      penghasilan tambahan.
                    </p>
                    <Button
                      size="lg"
                      onClick={() => router.push("/seller/activate")}
                    >
                      Daftar Sebagai Penyedia
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PublicLayout>
  );
}
