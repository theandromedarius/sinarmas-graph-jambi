import mongoose from "mongoose";

const Datas = mongoose.Schema({
  batang_canal_id: {
    type: String,
    require: true,
  },
  canal_data: [
    {
      data: [
        {
          lattitude: {
            type: Number,
            require: true,
          },
          longitude: {
            type: Number,
            require: true,
          },
          time: {
            type: String,
            require: true,
          },
          depth: {
            type: Number,
            require: true,
          },
          sta: {
            type: Number,
            require: true,
          },
          sta_distance: {
            type: Number,
            require: true,
          },
        },
      ],
      canal_id: {
        type: String,
        require: true,
      },
      dimensi: {
        panjang: {
          type: Number,
          require: true,
        },
        lebar: {
          type: Number,
          require: true,
        },
        tinggi: {
          type: Number,
          require: true,
        },
      },
      order_no: {
        type: String,
        require: true,
      },
      operation_no: {
        type: String,
        require: true,
      },
      start: {
        type: String,
        require: true,
      },
      end: {
        type: String,
        require: true,
      },
      measure_point: {
        type: String,
        require: true,
      },
      water_level: {
        type: String,
        require: true,
      },
      depth_correction: {
        type: String,
        require: true,
      },
      bed_float: {
        type: String,
        require: true,
      },
      revision: {
        type: String,
        require: true,
      },
      qc_type: {
        type: String,
        require: true,
      },
      operator: {
        type: String,
        require: true,
      },
      qc_date: {
        type: String,
        require: true,
      },
      measure_date: {
        type: String,
        require: true,
      },
      usv_code: {
        type: String,
        require: true,
      },
      district: {
        name: {
          type: String,
          require: true,
        },
        code: {
          type: String,
          require: true,
        },
      },
      canal_upper_width: {
        type: Number,
        require: true,
      },
      canal_bottom_width: {
        type: Number,
        require: true,
      },
      canal_length: {
        type: Number,
        require: true,
      },
      tranducer: {
        type: Number,
        require: true,
      },
      lane: {
        type: Number,
        require: true,
      },
      content_name: {
        type: String,
        require: true,
      },
    },
  ],
});

export default mongoose.model("Datas", Datas);
