import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"


const loader = new GLTFLoader()

export default function loadModel(url) {
    return new Promise((resolve, reject) => {
        loader.load(url,
            (gltf) => {
                const result = { model: gltf.scene }
                resolve(result)
            }),
            (progress) => {
                console.log(progress)
            },
            (error) => {
                console.error(error)
            }
    })
}