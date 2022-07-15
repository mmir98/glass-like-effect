import { TextureLoader, Math } from "three";
const tl = new TextureLoader()

export default function loadTexture(url){
    return new Promise(resolve => {
        tl.load(url, data => {
            if (!Math.isPowerOfTwo(data.image.width) || !Math.isPowerOfTwo(data.image.height)) {
                console.warn('"${url} size is not power of two!"')
            }

            data.needsUpdate = true
            resolve(data)
        })
    })
}