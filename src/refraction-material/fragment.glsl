uniform sampler2D envMap;
uniform vec2 resolution;
uniform sampler2D backfaceMap;

varying vec3 eyeVector;
varying vec3 modelNormal;

float fresnel(vec3 eyeVector, vec3 modelNormal){
    return pow(1.0 + dot(eyeVector, modelNormal), 3.0);
}

void main(){
    vec2 uv = gl_FragCoord.xy / resolution;
    vec3 backfaceNormal = texture2D(backfaceMap, uv).rgb;
    float alpha = 0.3;
    vec3 normal = (1.0 - alpha) * modelNormal - alpha * backfaceNormal;
    vec3 refracted = refract(eyeVector, normal, 1.0/1.1);
    uv += refracted.xy;

    vec4 texture = texture2D(envMap, uv);

    float f_ratio = fresnel(eyeVector, normal);
    vec3 outputColor = mix(texture.rgb, vec3(.7), f_ratio);
    gl_FragColor = vec4(outputColor, 1.0);
}