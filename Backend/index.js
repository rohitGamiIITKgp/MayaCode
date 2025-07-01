require("dotenv").config();

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cors = require('cors');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
// const storyRoutes = require('./routes/storyRoutes');
// const commentRoutes = require('./routes/commentRoutes');
// const likeRoutes = require('./routes/likeRoutes');
// const viewRoutes = require('./routes/viewRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const searchRoutes = require('./routes/searchRoutes');
// const reportRoutes = require('./routes/reportRoutes');
// const feedbackRoutes = require('./routes/feedbackRoutes');
// const analyticsRoutes = require('./routes/analyticsRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { logger } = require('./utils/logger');

const app = express();
// Basic JSON parsing
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());

// Debug middleware to log raw request
app.use((req, res, next) => {
  logger.info('📥 Raw Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  next();
});

// Debug middleware to log parsed request
app.use((req, res, next) => {
  logger.info('📦 Parsed Request:', {
    method: req.method,
    url: req.url,
    body: req.body
  });
  next();
});

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://mayacodebackend.onrender.com/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

app.get("/profile", (req, res) => {
  res.send(`Welcome ${req.user.displayName}`);
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Add error handling middleware
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server is running at port ${PORT}`);
});
