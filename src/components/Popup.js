import React from 'react'

const Popup = ({children, opened, setOpened }) => {
    return (
        <>
       { opened && <div className='popupContainer'>
            <div className="popup">
                <div onClick={()=>setOpened(false)} className="x pop">X</div>
            {children}
            </div>
        </div>}
        </>
    )
}

export default Popup
