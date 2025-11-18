import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * GET /api/orders
 * Mengambil daftar pesanan (untuk buyer atau seller)
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil query params (misal: ?role=worker&status=IN_PROGRESS)
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const response = await fetch(`${API_URL}/orders?${queryString}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Gagal mengambil daftar order" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/orders
 * Membuat order baru (status DRAFT)
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json(); // { serviceId, requirements, attachments }

    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Gagal membuat order" },
        { status: response.status }
      );
    }

    // Mengembalikan data order yang baru dibuat (termasuk ID-nya)
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
