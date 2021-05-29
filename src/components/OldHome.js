import gsap  from 'gsap'
import { Power2 } from 'gsap/gsap-core'
import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import LocomotiveScroll from 'locomotive-scroll'
import "../../node_modules/locomotive-scroll/src/locomotive-scroll.scss"
import { HomeIcon, School, SearchMap } from "../Svg";
import StaggerText from './StaggerText'
import { useInView } from 'react-intersection-observer'
import Croix from './Croix'
import ButtonCtrl from '../utils/Button';

const Home = () => {
    
    const home = useRef(null)
    const road = useRef(null)
    const text = useRef(null)
    const iconHome = useRef(null)
    const iconSearch = useRef(null)
    const infoContainer = useRef(null)
    const btn = useRef(null)
    const [ref, inView, entry] = useInView();
    
    const elements = []




    useEffect(()=>{
        const button = new ButtonCtrl(btn.current);
        const scroll =  new LocomotiveScroll({
            el: home.current,
            smooth: true,
            direction:'horizontal'
        })
        

        const tl = gsap.timeline({defaults:{
            duration:1.5,
            ease: Power2.easeInOut
        }})
        tl.to(iconSearch.current,{rotation:"120_cw",opacity:0})
        .from(iconHome.current,{rotate:"120_ccw", opacity:0},("-=1.3"))
       setTimeout(()=>{
        scroll.scrollTo(infoContainer.current)
       // setPlay(true)
       },2000)
       // if(inView) setPlay(true)
        tl.from(road.current,{width:0})
        .to(elements,{width:0 , stagger:0.2})
     
    },[])
    
    return (
        <>
        <div ref={home} data-scroll-container className='home scroll-container'>
           
            
            <div className="hero">
                
               
                <div ref={text} className='text'>
                    <StaggerText text="Partager votre trajet | quotidien avec d’autre | écolier!" />
                </div>
                <div ref={iconHome} className="home__icon">
                    <HomeIcon />
                </div>
                <div ref={iconSearch} className="search__icon">
                    <SearchMap />    
                </div> 
                
            
            </div>
            <div className="info">
                {/* <Croix top={"0px"} left={"100px"} /> */}
                
                <div className="reveal__container">
                {["","","","",""].map((elemnt,i)=>(
                    <div key={i} className='reveal'>
                        <div ref={(el)=> elements[i]=el}>
                           
                        </div>
                    </div>
                ))}
                </div>

                <div ref={infoContainer} className="info__container">
                    <div ref={ref} className="info__one">
                       <div className="info__title">  <StaggerText  text="Simple A Utiliser" />  </div>
                      <div className="info__desc">  <StaggerText text="interface simple et | épuré pour trouver | vite son prochain | depart" /> </div> 
                    </div>
                    
                    <div className="info__one">
                        <div className="info__title">  <StaggerText  text="Gratuit" />  </div>
                      <div className="info__desc">  <StaggerText  text="l’outil est gratuit pour les | passagers, prix du trajet a | regler directement avec le | conducteur" /> </div> 
                    
                    </div>

                    <div className="info__one">
                        <div className="info__title">  <StaggerText  text="Parter en sécurité " />  </div>
                      <div className="info__desc">  <StaggerText text="CIN obligatoire pour tous | les membres" /> </div> 
                    
                    </div>

                </div>
                <div className="btn__container">
                <button ref={btn} className="btn">
					<span className="button__text">
						<span className="button__text-inner"> <Link to='/map'>Lancer</Link></span>
					</span>
				</button>
                </div>
                
                <div className="road">
                    <svg ref={road} width="2336" height="46" viewBox="0 0 2336 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2334.15 25.1213C2335.32 23.9497 2335.32 22.0503 2334.15 20.8787L2315.06 1.7868C2313.89 0.615224 2311.99 0.615224 2310.82 1.7868C2309.65 2.95837 2309.65 4.85786 2310.82 6.02944L2327.79 23L2310.82 39.9706C2309.65 41.1421 2309.65 43.0416 2310.82 44.2132C2311.99 45.3848 2313.89 45.3848 2315.06 44.2132L2334.15 25.1213ZM2298.97 26H2332.03V20H2298.97V26Z" fill="#1A1A1A"/>
                        <line y1="23" x2="2315" y2="23" stroke="#1A1A1A" strokeWidth="6"/>
                    </svg>
                </div>
                <div className="school">
                    <School />
                </div>
            </div>
            
        </div>
        </>
    )
}

export default Home
