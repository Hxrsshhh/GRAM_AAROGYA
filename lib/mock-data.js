import { CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Activity } from "react";


// Fallback Mock Data for when Backend is offline
export const MOCK_ISSUES = [
  { _id: '1', title: "Water Main Leak", status: "pending", address: "123 Emerald St, Metro", createdAt: new Date().toISOString(), images: [] },
  { _id: '2', title: "Power Line Down", status: "in-progress", address: "456 Sapphire Ave, Metro", createdAt: new Date().toISOString(), images: [] },
  { _id: '3', title: "Pothole Repair", status: "resolved", address: "789 Ruby Rd, Metro", createdAt: new Date().toISOString(), images: [] },
  { _id: '4', title: "Street Light Out", status: "pending", address: "101 Jade Ln, Metro", createdAt: new Date().toISOString(), images: [] },
];


  export const stats = [
    {
      title: "Total Reports",
      value: 23,
      change: "+12% vs last month",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pending",
      value: 10,
      change: "Action required",
      icon: <Clock className="w-5 h-5" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Resolved",
      value: 6,
      change: "High efficiency",
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Active Pulse",
      value: 7,
      change: "Live updates",
      icon: <Activity className="w-5 h-5" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  export const chartData = [
    { name: "Jan", reports: 4 },
    { name: "Feb", reports: 7 },
    { name: "Mar", reports: 5 },
    { name: "Apr", reports: 12 },
    { name: "May", reports: 9 },
    { name: "Jun", reports:  23 },
  ];


  export const Issues =    [
          {
            _id: "2",
            title: "Broken Streetlight",
            description: "The street lighting in Sector 4 has been dark for three nights, creating safety concerns.",
            status: "in-progress",
            category: "utilities",
            address: "Sector 4, North Park",
            createdAt: new Date().toISOString(),
            images: []
          },
          {
            _id: "3",
            title: "Illegal Dumping",
            description: "Unauthorized waste disposal observed at the park entrance.",
            status: "resolved",
            category: "sanitation",
            address: "North Park Gates",
            createdAt: new Date().toISOString(),
            images: []
          },
          {
            _id: "4",
            title: "Water Main Leak",
            description: "Significant water leakage reported on the sidewalk of 5th Avenue.",
            status: "pending",
            category: "utilities",
            address: "5th Avenue",
            createdAt: new Date().toISOString(),
            images: []
          },
          {
            _id: "5",
            title: "Graffiti Removal",
            description: "Vandalism on the community center walls needs addressing.",
            status: "in-progress",
            category: "infrastructure",
            address: "Community Hub",
            createdAt: new Date().toISOString(),
            images: []
          }
        ]


export const IssueDetail =  {
            _id: "101",
            title: "Severe Road Subsidence on Oak Avenue",
            description: "A large section of the asphalt has begun to sink near the storm drain. This is creating a significant hazard for cyclists and small vehicles. The area becomes completely submerged during rain, hiding the depth of the hole.",
            status: "in-progress",
            category: "Infrastructure",
            priority: "High",
            address: "842 Oak Avenue, West District, Civic City",
            createdAt: new Date().toISOString(),
            viewCount: 342,
            upvotes: 56,
            user: { name: "Marcus Thorne", email: "m.thorne@civic.com" },
            images: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80"]
          }

export const userData = {
    name: "Jonathan Sterling",
    email: "j.sterling@community.org",
    phone: "+1 (555) 234-5678",
    address: "San Francisco, CA",
    bio: "Dedicated community organizer with 5+ years of experience in local outreach and sustainable development projects.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  }