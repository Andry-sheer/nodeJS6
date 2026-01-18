import { Router } from "express";
import { userAuth } from "../middleware/auth.users.js";
import { getUsers } from "../utils/get_users.js";

const router = Router();

router.get("/admin", userAuth, (req, res) => {
  res.render("admin", { title: 'admin' });
});

router.get("/only-users", userAuth, (req, res) => {
  res.render("only-users", { title: 'only-users' });
});

router.get("/profile", userAuth, (req, res) => {
  res.render("profile", { title: "profile" });
});


router.get("/users", userAuth, async (req, res) => {
  const users = await getUsers();
  res.render("users", {
    title: 'users',
    users: users
  });
});

export default router;