import React, { useEffect, useRef, useState } from 'react'
import SingleTrajet from './SingleTrajet'

const Card = ({info,title,Icon,canEdit}) => {
    const [seeMore, setSeeMore] = useState(false)
    const [numberOfTrajets,setNumberOfTrajets] = useState(0)
    const card = useRef()

    useEffect(() => {
        if(seeMore){
            card.current.style.height = 'auto'
        } else {
            card.current.style.height = '300px'
        }
    }, [seeMore])

    // useEffect(() => {
    //     setNumberOfTrajets(info.length)
    // }, [])

    // useEffect(() => {
       
    //   console.log(numberOfTrajets)
    // }, [numberOfTrajets])

    return (
        <div ref={card} className='card'>
            <div className="card__title">
                <div className="card__icon">
                    <Icon />
                </div>
                <div className="card__name">
                    {title}
                </div>
            </div>
            <div className="singleTrajets">
                { info.length > 0 ? info.map((trajet)=>(
                    <SingleTrajet setNumberOfTrajets={setNumberOfTrajets} canEdit={canEdit} key={trajet._id} info={trajet} />
                )) : <div className="aucunTrajet">
                    Aucun Trajet
                </div> }
            </div>
            { info.length > 2 && <div className="seeMoreContainer">
                <div onClick={()=>setSeeMore(!seeMore)} className="voirPlus">{ seeMore ? "Voir Moins" :  "Voir Tous Les Trajets"}</div>
                
            </div>}
        </div>
    )
}

export default Card
