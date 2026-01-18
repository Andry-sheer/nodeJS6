import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import session from "express-session";
import Store from 'session-file-store';
import { getUsers } from "./utils/get_users.js";
import { userAuth } from "./middleware/auth.users.js";
import { reviewUsers } from "./middleware/review.users.js";
import { addUser } from "./utils/add_user.js";

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

app.use(reviewUsers);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email && user.password === password)

  if (user) {
    //! я до цього не одразу дійшло, а потім пригадав як ви казали що можна навіть обьєкт туди записати)))
    req.session.user = {
      email: user.email,
      username: user.username,
      role: user.role,
      image: user.image
    }

    res.redirect('/')
  } else {
    res.render('login', { error : 'Invalid login or password!' })
  }
});

app.get('/logout', (req, res)=> {
  req.session.destroy((error)=> {
    if (error) console.log('Error session');
    res.redirect('/login');
  })
})

app.get("/admin", userAuth, (req, res) => {
  res.render("admin", { title: 'admin' });
});

app.get("/about", (req, res) => {
  res.render("about", { title: 'about' });
});

app.get("/only-users", userAuth, (req, res) => {
  res.render("only-users", { title: 'users' });
});

app.get("/profile", userAuth, (req, res) => {
  res.render("profile", { title: "profile" });
});


app.get("/users", userAuth, (req, res) => {
  res.render("users", {
    title: 'users',
    users: users
  });
});

app.get("/registration", (req, res) => {
  res.render("registration", { title: 'registration' });
});


app.post("/registration", async (req, res) => {
  const { email, password, username, image } = req.body;
  const user = users.find(user => user.email === email || user.username === username)

  if (user) {
    res.render('registration', { error: 'email or username is already exist' })
  } else {
    const newUser = {
      username: username,
      email: email,
      password: password,
      role: 'user',
      image: image ? image : './images/default.png'
    }
    
    req.session.user = {
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
      image: newUser.image
    }

    await addUser(newUser)
    res.redirect('/')
  }
});


app.use((req, res) => {
  res.status(404).send("page not found | 404");
});

//! додав емодзі запуску))) (про ракету аж страшно писати... 🥲)
app.listen(PORT, () => {
  console.log(`✅ Server launched at http://localhost:${PORT}`);
});
