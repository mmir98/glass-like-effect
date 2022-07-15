import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"
import { BackSide, ShaderMaterial } from "three"

export default class BackfaceMaterial extends ShaderMaterial{
    constructor(){
        super({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: BackSide,
        })

    }
}

