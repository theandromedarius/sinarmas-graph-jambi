import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const MainDataList = () => {
  const [table, setTable] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    getAllDatas();

    // eslint-disable-next-line
  }, []);

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

  const exportDataInfo = async (id) => {
    var content = "";
    var tableHead =
      "AUFNR       OPN MPNT        REVBUDAT   TERMINAL       NMEADOCDTMEAREAD         MDTXT                                   OC\n";
    var tableSubHead =
      "C12         C4  C12         NC3YYYYMMDD123456789012345XYYYYMMDD1234567890123456ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJXX\n";
    const response = await axios.get(`http://localhost:5001/datas/${id}`);
    let length = response.data.canal_data.length;
    var num = -20;
    for (var i = 0; i < length; i++) {
      let dataLength = response.data.canal_data[i].data.length;
      var order_no = (
        "000000000000" + String(response.data.canal_data[i].order_no)
      ).slice(-12);
      var operation_no = (
        "0000" + String(response.data.canal_data[i].operation_no)
      ).slice(-4);
      var measure_point = (
        "000000000000" + String(response.data.canal_data[i].measure_point)
      ).slice(-12);
      var revision = (
        "000" + String(response.data.canal_data[i].revision)
      ).slice(-3);
      var usv_code = (
        String(response.data.canal_data[i].usv_code) + "               "
      ).slice(0, 15);
      for (var j = 0; j < dataLength; j++) {
        num = num + 20;
        let panjang;
        if (j === 0) {
          panjang = "00              ";
        } else if (j > 0 && j < dataLength - 1) {
          panjang = "20              ";
        } else {
          panjang =
            response.data.canal_data[i].canal_length - (dataLength - 1) * 20;
          if (panjang < 10) {
            panjang = String("0" + panjang + "              ");
          } else {
            panjang = String(panjang + "              ");
          }
        }
        var canal_upper_width = checkNum(
          response.data.canal_data[i].canal_upper_width
        );
        var canal_bottom_width = checkNum(
          response.data.canal_data[i].canal_bottom_width
        );
        var mdtxt = (
          "S" +
          ("00000" + String(num)).slice(-4) +
          "-" +
          String(
            parseFloat(response.data.canal_data[i].water_level).toFixed(3)
          ) +
          "-" +
          String(
            parseFloat(response.data.canal_data[i].data[j].depth).toFixed(3)
          ) +
          "-" +
          String(canal_upper_width) +
          "-" +
          String(canal_bottom_width) +
          "/" +
          String(response.data.canal_data[i].measure_date) +
          "                                        "
        ).slice(0, 40);
        content += `${order_no}${operation_no}${measure_point}${revision}${response.data.canal_data[i].qc_date}${usv_code}X${response.data.canal_data[i].measure_date}${panjang}${mdtxt}AX\n`;
      }
    }
    var fileData = tableHead + tableSubHead + content;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${response.data.batang_canal_id} List.txt`;
    link.href = url;
    link.click();
  };

  const getAllDatas = async () => {
    let condition = false;
    const response = await axios.get("http://localhost:5001/alldatas");
    let length = response.data.length;
    if (length > 4) {
      condition = true;
    }
    if (response.data[0] !== undefined) {
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
                <th className="has-text-centered">Batang Canal ID</th>
                <th className="has-text-centered">Action</th>
              </tr>
            </thead>
            <tbody>
              {response.data.map((data, index) => (
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
                  <td>{data.batang_canal_id}</td>
                  <td className="has-text-centered">
                    <Link
                      to={`viewData/${data._id}`}
                      className="button is-success is-small mr-1 mb-1"
                    >
                      View
                    </Link>
                    <Link
                      to={`editMainData/${data._id}`}
                      className="button is-info is-small mr-1 mb-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => exportDataInfo(data._id)}
                      className="button is-warning is-small mr-1 mb-1"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => deleteDatas(data._id)}
                      className="button is-danger is-small "
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

  const deleteDatas = async (id, linkId) => {
    try {
      await axios.delete(`http://localhost:5001/datas/${id}`);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllDatas = async (id) => {
    try {
      await axios.delete("http://localhost:5001/alldatas");
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
          <span></span>
          <span>
            <Link to={`addMainData`} className="button is-success mr-5">
              Add Order
            </Link>
            <button
              onClick={() => deleteAllDatas()}
              className="button is-danger"
            >
              Clear Order
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainDataList;
