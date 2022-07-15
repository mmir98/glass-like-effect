import { ShaderMaterial } from "three";
import fragment from "./fragment.glsl"
import vertex from "./vertex.glsl"

export default class RefractionMaterial extends ShaderMaterial{
    constructor(options){
        super({
            fragmentShader: fragment,
            vertexShader: vertex,
        })

        this.uniforms = {
            backfaceMap: {value: options.backfaceMap},
            envMap: {value: options.envMap},
            resolution:{value: options.resolution}
        }
    }
}