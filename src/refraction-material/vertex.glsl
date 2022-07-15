
varying vec3 eyeVector;
varying vec3 modelNormal;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // vec4 modelViewMatrix = modelMatrix * viewMatrix;
    vec4 projection = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = projection;

    eyeVector = normalize(modelPosition.xyz - cameraPosition);
    modelNormal = normalize(modelViewMatrix * vec4(normal, 0.0)).xyz;

}