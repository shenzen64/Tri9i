import * as THREE from 'three'
import gsap from 'gsap'
import bgImg from '../static/images/bg.jpg'
import bgImg2 from '../static/images/bg2.jpg'
// import * as dat from 'dat.gui'
// const gui = new dat.GUI()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const vertexShader = `
varying vec2 vUv;
attribute float opacity;
varying float vOpacity;
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);


    // modelPosition += 0.6;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_PointSize = 2000. * (1. / - viewPosition.z);
    gl_Position = projectedPosition;

    vUv = uv;
    vOpacity = opacity;
}
`

const fragmentShader = `

varying vec2 vUv;
varying float vOpacity;

void main()
{
    vec2 uv = vec2(gl_PointCoord.x , 1. - gl_PointCoord.y );
    vec2 cUV = 2. *uv - 1. ; 

    vec3 originalColor = vec3(4./255. , 10./255. ,20./255.);

    vec4 color = vec4(0.08 / length(cUV));

    color.rgb = min(vec3(10.),color.rgb) ;

    color.rgb *= originalColor * 200.;

    color*= vOpacity;

    color.a = min(1.,color.a)*10.;

    float disc = length(cUV);

    color.a = step(0.8,color.a);

    gl_FragColor = vec4(color);
}
`

// PLANE

const planeVertexShader = `

varying vec2 vUv;
uniform float uTransition;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    if(pow(uv.x-0.5 ,2.) + pow(uv.y-0.5 ,2.) < (pow(uTransition,2.))+ 0.005 && pow(uv.x-0.5 ,2.) + pow(uv.y-0.5 ,2.) > (pow(uTransition,2.))- 0.005  ){
        modelPosition += sin(uTransition * uv.x*0.6);
    }

    // modelPosition -= 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}
`

const planeFragmentShader = `

varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uTexture2;
uniform float uTransition;
#define PI 3.1415926538

float random (in vec2 st) {
    return clamp(fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123),0.0,0.15);
}

