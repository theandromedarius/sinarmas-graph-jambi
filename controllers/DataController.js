import Data from "../models/DataModel.js";
import Pengukuran from "../models/PengukuranModel.js";
import mongoose from "mongoose";
// import Client from "ftp";
// import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

export const getAllDatas = async (req, res) => {
  try {
    const alldatas = await Data.find();
    res.json(alldatas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDatas = async (req, res) => {
  try {
    const datas = await Data.findById(req.params.id);
    res.json(datas);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDatasChart = async (req, res) => {
  try {
    var datas = [];
    const pengukuran = await Pengukuran.find();
    const datastmp = await Data.findById(req.params.id);
    var length = datastmp.canal_data.length;
    for (var i = 0; i < length; i++) {
      var lengths = datastmp.canal_data[i].data.length;
      for (var j = 0; j < lengths; j++) {
        let color;
        let panjang;
        var count = (
          parseFloat(datastmp.canal_data[i].data[j].depth) +
          parseFloat(datastmp.canal_data[i].water_level) +
          parseFloat(datastmp.canal_data[i].tranducer) +
          parseFloat(datastmp.canal_data[i].bed_float) -
          parseFloat(datastmp.canal_data[i].depth_correction)
        ).toFixed(3);
        if (count < pengukuran[0].tidakLulus) {
          color = "red";
        } else if (
          count >= pengukuran[0].toleransi.batasAwal &&
          count < pengukuran[0].toleransi.batasAkhir
        ) {
          color = "blue";
        } else if (count >= pengukuran[0].lulus) {
          color = "green";
        }
        if (j === 0) {
          panjang = `${datastmp.canal_data[i].data[j].sta};awal`;
        } else if (j === lengths) {
          panjang = `${datastmp.canal_data[i].data[j].sta};akhir`;
        } else if (j === parseInt(lengths / 2)) {
          panjang = `${datastmp.canal_data[i].data[j].sta};${datastmp.canal_data[i].canal_id}`;
        } else {
          panjang = `${datastmp.canal_data[i].data[j].sta};`;
        }
        const datatmp = {
          length: panjang,
          data: count * -1,
          color: color,
        };
        datas.push(datatmp);
      }
    }
    res.json(datas);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getData = async (req, res) => {
  try {
    const data = await Data.find(
      { "canal_data._id": req.params.id },
      { "canal_data.$": 1 }
    );
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDataChart = async (req, res) => {
  try {
    var datas = [];
    const pengukuran = await Pengukuran.find();
    const datatmp = await Data.find(
      { "canal_data._id": req.params.id },
      { "canal_data.$": 1 }
    );
    var length = datatmp[0].canal_data[0].data.length;
    for (var j = 0; j < length; j++) {
      let color;
      var count = (
        parseFloat(datatmp[0].canal_data[0].data[j].depth) +
        parseFloat(datatmp[0].canal_data[0].water_level) +
        parseFloat(datatmp[0].canal_data[0].tranducer) +
        parseFloat(datatmp[0].canal_data[0].bed_float) -
        parseFloat(datatmp[0].canal_data[0].depth_correction)
      ).toFixed(3);
      if (count < pengukuran[0].tidakLulus) {
        color = "red";
      } else if (
        count >= pengukuran[0].toleransi.batasAwal &&
        count < pengukuran[0].toleransi.batasAkhir
      ) {
        color = "blue";
      } else if (count >= pengukuran[0].lulus) {
        color = "green";
      }
      const data = {
        length: datatmp[0].canal_data[0].data[j].sta,
        data: count * -1,
        color: color,
      };
      datas.push(data);
    }
    res.json(datas);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDetailData = async (req, res) => {
  try {
    const detaildata = await Data.aggregate([
      {
        $match: {
          "canal_data.data._id": mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $project: {
          canal_data: {
            $map: {
              input: "$canal_data",
              in: {
                data: {
                  $filter: {
                    input: "$$this.data",
                    as: "data",
                    cond: {
                      $eq: [
                        "$$data._id",
                        mongoose.Types.ObjectId(req.params.id),
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);
    res.json(detaildata);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const saveDatas = async (req, res) => {
  const datas = new Data(req.body);
  try {
    const inserteddatas = await datas.save();
    res.status(201).json(inserteddatas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const saveData = async (req, res) => {
  try {
    const inserteddata = await Data.updateOne(
      { _id: req.params.id },
      { $push: req.body }
    );
    res.status(200).json(inserteddata);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const saveDetailData = async (req, res) => {
  try {
    const data = await Data.find(
      { "canal_data._id": req.params.id },
      { "canal_data.$": 1 }
    );

    var detailData = [];
    var canalLength = data[0].canal_data[0].canal_length;
    var length = data[0].canal_data[0].data.length;
    var bodyLength = req.body["canal_data.$.data"].length;

    let sta;
    let staDistance;

    for (let i = 0; i < bodyLength; i++) {
      if (length === 0) {
        sta = 0;
        staDistance = 0;
      } else {
        if (canalLength - length * 20 >= 0) {
          sta = length * 20;
          staDistance = 20;
        } else {
          sta = (length - 1) * 20 + (canalLength % 20);
          staDistance = canalLength % 20;
        }
      }
      const detailDataTmp = {
        lattitude: req.body["canal_data.$.data"][i].lattitude,
        longitude: req.body["canal_data.$.data"][i].longitude,
        time: req.body["canal_data.$.data"][i].time,
        depth: req.body["canal_data.$.data"][i].depth,
        sta: sta,
        sta_distance: staDistance,
      };
      detailData.push(detailDataTmp);
      length++;
    }
    detailData = {
      "canal_data.$.data": detailData,
    };
    const inserteddetaildata = await Data.updateOne(
      { "canal_data._id": req.params.id },
      { $push: detailData }
    );
    res.status(200).json(inserteddetaildata);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDatas = async (req, res) => {
  try {
    const updateddatas = await Data.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).json(updateddatas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateData = async (req, res) => {
  try {
    const updateddata = await Data.updateOne(
      { "canal_data._id": req.params.id },
      { $set: req.body }
    );
    res.status(200).json(updateddata);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDetailData = async (req, res) => {
  try {
    const updateddetaildata = await Data.updateOne(
      { "canal_data.data._id": req.params.id },
      { $set: req.body },
      { arrayFilters: [{ "data._id": req.params.id }] }
    );
    res.status(200).json(updateddetaildata);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllDatas = async (req, res) => {
  try {
    const deletedalldatas = await Data.deleteMany({});
    res.status(200).json(deletedalldatas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDatas = async (req, res) => {
  try {
    const deleteDatas = await Data.deleteOne({ _id: req.params.id });
    res.status(200).json(deleteDatas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllData = async (req, res) => {
  try {
    const deletedalldata = await Data.updateOne(
      { _id: req.params.id },
      { $pull: { canal_data: {} } }
    );
    res.status(200).json(deletedalldata);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteData = async (req, res) => {
  try {
    const deleteddata = await Data.updateOne(
      { "canal_data._id": req.params.id },
      { $pull: { canal_data: { _id: req.params.id } } }
    );
    res.status(200).json(deleteddata);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllDetailData = async (req, res) => {
  try {
    const deletedalldetaildata = await Data.updateOne(
      { "canal_data._id": req.params.id },
      { $pull: { "canal_data.$.data": {} } }
    );
    res.status(200).json(deletedalldetaildata);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDetailData = async (req, res) => {
  try {
    const deleteddetaildata = await Data.updateOne(
      { "canal_data.data._id": req.params.id },
      { $pull: { "canal_data.$.data": { _id: req.params.id } } }
    );
    res.status(200).json(deleteddetaildata);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const sendFile = async (req,res) => {
//   const c = new Client();

//   c.on("ready", function () {
//     console.log('Ready');
//     c.put(req.body.content, `/production/${req.params.id}/INBOX/test.remote-copy.txt`, function (err) {
//       if (err) { console.log('PUT err : ' + err); };
//       c.end();
//     });
//   });
//   c.connect({
//     host: process.env.HOST_FTP,
//     port: process.env.PORT_FTP,
//     user: process.env.USER_FTP,
//     password: process.env.PASSWORD_FTP
//   });
// }

// export const listFile = async (req,res) => {
//   const alldatas = await Data.find();
//   var length = alldatas.length;

//   for(var i = 0 ; i < length ; i++) {
//     var lengths = alldatas[i].canal_data.length;

//     for(var j = 0; j < lengths; j++){
//       const c = new Client();

//       c.on("ready", function() {
//         c.list( `/production/${alldatas[i].canal_data[i].district_code}/ERROR`, function (err, list) {
//           if (err) throw err;
//           if(list.length > 0) {
//             let mailTransporter = nodemailer.createTransport({
//               service: 'gmail',
//               auth: {
//                 user: process.env.USER_EMAIL,
//                 pass: process.env.PASSWORD_EMAIL
//               }
//             });

//             let mailDetails = {
//               from: process.env.USER_EMAIL,
//               to: process.env.RECEIVE_EMAIL,
//               subject: 'File Error',
//               text: 'File Upload Error'
//             };

//             mailTransporter.sendMail(mailDetails, function(err, data) {
//               if(err) {
//                 console.log(err);
//               } else {
//                 console.log('Email sent successfully');
//               }
//             });
//             console.dir(list);
//           } else {
//             console.log('tidak ada');
//         }

//         });
//       });

//       c.connect({
//         host: process.env.HOST_FTP,
//         port: process.env.PORT_FTP,
//         user: process.env.USER_FTP,
//         password: process.env.PASSWORD_FTP
//       })

//     }
//   }
// }
