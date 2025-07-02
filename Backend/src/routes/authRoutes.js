const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  res.redirect("/auth/profile");
});

router.get("/profile", (req, res) => {
  res.send(`Welcome ${req.user.displayName}`);
});

router.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

module.exports = router;
