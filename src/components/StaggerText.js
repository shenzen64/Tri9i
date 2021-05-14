import gsap from 'gsap'
import { Power2 } from 'gsap/gsap-core'
import React, { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'


const StaggerText = ({text}) => {
    const elements = []
    const [ref, inView, entry] = useInView();
    

    useEffect(()=>{
          
        const tl = gsap.timeline({paused:true,defaults : {
            duration: 1,
            ease: Power2.easeInOut
        }})
       tl.fromTo(elements,{y:"100%",stagger:0.3},{y:"0%",stagger:0.3})
       if(inView) {
           tl.play()
       }
  
    },[inView])

    return (
        <div ref={ref} >
            {text.split('|').map((el,i)=>(
                        <h2 className='stagger' key={i}>
                            <span ref={(x)=>elements[i]=x}>{el} </span>
                        </h2>
             ))}
        </div>
    )
}

export default StaggerText
