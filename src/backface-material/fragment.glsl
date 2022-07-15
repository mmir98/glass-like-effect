varying vec3 modelNormal;

void main(){
    gl_FragColor = vec4(modelNormal, 1.0);
}