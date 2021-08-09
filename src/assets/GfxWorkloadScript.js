
var foo = '';
//$(document).ready(function () {
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
foo = getParameterByName('str');
//});

var gl;

var Texture = new Image();
Texture.src = "data:image/gif;base64,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";

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;
function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.pointLifetimeAttribute = gl.getAttribLocation(shaderProgram, "aLifetime");
    gl.enableVertexAttribArray(shaderProgram.pointLifetimeAttribute);

    shaderProgram.pointStartPositionAttribute = gl.getAttribLocation(shaderProgram, "aStartPosition");
    gl.enableVertexAttribArray(shaderProgram.pointStartPositionAttribute);

    shaderProgram.pointEndPositionAttribute = gl.getAttribLocation(shaderProgram, "aEndPosition");
    gl.enableVertexAttribArray(shaderProgram.pointEndPositionAttribute);

    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "sTexture");
    shaderProgram.centerPositionUniform = gl.getUniformLocation(shaderProgram, "uCenterPosition");
    shaderProgram.colorUniform = gl.getUniformLocation(shaderProgram, "uColor");
    shaderProgram.timeUniform = gl.getUniformLocation(shaderProgram, "uTime");
}


function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);
}


var texture;
function initTexture() {
    texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function () {
        handleLoadedTexture(texture)
    }

    texture.image.src = Texture.src;
}


var pointLifetimesBuffer;
var pointStartPositionsBuffer;
var pointEndPositionsBuffer;
function initBuffers() {
    var numParticles = foo;
    lifetimes = [];
    startPositions = [];
    endPositions = [];
    for (var i = 0; i < numParticles; i++) {
        lifetimes.push(Math.random());

        startPositions.push((Math.random() * 0.25) - 0.125);
        startPositions.push((Math.random() * 0.25) - 0.125);
        startPositions.push((Math.random() * 0.25) - 0.125);

        endPositions.push((Math.random() * 2) - 1);
        endPositions.push((Math.random() * 2) - 1);
        endPositions.push((Math.random() * 2) - 1);
    }

    pointLifetimesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointLifetimesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lifetimes), gl.STATIC_DRAW);
    pointLifetimesBuffer.itemSize = 1;
    pointLifetimesBuffer.numItems = numParticles;

    pointStartPositionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointStartPositionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(startPositions), gl.STATIC_DRAW);
    pointStartPositionsBuffer.itemSize = 3;
    pointStartPositionsBuffer.numItems = numParticles;

    pointEndPositionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointEndPositionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(endPositions), gl.STATIC_DRAW);
    pointEndPositionsBuffer.itemSize = 3;
    pointEndPositionsBuffer.numItems = numParticles;

}

var time = 1.0;
var centerPos;
var color;
function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointLifetimesBuffer);
    gl.vertexAttribPointer(shaderProgram.pointLifetimeAttribute, pointLifetimesBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointStartPositionsBuffer);
    gl.vertexAttribPointer(shaderProgram.pointStartPositionAttribute, pointStartPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointEndPositionsBuffer);
    gl.vertexAttribPointer(shaderProgram.pointEndPositionAttribute, pointEndPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.uniform3f(shaderProgram.centerPositionUniform, centerPos[0], centerPos[1], centerPos[2]);
    gl.uniform4f(shaderProgram.colorUniform, color[0], color[1], color[2], color[3]);
    gl.uniform1f(shaderProgram.timeUniform, time);

    gl.drawArrays(gl.POINTS, 0, pointLifetimesBuffer.numItems);
}


var lastTime = 0;
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        time += elapsed / 3000;
    }
    if (time >= 1.0) {
        time = 0;
        centerPos = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
        color = [Math.random() / 2 + 0.5, Math.random() / 2 + 0.5, Math.random() / 2 + 0.5, 0.5];
        initBuffers();
    }

    lastTime = timeNow;
}


function tick() {
    animate();
    drawScene();
}


function webGLStart() {
    var canvas = document.getElementById("canvas");
    initGL(canvas);
    initTexture();
    initShaders();

    // Hack!
    gl.enable(0x8642);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    setInterval(tick, 15);

}

$(document).ready(function () {

    webGLStart();
});

