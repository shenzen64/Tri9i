import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapboxGl, { ZoomControl , RotationControl} from 'react-mapbox-gl';
import * as THREE from 'three'
import model from '../static/models/markerr.gltf'
import matcap from '../static/images/matcap4.png'
import globalTb from 'threebox-plugin';
import "threebox-plugin/dist/threebox.css"
import "threebox-plugin/examples/css/threebox.css"
import SearchBox from './SearchBox';
import axios from '../axios';
import { useStateValue } from "../context/StateProvider";
import { AddLocation, ClickIcon, GpsIcon } from '../Svg';
import gsap from 'gsap/gsap-core';
import { setRTLTextPlugin } from "mapbox-gl";

setRTLTextPlugin("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js");


const Threebox = globalTb.Threebox

const Mapbox = ReactMapboxGl({
    accessToken:
        'pk.eyJ1Ijoic2hlbnplbjY0IiwiYSI6ImNrbnNzaWg0ODExZ2oycW8xa2Jkc2FmeWwifQ.yFDqLEHzuH3qZLAgqt33MA', 
    antialias:true,
    touchZoomRotate:false
    });

    window.addEventListener('resize',()=>{
        // sizes.width = innerWidth
        // sizes.height = innerHeight
        if(window.tb){
        window.tb.camera.aspect = window.innerWidth /window.innerHeight
        window.tb.camera.updateProjectionMatrix()
        window.tb.renderer.setSize(window.innerWidth,window.innerHeight)
        window.tb.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    }
     })
     
 
const matc = new THREE.TextureLoader().load(matcap)


let minZoom = 12;
let mapConfig = {
			ALL: { center: [-7.565357, 33.560155,0], zoom: 16.25, pitch: 45, bearing: 0 },
			names: {
				compositeSource: "composite",
				compositeSourceLayer: "building",
				compositeLayer: "3d-buildings"
			}
		}


const navControlStyle= {
  right: 10,
  top: 10
}

