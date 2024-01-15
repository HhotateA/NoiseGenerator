precision mediump float;
uniform float time;
uniform vec2  resolution;
uniform float _Factor1;
uniform float _Factor2;
uniform float _Factor3;
uniform float _Tile;

float noise(vec2 uv)
{
    return fract(sin(dot(uv, vec2(_Factor1, _Factor2))) * _Factor3);
}

float blockNoise(vec2 uv)
{
    uv=floor(uv*_Tile)/_Tile;
    return noise(uv);
}

void main(void){
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float noise = snoise(uv*_Tile) * 0.5 + 0.5;
    gl_FragColor = vec4(noise,noise,noise,1.0);
}