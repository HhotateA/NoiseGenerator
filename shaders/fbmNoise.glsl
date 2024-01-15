precision mediump float;
uniform float time;
uniform vec2  resolution;
uniform float _Factor1;
uniform float _Factor2;
uniform float _Factor3;
uniform float _Tile;

float fBm (vec2 st) 
{
    float f = 0.;
    vec2 q = st;

    f += 0.5000*pnoise( q ,vec2(_Factor1,_Factor2)); q = q*2.01;
    f += 0.2500*pnoise( q ,vec2(_Factor1,_Factor2)); q = q*2.02;
    f += 0.1250*pnoise( q ,vec2(_Factor1,_Factor2)); q = q*2.03;
    f += 0.0625*pnoise( q ,vec2(_Factor1,_Factor2)); 

    return f;
}

void main(void){
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float noise = fBm(uv*_Tile)*0.5+0.5;
    gl_FragColor = vec4(noise,noise,noise,1.0);
}