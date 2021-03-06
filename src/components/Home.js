import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Sketch from '../utils/Sketch'
import StaggerText from './StaggerText'
import { Elipse } from '../Svg'
import { useInView } from 'react-intersection-observer'
import axios from '../axios'


gsap.registerPlugin(ScrollTrigger)

const Home = () => {

    const [sketch, setSketch] = useState()
    const [ref, inView, entry] = useInView();

    const canvas = useRef()
    const svg = useRef()
    const svg2 = useRef()
    const main = useRef()
    const introText = useRef()



    useEffect(() => {

     

        const paths = [...svg.current.querySelectorAll('path')]
        const paths2 = [...svg2.current.querySelectorAll('path')]

        const sk = new Sketch(canvas, paths, paths2)

        setSketch(sk)

    }, [])

    useEffect(() => {
        if(sketch)
        sketch.transition()
    }, [inView])


    return (
        <div>
            <div ref={main} className="hero">
                <main className="intro__container">
                    <div ref={introText}>
                       <StaggerText text='Partager votre trajet quotidien | avec d’autre écolier! ' />
                    </div>
                </main>
                <div  className="info__container">
                    <div ref={ref} className="hero__info">
                        <h3>Simple A Utiliser</h3>
                        <p> interface simple et épuré pour trouver vite votre prochain depart </p>
                        <div className="lancer__container">
                            <div className="elipse">
                                <Elipse />
                                {">"}
                            </div>
                           <div> <Link to='/map' > Lancer La Map </Link> </div> 
                        </div>
                    </div>
                </div>

                <div  className="info__container" style={{justifyContent:"flex-end"}} >
                    <div  className="hero__info">
                        <h3>Gratuit</h3>
                        <p> l’outil est gratuit pour les passagers, prix du trajet a regler directement avec le conducteur </p>
                        <div className="lancer__container">
                            <div className="elipse">
                                <Elipse />
                                {">"}
                            </div>
                            <div> <Link to='/map' > Lancer La Map </Link> </div> 
                        </div>
                    </div>
                </div>

                <div  className="info__container">
                    <div className="hero__info">
                        <h3>Parter En Sécurité</h3>
                        <p> CIN obligatoire pour les membres  </p>
                        <div className="lancer__container">
                            <div className="elipse">
                                <Elipse />
                                {">"}
                            </div>
                            <div> <Link to='/map' > Lancer La Map </Link> </div> 
                        </div>
                    </div>
                </div>
                
                <canvas ref={canvas}></canvas>
                <svg ref={svg} width="1362" height="662" viewBox="0 0 1362 662" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M451 82.5L249.5 144L-2 216.5L73.5 272L26 398.5L181.5 383L269.5 412L320 420L280 287.5L426.5 306L462 461.5L577.5 486L603.5 398.5L588.5 315V272L620.5 199.5L650 158L603.5 121L451 82.5Z" fill="black" />
                    <path d="M411 191.5L252 142L283 299.5H428L411 191.5Z" fill="black" />
                    <path d="M919.5 410.5L995 326L1053.5 304.5L1100 230.5L1362 447.5L1294 578.5L1255.5 598.5L1044.5 655.5L821 632.5L727 558.5L919.5 410.5Z" fill="black" />
                    <path d="M696 64L705.5 2H902.5L727 53L801 111.5L884 179.5L1107.5 227L1044.5 306L992 327.5L657.5 153L696 64Z" fill="black" />
                    <path d="M708.5 560L537.5 665H493L511.5 594L579 490.5L602 387.5L587 312L902.5 426L708.5 560Z" fill="black" />
                    <path d="M180.5 385.5H47L180.5 396.5V405L163.5 427.5L120 530.5L279 616L357.5 661L432 654H482.5L460 463L432 299.5H290L319.5 416.5L180.5 385.5Z" fill="black" />
                    <path d="M771 223.5L817.5 240.5L990.416 323.051L901.5 416.5L743 358.5L581 311L429 301L414 197V101.5L451.5 83L543 114L610.5 125.5L653 155L710.5 197L771 223.5Z" fill="black" />
                    <path d="M250.5 139.5L176 0H141L118.5 29.5L100 34L93 29.5C89.8333 25.8333 80.4 18.5 68 18.5L42.5 52V60.5L48 66L9 212.5H25.5L166.5 166L207 149L250.5 139.5Z" fill="black" />
                </svg>
                <svg ref={svg2} width="1361" height="663" viewBox="0 0 1361 663" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M452.979 498.385V491.59L456.667 486.494C470.93 491.873 510.228 504.501 553.312 511.975H604.261L592.412 546.799L579.185 565.485L561.427 579.924L527.491 602.008L463.307 615.598L430.109 569.732L419.78 565.485L414.616 561.238H406.501L399.861 565.485L387.32 574.828L376.253 579.924L362.236 584.171H354.859L348.219 574.828L340.842 561.238L344.531 546.799L348.219 532.36L354.859 511.975L358.548 502.632L362.236 498.385L379.942 486.494H387.32H399.861H406.501L419.78 491.59L424.207 502.632L430.109 511.975H435.273L441.913 507.728L448.552 502.632L452.979 498.385Z" fill="#C4C4C4"/>
                    <path d="M386.482 468.313C416.994 489.41 545.655 507.061 606.171 517.5L616.851 502.101L626.005 468.313L635.159 427.107C638.973 417.218 647.211 396.945 649.652 394.967C652.093 392.99 650.669 385.353 649.652 381.782V373.541L626.005 369.42L606.171 365.3H593.204L567.269 360.355L552.012 356.235L535.993 352.114L489.462 341.401L442.167 337.28L438.353 318.326L429.2 312.557L421.572 300.195L415.469 287.834C414.198 282.889 410.74 273 407.078 273H402.501L393.348 287.834L386.482 300.195H375.803H368.937L347.579 305.14L314.777 318.326L285 328L240.785 352.114L218.663 365.3L138.122 352.114C134.562 352.114 210.12 375.189 218.663 381.782C227.207 388.375 236.971 393.319 240.785 394.967L314.777 431.228C325.965 434.799 355.969 447.216 386.482 468.313Z" fill="#C4C4C4"/>
                    <path d="M365.732 716.936C368.099 717.612 369.459 719 363.713 719H356.436H352.798L356.436 707.644L350.199 685.529L346.56 672.977L333.566 597.667L329.928 570.77L330.967 556.425L335.645 536.701C340.15 526.341 349.887 504.306 352.798 499.046C355.709 493.786 368.218 470.157 374.108 459L452.075 488.885V499.046L443.758 505.621H438.041L430.764 501.437L424.007 495.46L419.849 488.885L412.052 485.896L407.374 484.701L401.137 483.506H385.024L379.306 485.896L369.95 492.471L363.713 501.437L356.436 512.195L352.798 522.356L346.56 545.667C345.174 548.655 342.402 555.349 342.402 558.218V568.977L352.798 581.529L363.713 586.31C365.272 585.314 369.534 582.963 374.108 581.529C378.682 580.094 383.291 578.54 385.024 577.942L398.538 568.977L405.815 562.402H415.171L424.007 568.977L432.843 574.356L463.51 614.402L415.171 668.195L383.984 707.644L368.391 714.218L366.052 716.609L365.732 716.936Z" fill="#C4C4C4"/>
                    <path d="M683.893 265.942L752.5 -2.5H641L592.413 125.482L570.063 147.597L541.995 174.494L434.402 251L411.532 270.126L396.458 277.896C392.127 284.471 381.801 297.262 375.148 295.827V265.942L379.306 227.092L388.142 200.793L407.374 186.448L416.73 166.724L407.374 152.379L375.148 157.758L320.571 174.494L259.238 186.448L220.775 200.793L192.187 222.908L165.679 256.379L138.13 287.459C136.883 314.237 144.888 332.885 149.046 338.862L203.102 375.322L444.277 479.322C467.667 486.893 524.426 503.588 564.345 509.804C604.263 516.021 609.392 512.394 606.966 509.804L653.746 383.092L683.893 316.747V265.942Z" fill="#C4C4C4"/>
                    <path d="M1070.25 412.779L1109.96 368.612H1065.66L1025.95 377.348L979.146 392.394L939.86 406.955L905.59 421.03L868.394 433.65L745.521 479.273V490.922L757.224 552.077H768.508L780.628 556.93L792.33 552.077H805.704C807.71 552.077 814.062 564.373 816.988 570.52L829.108 593.332L850.005 622.939L881.349 590.42V587.023L873.409 545.282V521.985V504.026L918.545 490.922V556.93L999.624 504.026L1030.55 467.139L1065.66 412.779H1070.25Z" fill="#C4C4C4"/>
                    <path d="M122.5 334L102.5 341.5L98.5001 346L80.5001 370L61.9996 406.5L42.0001 446.5L28.5001 471L18.5001 497.5V532.5L12.9996 556C16.6663 555.167 7.79984 564.3 -1.00017 573.5C-9.80017 582.7 9.33296 574.5 12.9996 573.5L61.9996 656.5L324 565L333.5 541.5L361.5 478.5C364.333 477.833 368.3 472 361.5 454L348 446.5L295 421L231 397L199 381.5L160 355L122.5 334Z" fill="#C4C4C4"/>
                    <path d="M1337.5 330.5V343L1171 371.5L1168.5 359.5L1157 338.5L1123.5 273L1101 242.5L1085 200.5L1074 188V181L1026 124.5L993 96L978.5 34L1026 15L1039.5 46.5L1128.5 15V-0.5L1307 3.5V22L1314 55L1322 66L1307 161.5L1314 194.5L1322 215.5L1327.5 230.5L1361 277.5V288L1337.5 330.5Z" fill="#C4C4C4"/>
                    <path d="M1266.27 543.34L1281.31 534.604V491.893L1252.89 458.403L1236.17 449.181L1073.18 421.03L995.864 517.617L958.25 542.37L954.906 545.767L978.31 594.788L958.25 604.01L931.92 559.843L921.89 563.725L849.169 627.307L836.631 638.956L828.273 654.487L808.63 684.579L836.631 699.625L849.169 705.45H855.02L1001.71 634.102L1035.99 604.01L1048.52 594.788L1073.18 571.977L1094.08 556.445L1184.35 516.646L1262.09 543.34H1266.27Z" fill="#C4C4C4"/>
                </svg>



            </div>
        </div>
    )
}

export default Home