const Maps = ({small=false, setCoordinates}) => {
    const [pitch, setPitch] = useState(40)
    const [coords, setCoords] = useState([])
    const [viewport , setViewport] = useState({
        longitude: -7.5898434, 
        latitude:33.5731104,
        zoom:11
    })
    const [mapp,setMap] = useState(null)
    const [btnClicked,setbtnClicked] = useState(false)
    const [openedClickLocation,setopenedClickLocation] = useState(false)
    const [clickedLongLat,setClickedLongLat] = useState({
        lat:null,
        lng:null
    })
    const [state, dispatch] = useStateValue();
    const mapContainer = useRef()
    const gps = useRef()
    const click = useRef()

    const onViewportChange =  (updated) => {
        setViewport({
        //   ...viewport,
        //   width: updated._container.clientWidth,
        //   height: updated._container.clientHeight,
          longitude: updated.getCenter().lng,
          latitude: updated.getCenter().lat,
          zoom: updated.getZoom(),
        });
      };
  
    const handleStyleLoad = (map) => {
       
         setMap(map)
          dispatch({
            type: "SET_MAP",
            map:map
          });
          setTimeout(() => {
            console.log("style loaded, go",state)
          }, 500);

        //
        // map.addLayer(createCompositeLayer())  //
 
    }
    
  const loadData = async () => {
        try {
            const data = await axios.get("/allSchools")
            setCoords(data.data) 
        } catch (error) {
            console.log(error)
        }

    }
    

    const schoolsLayer = ()=>{
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
            // enableTooltips:truee
        }
       coords.forEach((school,i)=>{
        const lat = school.coordinate[0]
        const long = school.coordinate[1]
        window.tb.loadObj(options, function (model) {
                        
            model.setCoords([long,lat]);
            model.traverse((mesh)=>{
                if(mesh.isMesh){
                    mesh.material = schoolMaterial
                }
            })
            model.addHelp(school.surnom.toUpperCase(),school.surnom,true,model.center,1,"label")
            // model.castShadow = true  // Trying to have better performance
            window.tb.world.add(model);
        });
       })
    }


    const initialLayer = ()=>(
        {
            id: 'custom_layer',
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, mbxContext) {
                
                // instantiate threebox
                window.tb = new Threebox(
                    map,
                    mbxContext,
                    {
                        defaultLights: true,
                        enableSelectingObjects: true,
                        enableSelectingFeatures: true, //change to false to disable fill-extrusion features selection
                        multiLayer: true,
                        antialias:true,      
                        realSunlight: true,
                        enableSelectingObjects: true, //enable 3D models over/selectionn
                        enableTooltips: true // enable default tooltips on fill-extrusion and 3D models 
                 
                    }
                );

               // SCHOOLS
               if(!small)
                schoolsLayer()

               // INIT
                window.tb.defaultLights()
                window.tb.createSkyLayer()
                window.tb.getSunSky(new Date())
            },
    
            render: function (gl, matrix) {
                window.tb.update();
            }
          }
    )



    let prevZoom = 11 //
    const handleZoom = (e) => {
        const currZoom = e.getZoom();
        const scale = clampZoom(prevZoom, currZoom);
        prevZoom = currZoom
        const root = document.documentElement
        const currScale = root?.style.getPropertyValue('--markerScale')
        root?.style.setProperty("--markerScale",currScale+scale)
       if(currZoom < 10){
        root?.style.setProperty("--markerScale",0.3)
       }
    }

    useEffect(() => {
        const tl = gsap.timeline({
            defaults: {
                duration:0.3,
                ease: "Power2.easeIn"
            }, 
            paused:true
        })
    
        tl.fromTo(gps.current,{ opacity:0,  y:0 },{ opacity:1,  y:-80  })
        tl.fromTo(click.current,{ opacity:0,  y:0  },{ opacity:1,  y:-160  },"-=0.2")
        
        if(btnClicked){
            tl.play()
        } else {
            tl.reverse()
        }
       
    }, [btnClicked])


    const getCurrLocalisation = ()=>{
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition((position)=>{
                const { latitude, longitude } = position.coords
                state.map.flyTo({
                    center: [longitude,latitude],
                    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
                    zoom:16
                  });
                
                  
                  const geometry = new THREE.BoxBufferGeometry(10,10,60)
                  const material = new THREE.MeshStandardMaterial({color: "#CD6E6F"})
                  let cube = new THREE.Mesh(geometry,material)
                  cube = window.tb.Object3D({ obj: cube, units: 'meters' })
                  cube.setCoords([longitude,latitude])
                  window.tb.world.children.forEach((mesh)=>{
                    if(mesh.name=='position'){
                        mesh.removeHelp()
                        window.tb.remove(mesh)
                    }
                })
                 cube.name = 'position'
                  cube.addHelp(`${small ? 'Position De Départ' : 'Votre Position'}`,"gps",true,cube.center,1,"label")
                  window.tb.world.add(cube)
                if(small) {
                setCoordinates({
                    latitude,
                    longitude
                })
               }
            },()=>{
                alert("ERREUR")
            })
        } else {
            alert("La géolocalisation n'est pas disponible")
        }
    }

    useEffect(() => {
        if(openedClickLocation){
            document.body.style.opacity = 0.85
            state.map.getCanvas().parentElement.style.cursor = 'crosshair'
        } else {
            if(state.map)
            state.map.getCanvas().parentElement.style.cursor = 'grab'
            document.body.style.opacity = 1
        }
       
    }, [openedClickLocation])

    useEffect(() => {
        if(clickedLongLat.lat){
        const {lng, lat} = clickedLongLat
        if(openedClickLocation){
            state.map.getCanvas().parentElement.style.cursor = 'grab'
            document.body.style.opacity = 1
             
                  state.map.flyTo({
                    center: [lng,lat],
                    essential: true, // this animation is considered essential with respect to prefers-reduced-motion
                    zoom:16
                  });
                
                  const geometry = new THREE.BoxBufferGeometry(10,10,60)
                  const material = new THREE.MeshStandardMaterial({color: "#CD6E6F"})
                  let cube = new THREE.Mesh(geometry,material)
                  cube = window.tb.Object3D({ obj: cube, units: 'meters' })
                  cube.setCoords([lng,lat])
                  cube.addHelp(`${small ? 'Position De Départ' : 'Votre Position'}`,"gps",true,cube.center,1,"label")
                  window.tb.world.children.forEach((mesh)=>{
                    if(mesh.name=='position'){
                        mesh.removeHelp()
                        window.tb.remove(mesh)
                    }
                  })
                  cube.name = 'position'
                  window.tb.world.add(cube)
                
                if(small) {
                    setCoordinates({
                        latitude:lat,
                        longitude:lng
                    })
                }
                  setopenedClickLocation(false)
            } else {
                setClickedLongLat({})
            }
       }
    }, [clickedLongLat.lng])

       
    useEffect(() => {
        loadData()
        // loadTrajects()
        return ()=>{
            loadData()
            // loadTrajects()  
        }
    }, [])


    let isMounted = true
    useEffect(() => {
    if(mapp && isMounted){

      mapp.addLayer(initialLayer())
    }
    return ()=>{
        isMounted = false
        setMap(null)
    }
    }, [mapp])

    return (
        <div className='mapContainer' ref={mapContainer}>
            {!small &&  <SearchBox  />}
         
            <Mapbox
            
                style="mapbox://styles/mapbox/navigation-night-v1"
                containerStyle={{
                    height: '100vh',
                    width: '100vw'
                }}
                onClick={(map,e)=>{
                    setClickedLongLat({
                    lat:e.lngLat.lat,
                    lng:e.lngLat.lng
                    }
                )}}
                center={[viewport.longitude,viewport.latitude]}
                antialias={true}
                pitch={[pitch]}
                onStyleLoad={handleStyleLoad}
                zoom={[viewport.zoom]}
                onZoom={handleZoom}
                onMoveEnd={onViewportChange}
                // onZoomEnd={onViewportChange}
                // onPitchEnd={onViewportChange}
            >
                <ZoomControl />
                <RotationControl />
            </Mapbox>
            
            <div onClick={()=>setopenedClickLocation(!openedClickLocation)} ref={click} className="addLocation up"> <ClickIcon /> <p> { small ?  " Selectionner une position sur la map": "Clicker sur votre localisation sur la map"} </p> </div>
            <div onClick={getCurrLocalisation} ref={gps} className="addLocation up"> <GpsIcon /> <p> Ajouter Votre Localisation Actuel </p> </div>
            <div  onClick={()=>setbtnClicked(!btnClicked)} className="addLocation">
                <AddLocation /> <p> { small ?  "Ajouter Le Lieu De Départ" :"Ajouter Votre Localisation"} </p>
            </div>
        </div>
    )
}



function createCompositeLayer() {
    let layer = {
        'id': mapConfig.names.compositeLayer,
        'source': mapConfig.names.compositeSource,
        'source-layer': mapConfig.names.compositeSourceLayer,
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': minZoom,
        'paint': {
            'fill-extrusion-color':
                [
                    'case',
                    ['boolean', ['feature-state', 'select'], false],
                    "lightgreen",
                    ['boolean', ['feature-state', 'hover'], false],
                    "lightblue",
                    '#343242'
                ],

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                'interpolate',
                ['linear'],
                ['zoom'],
                minZoom,
                0,
                minZoom + 0.05,
                ['get', 'height']
            ],
            'fill-extrusion-base': [
                'interpolate',
                ['linear'],
                ['zoom'],
                minZoom,
                0,
                minZoom + 0.05,
                ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.9
        }
    };
    return layer;
}



const clampZoom = (prevZoom, currZoom) => {
    let scale = 0.1
    // if (currZoom > 15) {
    //     scale = 0.001
    // } else {
    //     scale = 0.0297
    // }

    if (prevZoom < currZoom) {
        scale *= -1
    }

    return scale

}


export default Maps
