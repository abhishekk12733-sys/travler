export const mockUser = {
  id: 1,
  username: "wanderlust_explorer",
  email: "explorer@travel.com",
  bio: "Digital nomad | Adventure seeker | 47 countries and counting",
  profilePicture: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
  travelTags: ["adventurer", "backpacker", "photographer"]
};

export const mockTravelLogs = [
  {
    id: 1,
    userId: 1,
    country: "Japan",
    city: "Tokyo",
    dateVisited: "2024-03-15",
    image: "https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800",
    notes: "Amazing experience in Tokyo! Visited Shibuya crossing, ate the best ramen, and explored traditional temples. The blend of modern and traditional culture is incredible.",
    lat: 35.6762,
    lng: 139.6503,
    likes: 24,
    comments: 5,
    isPublic: true
  },
  {
    id: 2,
    userId: 1,
    country: "Iceland",
    city: "Reykjavik",
    dateVisited: "2024-01-20",
    image: "https://images.pexels.com/photos/2259232/pexels-photo-2259232.jpeg?auto=compress&cs=tinysrgb&w=800",
    notes: "Chased the Northern Lights and soaked in the Blue Lagoon. Iceland's natural beauty is otherworldly. Definitely coming back for the summer!",
    lat: 64.1466,
    lng: -21.9426,
    likes: 42,
    comments: 8,
    isPublic: true
  },
  {
    id: 3,
    userId: 1,
    country: "India",
    city: "Manali",
    dateVisited: "2023-12-10",
    image: "https://images.pexels.com/photos/1477430/pexels-photo-1477430.jpeg?auto=compress&cs=tinysrgb&w=800",
    notes: "Saw snow for the first time, did paragliding over the mountains, and stayed in a cozy local Airbnb. The Himalayan views are breathtaking!",
    lat: 32.2396,
    lng: 77.1887,
    likes: 31,
    comments: 12,
    isPublic: true
  },
  {
    id: 4,
    userId: 1,
    country: "Italy",
    city: "Venice",
    dateVisited: "2023-09-05",
    image: "https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&cs=tinysrgb&w=800",
    notes: "Got lost in the beautiful canals and stumbled upon hidden gems. Every corner is a photo opportunity. The gondola ride at sunset was magical.",
    lat: 45.4408,
    lng: 12.3155,
    likes: 56,
    comments: 15,
    isPublic: true
  }
];

export const mockCommunityPosts = [
  {
    id: 5,
    userId: 2,
    username: "beach_lover_22",
    userAvatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=200",
    country: "Maldives",
    city: "Male",
    dateVisited: "2024-02-14",
    image: "https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=800",
    notes: "Paradise found! Crystal clear waters and overwater bungalows. Best honeymoon destination ever!",
    lat: 4.1755,
    lng: 73.5093,
    likes: 89,
    comments: 20,
    isPublic: true
  },
  {
    id: 6,
    userId: 3,
    username: "mountain_hiker",
    userAvatar: "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200",
    country: "Nepal",
    city: "Pokhara",
    dateVisited: "2024-04-01",
    image: "https://images.pexels.com/photos/1578750/pexels-photo-1578750.jpeg?auto=compress&cs=tinysrgb&w=800",
    notes: "Completed the Annapurna Base Camp trek. 12 days of pure adventure and stunning mountain views. Life-changing experience!",
    lat: 28.2096,
    lng: 83.9856,
    likes: 67,
    comments: 18,
    isPublic: true
  }
];

export const mockWishlist = [
  { id: 1, country: "Peru", city: "Machu Picchu", lat: -13.1631, lng: -72.5450 },
  { id: 2, country: "New Zealand", city: "Queenstown", lat: -45.0312, lng: 168.6626 },
  { id: 3, country: "Norway", city: "Lofoten Islands", lat: 68.2167, lng: 13.6167 }
];

export const mockCalendarEvents = [
  {
    id: 1,
    type: "trip",
    title: "Bali Adventure",
    date: "2024-11-15",
    endDate: "2024-11-22",
    color: "bg-blue-500"
  },
  {
    id: 2,
    type: "reminder",
    title: "Renew Passport",
    date: "2024-10-30",
    color: "bg-red-500"
  },
  {
    id: 3,
    type: "flight",
    title: "Flight to Paris",
    date: "2024-12-05",
    time: "14:30",
    color: "bg-green-500"
  }
];
