import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import session from "express-session";
dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(morgan("dev"));

app.use(express.static("./public"));
app.use(express.static("./static"));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index", {
    title: "Home"
  });
});

app.use((req, res) => {
  res.status(404).send("page not found | 404");
});

//! додав емодзі запуску))) (про ракету аж страшно писати... 🥲)
app.listen(PORT, () => {
  console.log(`✅ Server launched at http://localhost:${PORT}`);
});
