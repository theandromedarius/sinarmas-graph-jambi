import mongoose from "mongoose";

const Pengukurans = mongoose.Schema({
  tidakLulus: {
    type: Number,
    require: true
  },
  toleransi: {
    batasAwal: {
      type: Number,
      require: true
    },
    batasAkhir: {
      type: Number,
      require: true
    }
  },
  lulus: {
    type: Number,
    require: true
  },
});

export default mongoose.model('Pengukurans', Pengukurans);