import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;

const AddMainData = () => {
  const [batangcanalid, setBatangCanalID] = useState("");

  const navigate = useNavigate();

  const saveData = async(e) => {
    e.preventDefault();
    const config = {
      headers:{
        "Access-Control-Allow-Origin": true,
        "Content-Type": "application/json"
      }
    };
    const url = "http://localhost:5001/datas";
    
    const data ={
      batang_canal_id: batangcanalid
    }
    try{
      await axios.post(url, data, config);
      navigate("/");
    }catch (error){
      console.log(error)
    }
  }

  return (
    <div className="columns mt-5">
      <div className="column is-half">
        <form onSubmit={saveData}>
          <div className="field">
            <label className="label">Batang Canal ID</label>
              <div className="control">
                <input 
                  type="text"
                  className="input" 
                  value={batangcanalid}
                  onChange ={(e) => setBatangCanalID(e.target.value)}
                  placeholder="Batang Canal ID"/>
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

export default AddMainData;