import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { latitude, longitude } = await req.json();

    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:5000,${latitude},${longitude});
        node["amenity"="clinic"](around:5000,${latitude},${longitude});
      );
      out;
    `;

    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    const data = await res.json();

    const places = data.elements.map((el) => ({
      name: el.tags?.name || "Unknown",
      latitude: el.lat,
      longitude: el.lon,
      address: el.tags?.["addr:full"] || "No address",
      phone: el.tags?.phone || null,
    }));

    return NextResponse.json({
      nearest_health_centers: places.slice(0, 10),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch health centers" },
      { status: 500 }
    );
  }
}