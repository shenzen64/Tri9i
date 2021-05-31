import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../static/images/logo.png'
import gsap from 'gsap'
import { useStateValue } from '../context/StateProvider'

import creer from '../static/images/creer.png'
import home from '../static/images/home.png'
import login from '../static/images/login.png'
import map from '../static/images/map.png'
import profil from '../static/images/profil.png'
import signin from '../static/images/signin.png'


const Header = () => {

    const [opened,setOpened] = useState(false)
    const [initTl,setTl] = useState(null)
    
    const [state,dispatch] = useStateValue()
    
    const line1 = useRef()
    const line2 = useRef()
    const menu = useRef()
    const img = useRef()
    const imgContainer = useRef()
    const nav = useRef()
    
    
    const elements = []
   
    
    const tl = gsap.timeline({defaults : {
        ease: 'Power2.easeOut',
        duration:.8,
        // paused: true
    }})
    

    useEffect(() => {
     

        if(opened){
            nav.current.style.pointerEvents='all'
            tl.to(line1.current , { rotate:45, y:7.5 } )
            tl.to(line2.current , { rotate: -45, y : -7.5 }, "-=1" )
            tl.to(menu.current, {duration:1.5 ,clipPath: "circle(2500px at 100% -10%)" },0)
            // tl.to(elements, { y:0 , opacity:1 , stagger:0.3 } )

        } else {
            nav.current.style.pointerEvents='none'
            tl.to(line1.current , { rotate:0, y:0 } )
            tl.to(line2.current , { rotate: 0, y : 0 }, "-=1" )
            tl.to(menu.current, {  clipPath: "circle(50px at 100% -10%)" },0)
            tl.from(elements, { y:100 , opacity:0, stagger:0.25 } )

        }

    }, [opened])

    const handleMouseEnter = (src)=>{
        img.current.src = src
        gsap.fromTo(imgContainer.current,{opacity:0,y:300, duration:0.8},{opacity:1,y:0})
    }

    const handleMouseLeave = ()=>{
        gsap.fromTo(imgContainer.current,{opacity:1,y:0, duration:0.8},{opacity:0,y:-300})
    }

    return (
        <div className={`header header__map`}>
                <div style={{pointerEvents:"all"}} className="header__logo">
                  <Link to='/'> <img src={logo} alt="Tri9i logo"/> </Link>  
                </div>
                <div onClick={()=>setOpened(!opened)} className="burger">
                    <div ref={line1} className="line"></div>
                    <div ref={line2} className="line"></div>
                </div>
                <div ref={menu} className="menu">
                    <nav ref={nav}>
                        <li ref={(el)=>elements[0]=el} onMouseLeave={handleMouseLeave} onMouseEnter={()=>handleMouseEnter(home)}  onClick={()=>setOpened(false)}> <Link to="/">ACCUEIL</Link> </li>
                        <li ref={(el)=>elements[1]=el}  onMouseLeave={handleMouseLeave} onMouseEnter={()=>handleMouseEnter(map)}  onClick={()=>setOpened(false)}> <Link to="/map">MAP</Link> </li>
                       { state.user ? <> <li ref={(el)=>elements[2]=el}  onMouseLeave={handleMouseLeave} onMouseEnter={()=>handleMouseEnter(creer)}  onClick={()=>setOpened(false)}> <Link to="/creer">CREER UN TRAJET</Link> </li>
                        <li ref={(el)=>elements[3]=el}   onMouseLeave={handleMouseLeave} onMouseEnter={()=>handleMouseEnter(profil)} onClick={()=>setOpened(false)}> <Link to="/profil">PROFIL</Link> </li> </> : 
                        <> <li ref={(el)=>elements[2]=el}  onMouseLeave={handleMouseLeave} onMouseEnter={()=>handleMouseEnter(login)}  onClick={()=>setOpened(false)}> <Link to="/signup">CREER UN COMPTE</Link> </li>
                        <li ref={(el)=>elements[3]=el}   onMouseLeave={handleMouseLeave} onMouseEnter={()=>handleMouseEnter(signin)} onClick={()=>setOpened(false)}> <Link to="/login">CONNECTEZ-VOUS</Link> </li> </>
                        }
                    </nav>
                    <div ref={imgContainer} className="menu__image">
                        <img ref={img} src={home} alt="IMAGE OF MENU" />
                    </div>
                </div>
        </div>
    )
}

export default Header
