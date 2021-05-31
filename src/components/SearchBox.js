import React, { useEffect, useRef, useState } from 'react'
import { SearchIcon } from '../Svg'
import * as THREE from 'three'
import model from '../static/models/markerr.gltf'
import matcap from '../static/images/matcap4.png'
// import Loading from './Loading'
import Trajets from './Trajets'
import axios from '../axios';
import { useStateValue } from "../context/StateProvider";

const matc = new THREE.TextureLoader().load(matcap)

const SearchBox = ({small=false, setDestination}) => {
    const [schools,setSchools] = useState("")
    const [currSchool,setCurrSchool] = useState("")
    const [currSchoolName,setCurrSchoolName] = useState("")
    const [currSchoolInfo,setCurrSchoolInfo] = useState({})
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
        if(window.innerWidth < 800){
         addSchool(coor,name)
         }
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

  const addSchool = (coor,name)=>{
      const schoolMaterial = new THREE.MeshMatcapMaterial({
        matcap:matc
    })
     let options = {
         type: 'gltf', 
         obj: model, //model url
         units: 'meters', //units in the default values are always in meters
         scale: 20,
         rotation: { x: 90, y: 180, z: 0 }, //default rotation
         anchor: 'center',
     }
    
     const lat = coor[0]
     const long = coor[1]
     window.tb.loadObj(options, function (model) {
                     
         model.setCoords([long,lat]);
         model.traverse((mesh)=>{
             if(mesh.isMesh){
                 mesh.material = schoolMaterial
             }
         })
         model.addHelp(name.toUpperCase(),name,true,model.center,1,"label")
         // model.castShadow = true  // Trying to have better performance
         window.tb.world.add(model);
     });
 
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
