import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { useParams, useNavigate } from "react-router-dom";
import { toPng } from "html-to-image";
import {
  Chart as ChartJS,
  BarElement,
  PointElement,
  Title,
  CategoryScale,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  BarElement,
  PointElement,
  CategoryScale,
  Title,
  annotationPlugin
);

const ChartData = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const chartRef = useRef(null);
  const downloadRef = useRef(null);

  const [chartData1, setChartData1] = useState({
    datasets: [],
  });
  const [data1, setData1] = useState({});
  const [bar1, setBar1] = useState(<div></div>);
  const [orderNo1, setOrderNo1] = useState("");
  const [canalId1, setCanalId1] = useState("");
  const [waterLevel1, setWaterLevel1] = useState("");
  const [dimensi, setDimensi] = useState("");
  const [qcDate, setQcDate] = useState("");
  const [orderNo2, setOrderNo2] = useState("");
  const [canalId2, setCanalId2] = useState("");
  const [waterLevel2, setWaterLevel2] = useState("");
  const [pengukuran, setPengukuran] = useState({
    tidakLulus: 2.905,
    toleransi: {
      batasAwal: 2.905,
      batasAkhir: 3.0,
    },
    lulus: 3.0,
  });

  useEffect(() => {
    getDataChart();
    getData();
    getPengukuran();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    setChartData1(data1);
  }, [data1]);

  useEffect(() => {
    setBar1(<Bar ref={chartRef} data={chartData1} options={options} />);
  }, [chartData1]);

  const getDataChart = async () => {
    const response = await axios.get(`http://localhost:5001/dataschart/${id}`);
    if (response.data !== undefined) {
      setData1({
        labels: response.data.map((data) => data.length),
        datasets: [
          {
            label: "Depth",
            data: response.data.map((data) => data.data),
            backgroundColor: response.data.map((data) => data.color),
          },
        ],
      });
    }
  };

  const getData = async () => {
    const response = await axios.get(`http://localhost:5001/datas/${id}`);
    // console.log(id);
    // console.log(response.data.canal_data.length);
    var length = response.data.canal_data.length;
    var qcdate = response.data.canal_data[0].qc_date;
    setCanalId1(response.data.canal_data[0].canal_id);
    setOrderNo1(response.data.canal_data[0].order_no);
    setWaterLevel1(response.data.canal_data[0].water_level);

    setCanalId2(response.data.canal_data[length - 1].canal_id);
    setOrderNo2(response.data.canal_data[length - 1].order_no);
    setWaterLevel2(response.data.canal_data[length - 1].water_level);

    setDimensi(
      response.data.canal_data[0].dimensi.panjang +
        " X " +
        response.data.canal_data[0].dimensi.lebar +
        " X " +
        response.data.canal_data[0].dimensi.tinggi
    );
    setQcDate(
      qcdate.slice(0, 4) + "-" + qcdate.slice(4, 6) + "-" + qcdate.slice(6, 8)
    );
  };

  const getPengukuran = async () => {
    const pengukuran = await axios.get("http://localhost:5001/pengukuran");
    setPengukuran(pengukuran.data[0]);
  };

  const download = () => {
    toPng(downloadRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${canalId1} - ${canalId2} - ${qcDate}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const options = {
    animation: {
      duration: 300,
    },
    scales: {
      responsive: true,
      x: {
        position: "top",
        ticks: {
          callback: function (label) {
            let realLabel = this.getLabelForValue(label);
            var sta = realLabel.split(";")[0];
            return sta;
          },
        },
      },
      // xAxis2: {
      //   position: 'top',
      //   type: "category",
      //   grid: {
      //     offset: true // offset true to get labels in between the lines instead of on the lines
      //   },
      //   ticks: {
      //     callback: function(label) {
      //       let realLabel = this.getLabelForValue(label)

      //       var sta = realLabel.split(";")[0];
      //       var keterangan = realLabel.split(";")[1];
      //       if(keterangan === "awal"){
      //         return "";
      //       }else if(keterangan === "akhir"){
      //         return "";
      //       }else if(keterangan === ""){
      //         return undefined;
      //       }else {
      //         return keterangan;
      //       }
      //     }
      //   }
      // }
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: "line",
            yMin: pengukuran.lulus * -1,
            yMax: pengukuran.lulus * -1,
            borderWidth: 3,
            borderColor: "blue",
          },
          line2: {
            type: "line",
            yMin: pengukuran.tidakLulus * -1,
            yMax: pengukuran.tidakLulus * -1,
            borderWidth: 3,
            borderColor: "red",
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ background: "white" }} ref={downloadRef}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "10px 30px",
          }}
        >
          <div>
            <p>KETERANGAN</p>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  backgroundColor: "green",
                  height: "auto",
                  width: "25px",
                  margin: "3px 8px 3px 0px",
                }}
              ></div>
              <p>PASS &#8805; {pengukuran.lulus}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  backgroundColor: "blue",
                  height: "auto",
                  width: "25px",
                  margin: "3px 8px 3px 0px",
                }}
              ></div>
              <p>
                {pengukuran.toleransi.batasAwal} &#8804; TOLERANCE &#62;{" "}
                {pengukuran.toleransi.batasAkhir}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  backgroundColor: "red",
                  height: "auto",
                  width: "25px",
                  margin: "3px 8px 3px 0px",
                }}
              ></div>
              <p>NOT PASS &#60; {pengukuran.tidakLulus}</p>
            </div>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <td>ORDER NO</td>
                  <td style={{ padding: "0px 10px" }}>:</td>
                  <td>
                    {orderNo1} s.d. {orderNo2}
                  </td>
                </tr>
                <tr>
                  <td>ID KANAL</td>
                  <td style={{ padding: "0px 10px" }}>:</td>
                  <td>
                    {canalId1} s.d. {canalId2}
                  </td>
                </tr>
                <tr>
                  <td>WL.</td>
                  <td style={{ padding: "0px 10px" }}>:</td>
                  <td>
                    {waterLevel1} m s.d. {waterLevel2} m
                  </td>
                </tr>
                <tr>
                  <td>DIMENSI</td>
                  <td style={{ padding: "0px 10px" }}>:</td>
                  <td>{dimensi}</td>
                </tr>
                <tr>
                  <td>QC DATE</td>
                  <td style={{ padding: "0px 10px" }}>:</td>
                  <td>{qcDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {bar1}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "10px 30px",
        }}
      >
        <button onClick={() => download()} className="button is-success">
          Download
        </button>
        <button
          onClick={() => navigate("/pengaturan")}
          className="button is-info"
        >
          Pengaturan
        </button>
      </div>
    </div>
  );
};

export default ChartData;
