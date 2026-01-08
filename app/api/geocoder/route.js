import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent":
            "MunicipalSyncProtocol_V1_Contact_harshsingharya612@email.com",
          "Accept-Language": "en",
        },
      }
    );

    if (!response.ok) {
      console.error(`Nominatim Error: ${response.status}`);
      return NextResponse.json(
        { error: `API responded with ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to connect to geocoding service" },
      { status: 500 }
    );
  }
}