void main()
{
    float strength= 0.0;
    vec4 basicTexture = texture2D(uTexture,vec2(vUv.x,vUv.y));
    vec4 secondeTexture = texture2D(uTexture2,vec2(vUv.x,vUv.y));

   

    if(pow(vUv.x-0.5 ,2.) + pow(vUv.y-0.5 ,2.)< (pow(uTransition,2.)) ){
        strength = 1.0;
    }


    vec4 finalTexture = mix(basicTexture,secondeTexture,clamp(strength* uTransition*2.,0.0,1.0));

    gl_FragColor = vec4(finalTexture)*vec4(0.,0.,254./255.,1.);
    // gl_FragColor = vec4(finalTexture);
}
`

const imageSize = {
    width:  1366,
    height:  663
}

export default class Sketch {
    constructor(canvas,paths,paths2){
        this.paths = paths
        this.paths2 = paths2
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 100, 10000)
        
        // gui.add(this.camera.position,'x').min(-500).max(600).step(0.1)
        // gui.add(this.camera.position,'y').min(-500).max(600).step(0.1)


        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas.current,
            antialias:true,
        })

      

        this.renderer.setSize(sizes.width, sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.geometry = new THREE.BufferGeometry()
        this.lines = this.getData()

        this.max = this.lines.length * 100 
        this.positions = new Float32Array(this.max*3)
        this.opacity = new Float32Array(this.max)
        this.isTransionDone = false 

        
        for (let i = 0; i < this.max-100; i++) {
            this.opacity.set([Math.random()/2],i)
            this.positions.set([Math.random()*100,Math.random()*100,Math.random()*100],i*3)
            
        }
        

        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions,3))
        this.geometry.setAttribute('opacity', new THREE.BufferAttribute(this.opacity,1))


        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent:true,
            depthTest: true,
            depthWrite:true,
            blending: THREE.AdditiveBlending
        })
        
        this.mesh = new THREE.Points(this.geometry,this.material)
        // this.mesh.position.z -= 0.1
        this.scene.add(this.mesh)




        // BACKGROUND
        this.map = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(imageSize.width,imageSize.height,10,10),
            new THREE.ShaderMaterial({
                color: 'rgb(39, 71, 251)',
                vertexShader: planeVertexShader,
                fragmentShader: planeFragmentShader,
                uniforms: {
                    uTexture: { value: new THREE.TextureLoader().load(bgImg) },
                    uTexture2: { value: new THREE.TextureLoader().load(bgImg2) },
                    uTransition : { value:0 }
                }
            })
        )
        this.scene.add(this.map)

        // gui.add(this.camera.rotation,'x').min(-Math.PI*2).max(Math.PI*2).step(0.001).name('cameraX')
        // gui.add(this.camera.rotation,'y').min(-Math.PI*2).max(Math.PI*2).name('cameraY').step(0.001)
        // gui.add(this.camera.rotation,'z').min(-Math.PI*2).max(Math.PI*2).name('cameraZ').step(0.001)
        // gui.add(this.camera.position,'z').min(-1).max(600).step(0.01).name('zoom')
        // gui.add(this.mesh.position,'z').min(-1).max(600).step(0.01).name('mesh')
        // gui.add(this.map.position,'z').min(-1000).max(1900).step(0.1).name('map')
        

        // gui.add(this.map.position,'z').min(-200).max(500).step(0.1)

       if(!this.isTransionDone) {
        const offsetX = -(sizes.width - imageSize.width)/2
        const offsetY = (sizes.height - imageSize.height)/2

        this.map.position.x = offsetX
        this.map.position.y = offsetY

        this.camera.position.x = offsetX
        this.camera.position.y = offsetY
        
        } 
        else {
            
        const offsetX = -(sizes.width - 1697)/2
        const offsetY = (sizes.height - 814)/2

        this.map.position.x = offsetX
        this.map.position.y = offsetY

        this.camera.position.x = offsetX
        this.camera.position.y = offsetY
        
        }

        this.camera.position.z = sizes.width <750 ?  260 : 430
        this.camera.rotation.y = sizes.width <750 ?  0.583 : 0
        this.scene.add(this.camera)

        window.addEventListener('resize',this.onResize.bind(this))
        this.tick()
        this.scene.rotation.z = Math.PI/3
       
    }

    getData(){
        const lines = []

        const currPath = this.isTransionDone ? this.paths2 : this.paths 

        currPath.forEach((path,j)=>{
            const len = path.getTotalLength()
            const numberOfPoints = Math.floor(len/5)
            
            const points = []

            for (let i = 0; i < numberOfPoints; i++) {
                
                const pointAt = len * i/numberOfPoints
                let p = path.getPointAtLength(pointAt)
                const randX = (Math.random()-0.5)*5
                const randY = (Math.random()-0.5)*5
                points.push(new THREE.Vector3(p.x-sizes.width/2 + randX,-p.y+sizes.height/2 + randY,0))
            }
           lines.push({
                id:j,
                path,
                length:len,
                number:numberOfPoints,
                points,
                currentPos:0,
                speed:1
            })
        })
        return lines
    }

    onResize(){
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    const offsetX = -(sizes.width - imageSize.width)/2
    const offsetY = (sizes.height - imageSize.height)/2
    // QUEL GENIE
    this.map.position.x = offsetX
    this.map.position.y = offsetY

    this.camera.position.x = offsetX
    this.camera.position.y = offsetY
        
    this.camera.position.z = sizes.width <750 ?  260 : 430
    this.camera.rotation.y = sizes.width <750 ?  0.583 : 0

    // Update camera
    this.camera.aspect = sizes.width / sizes.height
    this.camera.updateProjectionMatrix()

    // Update renderer
    this.renderer.setSize(sizes.width, sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    updateParticules(){
        let j =0
        
        this.lines.forEach((line)=>{
            line.currentPos += line.speed

            line.currentPos = line.currentPos %line.number

            for(let i =0; i < 100; i++){
                
                const index = (line.currentPos + i) % line.number
                const p = line.points[index]
                this.positions.set([p.x,p.y,p.z],j*3)
                 this.opacity.set([i/80],j)
                j++
                
            }
        })
        
        
        this.geometry.attributes.position.array = this.positions
        this.geometry.attributes.position.needsUpdate = true
        this.geometry.attributes.opacity.needsUpdate = true
    }

    transition(){
   

        if(!this.isTransionDone)
             gsap.to(this.map.material.uniforms.uTransition,{ value:1.0 , duration:1, ease:'Power3.out'})
        else
             gsap.to(this.map.material.uniforms.uTransition,{ value:0.0 , duration:1, ease:'Power3.in'})
    

        this.isTransionDone = !this.isTransionDone
        
        this.lines = this.getData()
    }

    tick(){
        
            // Render
            this.renderer.render(this.scene, this.camera)
        
            this.updateParticules()
            
            // Call tick again on the next frame
            window.requestAnimationFrame(this.tick.bind(this))
        
    }
}