import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const EditDetailData = () => {
  const [lattitude, setLattitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [time, setTime] = useState("");
  const [depth, setDepth] = useState("");
  
  const navigate = useNavigate();
  const {id} = useParams();
  const location = useLocation();

  useEffect(() => {
    getDetailData();

		// eslint-disable-next-line
  },[])

  const getDetailData = async() => {
    const response = await axios.get(`http://localhost:5001/detaildata/${id}`);
    const fixedData = response.data[0].canal_data.filter(item => Array.isArray(item.data) && item.data.length > 0)
    setLattitude(fixedData[0].data[0].lattitude);
    setLongitude(fixedData[0].data[0].longitude);
    setTime(fixedData[0].data[0].time);
    setDepth(fixedData[0].data[0].depth);
  };

  const updateDetailData = async(e) => {
    e.preventDefault();
    try{
      await axios.patch(`http://localhost:5001/detaildata/${id}`,{
        "canal_data.$[].data.$[data].lattitude": lattitude,
        "canal_data.$[].data.$[data].longitude": longitude,
        "canal_data.$[].data.$[data].time": time,
        "canal_data.$[].data.$[data].depth": depth,
      });
      navigate(-1);
    }catch (error){
      console.log(error)
    }
  }

  return (
    <div className="columns mt-5">
      <div className="column is-half">
        <form onSubmit={updateDetailData}>
        <div className="field">
            <label className="label">Lattitude</label>
              <div className="control">
                <input 
                  type="text"
                  className="input" 
                  value={lattitude}
                  onChange ={(e) => setLattitude(e.target.value)}
                  placeholder="Lattitude"/>
              </div>
          </div>
          <div className="field">
            <label className="label">Longitude</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={longitude}
                onChange ={(e) => setLongitude(e.target.value)} 
                placeholder="Longitude"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Time</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={time}
                onChange ={(e) => setTime(e.target.value)} 
                placeholder="Time"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Depth (m)</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={depth}
                onChange ={(e) => setDepth(e.target.value)} 
                placeholder="Depth"/>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type='submit' className='button is-success'>Update</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditDetailData;