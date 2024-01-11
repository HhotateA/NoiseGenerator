precision mediump float;
uniform float time;
uniform vec2  resolution;
uniform float _Factor1;
uniform float _Factor2;
uniform float _Factor3;

float noise(vec2 uv)
{
    return fract(sin(dot(uv, vec2(_Factor1, _Factor2))) * _Factor3);
}

void main(void){
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float noise = noise(uv);
    gl_FragColor = vec4(noise,noise,noise,1.0);
}