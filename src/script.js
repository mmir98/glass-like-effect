import './style.css'
import loadTexture from './utils/loadTexture'
import loadModel from './utils/loadModel'
import RefractionMaterial from "./refraction-material/index.js"
import * as THREE from "three"
import BackfaceMaterial from './backface-material'


class App {
    constructor() {
        this.render = this.render.bind(this)
        this.resize = this.resize.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)

        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
            dpr: Math.min(window.devicePixelRatio, 2 || 1)
        }

        this.velocity = 0.005
        this.pointerDown = false
        this.pointer = {
            x: 0,
            y: 0,
        }

        this.setup()
    }

    addEventListeners(){
        if ("ontouchmove" in window) {
            window.addEventListener("touchstart", this.handleMouseDown)
            window.addEventListener("touchmove", this.handleMouseMove)
            window.addEventListener("touchend", this.handleMouseUp)
        }else{
            window.addEventListener("mousedown", this.handleMouseDown)
            window.addEventListener("mousemove", this.handleMouseMove)
            window.addEventListener("mouseup", this.handleMouseUp)
        }
    }

    async setup() {
        this.createScene()

        this.envFBO = new THREE.WebGLRenderTarget(this.sizes.width * this.sizes.dpr, this.sizes.height * this.sizes.dpr)
        this.backfaceFBO = new THREE.WebGLRenderTarget(this.sizes.width * this.sizes.dpr, this.sizes.height * this.sizes.dpr)

        this.plane = await this.createBackground()
        this.scene.add(this.plane)

        this.model = await this.createModel()
        // this.model = new THREE.Mesh(new THREE.BoxBufferGeometry(5, 5, 5), new MeshBasicMaterial({color: "red"}))
        this.scene.add(this.model)

        this.camera.position.z = 5
        this.orthoCamera.position.z = 5

        window.addEventListener("resize", this.resize)

        this.addEventListeners()
        this.render()
    }

    createScene(){
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(50, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.orthoCamera = new THREE.OrthographicCamera(this.sizes.width / -2, this.sizes.width / 2, this.sizes.height / 2, this.sizes.height / -2)
        this.orthoCamera.layers.set(1)

        this.renderer = new THREE.WebGLRenderer({})
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.dpr)
        this.renderer.autoClear = false
        this.renderer.setClearColor("#ff00ff")

        document.body.appendChild(this.renderer.domElement)
    }

    async createBackground(){
        const texture = await loadTexture("wallpapers/2082263.jpg")
        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(),
            new THREE.MeshBasicMaterial({map: texture})
        )
        plane.layers.set(1)
        plane.scale.set(this.sizes.width, this.sizes.height, 1)
        return plane
    }

    async createModel(){
        this.backfaceMaterial = new BackfaceMaterial()
        this.refractionMaterial = new RefractionMaterial({
            backfaceMap: this.backfaceFBO.texture,
            envMap: this.envFBO.texture,
            resolution: [this.sizes.width * this.sizes.dpr, this.sizes.height * this.sizes.dpr]
        })

        let geometry = new THREE.BoxBufferGeometry(2,2,2, 32, 32, 32)
        let torusGeometry = new THREE.TorusGeometry(1, 0.5, 64, 64)
        let model = new THREE.Mesh(torusGeometry, this.refractionMaterial)

        // let { model } = await loadModel("model/scene.gltf")
        // model.children[0].material = this.refractionMaterial
        // return model.children[0]
        return model
    }

    render() {
        requestAnimationFrame(this.render)

        this.renderer.clear()

        this.velocity *= 0.8
        this.model.rotation.y += this.velocity + Math.sign(this.velocity) * 0.005 * (1 - Number(this.pointerDown))

        this.renderer.setRenderTarget(this.envFBO)
        this.renderer.render(this.scene, this.orthoCamera)

        this.model.material = this.backfaceMaterial
        this.renderer.setRenderTarget(this.backfaceFBO)
        this.renderer.clearDepth()
        this.renderer.render(this.scene, this.camera)        
        
        this.renderer.setRenderTarget(null)
        this.renderer.render(this.scene, this.orthoCamera)
        this.renderer.clearDepth()

        this.model.material = this.refractionMaterial
        this.renderer.render(this.scene, this.camera)
    }

    resize(){
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight

        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.envFBO.setSize(this.sizes.width * this.sizes.dpr, this.sizes.height * this.sizes.dpr)

        this.plane.scale.set(this.sizes.width, this.sizes.height, 1)
        
        this.model.material.uniforms.resolution.value = [this.sizes.width * this.sizes.dpr, this.sizes.height * this.sizes.dpr]
        
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()

        this.orthoCamera.left = this.sizes.width / -2
        this.orthoCamera.right = this.sizes.width / 2
        this.orthoCamera.top = this.sizes.height / 2
        this.orthoCamera.bottom = this.sizes.height / -2
        this.orthoCamera.updateProjectionMatrix()
    }

    handleMouseDown(e){
        this.pointerDown = true
        this.pointer.x = e.touches ? e.touches[0].clientX : e.clientX
    }

    handleMouseMove(e){
        if (!this.pointerDown) return 

        const x = e.touches ? e.touches[0].clientX : e.clientX
        this.velocity += (x - this.pointer.x) * 0.001

        this.pointer.x = x
    }

    handleMouseUp(e){
        this.pointerDown = false
    }

}

new App();
