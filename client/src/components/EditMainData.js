import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditMainData = () => {
  const [batangcanalid, setBatangCanalID] = useState("");
  
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(() => {
    getDatas();

		// eslint-disable-next-line
  },[])

  const getDatas = async() => {
    const response = await axios.get(`http://localhost:5001/datas/${id}`);
    setBatangCanalID(response.data.batang_canal_id);
  };

  const updateMainData = async(e) => {
    e.preventDefault();
    try{
      await axios.patch(`http://localhost:5001/datas/${id}`,{
        "batang_canal_id" : batangcanalid
      });
      navigate("/");
    }catch (error){
      console.log(error)
    }
  }

  return (
    <div className="columns mt-5">
      <div className="column is-half">
        <form onSubmit={updateMainData}>
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
              <button type='submit' className='button is-success'>Update</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditMainData;