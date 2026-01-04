export async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "CivicPulse/1.0 (contact@civicpulse.app)",
    },
  });

  const data = await res.json();

  if (!data || data.length === 0) {
    throw new Error("Address not found");
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
