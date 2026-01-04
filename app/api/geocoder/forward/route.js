import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address is required" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      address
    )}&limit=1`,
    {
      headers: {
        "User-Agent":
          "MunicipalSyncProtocol_V1_Contact_harshsingharya612@email.com",
        "Accept-Language": "en",
      },
    }
  );

  const data = await response.json();

  if (!data.length) {
    return NextResponse.json(
      { error: "No location found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
    displayName: data[0].display_name,
  });
}
