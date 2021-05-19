import axios from '../axios'
import React, { useEffect, useRef, useState } from 'react'
import { useStateValue } from "../context/StateProvider";
import { AccountIcon, BigArrow, DateIcon, DollarIcon, LocalisationIcon, PhoneIcon } from '../Svg'
import { Link } from 'react-router-dom'
import * as THREE from 'three'
import model from '../static/models/markerr.gltf'
import moment from 'moment'
import gsap from 'gsap'
import Popup from './Popup';


const geometry = new THREE.PlaneBufferGeometry(30,50,12);

const Trajets = ({currSchool,name}) => {
    const [trajets, setTrajets] = useState([])
    const [currTrajet, setCurrTrajet] = useState("")
    const [loading, setLoading] = useState(false)
    const [openedPopup,setOpenedPopup] = useState(false)
    const [isSigned,setIsSigned] = useState(false)
    const [info, setInfo] = useState("")
    const [state,dispatch] = useStateValue()
    const allTrajets = useRef()
    const container = useRef()

    
    const generateArr = (trajets)=>{

        const materials = []

        trajets.forEach((trajet,i)=>{  
                    const cnv = document.createElement('canvas')
                    cnv.width = 1024  
                    cnv.height = 1024
                    const ctx = cnv.getContext('2d')
                    ctx.save()
                    ctx.fillStyle = '#dfdfdf'
                    ctx.fillRect(0, 0, cnv.width, cnv.height);
                    // ctx.textAlign = "center"
                    // Lorem  sit amet hhi  similique temporibus phi0 consectetur obcaecati, ullam nisi nesciunt autem vel adipisci voluptas sit beatae quaerat dolore natus repellat enim.
                    ctx.font = "6.5rem sans-serif";
                    ctx.fillStyle='#080077'
                    ctx.fillText(`Debut du Trajet`, cnv.width/5,cnv.height/9)

                    ctx.font = "7.5em sans-serif";
                    ctx.textBaseline = "center";
                    ctx.maxWidth =cnv.width;
                    ctx.fillStyle='#252020'
                    ctx.fillText("-Destination:", cnv.width/8,cnv.height/4)

                    ctx.fillStyle='#252020'
                    ctx.fillText(`${trajets[i].destination.surnom} 🏳`, cnv.width/8,cnv.height/2.8)
                    ctx.fillStyle='#252020'
                    ctx.font = "6.2em sans-serif";
                    ctx.fillText(`-Prix Du trajet: ${trajets[i].prix ? trajets[i].prix : "--" }dh `, cnv.width/8,cnv.height/2)
                    ctx.font = "4.9em sans-serif";
                    ctx.fillText(`-Date Du Trajet: ${moment(trajets[i].dateStr).format("DD/MM/YYYY A HH:mm") ? moment(trajets[i].date).format("DD/MM/YYYY A HH:mm") : "--" }`, cnv.width/8,cnv.height/1.65)
                    ctx.fillText(`-Nombre de passagers: ${trajets[i].passagers.length} `, cnv.width/8,cnv.height/1.4)
                    ctx.restore()
    
    
                    const texture = new THREE.CanvasTexture(cnv)
    
                    const material =new THREE.ShaderMaterial({
                        vertexShader : `
                        varying vec2 vUv;  
                        void main (){
                            vec4 modelPosition = modelMatrix * vec4(position,1.0);
                            
                            vec4 viewPosition = viewMatrix * modelPosition;
                            vec4 projectedPosition = projectionMatrix * viewPosition;
                        
                            gl_Position = projectedPosition;
                            vUv = uv;
                        }
                        `,
                        fragmentShader : `
                        uniform sampler2D uTexture;
                        varying vec2 vUv;
                        void main()
                        {
                            vec4 textureColor = texture2D(uTexture,vec2(vUv.x,vUv.y));
                            gl_FragColor = vec4(textureColor.xyz,1.0);
                        }
                        ` ,
                        uniforms:{
                            uTexture: { value: texture }
                        }
                    })
                    // const material = new THREE.MeshStandardMaterial({
                    //     map:texture
                    // })
                    materials.push(material)
                    
                })
        
        const arrr = []
        for (let i = 0; i < trajets.length; i++) {

            let cube1 = new THREE.Mesh(geometry, materials[i])
           
            cube1 = window.tb.Object3D({ obj: cube1, units: 'meters' });
            
            cube1.rotation.z= Math.PI
            arrr.push(cube1)
        }
        
        return arrr
    }

    const drawLine = (start,destination)=>{
        var line = new Array();
        var maxElevation = Math.pow(Math.abs(destination[0]*destination[1]), 0.5)*10 ;
        var arcSegments = 25;
    
        for (var l = 0; l<=arcSegments; l++){
            
            var waypoint = [lerp(start[0],destination[0],l/arcSegments),lerp(start[1],destination[1],l/arcSegments)]
    
            var waypointElevation = Math.sin(Math.PI*l/arcSegments) * maxElevation;
            
            waypoint.push(waypointElevation);
            line.push(waypoint);
        }
        return line
    }

    const joinTrajet = async ()=>{
        setOpenedPopup(true)
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        }

        try {
            const response = await axios.put(`/addTrajet/${currTrajet._id}`,undefined,{headers})

            if(response.data.error){
                setInfo(response.data.error)
            } else {
                setInfo("Trajet Ajouté Avec Succée, Contactez Le Conducteur Pour Plus D'information")
            }
         
            
        } catch (error) {
            console.log(error)
        }

    }

    const trajetsLayer = (trajets)=>(
        {
            id: `lines for ${currSchool} ${Math.random()}`,
            type: 'custom',
            renderingMode: '3d',
            onAdd: function (map, mbxContext) {
                let options = {
                    type: 'gltf', 
                    obj: model, //model url
                    units: 'meters', //units in the default values are always in meters
                    scale: 13,
                    rotation: { x: 90, y: 180, z: 0 }, //default rotation
                    anchor: 'center',
                    // enableTooltips:true
                }
                const arr = generateArr(trajets)
                arr.forEach((cube, i) => {
                    const lat = trajets[i].depart[0]
                    const long = trajets[i].depart[1]
    
                    cube.setCoords([long, lat]);
                    
                    cube.rotation.x =  -Math.PI/2
                     cube.position.z +=2
                    cube.position.x -=0.42
                    cube.position.y +=0.06
               
                    window.tb.add(cube);
                    window.tb.loadObj(options, function (model) {
                        
    
    
                        model.setCoords([long,lat]);
                       
                        model.castShadow = true
                        window.tb.world.add(model);
                    }); //
                })
                trajets.forEach((trajet)=>{
                    const singleLine = drawLine(trajet.depart.reverse(),trajet.destination.coordinate.reverse())
                    const lineMesh= window.tb.line({
                         geometry: singleLine,
                         color: 'rgb(192, 43, 43)',
                         width: 3
                     })
                     lineMesh.name = trajet._id
                     window.tb.world.add(lineMesh)
                 })
            },
    
            render: function (gl, matrix) {
                window.tb.update();
            }
          }
    )

    const searchTrajet = async ()=>{
        setLoading(true)
        try {
          const searchResult = await axios.get(`/trajets/${currSchool}`)
           setTrajets(searchResult.data)
          
            state.map.addLayer(trajetsLayer(searchResult.data))              

          setLoading(false);
        } catch (error) {
          console.log(error);
        }
    }

    const handleTrajetClick = async (id)=>{
        // gsap.to(selectedTrajet.current,{x:'-110%' ,duration:0.9})
        window.tb.world.children.forEach((mesh)=>{
            if(mesh.name!=id && mesh.type=="Line2"){
                // mesh.visible = false
                mesh.material.opacity = 0.1
            }
        })
        gsap.to(allTrajets.current,{x:'-50%' ,duration:0.8})

       
        setLoading(true)
        try {
          const searchResult = await axios.get(`/singleTrajet/${id}`)
          setCurrTrajet(searchResult.data)
          state.map.flyTo({
            center: searchResult.data.depart.reverse(),
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom:17.7,
           
        });
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
       
    }

    const returnToAllTrajets = ()=>{
        state.map.flyTo({
            center: currTrajet.destination.coordinate.reverse(),
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
            zoom: 15.4
        });
        window.tb.world.children.forEach((mesh)=>{
            if(mesh.type=="Line2"){
                mesh.material.opacity = 1
            }
        })
        gsap.to(allTrajets.current,{x:'0%' ,duration:0.8})
    }
    const closePopup = ()=>{
        container.current.style.display = 'none'
    }

    useEffect(()=>{
        // gsap.from(container.current,{scale:0,opacity:.6})
        container.current.style.display = 'initial'
        searchTrajet()
    },[currSchool])

    useEffect(() => {
        if(state.user){
            setIsSigned(true)
        }
    }, [])

    return (
        <div ref={container} className='trajetsContainer'>
            <Popup opened={openedPopup} setOpened={setOpenedPopup}>
               { isSigned ? <div className='added' > {info.includes('Erreur') ?  <span className='errorP'> {info} </span> : <span className="successP">{info}</span> } </div> : <div className="register">
                   <div className="connect">
                   Vous Devez Vous <Link to='/login' >Connectez</Link> Pour Rejoindre Un Trajet
                   </div>
                   <div className="signup">
                   Vous n'avez pas un compte? <Link to='/signup'> Creez-en-un </Link>
                   </div>
               </div>}
            </Popup>
            <div ref={allTrajets} className="wrapper">
            <div  className="allTrajetss">
                <div className="trajets__title">
                    Tous Les Trajets Vers: {name.toUpperCase()}
                    <div className="x" onClick={closePopup} >X</div>
                </div>
                <div className="allTrajets">
                  { !loading ? trajets.length >0 ? trajets.map((trajet)=>(
                    <div key={trajet._id} className="oneTrajet">
                        <div onClick={()=> handleTrajetClick(trajet._id)} className="trajet__info">
                            <div className="trajet__info-one">
                                <LocalisationIcon />
                                {trajet.adresseDepart ? trajet.adresseDepart : 'Indefini'}
                            </div>
                            <div className="trajet__info-one">
                                <DateIcon />
                                {trajet.dateStr}
                            </div>
                            <div className="trajet__info-one">
                                <DollarIcon />
                                {trajet.prix ? trajet.prix + " Dh" : 'Gratuit'}
                            </div>
                        </div>
                        <div className="arrow">
                            <BigArrow />
                        </div>
                    </div>
                  )) :  <div className='noResult' >Pas de resultat (•_•) </div> : <div className="loading">
                       <strong>Chargement...</strong> 
                  </div>  }
                </div>
            </div>
            <div className="selectedTrajet">
              { currTrajet && <> <div className="selectedTrajet__title">
                 <div onClick={returnToAllTrajets} className="arrowContainer"> <BigArrow /> </div> DETAIL DU TRAJET
              </div>
              <div className="trajet__info">
                  <AccountIcon /> {currTrajet.conducteur.name}
              </div>
              <div className="trajet__info">
                  <PhoneIcon /> {currTrajet.conducteur.phone}
              </div>
              <div className="trajet__info">
                  <LocalisationIcon /> {currTrajet.adresseDepart}
              </div>
              <div className="trajet__info">
                  <DateIcon /> {currTrajet.dateStr}
              </div>
              <div className="trajet__info">
                  <DollarIcon /> {currTrajet.prix ? currTrajet.prix : "Gratuit"}
              </div>
              <div className="trajet__info">
                  Nombre Maximale: {currTrajet.nombreMax}
              </div>
              <div className="btnContainer">
              <div onClick={joinTrajet} className="btn">
                  Rejoinder Le Trajet
              </div>
              </div> </>}
              
                </div>
            </div>
        </div>
        
    )
}
function lerp(value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
}

export default Trajets
