var startTime = new Date().getTime();
main();

async function main() {
    drawAsync("preview1","shaders/v.glsl","shaders/seed.glsl");
    drawAsync("preview2","shaders/v.glsl","shaders/simpleNoise.glsl");
    drawAsync("preview3","shaders/v.glsl","shaders/blockNoise.glsl");
    drawAsync("preview4","shaders/v.glsl","shaders/perlinNoise.glsl","shaders/webgl-noise-master/classicnoise2D.glsl");
    drawAsync("preview5","shaders/v.glsl","shaders/fbmNoise.glsl","shaders/webgl-noise-master/classicnoise2D.glsl");
    drawAsync("preview6","shaders/v.glsl","shaders/curlNoise.glsl");
    drawAsync("preview7","shaders/v.glsl","shaders/cellular2D.glsl","shaders/webgl-noise-master/cellular2x2x2.glsl");
}

$('#canvasW').on('input', function (event) {
    resizeCanvas();
});
$('#canvasH').on('input', function (event) {
    resizeCanvas();
});

function resizeCanvas(){
    $('canvas').each(function(i, e){
        e.width = Number($('#canvasW').val());
        e.height = Number($('#canvasH').val());
    })
}

// https://developer.mozilla.org/ja/docs/Web/API/WebGLShader
function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        throw `WebGL プログラムをコンパイルできませんでした。\n\n${info}`;
    }
    return shader;
}

async function drawAsync(canvasId,vsPath,fsPath,libPath = ""){
    const canvas = document.getElementById(canvasId);
    const vsreq = await fetch(vsPath);
    const vs = await vsreq.text();
    const fsreq = await fetch(fsPath);
    const fs = await fsreq.text();
    if(libPath != "")
    {
        const libreq = await fetch(libPath);
        const lib = await libreq.text();
        return draw(canvas,vs,"precision mediump float;"+lib+fs);
    }
    return draw(canvas,vs,fs);
}

function draw(canvas,vs,fs)
{
    const gl = canvas.getContext('webgl');
    if (gl === null) {
      alert(
        "WebGL を初期化できません。ブラウザーまたはマシンが対応していない可能性があります。",
      );
      return;
    }
    var pogram = gl.createProgram();

    // シェーダーのコンパイル
    var vs = createShader(gl,vs,gl.VERTEX_SHADER);
    var fs = createShader(gl,fs,gl.FRAGMENT_SHADER);
    gl.attachShader(pogram, vs);
    gl.attachShader(pogram, fs);
    gl.linkProgram(pogram);

    var isLink = gl.getProgramParameter(pogram, gl.LINK_STATUS);
    gl.useProgram(pogram);

    // シェーダーパラメーター
    var params = {};
    params.time = gl.getUniformLocation(pogram, 'time');
    params.resolution = gl.getUniformLocation(pogram, 'resolution');
    params.Factor1 = gl.getUniformLocation(pogram, '_Factor1');
    params.Factor2 = gl.getUniformLocation(pogram, '_Factor2');
    params.Factor3 = gl.getUniformLocation(pogram, '_Factor3');
    params.Tile = gl.getUniformLocation(pogram, '_Tile');

    // 頂点の受け渡し
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0,-1,-1,0,1,1,0,1,-1,0]), gl.STATIC_DRAW);


    var attribute = gl.getAttribLocation(pogram, 'position');
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 3, gl.FLOAT, false, 0, 0);


    // ルーチンを実行
    (function(){
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // パラメータ受け渡し
        gl.uniform1f(params.time, (new Date().getTime() - startTime) * 0.001);
        gl.uniform2fv(params.resolution, [canvas.width, canvas.height]);
        gl.uniform1f(params.Factor1, Number($("#factor1").val()));
        gl.uniform1f(params.Factor2, Number($("#factor2").val()));
        gl.uniform1f(params.Factor3, Number($("#factor3").val()));
        gl.uniform1f(params.Tile, Number($("#tile").val()));

        // レンダリング
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.flush();

        // 再起
        requestAnimationFrame(arguments.callee);
    })();
    
    // 初期化
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}