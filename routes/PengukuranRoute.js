import express from "express";
import { getAllPengukurans, savePengukurans, updatePengukurans, deletePengukurans } from "../controllers/PengukuranController.js";
const router = express.Router();

router.get('/pengukuran', getAllPengukurans);
router.post('/pengukuran', savePengukurans);
router.patch('/pengukuran/:id', updatePengukurans);;
router.delete('/pengukuran/:id', deletePengukurans);

export default router;