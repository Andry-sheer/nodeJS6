import { Router } from "express";
import { getUsers } from "../utils/get_users.js";
import { addUser } from "../utils/add_user.js";

const router = Router();

router.get("/registration", (req, res) => {
  res.render("registration", { title: "registration" });
});

router.post("/registration", async (req, res) => {
  const { email, password, username, image } = req.body;
  const users = await getUsers();
  const user = users.find(
    (user) => user.email === email || user.username === username,
  );

  if (user) {
    res.render("registration", { error: "email or username is already exist" });
  } else {
    const newUser = {
      username: username,
      email: email,
      password: password,
      role: "user",
      image: image ? image : "./images/default.png",
    };

    req.session.user = {
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      image: newUser.image,
    };

    await addUser(newUser);
    res.redirect("/");
  }
});

export default router;
