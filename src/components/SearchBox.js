import React, { useEffect, useRef, useState } from 'react'
import { SearchIcon } from '../Svg'
// import Loading from './Loading'
import Trajets from './Trajets'
import axios from '../axios';
import { useStateValue } from "../context/StateProvider";


const SearchBox = ({small=false, setDestination}) => {
    const [schools,setSchools] = useState("")
    const [currSchool,setCurrSchool] = useState("")
    const [currSchoolName,setCurrSchoolName] = useState("")
    const [loading,setLoading] = useState(false)
    const [state, dispatch] = useStateValue();
    let input = useRef()

    const searchschool = async (school) => {
        setLoading(true)
        try {
          if (!input.value) return setSchools([]);
          const searchResult = await axios.get( `/searchSchool/${school}`)
          setSchools(searchResult.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      };

    const handleClick = (coor,name,id)=>{
       if(!small){
        state.map.flyTo({
            center: coor.reverse(),
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom:16
          });
        setCurrSchool(id)
        setCurrSchoolName(name)
      }else {
        setDestination(id)
      }
        input.value = name
        setSchools([])
        
    }


    
    return (
        <div className={small ? "smallSearchContainer" :'searchContainer'} >
            {currSchool && <Trajets name={currSchoolName} currSchool={currSchool} />}
          <div className={ small? "smallSearch" :"search"}>
            <div className="inputC">
                { !small && <SearchIcon />}
                {!small && <div className="line"></div>}
                <input
                ref={(el) => (input = el)}
                type="text"
                placeholder="Taper le nom de votre école..."
                onChange={(e) => {
                    if (e.target.value === "") setSchools([]);
                    else searchschool(e.target.value);
                }}
                />
               {schools.length > 0 && <div className="x" onClick={()=>{
                   input.value = ""
                   setSchools([])
               }}>X</div>}
            </div>
            
            {schools.length > 0 && (
              <div className="allResults">
                {!loading ? (
                  schools.map((school) => {
                    return (
                      <div onClick={()=>handleClick(school.coordinate,school.surnom,school._id)} className="result" key={school._id}>
                       {school.surnom}
                      </div>
                    );
                  })
                ) : (
                //   <Loading />
                <div>loading..</div>
                )}
              </div>
            )}
          </div>
      
        </div>
    )
}

export default SearchBox
