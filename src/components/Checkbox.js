import React, { useEffect, useState } from 'react'
import { CheckIcon } from '../Svg'


const daysShort = ['L','m','M','J','V','S','D']
const week = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]

const Checkbox = ({day,setStr,active=false}) => {
    const [checked,setChecked] = useState(active)
    const [letter,setLetter] = useState(daysShort[week.indexOf(day)])


    useEffect(() => {
        if(active) {
                setStr((str)=>str+letter)
            return
        }

        if(checked){
            setStr((str)=>str+letter)
        } else {
            setStr(str=>str.replace(letter,''))
        }
    }, [checked])

    return (
        <div style={{cursor: `${active ? "not-allowed" : "pointer"}`}}
            onClick={()=>{
            if(active) return
            setChecked(!checked)}
            } 
            className="checkBox">
           { checked && <CheckIcon />}
        </div>
    )
}

export default Checkbox
