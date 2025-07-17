import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditPengukuran = () => {
  const [tidakLulus, setTidakLulus] = useState("");
  const [toleransiBatasAwal, setToleransiBatasAwal] = useState("");
  const [toleransiBatasAkhir, setToleransiBatasAkhir] = useState("");
  const [lulus, setLulus] = useState("");
  const [data, setData] = useState(false);

  const navigate = useNavigate();

  const saveData = async(e) => {
    e.preventDefault();
    try{
      if(data.length > 0 )
        await axios.patch(`http://localhost:5001/pengukuran/${data[0]._id}`,{
          "tidakLulus" : tidakLulus,
          "toleransi" : {
            "batasAwal": toleransiBatasAwal,
            "batasAkhir": toleransiBatasAkhir
          },
          "lulus" : lulus
        });
      else
        await axios.post("http://localhost:5001/pengukuran",{
          "tidakLulus" : tidakLulus,
          "toleransi" : {
            "batasAwal": toleransiBatasAwal,
            "batasAkhir": toleransiBatasAkhir
          },
          "lulus" : lulus
        });
      navigate(-1);
    }catch (error){
      console.log(error)
    }
  }

  const getPengukuran = async() => {
    const pengukuran = await axios.get("http://localhost:5001/pengukuran")
    setData(pengukuran.data);
  }

  useEffect(() => {
    getPengukuran();
  },[])

  return (
    <div className="columns mt-5">
      <div className="column is-half">
        <form onSubmit={saveData}>
          <div className="field">
            <label className="label">Tidak Lulus</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={tidakLulus}
                onChange ={(e) => setTidakLulus(e.target.value)} 
                placeholder="Tidak Lulus (ex: 2.55)"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Toleransi</label>
            <div className="control" style={{display: 'flex', flexDirection: 'row'}}>
              <input 
                type="text" 
                className="input" 
                value={toleransiBatasAwal}
                onChange ={(e) => setToleransiBatasAwal(e.target.value)} 
                placeholder="Tolerasi Batas Awal (ex: 2.55)"/>
              <p style={{margin: "auto 5px"}}>s.d.</p>
              <input 
                type="text" 
                className="input" 
                value={toleransiBatasAkhir}
                onChange ={(e) => setToleransiBatasAkhir(e.target.value)} 
                placeholder="Toleransi Batas Akhir (ex: 2.9999)"/>
            </div>
          </div>
          <div className="field">
            <label className="label">Lulus</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={lulus}
                onChange ={(e) => setLulus(e.target.value)} 
                placeholder="Lulus (ex: 3)"/>
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

export default EditPengukuran;