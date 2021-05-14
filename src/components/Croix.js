import React from 'react'

const Croix = ({top,left,deg}) => {
    return (
        <div style={{top,left,transform: `rotate(${deg}deg)`}} className='croix'>
            <svg width="66" height="66" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="32.5" x2="32.5" y2="66" stroke="black" stroke-width="5"/>
            <line x1="66" y1="35.5" y2="35.5" stroke="black" stroke-width="5"/>
            </svg>
        </div>
    )
}

export default Croix
