import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const AddDetailData = () => {
  const [lattitude, setLattitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [time, setTime] = useState("");
  const [depth, setDepth] = useState("");

  const {id} = useParams();
  const navigate = useNavigate();

  const saveData = async(e) => {
    e.preventDefault();
    try{
      await axios.post(`http://localhost:5001/detaildata/${id}`,{
        "canal_data.$.data": [
          {
            "lattitude": lattitude,
            "longitude": longitude,
            "time": time,
            "depth": depth
          }
        ]
      });
      navigate(-1);
    }catch (error){
      console.log(error)
    }
  }

  return (
    <div className="columns mt-5">
      <div className="column is-half">
        <form onSubmit={saveData}>
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
              <button type='submit' className='button is-success'>Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDetailData;