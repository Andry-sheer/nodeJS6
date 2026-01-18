import { Router } from "express";
import { getUsers } from "../utils/get_users.js";

const router = Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await getUsers();
  const user = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (user) {
    req.session.user = {
      email: user.email,
      username: user.username,
      role: user.role,
      image: user.image,
    };

    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid login or password!" });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) console.log("Error session");
    res.redirect("/login");
  });
});

export default router;
