// import React, { useEffect, useRef, useState } from 'react';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import ReactMapboxGl, { ZoomControl , RotationControl} from 'react-mapbox-gl';
// import { setRTLTextPlugin } from "mapbox-gl";

// // setRTLTextPlugin("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js");

// const Mapbox = ReactMapboxGl({
//     accessToken:
//         'pk.eyJ1Ijoic2hlbnplbjY0IiwiYSI6ImNrbnNzaWg0ODExZ2oycW8xa2Jkc2FmeWwifQ.yFDqLEHzuH3qZLAgqt33MA', 
//     antialias:true,
//     touchZoomRotate:false
// });


// const SmallMap = () => {

//     const [coords, setCoords] = useState([])
//     const [viewport , setViewport] = useState({
//         longitude: -7.5898434, 
//         latitude:33.5731104,
//         zoom:11
//     })
//     const [mapp,setMap] = useState(null)
//     const [btnClicked,setbtnClicked] = useState(false)
//     const [openedClickLocation,setopenedClickLocation] = useState(false)
//     const [clickedLongLat,setClickedLongLat] = useState({
//         lat:null,
//         lng:null
//     })
//     const [state, dispatch] = useStateValue();
//     const mapContainer = useRef()
//     const gps = useRef()
//     const click = useRef()

//     const onViewportChange =  (updated) => {
//         setViewport({
//         //   ...viewport,
//         //   width: updated._container.clientWidth,
//         //   height: updated._container.clientHeight,
//           longitude: updated.getCenter().lng,
//           latitude: updated.getCenter().lat,
//           zoom: updated.getZoom(),
//         });
//       };

//     useEffect(() => {
//         const tl = gsap.timeline({
//             defaults: {
//                 duration:0.3,
//                 ease: "Power2.easeIn"
//             }, 
//             paused:true
//         })
    
//         tl.fromTo(gps.current,{ opacity:0,  y:0 },{ opacity:1,  y:-80  })
//         tl.fromTo(click.current,{ opacity:0,  y:0  },{ opacity:1,  y:-160  },"-=0.2")
        
//         if(btnClicked){
//             tl.play()
//         } else {
//             tl.reverse()
//         }
       
//     }, [btnClicked])


//     const getCurrLocalisation = ()=>{
//         if("geolocation" in navigator){
//             navigator.geolocation.getCurrentPosition((position)=>{
//                 const { latitude, longitude } = position.coords
//                 state.map.flyTo({
//                     center: [longitude,latitude],
//                     essential: true, // this animation is considered essential with respect to prefers-reduced-motion
//                     zoom:16
//                   });
//                   const geometry = new THREE.BoxBufferGeometry(10,10,60)
//                   const material = new THREE.MeshStandardMaterial({color: "#CD6E6F"})
//                   let cube = new THREE.Mesh(geometry,material)
//                   cube = window.tb.Object3D({ obj: cube, units: 'meters' })
//                   cube.setCoords([longitude,latitude])
//                   window.tb.world.children.forEach((mesh)=>{
//                     if(mesh.name=='position'){
//                         mesh.removeHelp()
//                         window.tb.remove(mesh)
//                     }
//                 })
//                  cube.name = 'position'
//                   cube.addHelp("Votre Position","gps",true,cube.center,1,"label")
//                   window.tb.world.add(cube)
            
//             },()=>{
//                 alert("ERREUR")
//             })
//         } else {
//             alert("La géolocalisation n'est pas disponible")
//         }
//     }

//     useEffect(() => {
//         if(openedClickLocation){
//             document.body.style.opacity = 0.85
//             state.map.getCanvas().parentElement.style.cursor = 'crosshair'
//         } else {
//             if(state.map)
//             state.map.getCanvas().parentElement.style.cursor = 'grab'
//             document.body.style.opacity = 1
//         }
       
//     }, [openedClickLocation])

//     useEffect(() => {
//         if(clickedLongLat.lat){
//         const {lng, lat} = clickedLongLat
//         if(openedClickLocation){
//             state.map.getCanvas().parentElement.style.cursor = 'grab'
//             document.body.style.opacity = 1
             
//                   state.map.flyTo({
//                     center: [lng,lat],
//                     essential: true, // this animation is considered essential with respect to prefers-reduced-motion
//                     zoom:16
//                   });
//                   const geometry = new THREE.BoxBufferGeometry(10,10,60)
//                   const material = new THREE.MeshStandardMaterial({color: "#CD6E6F"})
//                   let cube = new THREE.Mesh(geometry,material)
//                   cube = window.tb.Object3D({ obj: cube, units: 'meters' })
//                   cube.setCoords([lng,lat])
//                   cube.addHelp("Votre Position","gps",true,cube.center,1,"label")
//                   window.tb.world.children.forEach((mesh)=>{
//                     if(mesh.name=='position'){
//                         mesh.removeHelp()
//                         window.tb.remove(mesh)
//                     }
//                   })
//                   cube.name = 'position'
//                   window.tb.world.add(cube)
//                   setopenedClickLocation(false)
//             } else {
//                 setClickedLongLat({})
//             }
//        }}, [clickedLongLat.lng])

//     return (
//         <div className='smallMap'>
//             <Mapbox
            
//             style="mapbox://styles/mapbox/navigation-night-v1"
//             containerStyle={{
//                 height: '100vh',
//                 width: '100vw'
//             }}
//             onClick={(map,e)=>{
//                 setClickedLongLat({
//                 lat:e.lngLat.lat,
//                 lng:e.lngLat.lng
//                 }
//             )}}
//             center={[viewport.longitude,viewport.latitude]}
//             antialias={true}
//             pitch={[pitch]}
//             onStyleLoad={handleStyleLoad}
//             zoom={[viewport.zoom]}
//             onZoom={handleZoom}
//             onMoveEnd={onViewportChange}
//             // onZoomEnd={onViewportChange}
//             // onPitchEnd={onViewportChange}
//         >
//             <ZoomControl />
//             <RotationControl />
//         </Mapbox>
        
//         <div onClick={()=>setopenedClickLocation(!openedClickLocation)} ref={click} className="addLocation up"> <ClickIcon /> <p> Clicker sur votre localisation sur la map </p> </div>
//         <div onClick={getCurrLocalisation} ref={gps} className="addLocation up"> <GpsIcon /> <p> Ajouter Votre Localisation Actuel </p> </div>
//         <div  onClick={()=>setbtnClicked(!btnClicked)} className="addLocation">
//             <AddLocation /> <p> Ajouter Votre Localisation </p>
//         </div>
//         </div>
//     )
// }

// export default SmallMap
