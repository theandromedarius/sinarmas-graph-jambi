import express from "express";
import { getAllDatas, getDatas, getDatasChart, getData, getDataChart, getDetailData, saveDatas, saveData, saveDetailData, updateDatas, updateData, updateDetailData, deleteAllDatas, deleteDatas, deleteAllData, deleteData, deleteAllDetailData, deleteDetailData} from "../controllers/DataController.js"; 
const router = express.Router();

router.get('/alldatas', getAllDatas);
router.get('/datas/:id', getDatas);
router.get('/dataschart/:id', getDatasChart)
router.get('/data/:id', getData);
router.get('/datachart/:id', getDataChart);
router.get('/detaildata/:id', getDetailData);
router.post('/datas', saveDatas);
router.post('/data/:id', saveData);
router.post('/detaildata/:id', saveDetailData);
router.patch('/datas/:id', updateDatas);
router.patch('/data/:id', updateData);
router.patch('/detaildata/:id', updateDetailData);
router.delete('/alldatas', deleteAllDatas);
router.delete('/datas/:id', deleteDatas);
router.delete('/alldata/:id', deleteAllData);
router.delete('/data/:id', deleteData);
router.delete('/alldetaildata/:id', deleteAllDetailData);
router.delete('/detaildata/:id', deleteDetailData);
// router.get('/list/:id', listFile);
// router.post('/send', sendFile);

export default router;