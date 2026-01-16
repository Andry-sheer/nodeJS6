import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import session from "express-session";
import Store from 'session-file-store';
import { getUsers } from "./utils/get_users.js";

dotenv.config();
const fileStore = Store(session);

const users = await getUsers();
// console.log(users);

const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET_SESSION;
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(morgan("dev"));

app.use(express.static("./public"));
app.use(express.static("./static"));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
  store: new fileStore({
    path: './sessions',
    ttl: 60 * 60,
    retries: 0,
  })
}));

app.get("/", (req, res) => {
  const user = req.session.user;
  res.render("index", {
    title: "Home",
    user
  });
});

app.get("/profile", (req, res) => {
  const user = req.session.user;
  res.render("profile", {
    title: "profile",
    user
  });
});

app.get("/login", (req, res) => {
  res.render("login", {});
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email && user.password === password)
  if (user.email && user.password === password) {
    req.session.user = {
      email: user.email,
      username: user.username,
      role: user.role,
      image: user.image
    }
    res.redirect('/')
  } else {
    res.render('login', {error : 'Invalid login or password!'})
  }
});

app.get('/logout', (req, res)=> {
  req.session.destroy((error)=> {
    if (error) console.log('Error session');
    res.redirect('/login');
  })
})

app.use((req, res) => {
  res.status(404).send("page not found | 404");
});

//! додав емодзі запуску))) (про ракету аж страшно писати... 🥲)
app.listen(PORT, () => {
  console.log(`✅ Server launched at http://localhost:${PORT}`);
});
