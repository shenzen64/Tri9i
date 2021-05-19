import React, { useState } from 'react'
import axios from '../axios'
import Datetime from 'react-datetime';
import { DateIcon, DeleteIcon, DollarIcon, InfoIcon, LineTo, LocalisationIcon, MaxIcon, MoreInfoIcon, PhoneIcon, UnivIcon } from '../Svg'
import Popup from './Popup'
import moment from 'moment';

const SingleTrajet = ({info,canEdit}) => {
    
    const [opened,setOpened] = useState(false)
    const [getInfo, setGetInfo] = useState(false)
    const [deleteTr ,setDeleteTr] = useState(false)
    const [trajetInfo,setTrajetInfo] = useState({})
    const [date,setDate]= useState("")
    const [prix,setPrix] = useState('')
    const [max,setMax] = useState('')
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [deleted,setDeleted] = useState(false)

        // disable past dates
        const yesterday = moment().subtract(1, 'day');
        const disablePastDt = current => {
        return current.isAfter(yesterday);
        };

    const getTrajetInfo = async ()=>{
        if(trajetInfo._id) return
        try {
            const myTr = await axios.get(`/singleTrajet/${info._id}`)
            setTrajetInfo(myTr.data)
            setMax(myTr.data.nombreMax)
            setDate(myTr.data.date)
            if(!myTr.data.prix){
                setPrix('0')
            } else{
            setPrix(myTr.data.prix)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateTrajet = async (e)=>{
        e.preventDefault()
        if(!max){
            setSuccess('')
            return setError("Veillez Entrer Le Nombre Maximal De Passagers")
        }

        const data = {
            nombreMax:max,
            prix: prix ? prix : undefined,
            date
        }

        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        }

        try {
            
            const response = await axios.patch(`/updateTrajet/${info._id}`,data,{headers})

            setError('')
            setSuccess("Trajet Mis A Jour Avec Succée")

        } catch (error) {
            console.log(error)
        }

    }

    const deleteTrajet = async ()=> {
        

        const headers = {
            // "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        }

        try {
            if(canEdit){
                await axios.delete(`/deleteTrajet/${info._id}`,{headers})
            }
            else {
                await axios.put(`/deleteFromTrajet/${info._id}`,undefined,{headers})
            }
            setOpened(false)
            setDeleted(true)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div style={{display:`${deleted ? 'none' : 'block'}`}} className='singleTrajet'>
            
            <div className="singleTrajet__container">
                <div className="lineTo">
                    <LineTo />
                </div>
                <div className="singleTrajet__info">
                    <div className="depart"> {info.adresseDepart}</div>
                    <div className="destination"> {info.destination.surnom} </div>
                </div>
                <div className="singleTrajet__actions">
                 <div
                onClick={()=>{
                    setOpened(true)
                    setDeleteTr(false)
                    setGetInfo(true)
                    getTrajetInfo()
                }}
                className="learnMore">
                  { canEdit?  <InfoIcon /> : <MoreInfoIcon/> }
                </div>
                <div onClick={()=>{
                    setOpened(true)
                    setGetInfo(false)
                    setDeleteTr(true)
                }} className="deleteIcon">
                    <DeleteIcon />
                </div>
                </div>
                
            </div>
            {opened && <Popup opened={opened} setOpened={setOpened} >
                { deleteTr && <div className='deleteTr'> 
                <p> {canEdit ? "Voulez Vous Vraiment Supprimer Ce Trajet?" : "Etes-Vous Sur De Ne Plus Rejoindre Ce Trajet?"} </p>
                <button
                onClick={deleteTrajet}
                className='yes' > Oui </button>
                <button
                onClick={()=>setOpened(false)}
                className='no'> Annuler </button>    
                 </div> }
                { getInfo && <div className='trajet__info'>
                    {trajetInfo._id && <> 
                    <div className='iconWithInfo'>
                    <LocalisationIcon />    {trajetInfo.adresseDepart}
                    </div>
                    <div className='iconWithInfo'>
                        <UnivIcon/>
                        {info.destination.surnom}
                    </div>
                    { canEdit ? <form onSubmit={updateTrajet} >
                    <div className="inputWithIcon biggerSvg">
                        <Datetime
                        initialValue={moment(trajetInfo.date)}
                        dateFormat="DD/MM/YYYY à"
                        timeFormat="HH:mm"
                        onChange={(e)=>setDate(e._d)}
                        isValidDate={disablePastDt}
                        />  
                            <DateIcon />
                        </div>
                        <div className="inputWithIcon biggerSvg">
                            <input 
                            value={prix} onChange={(e)=>setPrix(e.target.value.replace(/[^0-9.]/g, ""))} min={0} step={0.5}
                            type="number" />
                            <DollarIcon />
                        </div>
                        <div className="inputWithIcon">
                            <input 
                            value={max} onChange={(e)=>setMax(e.target.value.replace(/[^0-9]/g, ""))} min={0} step={1}
                            type="number" />
                            <MaxIcon />
                        </div>
                        <div className="form__info">
                            {error && <div className="error"> {error} </div> }
                            {success && <div className="success"> {success} </div> }
                        </div>
                       
                        <button type="submit" className="updateSubmit">
                            Mettre A Jour
                        </button>
                        
                    </form> : <> 
                    <div className='iconWithInfo'>
                    <MaxIcon />    {trajetInfo.nombreMax}
                    </div>
                    <div className='iconWithInfo'>
                        <DollarIcon/>
                        {trajetInfo.prix}
                    </div>
                    <div className='iconWithInfo'>
                        <DateIcon/>
                        {trajetInfo.dateStr}
                    </div>
                    </>}
                    </>
                    }
                </div> }
            </Popup>}
        </div>
    )
}

export default SingleTrajet
