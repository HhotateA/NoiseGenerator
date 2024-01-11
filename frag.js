// フラグメントシェーダには時間の経過がtimeに秒単位で、
// スクリーン解像度がresolutionにピクセル単位で入ってくる
precision mediump float;
uniform float time;
uniform vec2  resolution;

// HSV色空間を使うための関数
vec3 hsv(float h, float s, float v){
vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

// ジュリア集合を描くためのフラグメントシェーダ
void main(void){
vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
int j = 0;
vec2 x = vec2(-0.345, 0.654);     // この辺変えると……
vec2 y = vec2(time * 0.005, 0.0); // いろいろ変わるかも
vec2 z = p;
for(int i = 0; i < 360; i++){
    j++;
    if(length(z) > 2.0){break;}
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + x + y;
}
float h = abs(mod(time * 15.0 - float(j), 360.0) / 360.0);
gl_FragColor = vec4(hsv(h, 1.0, 1.0), 1.0);
}