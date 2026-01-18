import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import session from "express-session";
import Store from "session-file-store";
import { reviewUsers } from "./middleware/review.users.js";
import homeRouter from "./routes/main.router.js";
import loginRouter from "./routes/login.router.js";
import registrationRouter from "./routes/registration.router.js";
import authRouter from "./routes/auth.router.js";

dotenv.config();
const fileStore = Store(session);

const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET_SESSION;
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(morgan("dev"));

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new fileStore({
      path: "./sessions",
      ttl: 60 * 60,
      retries: 2,
      logFn: () => {},
      reapInterval: 86400,
    }),
  }),
);

app.use(reviewUsers);

app.use("/", homeRouter);

app.use("/", loginRouter);

app.use("/", registrationRouter);

app.use("/", authRouter);

app.use((req, res) => {
  res.status(404).send("page not found | 404");
});

app.listen(PORT, () => {
  console.log(`✅ Server launched at http://localhost:${PORT}`);
});
