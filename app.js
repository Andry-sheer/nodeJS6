import express from 'express'
import dotenv from 'dotenv'
dotenv.config();

const PORT = process.env.PORT || 3001

const server = express();

server.listen(PORT, ()=> {
  console.log(`server launched http://localhost:${PORT}`);
})