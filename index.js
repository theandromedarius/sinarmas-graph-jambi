import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import DataRoute from "./routes/DataRoute.js";
import PengukuranRoute from "./routes/PengukuranRoute.js";
// import { listFile } from "./controllers/DataController.js";
import * as dotenv from 'dotenv';

dotenv.config();

const corsConfig = {
  credentials: true,
  origin: true,
};
const PORT = process.env.PORT || 5001;
const app = express();
mongoose.connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_USERNAME}@mongo:27017/admin`,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected...'));

app.use(cors(corsConfig));
app.use(express.json());
app.use(DataRoute);
app.use(PengukuranRoute);

app.listen(PORT, () => console.log('Server up and running...'));

// setInterval(listFile, 360000);
