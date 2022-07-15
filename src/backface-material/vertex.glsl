varying vec3 modelNormal;

void main(){
    modelNormal = normalize(modelViewMatrix * vec4(normal, 0.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}