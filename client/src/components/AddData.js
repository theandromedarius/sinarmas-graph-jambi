import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddData = () => {
  const { id } = useParams();

  const [canalid, setCanalId] = useState("");
  const [dimensiPanjang, setDimensiPanjang] = useState("");
  const [dimensiLebar, setDimensiLebar] = useState("");
  const [dimensiTinggi, setDimensiTinggi] = useState("");
  const [orderno, setOrderNo] = useState("");
  const [operationno, setOperationNo] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [measurepoint, setMeasurePoint] = useState("");
  const [waterlevel, setWaterLevel] = useState("");
  const [depthcorrection, setDepthCorrection] = useState("");
  const [bedfloat, setBedFloat] = useState("");
  const [revision, setRevision] = useState("");
  const [qcType, setQcType] = useState("");
  const [operator, setOperator] = useState("");
  const [qcdate, setQcDate] = useState("");
  const [measuredate, setMeasureDate] = useState("");
  const [usvcode, setUsvCode] = useState("");
  const [districtname, setDistrictName] = useState("District Merang");
  const [districtcode, setDistrictCode] = useState("3B01");
  const [canalupperwidth, setCanalUpperWidth] = useState("");
  const [canalbottomwidth, setCanalBottomWidth] = useState("");
  const [canallength, setCanalLength] = useState("");
  const [tranducer, setTranducer] = useState("");
  const [lane, setLane] = useState("1");

  const navigate = useNavigate();

  const saveData = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/data/${id}`, {
        canal_data: [
          {
            canal_id: canalid,
            dimensi: {
              panjang: dimensiPanjang,
              lebar: dimensiLebar,
              tinggi: dimensiTinggi,
            },
            order_no: orderno,
            operation_no: operationno,
            start: start,
            end: end,
            measure_point: measurepoint,
            water_level: waterlevel,
            depth_correction: depthcorrection,
            bed_float: bedfloat,
            revision: revision,
            qc_type: qcType,
            operator: operator,
            qc_date: qcdate,
            measure_date: measuredate,
            usv_code: usvcode,
            district: {
              name: districtname,
              code: districtcode,
            },
            canal_upper_width: canalupperwidth,
            canal_bottom_width: canalbottomwidth,
            canal_length: canallength,
            tranducer: tranducer,
            lane: lane,
          },
        ],
      });
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (districtname === "District Merang") {
      setDistrictCode("2E01");
    } else if (districtname === "District Buring") {
      setDistrictCode("2E02");
    } else if (districtname === "District Mendis") {
      setDistrictCode("2C02");
    } else if (districtname === "District Sembilang") {
      setDistrictCode("2B01");
    } else if (districtname === "District Sei Benu") {
      setDistrictCode("2J01");
    } else if (districtname === "District 1") {
      setDistrictCode("2A02");
    } else if (districtname === "District 2") {
      setDistrictCode("2A04");
    } else if (districtname === "District 5") {
      setDistrictCode("2A08");
    } else if (districtname === "District 6") {
      setDistrictCode("2A03");
    } else {
      setDistrictCode("2A05");
    }
  }, [districtname]);

  return (
    <div className="columns mt-5">
      <div className="column is-half">
        <form onSubmit={saveData}>
          <div className="field">
            <label className="label">Canal ID</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={canalid}
                onChange={(e) => setCanalId(e.target.value)}
                placeholder="Canal ID (ex: SJ400001)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Dimensi (m)</label>
            <div
              className="control"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <input
                type="text"
                className="input"
                value={dimensiPanjang}
                onChange={(e) => setDimensiPanjang(e.target.value)}
              />
              <p style={{ margin: "auto 5px" }}>X</p>
              <input
                type="text"
                className="input"
                value={dimensiLebar}
                onChange={(e) => setDimensiLebar(e.target.value)}
              />
              <p style={{ margin: "auto 5px" }}>X</p>
              <input
                type="text"
                className="input"
                value={dimensiTinggi}
                onChange={(e) => setDimensiTinggi(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Order No</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={orderno}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder="Order No (ex: 000000000001)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Operation No</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={operationno}
                onChange={(e) => setOperationNo(e.target.value)}
                placeholder="Operation No (ex: 0010)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">start (m)</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="Start (ex: 10)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">End (m)</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="End (ex: 100)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Measure Point</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={measurepoint}
                onChange={(e) => setMeasurePoint(e.target.value)}
                placeholder="Measure Point (ex: 100000)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Water Level (m)</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={waterlevel}
                onChange={(e) => setWaterLevel(e.target.value)}
                placeholder="Nilai BP (ex: 0.66)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Depth Correction (m)</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={depthcorrection}
                onChange={(e) => setDepthCorrection(e.target.value)}
                placeholder="Sensor - Rambu (ex: 0.26)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Bed Float (m)</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={bedfloat}
                onChange={(e) => setBedFloat(e.target.value)}
                placeholder="Ketebalan Sedimen (ex: 0.26)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Revision</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={revision}
                onChange={(e) => setRevision(e.target.value)}
                placeholder="Revision (ex: 001)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">QC Type</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={qcType}
                onChange={(e) => setQcType(e.target.value)}
                placeholder="Qc Type (ex: 001)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Operator</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="Operator (ex: Agus)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">QC Date</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={qcdate}
                onChange={(e) => setQcDate(e.target.value)}
                placeholder="QC Date (ex: 20211121)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Measure Date</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={measuredate}
                onChange={(e) => setMeasureDate(e.target.value)}
                placeholder="Measure Date (ex: 20211121)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">USV Code</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={usvcode}
                onChange={(e) => setUsvCode(e.target.value)}
                placeholder="USV Code (ex: Karta-Boat-01)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">District</label>
            <div
              className="control"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <div
                className="select is-fullwidth"
                style={{ margin: "0px 5px 0px 0px" }}
              >
                <select
                  value={districtname}
                  onChange={(e) => setDistrictName(e.target.value)}
                >
                  <option value="District Merang">District Merang (DM)</option>
                  <option value="District Buring">District Buring (DB)</option>
                  <option value="District Sembilang">
                    District Sembilang (DS)
                  </option>
                  <option value="District Sei Benu">
                    District Sei Benu (DSB)
                  </option>
                  <option value="District 1">District 1 (DI)</option>
                  <option value="District 2">District 2 (DII)</option>
                  <option value="District 3">District 3 (DIII)</option>
                  <option value="District 6">District 6 (DVI)</option>
                  <option value="District 7">District 7 (DVII)</option>
                </select>
              </div>
              <input
                style={{ margin: "0px 0px 0px 5px", width: "20%" }}
                type="text"
                className="input"
                value={districtcode}
                onChange={(e) => setDistrictCode(e.target.value)}
                disabled
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Canal Upper Width (m)</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={canalupperwidth}
                onChange={(e) => setCanalUpperWidth(e.target.value)}
                placeholder="Canal Upper Width (ex: 10)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Canal Bottom Width (m)</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={canalbottomwidth}
                onChange={(e) => setCanalBottomWidth(e.target.value)}
                placeholder="Canal Bottom Width (ex: 10)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Canal Length (m)</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={canallength}
                onChange={(e) => setCanalLength(e.target.value)}
                placeholder="Canal Length (ex: 10)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Tranducer (m)</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={tranducer}
                onChange={(e) => setTranducer(e.target.value)}
                placeholder="Water Level - Sensor (ex: 2)"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Lane</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={lane} onChange={(e) => setLane(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddData;
