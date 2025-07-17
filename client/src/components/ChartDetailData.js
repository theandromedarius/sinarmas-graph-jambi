import React, {useState, useEffect, useRef} from "react";
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useParams, useNavigate } from 'react-router-dom';
import { toPng } from 'html-to-image';
import { Chart as ChartJS, BarElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';
import annotationPlugin from "chartjs-plugin-annotation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(BarElement, PointElement, LinearScale, CategoryScale, Title, annotationPlugin);

const ChartDetailData = () => {
  const {id} = useParams();
  const navigate = useNavigate();

	const chartRef = useRef(null);
  const downloadRef = useRef(null);

  const [chartData1, setChartData1] = useState({
    datasets: [],
  });
  const [data1, setData1] = useState({});
  const [bar1, setBar1] = useState(<div></div>);
  const [orderNo, setOrderNo] = useState('');
  const [canalId, setCanalId] = useState('');
  const [waterLevel, setWaterLevel] = useState('');
  const [dimensi, setDimensi] = useState('');
  const [qcDate, setQcDate] = useState('');
  const [sameLength, setSameLength] = useState(true)
  const [pengukuran, setPengukuran] = useState({
    tidakLulus: 2.905,
    toleransi: {
      batasAwal: 2.905,
      batasAkhir: 3.000
    },
    lulus: 3.000
  });

  useEffect(() => {
    getDetailDataChart();
    getDetailData();
    getPengukuran();
    getLength()

    // eslint-disable-next-line
  },[])

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    setChartData1(data1);
  }, [data1]);

  useEffect(() => {
    if(!sameLength){
      toast.error('Panjang Kanal Tidak Sesuai!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    }
  }, [sameLength]);

  useEffect(() => {
    setBar1(
      <Bar ref={chartRef} data={chartData1} options={options}/>
    ) 
  },[chartData1])

  const getDetailDataChart = async() => {
    const response = await axios.get(`http://localhost:5001/datachart/${id}`);
    // console.log(response.data);
    if(response.data !== undefined){
      setData1({
        labels: response.data.map((data) => data.length),
        datasets: [
          {
            label: "Depth",
            data: response.data.map((data) => data.data),
            backgroundColor: response.data.map((data) => data.color),
          }
        ]
      })
    }
  };

  const getDetailData = async() => {
    const response = await axios.get(`http://localhost:5001/data/${id}`);
    var qcdate = response.data[0].canal_data[0].qc_date;
    setCanalId(response.data[0].canal_data[0].canal_id);
    setOrderNo(response.data[0].canal_data[0].order_no);
    setWaterLevel(response.data[0].canal_data[0].water_level);
    setDimensi(response.data[0].canal_data[0].dimensi.panjang + ' X ' + response.data[0].canal_data[0].dimensi.lebar + ' X ' + response.data[0].canal_data[0].dimensi.tinggi);
    setQcDate(qcdate.slice(0,4) + "-" + qcdate.slice(4,6) + "-" + qcdate.slice(6,8));
  };

  const getPengukuran = async() => {
    const pengukuran = await axios.get("http://localhost:5001/pengukuran")
    setPengukuran(pengukuran.data[0]);
  }

  const download = () => {
    toPng(downloadRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${canalId} - ${qcDate}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const options = {
    animation: {
      duration: 300,
    },
    scales: {
      x: {
        position: 'top'
      }
    },
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: pengukuran.lulus * -1,
            yMax: pengukuran.lulus * -1,
            borderWidth: 3,
            borderColor: 'blue'
          },
          line2: {
            type: 'line',
            yMin: pengukuran.tidakLulus * -1,
            yMax: pengukuran.tidakLulus * -1,
            borderWidth: 3,
            borderColor: 'red'
          }
        }
      }
    }
  }

  

  const getLength = async() => {
    const [{ data: dataChart }, { data: dataForm }] = await Promise.all([
      axios.get(`http://localhost:5001/datachart/${id}`),
      axios.get(`http://localhost:5001/data/${id}`)
    ]);
    if(dataChart.length > 0){
      const formLength = dataForm[0].canal_data[0].canal_length;
      const chartLengthDetails = dataChart[dataChart.length - 1].length;
      const lastStaDefined = dataChart[dataChart.length - 1].data
      const dobleSta = chartLengthDetails !== dataChart[dataChart.length - 2].length
      setSameLength((formLength === chartLengthDetails) && lastStaDefined && dobleSta)
    }
  };

  return (
		<div style={{width: '100%'}}>
      <div style={{background: "white"}} ref={downloadRef}>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "10px 30px"}}>
          <div>
            <p>KETERANGAN</p>
            <div style={{display: "flex", flexDirection: "row"}}>
              <div style={{backgroundColor: "green", height: "auto", width: "25px", margin: "3px 8px 3px 0px"}}></div>
              <p>PASS &#8805; {pengukuran.lulus}</p>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
              <div style={{backgroundColor: "blue", height: "auto", width: "25px", margin: "3px 8px 3px 0px"}}></div>
              <p>{pengukuran.toleransi.batasAwal} &#8804; TOLERANCE &#62; {pengukuran.toleransi.batasAkhir}</p>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
              <div style={{backgroundColor: "red", height: "auto", width: "25px", margin: "3px 8px 3px 0px"}}></div>
              <p>NOT PASS &#60; {pengukuran.tidakLulus}</p>
            </div>
          </div>
          <div>
            <table>
              <tbody>
                <tr>
                  <td>ORDER NO</td>
                  <td style={{padding: "0px 10px"}}>:</td>
                  <td>{orderNo}</td>
                </tr>
                <tr>
                  <td>ID KANAL</td>
                  <td style={{padding: "0px 10px"}}>:</td>
                  <td>{canalId}</td>
                </tr>
                <tr>
                  <td>WL.</td>
                  <td style={{padding: "0px 10px"}}>:</td>
                  <td>{waterLevel} m</td>
                </tr>
                <tr>
                  <td>DIMENSI</td>
                  <td style={{padding: "0px 10px"}}>:</td>
                  <td>{dimensi}</td>
                </tr>
                <tr>
                  <td>QC DATE</td>
                  <td style={{padding: "0px 10px"}}>:</td>
                  <td>{qcDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {bar1}
        <ToastContainer/>
      </div>
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "10px 30px"}}>
        <button onClick={() => download()} className='button is-success'>Download</button>
        <button onClick={() => navigate("/pengaturan")} className='button is-info'>Pengaturan</button>
      </div>
    </div>
	);
}

export default ChartDetailData;