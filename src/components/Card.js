import React from 'react'
import SingleTrajet from './SingleTrajet'

const Card = ({info,title,Icon,canEdit}) => {
    return (
        <div className='card'>
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
                    <SingleTrajet canEdit={canEdit} key={trajet._id} info={trajet} />
                )) : <div className="aucunTrajet">
                    Aucun Trajet
                </div> }
            </div>
        </div>
    )
}

export default Card
