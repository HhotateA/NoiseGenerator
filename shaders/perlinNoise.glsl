precision mediump float;
uniform float time;
uniform vec2  resolution;
uniform float _Factor1;
uniform float _Factor2;
uniform float _Factor3;
uniform float _Tile;

void main(void){
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float noise = pnoise(uv*_Tile,vec2(_Factor1,_Factor2)) * 0.5 + 0.5;
    gl_FragColor = vec4(noise,noise,noise,1.0);
}