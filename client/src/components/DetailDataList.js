import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ExcelRenderer } from "react-excel-renderer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailDataList = () => {
  const { id } = useParams();

  const inputRef = useRef(null);

  const [table, setTable] = useState(<div></div>);
  const [waterlevel, setWaterLevel] = useState("");
  const [tranducer, setTranducer] = useState("");
  const [depthcorrection, setDepthCorrection] = useState("");
  const [length, setLength] = useState("");
  const [canalId, setCanalId] = useState("Canal ID: ");
  const [compareFile, setCompareFile] = useState(<></>);
  const [falidarionFile, setFalidationFile] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getDetailData();
    getCanalId();

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!falidarionFile) {
      toast.error("File Tidak Sesuai!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [falidarionFile]);

  const getDetailData = async () => {
    let condition = false;
    const response = await axios.get(`http://localhost:5001/data/${id}`);
    let lengths = response.data[0].canal_data[0].data.length;
    if (lengths > 7) {
      condition = true;
    }
    setWaterLevel(response.data[0].canal_data[0].water_level);
    setTranducer(response.data[0].canal_data[0].tranducer);
    setDepthCorrection(response.data[0].canal_data[0].depth_correction);
    if (lengths !== 0) {
      setLength(response.data[0].canal_data[0].data[lengths - 1].length);
      setTable(
        <div
          style={
            condition
              ? { overflowY: "scroll", height: "408px", marginBottom: "10px" }
              : { display: "flex", marginBottom: "10px" }
          }
        >
          <table className="table is-bordered is-fullwidth mt-2">
            <thead>
              <tr>
                <th className="has-text-centered">No</th>
                <th className="has-text-centered">Lattitude</th>
                <th className="has-text-centered">longitude</th>
                <th className="has-text-centered">Time</th>
                <th className="has-text-centered">Depth (m)</th>
                <th className="has-text-centered">Action</th>
              </tr>
            </thead>
            <tbody>
              {response.data[0].canal_data[0].data.map((data, index) => (
                <tr
                  key={data._id}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(0, 123, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td className="has-text-centered">{index + 1}</td>
                  <td className="has-text-centered">{data.lattitude}</td>
                  <td className="has-text-centered">{data.longitude}</td>
                  <td className="has-text-centered">{data.time}</td>
                  <td className="has-text-centered">{data.depth}</td>
                  <td className="has-text-centered">
                    <Link
                      to={`editDetail/${data._id}`}
                      state={{
                        water_level: response.data.water_level,
                        tranducer: response.data.tranducer,
                        depth_correction: response.data.depth_correction,
                      }}
                      className="button is-info is-small mr-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteDetailData(data._id)}
                      className="button is-danger is-small"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      setTable(<div></div>);
    }
  };

  const checkNum = (num) => {
    if (num < 10) {
      return parseFloat(num).toFixed(3);
    } else if (num >= 10 && num <= 100) {
      return parseFloat(num).toFixed(2);
    } else if (num >= 100 && num <= 1000) {
      return parseFloat(num).toFixed(1);
    } else {
      return num;
    }
  };

  const exportDetailDataInfo = async () => {
    var content = "";
    var tableHead =
      "AUFNR       OPN MPNT        REVBUDAT   TERMINAL       NMEADOCDTMEAREAD         MDTXT                                   OC\n";
    var tableSubHead =
      "C12         C4  C12         NC3YYYYMMDD123456789012345XYYYYMMDD1234567890123456ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJXX\n";
    const response = await axios.get(`http://localhost:5001/data/${id}`);
    let length = response.data[0].canal_data[0].data.length;
    let water_level;
    var order_no = (
      "000000000000" + String(response.data[0].canal_data[0].order_no)
    ).slice(-12);
    var operation_no = (
      "0000" + String(response.data[0].canal_data[0].operation_no)
    ).slice(-4);
    var measure_point = (
      "000000000000" + String(response.data[0].canal_data[0].measure_point)
    ).slice(-12);
    var revision = (
      "000" + String(response.data[0].canal_data[0].revision)
    ).slice(-3);
    var usv_code = (
      String(response.data[0].canal_data[0].usv_code) + "               "
    ).slice(0, 15);
    var canal_upper_width = checkNum(
      response.data[0].canal_data[0].canal_upper_width
    );
    var canal_bottom_width = checkNum(
      response.data[0].canal_data[0].canal_bottom_width
    );
    for (var i = 0; i < length; i++) {
      var final_depth =
        parseFloat(response.data[0].canal_data[0].data[i].depth) +
        parseFloat(response.data[0].canal_data[0].tranducer) +
        parseFloat(response.data[0].canal_data[0].bed_float) -
        parseFloat(response.data[0].canal_data[0].depth_correction);
      var sta_distance = response.data[0].canal_data[0].data[i].sta_distance;
      var sta = response.data[0].canal_data[0].data[i].sta;
      if (sta_distance < 10) {
        sta_distance = String("0" + sta_distance + "              ");
      } else {
        sta_distance = String(sta_distance + "              ");
      }
      if (response.data[0].canal_data[0].water_level < 0) {
        water_level = parseFloat(
          response.data[0].canal_data[0].water_level
        ).toFixed(2);
      } else {
        water_level = parseFloat(
          response.data[0].canal_data[0].water_level
        ).toFixed(3);
      }
      var mdtxt = (
        "S" +
        ("00000" + String(sta)).slice(-4) +
        "-" +
        String(water_level) +
        "-" +
        String(final_depth.toFixed(3)) +
        "-" +
        String(canal_upper_width) +
        "-" +
        String(canal_bottom_width) +
        "/" +
        String(response.data[0].canal_data[0].measure_date) +
        "                                        "
      ).slice(0, 40);
      content += `${order_no}${operation_no}${measure_point}${revision}${response.data[0].canal_data[0].qc_date}${usv_code}X${response.data[0].canal_data[0].measure_date}${sta_distance}${mdtxt}AX\n`;
    }
    revision = response.data[0].canal_data[0].revision;
    var fileData = tableHead + tableSubHead + content;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    if (parseInt(revision) === 0) {
      link.download = `${response.data[0].canal_data[0].district.code}-${response.data[0].canal_data[0].canal_id}-${response.data[0].canal_data[0].qc_date}-${response.data[0].canal_data[0].usv_code}.txt`;
    } else {
      link.download = `${response.data[0].canal_data[0].district.code}-${
        response.data[0].canal_data[0].canal_id
      }-${response.data[0].canal_data[0].qc_date}-${
        response.data[0].canal_data[0].usv_code
      }-R${parseInt(revision)}.txt`;
    }
    link.href = url;
    link.click();
  };

  const getCanalId = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/data/${id}`);
      const {
        canal_id: canalId,
        data,
        content_name: contentName,
      } = response.data[0].canal_data[0];

      setCanalId(`Canal ID: ${canalId}`);

      if (data.length) {
        if (!contentName.includes(canalId)) {
          setFalidationFile(false);
        }
        setCompareFile(<p>File Open: {contentName}</p>);
      } else {
        setCompareFile(<></>);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDetailData = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/detaildata/${id}`);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllDetailData = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/alldetaildata/${id}`);
      await axios.patch(`http://localhost:5001/data/${id}`, {
        "canal_data.$.content_name": "",
      });
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const fileHandler = (e) => {
    let fileObj = e.target.files[0];
    let fileName = fileObj.name;

    ExcelRenderer(fileObj, async (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        try {
          let data = [];
          let length = resp.rows.length;
          for (let i = 1; i < length; i++) {
            data[i - 1] = {
              lattitude: resp.rows[i][1],
              longitude: resp.rows[i][2],
              time: resp.rows[i][3],
              depth: resp.rows[i][4],
            };
          }
          console.log(data);
          await axios.post(`http://localhost:5001/detaildata/${id}`, {
            "canal_data.$.data": data,
          });
          await axios.patch(`http://localhost:5001/data/${id}`, {
            "canal_data.$.content_name": fileName,
          });
          navigate(0);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const sendFileData = async () => {
    try {
      var content = "";
      var tableHead =
        "AUFNR       OPN MPNT        REVBUDAT   TERMINAL       NMEADOCDTMEAREAD         MDTXT                                   OC\n";
      var tableSubHead =
        "C12         C4  C12         NC3YYYYMMDD123456789012345XYYYYMMDD1234567890123456ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJXX\n";
      const response = await axios.get(`http://localhost:5001/data/${id}`);
      let length = response.data[0].canal_data[0].data.length;
      var order_no = (
        "000000000000" + String(response.data[0].canal_data[0].order_no)
      ).slice(-12);
      var operation_no = (
        "0000" + String(response.data[0].canal_data[0].operation_no)
      ).slice(-4);
      var measure_point = (
        "000000000000" + String(response.data[0].canal_data[0].measure_point)
      ).slice(-12);
      var revision = (
        "000" + String(response.data[0].canal_data[0].revision)
      ).slice(-3);
      var usv_code = (
        String(response.data[0].canal_data[0].usv_code) + "               "
      ).slice(0, 15);
      for (var i = 0; i < length; i++) {
        var mdtxt = (
          "S" +
          (
            "00000" +
            String(parseInt(response.data[0].canal_data[0].data[i].length) - 20)
          ).slice(-4) +
          "-" +
          String(
            parseFloat(response.data[0].canal_data[0].water_level).toFixed(3)
          ) +
          "-" +
          String(
            parseFloat(response.data[0].canal_data[0].data[i].depth).toFixed(3)
          ) +
          "-" +
          String(
            parseFloat(
              response.data[0].canal_data[0].canal_upper_width
            ).toFixed(3)
          ) +
          String(
            parseFloat(
              response.data[0].canal_data[0].canal_bottom_width
            ).toFixed(3)
          ) +
          "/" +
          String(response.data[0].canal_data[0].measure_date) +
          "                                        "
        ).slice(0, 40);
        content += `${order_no}${operation_no}${measure_point}${revision}${response.data[0].canal_data[0].qc_date}${usv_code}X${response.data[0].canal_data[0].measure_date}20              ${mdtxt}AX\n`;
      }
      var fileData = tableHead + tableSubHead + content;
      await axios.post(
        `http://localhost:5001/send/${response.data[0].canal_data[0].district_code}`,
        {
          content: fileData,
        }
      );
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns">
      <div className="column is-fullwidth">
        <p className="mt-2">Report Parameters</p>
        {table}
        <div className="is-flex is-justify-content-space-between">
          <span>
            <input
              style={{ display: "none" }}
              ref={inputRef}
              type="file"
              onChange={fileHandler.bind(this)}
            />
            <button onClick={handleClick} className="button is-info mr-5">
              Load From File
            </button>
            <Link to={`chartDetail/${id}`} className="button is-info mr-5">
              Export to Graph
            </Link>
            <button
              onClick={() => exportDetailDataInfo()}
              className="button is-info mr-5"
            >
              Export to txt
            </button>
            <button
              onClick={() => sendFileData()}
              className="button is-info mr-5"
            >
              Send to FTP
            </button>
          </span>
          <span>
            <Link
              to={`adddetail/${id}`}
              state={{
                water_level: waterlevel,
                tranducer: tranducer,
                depth_correction: depthcorrection,
                length: length,
              }}
              className="button is-success mr-5"
            >
              Add Order
            </Link>
            <button
              onClick={() => deleteAllDetailData(id)}
              className="button is-danger"
            >
              Clear Order
            </button>
          </span>
        </div>
        <p>{canalId}</p>
        {compareFile}
        <ToastContainer />
      </div>
    </div>
  );
};

export default DetailDataList;
