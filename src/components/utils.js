// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// const Threebox = require("threebox-plugin/src/Threebox")
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
  //  const tb = new Threebox(map,map.getCanvas().getContext('webgl'),{preserveDrawingBuffer:true})
   
// mapboxgl.workerClass = MapboxWorker;
// mapboxgl.accessToken = 'pk.eyJ1Ijoic2hlbnplbjY0IiwiYSI6ImNrbnNzaWg0ODExZ2oycW8xa2Jkc2FmeWwifQ.yFDqLEHzuH3qZLAgqt33MA';


    // const customLayer1 = {
    //     id: 'custom_layer',
    //     type: 'custom',
    //     renderingMode: '3d',
    //     onAdd: function (map, gl) {
    
    //          window.tb = new Threebox(
    //             map,
    //             map.getCanvas().getContext('webgl'), //get the context from Mapbox
    //             { defaultLights: true }
    //         );

    //         let cube1 = new THREE.Mesh(geometry, material);
    //         cube1 = window.tb.Object3D({ obj: cube1, units: 'meters' });
    //     //    const cube2 = window.tb.Object3D({ obj: cube1, units: 'meters' });

    //         cube1.rotation.x = -Math.PI/2
    //         cube1.setCoords([ -7.5898434,33.5731104]);
    //         window.tb.add(cube1);

    //         // cube2.rotation.x = -Math.PI/4
    //         // cube1.setCoords([ -7.5898435,33.5731105]);
    //         // window.tb.add(cube2);
    //     },
    //     render: function (gl, matrix) {
    //         window.tb.update(); //update Threebox scene
    //     }
    // }
    // map.addLayer(customLayer1, 'waterway-label');
    // useEffect(() => {
    //     // gui.add(parameters,'pitch').min(0).max(60).step(0.01).onChange((e)=>setPitch(e))
    // }, [window.tb])

    
// V2

// const Maps = () => {
//     const mapContainer = useRef();
//     const [lng, setLng] = useState(-70.9);
//     const [lat, setLat] = useState(42.35);
//     const [zoom, setZoom] = useState(9);
//     useEffect(() => {
//         const map = new mapboxgl.Map({
//         container: mapContainer.current,
//         style: `mapbox://styles/mapbox/streets-v10`,
//         center: [lng, lat],
//         zoom: zoom
//         });
//         return () => map.remove();
//         }, []);
//     return (
//         <div>
//         <div className="map-container" ref={mapContainer}/>
//         </div>
//     )
// }

