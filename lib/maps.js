import axios from "axios";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function getHealthCenters(lat, lon) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;

  const res = await axios.get(url, {
    params: {
      location: `${lat},${lon}`,
      radius: 5000,
      type: "hospital",
      key: API_KEY,
    },
  });

  const results = res.data.results;

  return results.slice(0, 5).map((place) => ({
    name: place.name,
    address: place.vicinity,
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
  }));
}

export async function getRoute(start, end) {
  const url = `https://maps.googleapis.com/maps/api/directions/json`;

  const res = await axios.get(url, {
    params: {
      origin: `${start.lat},${start.lon}`,
      destination: `${end.lat},${end.lon}`,
      mode: "driving",
      key: API_KEY,
    },
  });

  return {
    route_polyline:
      res.data.routes?.[0]?.overview_polyline?.points || null,
  };
}