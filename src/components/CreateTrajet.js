import React, { useEffect, useRef, useState } from 'react'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import moment from 'moment'
import Checkbox from './Checkbox';
import Map from './Map';
import SearchBox from './SearchBox';
import "moment/locale/fr-ca"
import axios from '../axios';
import { useStateValue } from '../context/StateProvider';
import { useHistory } from 'react-router';
moment().locale("fr-ca")


String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

const week = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]

function cleanRecurssif (str){
    const firstChar = str[0]
    let finalStr = firstChar
    for(let i=1 ;i <str.length ; i++){
        if(str[i]==firstChar){
            break
        }
    finalStr += str[i]
    }
    return finalStr
}


const CreateTrajet = () => {

    const [coords,setCoords] = useState({})
    const [adresse, setAdresse] = useState('')
    const [destination, setDestination] = useState('')
    const [date, setDate] = useState(new Date())
    const [max, setMax] = useState("")
    const [prix, setPrix] = useState("")
    const [isRecurssif,setIsRecurssif] = useState(false)
    const [str,setStr] = useState('')
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [state, dispatch] = useStateValue();
    const history = useHistory()

    const rond = useRef()
    const info = useRef()

    // disable past dates
    const yesterday = moment().subtract(1, 'day');
    const disablePastDt = current => {
    return current.isAfter(yesterday);
    };



    const handleSubmit = async ()=>{
        if(!coords.latitude){
            setSuccess('')
            info.current.scrollIntoView({behavior: 'smooth'})
            return setError("Veillez Entrer La Position De Départ Sur La Map")
        }
        if(adresse.length < 5){
            setSuccess('')
            info.current.scrollIntoView({behavior: 'smooth'})
            return setError("L'Adresse De Départ Doit Contenir Au Moins 5 Caractères")
        }
        if(!destination){
            setSuccess('')
            info.current.scrollIntoView({behavior: 'smooth'})
            return setError("Veillez Entrer L'école De Destination")
        }
        if(!max){
            setSuccess('')
            info.current.scrollIntoView({behavior: 'smooth'})
            return setError("Veillez Entrer Le Nombre Maximal De Passagers")
        }

        const data = {
            nombreMax:max,
            destination,
            prix: prix ? prix : undefined,
            depart: [coords.latitude,coords.longitude],
            adresseDepart:adresse,
            recurssif : isRecurssif ? cleanRecurssif(str) : "",
            date
        }

        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        }

        try {
            const response = await axios.post('/createTrajet',data,{headers})

            setError('')
            setSuccess("Trajet Ajoutée Avec Succée")
            setCoords({})
            setAdresse("")
            setDestination('')
            setMax("")
            info.current.scrollIntoView({behavior: 'smooth'})
            
        } catch (error) {
            console.log(error)
        }

    }
    
    useEffect(() => {
        if(isRecurssif){
            rond.current.style.transform = 'translateX(100%)'
            rond.current.style.background = '#AE5D5E'
        } else {
            rond.current.style.transform = 'none'
            rond.current.style.background = '#F0F0F0'
        }
    }, [isRecurssif])


    useEffect(() => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          dispatch({ type: "SET_USER", user });
        } else {
          history.push("/login");
        }
      } catch (error) {
        history.push("/login");
      }
    }, []);

    return (
        <div className='creer'>
            <div className="creer__title">
                Creer Un Trajet
            </div>
            <div className="creer__label">
              Definnissez le lieu de départ:
            </div>
            {coords.latitude && <div className="creer__coords">
            Cordoonnées Ajoutées  <span> (Lat : {coords.latitude}, Long: {coords.longitude}) </span>
            </div>}
            <div className="creer__map--container">
                <div className="creer__map">
                    <Map setCoordinates={setCoords} small={true}/>
                </div>
            </div>
            <div className="creer__label">
             Definnissez l’adresse de départ:
            </div>
            <div className="creer__input">
                <input  value={adresse} onChange={(e)=>setAdresse(e.target.value)}  type="text" id='small' placeholder='exemple: 28 résidence el ferdaous, ain borja, Casa'/>
            </div>
            <div className="creer__label">
             Definnissez la destination:
            </div>
            <div className="search__input">
                <SearchBox setDestination={setDestination} small={true} />
            </div>
            <div className="creer__label">
             Definnissez La Date De Départ:
            </div>
            <div className="creer__input">
              <Datetime
              initialValue={moment()}
              dateFormat="DD/MM/YYYY à"
              timeFormat="HH:mm"
              onChange={(e)=>setDate(e._d)}
              isValidDate={disablePastDt}
              />     
            </div>
            <div className="creer__label">
             Determinez le nombre maximal de passagers:
            </div>
            <div className="creer__input">
                <input value={max} onChange={(e)=>setMax(e.target.value.replace(/[^0-9]/g, ""))} min={0} step={1} type="number"  placeholder='exemple: 4'/>
            </div>
            <div className="creer__label">
             Determinez le prix du trajet <span> (Laisser cette case vide si le trajet est gratuit)</span>:
            </div>
            <div className="creer__input">
                <input value={prix} onChange={(e)=>setPrix(e.target.value.replace(/[^0-9.]/g, ""))} min={0} step={0.5} type="number"  placeholder='exemple: 12dh'/>
            </div>
            <div className="recurssif__title">
                <div className="creer__label">Trajet Recurssif</div>
                <div onClick={()=>setIsRecurssif(!isRecurssif)} className="enableToggle">
                    <div ref={rond} className="rond"></div>
                </div>
            </div>
            <div className="recurssif" style={{opacity:`${isRecurssif ? 1 : 0.4}`, pointerEvents: `${isRecurssif ? 'all' : 'none'}`}}>
                Chaque:
                {week.map((day)=>(
                    <div key={day} className='dayContainer'>
                        <div className="day"> {day} </div>
                        <Checkbox 
                        active={day==moment(date).format("dddd").capitalize()}
                        day={day} setStr={setStr} />
                    </div>
                ))}
            </div>
            <div className="submit__container">
                <div onClick={handleSubmit} className="submit">
                    Ajouter Le Trajet
                </div>
            </div>
            <div ref={info} className="form__info creer">
                        {error && <div className="error">{error}</div>}
                        {success && <div className="success">{success}</div>}
             </div>

        </div>
    )
}

export default CreateTrajet
