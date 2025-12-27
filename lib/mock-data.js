export const userData = {
  name: "harsh Singh",
  email: "singh@community.org",
  phone: "+1 (555) 234-5678",
  address: "San Francisco, CA",
  bio: "Dedicated community organizer with 5+ years of experience in local outreach and sustainable development projects.",
  avatar:
    "https://imgs.search.brave.com/CwK8iWK54xEr6yXGa0lC9qj4JIG1s4jm_XtPXzizg9k/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1wc2QvM2Qt/aWxsdXN0cmF0aW9u/LXBlcnNvbi13aXRo/LXN1bmdsYXNzZXNf/MjMtMjE0OTQzNjE4/OC5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQwJnE9ODA",
};

const randomDate = (daysBack = 120) => {
  const now = new Date();
  const past = new Date(
    now.getTime() - Math.floor(Math.random() * daysBack) * 24 * 60 * 60 * 1000
  );
  return past.toISOString();
};

// lib/mock/issue-detail.mock.js
export const ISSUE_DETAILS = [
  {
    _id: "101",
    title: "Severe Road Subsidence on Oak Avenue",
    description:
      "A large section of asphalt has sunk near the storm drain, creating hazards for cyclists and small vehicles.",
    status: "in-progress",
    category: "infrastructure",
    priority: "High",
    address: "MG Road, Bengaluru, Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    createdAt: new Date("2024-03-10"),
    viewCount: 342,
    upvotes: 56,
    user: { name: "Marcus Thorne", email: "m.thorne@civic.com" },
    images: [
      "https://imgs.search.brave.com/V0rK-wHBgoJhbtEJir3nVPGPKEYNelOIPR6-8r4nSCA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9zZXZl/cmVseS1kYW1hZ2Vk/LXJlc2lkZW50aWFs/LXN0cmVldC1zaG93/aW5nLXNpZ25pZmlj/YW50LWNyYWNrcy0z/NjU5OTAyMTIuanBn",
    ],
  },
  {
    _id: "102",
    title: "Collapsed Drain Cover",
    description:
      "Drain cover has collapsed under traffic pressure, exposing a deep pit on the main road.",
    status: "pending",
    category: "infrastructure",
    priority: "Critical",
    address: "Ring Road, Sector 9, New Delhi",
    lat: 28.6139,
    lng: 77.209,
    createdAt: new Date("2024-03-12"),
    viewCount: 198,
    upvotes: 41,
    user: { name: "Aisha Khan", email: "a.khan@citymail.com" },
    images: [
      "https://imgs.search.brave.com/YhbkeUgW6hrnXRelgwV9kbWQa6H60TJPsIgGRjRE-So/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YXNsbGltaXRlZC5j/by51ay9zaXRlcy9h/c2wvZmlsZXMvc3R5/bGVzL3dlYnAvcHVi/bGljLzIwMjUtMTIv/Y29sbGFwc2VkLWRy/YWluLXJlcGFpci1B/U0wtTGltaXRlZC1H/dWlsZGZvcmQtU3Vy/cmV5LUFTTC1Db2xs/YXBzZS1kcmFpbi1p/bnNwZWN0aW9uLWNo/YW1iZXItSlBFRy5K/UEc_aXRvaz1IcXpt/VjVDZQ",
    ],
  },
  {
    _id: "103",
    title: "Streetlight Failure Near School",
    description:
      "Multiple streetlights are not working near the school crossing, reducing night visibility.",
    status: "in-progress",
    category: "utilities",
    priority: "Medium",
    address: "Salt Lake City, Kolkata, West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    createdAt: new Date("2024-03-14"),
    viewCount: 156,
    upvotes: 29,
    user: { name: "Rohit Mehra", email: "rohit.m@pulse.in" },
    images: [
      "https://imgs.search.brave.com/ECgZ40Lj6qBWfGV_cH9mYmhchwzctN67fevOe2RAyys/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNDk2/MDI2MTcwL3Bob3Rv/L2Jyb2tlbi1zdHJl/ZXQtbGFtcC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9MWJY/NGJpbnlZa0Q4UF9a/ekhiZlJUc3BLb3dU/SUdvVGtTanh2YmNq/QWtZND0",
    ],
  },
  {
    _id: "104",
    title: "Illegal Garbage Dumping",
    description:
      "Large piles of garbage dumped illegally behind the market complex.",
    status: "resolved",
    category: "sanitation",
    priority: "Medium",
    address: "Andheri East, Mumbai, Maharashtra",
    lat: 19.076,
    lng: 72.8777,
    createdAt: new Date("2024-03-05"),
    viewCount: 221,
    upvotes: 38,
    user: { name: "Elena Ruiz", email: "eruiz@community.net" },
    images: [
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    _id: "105",
    title: "Water Pipeline Leakage",
    description:
      "Continuous water leakage observed from underground pipeline, flooding the footpath.",
    status: "in-progress",
    category: "utilities",
    priority: "High",
    address: "Banjara Hills, Hyderabad, Telangana",
    lat: 17.385,
    lng: 78.4867,
    createdAt: new Date("2024-03-18"),
    viewCount: 312,
    upvotes: 63,
    user: { name: "Daniel Park", email: "d.park@metro.org" },
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    _id: "106",
    title: "Traffic Signal Not Responding",
    description:
      "Signal stuck on red for over 20 minutes causing traffic congestion.",
    status: "pending",
    category: "infrastructure",
    priority: "Critical",
    address: "Anna Salai, Chennai, Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    createdAt: new Date("2024-03-20"),
    viewCount: 402,
    upvotes: 88,
    user: { name: "Sneha Iyer", email: "s.iyer@pulse.in" },
    images: [
      "https://imgs.search.brave.com/Gq76zbNSqHuERYEwc3ryJCpGW1p6xp01RzBEJjQ8eGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9vcHRy/YWZmaWMuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDI1LzAz/L0lzLVlvdXItUG9y/dGFibGUtVHJhZmZp/Yy1TaWduYWwtTm90/LVJlc3BvbmRpbmdI/ZXJlcy1XaGF0LXRv/LURvLTEwMjR4NzY4/LmpwZw",
    ],
  },
  {
    _id: "107",
    title: "Broken Footpath Tiles",
    description:
      "Loose and broken footpath tiles creating tripping hazards for pedestrians.",
    status: "pending",
    category: "infrastructure",
    priority: "Low",
    address: "Civil Lines, Jaipur, Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    createdAt: new Date("2024-03-21"),
    viewCount: 94,
    upvotes: 12,
    user: { name: "Thomas Lee", email: "tlee@urbanwatch.org" },
    images: [
      "https://imgs.search.brave.com/DV9zfMMaTL_jdEzA3JNJGBPC8SvuE-WDK97jyPYYNXE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9icm9rZW4t/dGlsZXMtb24tc3Ry/ZWV0LTI2MG53LTY5/NDk3MDY0Ny5qcGc",
    ],
  },
  {
    _id: "108",
    title: "Overflowing Public Toilet",
    description:
      "Public restroom has not been cleaned for days, causing overflow and odor.",
    status: "in-progress",
    category: "sanitation",
    priority: "High",
    address: "Children's Park, Chandigarh",
    lat: 30.7333,
    lng: 76.7794,
    createdAt: new Date("2024-03-19"),
    viewCount: 267,
    upvotes: 47,
    user: { name: "Neha Kapoor", email: "nkapoor@civic.in" },
    images: [
      "https://imgs.search.brave.com/qGGiMHd9ECwEzw97bOelmf1Wn2ZPPMLWNljeaWBN35s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93ZXN0/ZXJucm9vdGVyLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/NS8wMy90b2lsZXQt/b3ZlcmZsb3dpbmcu/d2VicA",
    ],
  },
  {
    _id: "109",
    title: "Fallen Tree Blocking Road",
    description:
      "Tree uprooted after storm is blocking half the road and slowing traffic.",
    status: "resolved",
    category: "infrastructure",
    priority: "High",
    address: "Market Square, Nagpur",
    lat: 21.1458,
    lng: 79.0882,
    createdAt: new Date("2024-03-02"),
    viewCount: 189,
    upvotes: 34,
    user: { name: "Luis Moreno", email: "lmoreno@city.net" },
    images: [
      "https://imgs.search.brave.com/ajfbF7_VBkMYu7p_aluPkb4QPYs8N0keDlz7fb9YFss/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTU3/Mzc0NjQ0L3Bob3Rv/L2ZhbGxlbi10cmVl/LWJsb2NraW5nLXRo/ZS1yb2FkLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1GOERu/MWNQLWlNU0RQLXpK/NmxMTGotZ0FJRTl1/alI2bGsyY0V4OWJR/ajFjPQ",
    ],
  },
  {
    _id: "110",
    title: "Open Manhole Cover",
    description:
      "Uncovered manhole posing danger to pedestrians and two-wheelers.",
    status: "pending",
    category: "utilities",
    priority: "Critical",
    address: "East Park Lane, Guwahati",
    lat: 26.1445,
    lng: 91.7362,
    createdAt: new Date("2024-03-22"),
    viewCount: 358,
    upvotes: 79,
    user: { name: "Harish Verma", email: "h.verma@metro.in" },
    images: [
      "https://imgs.search.brave.com/zT-Yqfbgc0EtJfzBFbLvl3WNKyYzmxBQfDOtYk0vzk8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE1LzE1LzQ2LzU0/LzM2MF9GXzE1MTU0/NjU0ODZfSXIwQ1lI/bXZyQ01zS1JJMGY5/b0FwNVh4Zm1TdGJZ/WVMuanBn",
    ],
  },
  {
    _id: "111",
    title: "Pothole Pandemic on High Street",
    description:
      "A cluster of deep potholes has appeared after the recent rains, causing several flat tires.",
    status: "pending",
    category: "infrastructure",
    priority: "High",
    address: "North Bridge Road, Kochi",
    lat: 9.9312,
    lng: 76.2673,
    createdAt: new Date("2024-03-23"),
    viewCount: 512,
    upvotes: 120,
    user: { name: "Sarah Jenkins", email: "s.jenkins@webmail.com" },
    images: [
      "https://imgs.search.brave.com/cqBh39PS70T6kPw4FirwsXk0DQN_SSc4lOl7gMNj-CQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90b3du/c3F1YXJlLm1lZGlh/L3NpdGUvNjcvZmls/ZXMvMjAxOS8wMy9Q/b3Rob2xlLmpwZz93/PTk4MCZxPTc1",
    ],
  },
  {
    _id: "112",
    title: "Burst Sewage Pipe",
    description:
      "Sewage water is bubbling up from the pavement, creating a health hazard and foul smell.",
    status: "pending",
    category: "sanitation",
    priority: "Critical",
    address: "Clock Tower Plaza, Mysuru",
    lat: 12.2958,
    lng: 76.6394,
    createdAt: new Date("2024-03-24"),
    viewCount: 289,
    upvotes: 95,
    user: { name: "Kevin Vaught", email: "kv@industrial.com" },
    images: [
      "https://imgs.search.brave.com/zePs-Ov1PfhrDKB03TIzju2aV6zcpavcbar0RXAnLGM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9sZWFr/aW5nLWluZHVzdHJp/YWwtcGlwZS10cmFu/c3BvcnRpbmctc2V3/YWdlLXdhdGVyLWxl/YWtpbmctaW5kdXN0/cmlhbC1waXBlLXRy/YW5zcG9ydGluZy1z/ZXdhZ2Utd2F0ZXIt/Y2xvc2UtdXAtc2hv/dC0xNjQwNDk1Mjcu/anBn",
    ],
  },
  {
    _id: "113",
    title: "Graffiti on Heritage Wall",
    description:
      "Vandalism reported on the historic clock tower wall in the town center.",
    status: "resolved",
    category: "infrastructure",
    priority: "Low",
    address: "Industrial Area Phase 2, Ludhiana",
    lat: 30.9009,
    lng: 75.8573,
    createdAt: new Date("2024-02-28"),
    viewCount: 145,
    upvotes: 15,
    user: { name: "Linda Wu", email: "lwu@history.org" },
    images: [
      "https://imgs.search.brave.com/3daOEww__EVfQipWzD__FGEq6KYBlAanBXHBeqUeGYU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Z2lmZnl3YWxscy5p/bi9jZG4vc2hvcC9m/aWxlcy9iMzIwX3Rl/eHR1cmVfb2ZfYV9i/cmlnaHRfd2FsbF93/aXRoX3J1cHR1cmVz/X29mX3Bvc3RlcnMu/anBnP3F1YWxpdHk9/OTAmdj0xNzM0MDc1/NzExJndpZHRoPTEz/MjY",
    ],
  },
  {
    _id: "114",
    title: "Broken Fire Hydrant",
    description:
      "Fire hydrant is leaking heavily, wasting thousands of gallons of water.",
    status: "in-progress",
    category: "utilities",
    priority: "High",
    address: "High Street, Ahmedabad",
    lat: 23.0225,
    lng: 72.5714,
    createdAt: new Date("2024-03-25"),
    viewCount: 304,
    upvotes: 58,
    user: { name: "Mike Ross", email: "mike.r@safety.com" },
    images: [
      "https://imgs.search.brave.com/jhnRKHb5MN82pCkGaYfWTNGv8kjNX0V49VbAak5DRKU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvODk5/Mzk3NzcvcGhvdG8v/b3VjaC0yLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz15X2Iz/VUVCalZJRm1rNGVh/VW9VMzZJa3hzd2RM/OGVleTUwa0FhVVRu/QnNRPQ",
    ],
  },
  {
    _id: "115",
    title: "Overgrown Vegetation on Path",
    description:
      "Thorny bushes have overgrown the pedestrian walkway, making it impassable.",
    status: "pending",
    category: "sanitation",
    priority: "Low",
    address: "Civil Lines, Jaipur",
    lat: 26.9124,
    lng: 75.7873,
    createdAt: new Date("2024-03-26"),
    viewCount: 88,
    upvotes: 9,
    user: { name: "Garry P.", email: "garry@garden.net" },
    images: [
      "https://imgs.search.brave.com/8u3Y7xpf2yKqXmLPiXFKZbwU1HedZLBLqTcajnjVrCs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9pbmZy/YXJlZC1pbWFnZS1v/dmVyZ3Jvd24tdmVn/ZXRhdGlvbi1wYWxt/LW9pbC1wbGFudGF0/aW9uLTM3MTU0MjEx/My5qcGc",
    ],
  },
  {
    _id: "116",
    title: "Dangerous Dangling Wires",
    description:
      "Overhead power lines have come loose and are dangling dangerously low after high winds.",
    status: "pending",
    category: "utilities",
    priority: "Critical",
    address: "Hillcrest Drive, Shimla",
    lat: 31.1048,
    lng: 77.1734,
    createdAt: new Date("2024-03-27"),
    viewCount: 670,
    upvotes: 145,
    user: { name: "Alice Cooper", email: "alice@citywatch.com" },
    images: [
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    _id: "117",
    title: "Broken Playground Swing",
    description:
      "One of the swings in the public park is broken and hanging by a single chain.",
    status: "pending",
    category: "infrastructure",
    priority: "Medium",
    address: "Sunnyvale Children's Park",
    createdAt: new Date("2024-03-28"),
    viewCount: 112,
    upvotes: 22,
    user: { name: "Jason Derlo", email: "jd@parentmail.com" },
    images: [
      "https://imgs.search.brave.com/f8VS0oemTpDb67gxI6eegEm0Z_ASRNUBIJb8tO9sulw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS1w/aG90by9icm9rZW4t/Y2hhaW4tc3dpbmct/cGxheWdyb3VuZC1z/Y2hvb2wtMjYwbnct/MTAzMzUyNjYzNS5q/cGc",
    ],
  },
  {
    _id: "118",
    title: "Clogged Storm Drain",
    description:
      "Drain is completely filled with plastic waste and leaves, leading to flooding.",
    status: "in-progress",
    category: "sanitation",
    priority: "High",
    address: "Bus Terminal, Indore",
    lat: 22.7196,
    lng: 75.8577,
    createdAt: new Date("2024-03-29"),
    viewCount: 205,
    upvotes: 48,
    user: { name: "Sam Wilson", email: "sam.w@cityview.com" },
    images: [
      "https://imgs.search.brave.com/1dZGwBlTTobXvrHDIstWNeCtuUO3MSEKXGOu3BAly90/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hbWVy/aWNsZWFucHVtcGlu/Zy5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjUvMDMvQ2xv/Z2dlZC1zdG9ybS1k/cmFpbnMtMTAyNHg1/MTIud2VicA",
    ],
  },
];

export function generateIssuePreview(issue) {
  return {
    _id: issue._id,
    title: issue.title,
    status: issue.status,
    address: issue.address,
    createdAt: issue.createdAt,
    images: issue.images ?? [],
  };
}

export function generateIssuePreviewList(issues = []) {
  return issues.map(generateIssuePreview);
}

import { TrendingUp, Clock, CheckCircle2, Activity } from "lucide-react";

/**
 * Calculate dashboard stats from issues data
 */
export function calculateIssueStats(issues = []) {
  const total = issues.length;

  const pending = issues.filter((i) => i.status === "pending").length;
  const inProgress = issues.filter((i) => i.status === "in-progress").length;
  const resolved = issues.filter((i) => i.status === "resolved").length;

  // Example growth logic (safe default)
  const changePercent = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return [
    {
      title: "Total Reports",
      value: total,
      change: `+${changePercent}% vs last month`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pending",
      value: pending,
      change: pending > 0 ? "Action required" : "All clear",
      icon: <Clock className="w-5 h-5" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Resolved",
      value: resolved,
      change: resolved > pending ? "High efficiency" : "In progress",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Active Pulse",
      value: inProgress,
      change: "Live updates",
      icon: <Activity className="w-5 h-5" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];
}

/**
 * Generates monthly reports chart data from issues
 * Output format matches Recharts expectations
 */
export function generateMonthlyChartData(issues = []) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize counts
  const monthlyCounts = Array(12).fill(0);

  issues.forEach((issue) => {
    const date = new Date(issue.createdAt);
    const monthIndex = date.getMonth(); // 0–11
    monthlyCounts[monthIndex]++;
  });

  // Convert to chart format
  return months.map((month, index) => ({
    name: month,
    reports: monthlyCounts[index],
  }));
}

// lib/mock-data/issue.service.js

export function getIssueById(issues, id) {
  return issues.find((issue) => issue._id === id) || null;
}

// lib/utils/issue-preview.js

export function generateMapTssue(issue) {
  if (!issue) return null;

  return {
    _id: issue._id,
    title: issue.title,
    category: issue.category,
    status: issue.status,
    priority: issue.priority,
    address: issue.address,
    lat: issue.lat,
    lng: issue.lng,
    images: issue.images ?? [],
  };
}

// lib/utils/issue-preview.js

export function generateMapIssueList(issues = []) {
  return issues.map(generateMapTssue);
}
