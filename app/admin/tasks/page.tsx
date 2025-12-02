"use client";

import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TbClock,
  TbCheck,
  TbAlertTriangle,
  TbLoader,
  TbCpu,
} from "react-icons/tb";

const AdminTasksPage = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleTriggerTask = async (taskName: string, endpoint: string) => {
    if (!confirm(`Jalankan task ${taskName} sekarang?`)) return;

    setLoading(taskName);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success || res.ok) {
        alert(`Berhasil: ${data.message || "Task dijalankan."}`);
      } else {
        alert(`Gagal: ${data.message || "Terjadi kesalahan."}`);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TbCpu className="h-7 w-7 text-primary" />
            System Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Jalankan maintenance task secara manual (biasanya berjalan otomatis
            via Cron).
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Task 1: Auto Complete */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TbCheck className="text-green-600" /> Auto-Complete Orders
                </CardTitle>
                <Badge variant="outline">Hourly</Badge>
              </div>
              <CardDescription>
                Menyelesaikan pesanan yang statusnya <b>DELIVERED</b> dan sudah
                didiamkan pembeli selama lebih dari <b>3 hari</b>. Dana akan
                diteruskan ke Seller.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() =>
                  handleTriggerTask(
                    "Auto Complete",
                    "/api/admin/tasks/trigger/auto-complete"
                  )
                }
                disabled={loading !== null}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading === "Auto Complete" ? (
                  <TbLoader className="animate-spin mr-2" />
                ) : null}
                Jalankan Sekarang
              </Button>
            </CardContent>
          </Card>

          {/* Task 2: Auto Expire */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TbClock className="text-red-600" /> Auto-Expire Unpaid
                </CardTitle>
                <Badge variant="outline">Hourly</Badge>
              </div>
              <CardDescription>
                Membatalkan pesanan yang statusnya <b>WAITING_PAYMENT</b> dan
                belum dibayar selama lebih dari <b>24 jam</b>. Stok/Slot akan
                dikembalikan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() =>
                  handleTriggerTask(
                    "Auto Expire",
                    "/api/admin/tasks/trigger/auto-expire"
                  )
                }
                disabled={loading !== null}
                variant="destructive"
                className="w-full"
              >
                {loading === "Auto Expire" ? (
                  <TbLoader className="animate-spin mr-2" />
                ) : null}
                Jalankan Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 items-start text-sm text-yellow-800">
          <TbAlertTriangle className="shrink-0 mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">Perhatian</p>
            <p>
              Menjalankan task ini secara manual akan memproses data secara
              real-time. Pastikan tidak melakukan spam klik untuk menghindari
              beban server berlebih.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTasksPage;
