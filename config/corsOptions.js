const corsOptions = {
  // origin: "http://localhost:3000",
  origin: "https://react-project-spotify-clone.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow these methods
};

module.exports = corsOptions;
