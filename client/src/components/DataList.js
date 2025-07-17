import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ExcelRenderer } from "react-excel-renderer";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";

const DataList = () => {
  const { id } = useParams();

  const inputRef = useRef(null);

  const [table, setTable] = useState([]);
  const exportRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  const getData = async () => {
    let condition = false;
    var array_check_box = [];
    const response = await axios.get(`http://localhost:5001/datas/${id}`);
    let length = response.data.canal_data.length;
    if (length > 4) {
      condition = true;
    }
    if (response.data.canal_data[0] !== undefined) {
      for (let i = 0; i < length; i++) {
        array_check_box.push(false);
      }
      exportRef.current = array_check_box;
      setTable(
        <div
          style={
            condition
              ? {
                  overflowY: "scroll",
                  maxHeight: "408px",
                  marginBottom: "10px",
                  display: "flex",
                }
              : { display: "flex", marginBottom: "10px" }
          }
        >
          <table className="table is-bordered is-fullwidth mt-2">
            <thead>
              <tr>
                <th className="has-text-centered">No</th>
                <th className="has-text-centered">Canal ID</th>
                <th className="has-text-centered">Order No</th>
                <th className="has-text-centered">Operation No</th>
                <th className="has-text-centered">Water Level (m)</th>
                <th className="has-text-centered">Depth Correction (m)</th>
                <th className="has-text-centered">Bed Float (m)</th>
                <th className="has-text-centered">Revision</th>
                <th className="has-text-centered">Qc Type</th>
                <th className="has-text-centered">Action</th>
                <th className="has-text-centered">
                  Export TXT/XLSX
                  <input
                    style={{ marginLeft: "10px" }}
                    type="checkbox"
                    onChange={handleCheckAll}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {response.data.canal_data.map((data, index) => (
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
                  <td>{index + 1}</td>
                  <td>{data.canal_id}</td>
                  <td>{data.order_no}</td>
                  <td>{data.operation_no}</td>
                  <td>{data.water_level}</td>
                  <td>{data.depth_correction}</td>
                  <td>{data.bed_float}</td>
                  <td>{data.revision}</td>
                  <td>{data.qc_type}</td>
                  <td className="has-text-centered">
                    <Link
                      to={`viewDetailData/${data._id}`}
                      className="button is-success is-small mr-1 mb-1"
                    >
                      View
                    </Link>
                    <Link
                      to={`editData/${data._id}`}
                      className="button is-info is-small mr-1 mb-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteData(data._id)}
                      className="button is-danger is-small "
                    >
                      Delete
                    </button>
                  </td>
                  <td className="has-text-centered">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <input
                        style={{ width: "20px", height: "20px" }}
                        type="checkbox"
                        value={index}
                        onClick={(e) => handleExport(e)}
                      />
                      {data.data.length > 0 && (
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor:
                              data.data[data.data.length - 1].sta ===
                                data.canal_length &&
                              data.data[data.data.length - 1].sta !==
                                data.data[data.data.length - 2].sta &&
                              data.data[data.data.length - 1].depth &&
                              data.content_name.includes(data.canal_id)
                                ? "lime"
                                : "red",
                            marginLeft: "10px",
                          }}
                        />
                      )}
                    </div>
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

  const handleCheckAll = (e) => {
    const { checked } = e.target;

    exportRef.current = exportRef.current.map(() => checked);
  };

  const handleExport = (e) => {
    const { checked } = e.target;
    const { value } = e.target;
    if (checked === true) {
      exportRef.current[value] = true;
    } else {
      exportRef.current[value] = false;
    }
  };

  const exportDataInfo = async () => {
    var content = "";
    var tableHead =
      "AUFNR       OPN MPNT        REVBUDAT   TERMINAL       NMEADOCDTMEAREAD         MDTXT                                   OC\n";
    var tableSubHead =
      "C12         C4  C12         NC3YYYYMMDD123456789012345XYYYYMMDD1234567890123456ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJXX\n";
    const response = await axios.get(`http://localhost:5001/datas/${id}`);
    let length = response.data.canal_data.length;
    let water_level;
    for (var i = 0; i < length; i++) {
      if (exportRef.current[i] === false) {
        continue;
      }
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

      if (response.data.canal_data[i].revision !== "000") {
        var revision = (
          "000" + String(response.data.canal_data[i].revision)
        ).slice(-3);
      } else if (response.data.canal_data[i].qc_type !== "001") {
        var revision = "001";
      } else {
        var revision = (
          "000" + String(response.data.canal_data[i].revision)
        ).slice(-3);
      }

      var usv_code = (
        String(response.data.canal_data[i].usv_code) + "               "
      ).slice(0, 15);
      var revision_real = response.data.canal_data[i].revision;
      var qc_type_fix = response.data.canal_data[i].qc_type;
      var district_code = response.data.canal_data[i].district.code;
      var qc_date = response.data.canal_data[i].qc_date;
      var usv_code_real = response.data.canal_data[i].usv_code;
      for (
        var j = response.data.canal_data[i].start > 0 ? 1 : 0;
        j < dataLength;
        j++
      ) {
        var final_depth =
          parseFloat(response.data.canal_data[i].data[j].depth) +
          parseFloat(response.data.canal_data[i].tranducer) +
          parseFloat(response.data.canal_data[i].bed_float) -
          parseFloat(response.data.canal_data[i].depth_correction);
        var sta_distance = response.data.canal_data[i].data[j].sta_distance;
        var sta = response.data.canal_data[i].data[j].sta;
        if (response.data.canal_data[i].start > 0) {
          sta = sta + Number(response.data.canal_data[i].start);
        }
        if (sta_distance < 10) {
          sta_distance = String("0" + sta_distance + "              ");
        } else {
          sta_distance = String(sta_distance + "              ");
        }
        if (response.data.canal_data[i].water_level < 0) {
          water_level = parseFloat(
            response.data.canal_data[i].water_level
          ).toFixed(2);
        } else {
          water_level = parseFloat(
            response.data.canal_data[i].water_level
          ).toFixed(3);
        }
        var canal_upper_width = checkNum(
          response.data.canal_data[i].canal_upper_width
        );
        var canal_bottom_width = checkNum(
          response.data.canal_data[i].canal_bottom_width
        );
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
          String(response.data.canal_data[i].measure_date) +
          "                                        "
        ).slice(0, 40);
        content += `${order_no}${operation_no}${measure_point}${revision}${response.data.canal_data[i].qc_date}${usv_code}X${response.data.canal_data[i].measure_date}${sta_distance}${mdtxt}AX\n`;
      }
    }
    var fileData = tableHead + tableSubHead + content;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${district_code}-${qc_date}-${usv_code_real}-1R${parseInt(
      revision_real
    )}Q${parseInt(qc_type_fix)}.txt`;
    link.href = url;
    link.click();
  };

  const geoToUTM = (latitude, longitude) => {
    const a = 6378137.0;
    const f = 1 / 298.257223563;
    const k0 = 0.9996;

    const e = Math.sqrt(2 * f - Math.pow(f, 2));
    const e1sq = (e * e) / (1 - e * e);

    const zone = Math.floor((longitude + 180) / 6) + 1;
    const λ0 = (zone - 1) * 6 - 180 + 3;

    const φ = latitude * (Math.PI / 180);
    const λ = longitude * (Math.PI / 180);
    const λ0_rad = λ0 * (Math.PI / 180);

    const N = a / Math.sqrt(1 - Math.pow(e * Math.sin(φ), 2));
    const T = Math.pow(Math.tan(φ), 2);
    const C = e1sq * Math.pow(Math.cos(φ), 2);
    const A = Math.cos(φ) * (λ - λ0_rad);

    const M =
      a *
      ((1 -
        Math.pow(e, 2) / 4 -
        (3 * Math.pow(e, 4)) / 64 -
        (5 * Math.pow(e, 6)) / 256) *
        φ -
        ((3 * Math.pow(e, 2)) / 8 +
          (3 * Math.pow(e, 4)) / 32 +
          (45 * Math.pow(e, 6)) / 1024) *
          Math.sin(2 * φ) +
        ((15 * Math.pow(e, 4)) / 256 + (45 * Math.pow(e, 6)) / 1024) *
          Math.sin(4 * φ) -
        ((35 * Math.pow(e, 6)) / 3072) * Math.sin(6 * φ));

    const x =
      k0 *
        N *
        (A +
          ((1 - T + C) * Math.pow(A, 3)) / 6 +
          ((5 - 18 * T + Math.pow(T, 2) + 14 * C - 58 * e1sq) *
            Math.pow(A, 5)) /
            120) +
      500000.0;

    const y =
      k0 *
      (M +
        N *
          Math.tan(φ) *
          (Math.pow(A, 2) / 2 +
            ((5 - T + 9 * C + 4 * Math.pow(C, 2)) * Math.pow(A, 4)) / 24 +
            ((61 - 58 * T + Math.pow(T, 2) + 270 * C - 330 * e1sq) *
              Math.pow(A, 6)) /
              720));

    const hemisphereAdjustment = latitude < 0 ? 10000000 : 0;
    const yAdjusted = y + hemisphereAdjustment;

    return {
      x: Number(x.toFixed(3)),
      y: Number(yAdjusted.toFixed(3)),
    };
  };

  const calculateColumnWidths = (worksheet) => {
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    const colWidths = [];
    const maxColWidth = 30;

    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 3;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell && cell.v !== undefined) {
          const cellValue = String(cell.v);
          maxWidth = Math.max(maxWidth, cellValue.length);
        }
      }
      colWidths[C] = Math.min(maxWidth, maxColWidth);
    }
    return colWidths;
  };

  const exportDataInfoXLSX = async (buttonType) => {
    const response = await axios.get(`http://localhost:5001/datas/${id}`);
    const length = response.data.canal_data.length;
    let water_level;

    let geoData = [];
    let utmData = [];

    const tableHeadGeo = [
      "Sta",
      "Lattitude",
      "Longitude",
      "Time",
      "Depth",
      "Order No",
      "Measure Point",
      "Water Level",
      "Bed Float",
      "Canal ID",
    ];
    const tableHeadUTM = [
      "Sta",
      "X",
      "Y",
      "Time",
      "Depth",
      "Order No",
      "Measure Point",
      "Water Level",
      "Bed Float",
      "Canal ID",
    ];

    for (let i = 0; i < length; i++) {
      if (exportRef.current[i] === false) {
        continue;
      }
      const canalId = String(response.data.canal_data[i].canal_id);
      const dataLength = response.data.canal_data[i].data.length;
      const order_no = String(response.data.canal_data[i].order_no);
      const measure_point = String(response.data.canal_data[i].measure_point);
      const bedFloat = String(response.data.canal_data[i].bed_float);
      var revision_real = response.data.canal_data[i].revision;
      var qc_type_fix = response.data.canal_data[i].qc_type;
      var district_code = response.data.canal_data[i].district.code;
      var qc_date = response.data.canal_data[i].qc_date;
      var usv_code_real = response.data.canal_data[i].usv_code;

      for (let j = 0; j < dataLength; j++) {
        const sta = response.data.canal_data[i].data[j].sta.toFixed(0);
        const lattitude = parseFloat(
          response.data.canal_data[i].data[j].lattitude
        );
        const longitude = parseFloat(
          response.data.canal_data[i].data[j].longitude
        );
        const time = parseFloat(response.data.canal_data[i].data[j].time);
        const depth = parseFloat(
          response.data.canal_data[i].data[j].depth
        ).toFixed(2);
        water_level = String(response.data.canal_data[i].water_level);

        geoData.push([
          sta,
          lattitude,
          longitude,
          time,
          depth,
          order_no,
          measure_point,
          water_level,
          bedFloat,
          canalId,
        ]);

        const { x, y } = geoToUTM(lattitude, longitude);
        utmData.push([
          sta,
          x,
          y,
          time,
          depth,
          order_no,
          measure_point,
          water_level,
          bedFloat,
          canalId,
        ]);
      }
    }

    let ws;
    if (buttonType === "Geographic") {
      ws = XLSX.utils.aoa_to_sheet([tableHeadGeo, ...geoData]);
    } else {
      ws = XLSX.utils.aoa_to_sheet([tableHeadUTM, ...utmData]);
    }

    const columnWidths = calculateColumnWidths(ws);
    ws["!cols"] = columnWidths.map((width) => ({ wch: width }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const xlsxBlob = new Blob(
      [XLSX.write(wb, { bookType: "xlsx", type: "array" })],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    const url = URL.createObjectURL(xlsxBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Request-PAT-${district_code}-${qc_date}-${usv_code_real}${
      buttonType === "UTM" ? "-UTM" : ""
    }-1R${parseInt(revision_real)}Q${parseInt(qc_type_fix)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/data/${id}`);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllData = async () => {
    try {
      await axios.delete(`http://localhost:5001/alldata/${id}`);
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

    ExcelRenderer(fileObj, async (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        try {
          let data = [];
          let district_code;
          let length = resp.rows.length;
          for (var i = 1; i < length; i++) {
            if (resp.rows[i].length) {
              if (resp.rows[i][19] === "District Merang") {
                district_code = "2E01";
              } else if (resp.rows[i][19] === "District Buring") {
                district_code = "2E02";
              } else if (resp.rows[i][19] === "District Mendis") {
                district_code = "2C02";
              } else if (resp.rows[i][19] === "District Sembilang") {
                district_code = "2B01";
              } else if (resp.rows[i][19] === "District Sei Benu") {
                district_code = "2J01";
              } else if (resp.rows[i][19] === "District 1") {
                district_code = "2A02";
              } else if (resp.rows[i][19] === "District 2") {
                district_code = "2A04";
              } else if (resp.rows[i][19] === "District 5") {
                district_code = "2A08";
              } else if (resp.rows[i][19] === "District 6") {
                district_code = "2A03";
              } else {
                district_code = "2A05";
              }
              data[i - 1] = {
                canal_id: resp.rows[i][1],
                dimensi: {
                  panjang: resp.rows[i][2],
                  lebar: resp.rows[i][3],
                  tinggi: resp.rows[i][4],
                },
                order_no: resp.rows[i][5],
                operation_no: resp.rows[i][6],
                start: resp.rows[i][7],
                end: resp.rows[i][8],
                measure_point: resp.rows[i][9],
                water_level: resp.rows[i][10],
                depth_correction: resp.rows[i][11],
                bed_float: resp.rows[i][12],
                revision: resp.rows[i][13],
                qc_type: resp.rows[i][14],
                operator: resp.rows[i][15],
                qc_date: resp.rows[i][16],
                measure_date: resp.rows[i][17],
                usv_code: resp.rows[i][18],
                district: {
                  name: resp.rows[i][19],
                  code: district_code,
                },
                canal_upper_width: resp.rows[i][20],
                canal_bottom_width: resp.rows[i][21],
                canal_length: resp.rows[i][22],
                tranducer: resp.rows[i][23],
                lane: resp.rows[i][24],
              };
            }
          }
          await axios.post(`http://localhost:5001/data/${id}`, {
            canal_data: data,
          });
          navigate(0);
        } catch (error) {
          console.log(error);
        }
      }
    });
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
            <Link to={`chartData/${id}`} className="button is-info mr-5">
              Export to Graph
            </Link>
            <button
              onClick={() => exportDataInfo()}
              className="button is-info mr-5"
            >
              Export to txt
            </button>
            <div className="dropdown is-hoverable">
              <div className="dropdown-trigger">
                <button className="button is-info dropdown-trigger-button">
                  Export to XLSX ▼
                </button>
              </div>
              <div className="dropdown-menu">
                <div className="dropdown-content">
                  <button
                    className="dropdown-item"
                    onClick={() => exportDataInfoXLSX("Geographic")}
                  >
                    Geographic
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => exportDataInfoXLSX("UTM")}
                  >
                    UTM
                  </button>
                </div>
              </div>
            </div>
          </span>
          <span>
            <Link to={`addData/${id}`} className="button is-success mr-5">
              Add Order
            </Link>
            <button
              onClick={() => deleteAllData()}
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

export default DataList;
