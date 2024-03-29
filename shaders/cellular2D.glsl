precision mediump float;
uniform float time;
uniform vec2  resolution;
uniform float _Tile;
uniform float _Speed;

// HSV色空間を使うための関数
vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

void main(void){
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 noise = cellular2x2x2(vec3(uv*_Tile,time*_Speed))*0.5+0.5;
    vec3 c = hsv(noise.x,0.5,noise.y);
    
    gl_FragColor = vec4(c.r,c.g,c.b,1.0);
}