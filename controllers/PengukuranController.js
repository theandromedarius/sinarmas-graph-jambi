import Pengukuran from "../models/PengukuranModel.js";

export const getAllPengukurans = async (req,res) => {
  try {
    const allpengukurans = await Pengukuran.find();
    res.json(allpengukurans);
  }catch (error) {
    res.status(500).json({message: error.message});
  }
}

export const savePengukurans = async (req,res) => {
  const pengukurans = new Pengukuran(req.body);
  try {
    const insertedPengukurans = await pengukurans.save();
    res.status(201).json(insertedPengukurans);
  }catch (error) {
    res.status(400).json({message: error.message});
  }
}

export const updatePengukurans = async (req,res) => {
  try {
    const updatedPengukurans = await Pengukuran.updateOne({_id:req.params.id}, {$set: req.body});
    res.status(200).json(updatedPengukurans);
  }catch (error) {
    res.status(400).json({message: error.message});
  }
}

export const deletePengukurans = async (req,res) => {
  try {
    const deletedPengukurans = await Pengukuran.deleteOne({"_id":req.params.id});
    res.status(200).json(deletedPengukurans);
  }catch (error) {
    res.status(400).json({message: error.message});
  }
}