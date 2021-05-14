import React from 'react'
import logo from '../logo.png'

const Header = () => {
    return (
        <div className='header'>
            <img src={logo} alt="Tri9i logo"/>
            <div className="menu">
                <div>Menu</div>
                <div className="burger">
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
            </div>
        </div>
    )
}

export default Header
