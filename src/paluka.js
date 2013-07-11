

    var gl;

    function initGL(canvas) {
        try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        } catch (e) {
        alert("WebGL is not supported by your browser. Switch to Google Chrome or Mozilla Firefox to see my WebGL experiment.");
        }
	if(!gl){
		gl = setupWebGL(canvas);
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

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    }


    function handleLoadedTexture(texture) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        }


    var myTexture;

    function initTexture() {
        myTexture = gl.createTexture();
        myTexture.image = new Image();
        myTexture.image.onload = function () {
        handleLoadedTexture(myTexture)
        }

    myTexture.image.src = "texture1.gif";
    }


    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
        }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
        }
    mvMatrix = mvMatrixStack.pop();
    }


    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        }


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
        }

    var cubeVertexPositionBuffer;
    var cubeVertexTextureCoordBuffer;
    var cubeVertexIndexBuffer;

    function initBuffers() {
        cubeVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        vertices = [
        //Letter E
        //Left Line
        // Front face
        -2, -2.0,  1.0,
        -1.0, -2.0,  1.0,
        -1.0,  3.0,  1.0,
        -2.0,  3.0,  1.0,

        // Back face
        -2, -2.0,  -1.0,
        -1.0, -2.0,  -1.0,
        -1.0,  3.0,  -1.0,
        -2.0,  3.0,  -1.0,

        // Top face
        -2.0,  3.0, 1.0,
        -1.0,  3.0,  1.0,
        -1.0,  3.0,  -1.0,
        -2.0,  3.0, -1.0,

        // Bottom face
        -2.0, -2.0, 1.0,
        -1.0, -2.0, 1.0,
        -1.0, -2.0,  -1.0,
        -2.0, -2.0,  -1.0,

        // Right face
        -1.0, 3.0,  1.0,
        -1.0,  -2.0, 1.0,
        -1.0,  -2.0,  -1.0,
        -1.0, 3.0,  -1.,

        // Left face
        -2.0, 3.0,  1.0,
        -2.0, -2.0,  1.0,
        -2.0, -2.0,  -1.0,
        -2.0,  3.0,  -1.0,


        // Top Line
        //Front Face
        -1.0, 3.0, 1.0,
        -1.0, 2.0, 1.0,
        1.0, 2.0, 1.0,
        1.0, 3.0, 1.0,

        //Back Face
        -1.0, 3.0, -1.0,
        -1.0, 2.0, -1.0,
        1.0, 2.0, -1.0,
        1.0, 3.0, -1.0,

        //Top Face
        -1.0, 3.0, -1.0,
        -1.0, 3.0, 1.0,
        1.0, 3.0, 1.0,
        1.0, 3.0, -1.0,

        //Bottom Face
        -1.0, 2.0, -1.0,
        -1.0, 2.0, 1.0,
        1.0, 2.0, 1.0,
        1.0, 2.0, -1.0,

        //Right Face
        1.0, 3.0, 1.0,
        1.0, 2.0, 1.0,
        1.0, 2.0, -1.0,
        1.0, 3.0, -1.0,


        // Middle Line
        //Front Face
        -1.0, 1.0, 1.0,
        -1.0, 0.0, 1.0,
        1.0, 0.0, 1.0,
        1.0, 1.0, 1.0,

        //Back Face
        -1.0, 1.0, -1.0,
        -1.0, 0.0, -1.0,
        1.0, 0.0, -1.0,
        1.0, 1.0, -1.0,

        //Top Face
        -1.0, 1.0, -1.0,
        -1.0, 1.0, 1.0,
        1.0, 1.0, 1.0,
        1.0, 1.0, -1.0,

        //Bottom Face
        -1.0, 0.0, -1.0,
        -1.0, 0.0, 1.0,
        1.0, 0.0, 1.0,
        1.0, 0.0, -1.0,

        //Right Face
        1.0, 1.0, 1.0,
        1.0, 0.0, 1.0,
        1.0, 0.0, -1.0,
        1.0, 1.0, -1.0,

        // Bottom Line
        //Front Face
        -1.0, -1.0, 1.0,
        -1.0, -2.0, 1.0,
        1.0, -2.0, 1.0,
        1.0, -1.0, 1.0,

        //Back Face
        -1.0, -1.0, -1.0,
        -1.0, -2.0, -1.0,
        1.0, -2.0, -1.0,
        1.0, -1.0, -1.0,

        //Top Face
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, -1.0, -1.0,

        //Bottom Face
        -1.0, -2.0, -1.0,
        -1.0, -2.0, 1.0,
        1.0, -2.0, 1.0,
        1.0, -2.0, -1.0,

        //Right Face
        1.0, -1.0, 1.0,
        1.0, -2.0, 1.0,
        1.0, -2.0, -1.0,
        1.0, -1.0, -1.0,



        //Letter R
        //Vertical Line
        //Front Face
        2.0, -2.0, 1.0,
        3.0, -2.0, 1.0,
        3.0, 1.0, 1.0,
        2.0, 1.0, 1.0,

        //Back Face
        2.0, -2.0, -1.0,
        3.0, -2.0, -1.0,
        3.0, 1.0, -1.0,
        2.0, 1.0, -1.0,

        //Left Face
        2.0, 1.0, 1.0,
        2.0, -2.0, 1.0,
        2.0, -2.0, -1.0,
        2.0, 1.0, -1.0,

        //Right Face
        3.0, 1.0, 1.0,
        3.0, -2.0, 1.0,
        3.0, -2.0, -1.0,
        3.0, 1.0, -1.0,

        //Top Face
        2.0, 1.0, 1.0,
        3.0, 1.0, 1.0,
        3.0,  1.0, -1.0,
        2.0,  1.0, -1.0,


        //Bottom Face
        2.0, -2.0, 1.0,
        3.0, -2.0, 1.0,
        3.0,  -2.0, -1.0,
        2.0,  -2.0, -1.0,

        //Diagonal Line
        //Front Face
        3.0, 0.5, 1.0,
        3.0, -0.5, 1.0,
        4.0, 0.5, 1.0,
        3.75, 1.0, 1.0,

        //Back Face
        3.0, 0.5, -1.0,
        3.0, -0.5, -1.0,
        4.0, 0.5, -1.0,
        3.75, 1.0, -1.0,

        //Top Face
        3.0, 0.5, -1.0,
        3.0, 0.5, 1.0,
        3.75, 1.0, 1.0,
        3.75, 1.0, -1.0,

        //Bottom Face
        3.0, -0.5, -1.0,
        3.0, -0.5, 1.0,
        4.0, 0.5, 1.0,
        4.0, 0.5, -1.0,

        //Right Face
        3.75, 1.0, -1.0,
        3.75, 1.0, 1.0,
        4.0, 0.5, 1.0,
        4.0, 0.5, -1.0,

        //Letter I
        //Vertical Line
        //Front Face
        5.0, -2.0, 1.0,
        6.0, -2.0, 1.0,
        6.0, 0.0, 1.0,
        5.0, 0.0, 1.0,

        //Back Face
        5.0, -2.0, -1.0,
        6.0, -2.0, -1.0,
        6.0, 0.0, -1.0,
        5.0, 0.0, -1.0,

        //Top Face
        5.0, 0.0, 1.0,
        6.0, 0.0, 1.0,
        6.0, 0.0, -1.0,
        5.0, 0.0, -1.0,

        //Bottom Face
        5.0, -2.0, 1.0,
        6.0, -2.0, 1.0,
        6.0, -2.0, -1.0,
        5.0, -2.0, -1.0,

        //Left Face
        5.0, -2.0, -1.0,
        5.0, -2.0, 1.0,
        5.0, 0.0, 1.0,
        5.0, 0.0, -1.0,

        //Right Face
        6.0, -2.0, -1.0,
        6.0, -2.0, 1.0,
        6.0, 0.0, 1.0,
        6.0, 0.0, -1.0,

        //Dot
        //Front Face
        5.0, 1.0, 1.0,
        6.0, 1.0, 1.0,
        6.0, 2.0, 1.0,
        5.0, 2.0, 1.0,

        //Back Face
        5.0, 1.0, -1.0,
        6.0, 1.0, -1.0,
        6.0, 2.0, -1.0,
        5.0, 2.0, -1.0,

        //Top Face
        5.0, 2.0, 1.0,
        6.0, 2.0, 1.0,
        6.0, 2.0, -1.0,
        5.0, 2.0, -1.0,

        //Bottom Face
        5.0, 1.0, 1.0,
        6.0, 1.0, 1.0,
        6.0, 1.0, -1.0,
        5.0, 1.0, -1.0,

        //Left Face
        5.0, 1.0, -1.0,
        5.0, 1.0, 1.0,
        5.0, 2.0, 1.0,
        5.0, 2.0, -1.0,

        //Right Face
        6.0, 1.0, -1.0,
        6.0, 1.0, 1.0,
        6.0, 2.0, 1.0,
        6.0, 2.0, -1.0,

        //Letter K
        //Vertical Line
        // Front face
        7, -2.0,  1.0,
        8.0, -2.0,  1.0,
        8.0,  3.0,  1.0,
        7.0,  3.0,  1.0,

        // Back face
        7, -2.0,  -1.0,
        8.0, -2.0,  -1.0,
        8.0,  3.0,  -1.0,
        7.0,  3.0,  -1.0,

        // Top face
        7.0,  3.0, 1.0,
        8.0,  3.0,  1.0,
        8.0,  3.0,  -1.0,
        7.0,  3.0, -1.0,

        // Bottom face
        7.0, -2.0, 1.0,
        8.0, -2.0, 1.0,
        8.0, -2.0,  -1.0,
        7.0, -2.0,  -1.0,

        // Right face
        8.0, 3.0,  1.0,
        8.0,  -2.0, 1.0,
        8.0,  -2.0,  -1.0,
        8.0, 3.0,  -1.,

        // Left face
        7.0, 3.0,  1.0,
        7.0, -2.0,  1.0,
        7.0, -2.0,  -1.0,
        7.0,  3.0,  -1.0,

        //Top Diagonal Line
        //Front Face
        8.0, 1.0, 1.0,
        8.0, 0.5, 1.0,
        9.25, 2.75, 1.0,
        9.0, 3.0, 1.0,

        //Back Face
        8.0, 1.0, -1.0,
        8.0, 0.5, -1.0,
        9.25, 2.75, -1.0,
        9.0, 3.0, -1.0,

        //Top Face
        8.0, 1.0, -1.0,
        8.0, 1.0, 1.0,
        9.0, 3.0, 1.0,
        9.0, 3.0, -1.0,

        //Bottom Face
        8.0, 0.5, -1.0,
        8.0, 0.5, 1.0,
        9.25, 2.75, 1.0,
        9.25, 2.75, -1.0,

        //Right Face
        9.0, 3.0, -1.0,
        9.0, 3.0, 1.0,
        9.25, 2.75, 1.0,
        9.25, 2.75, -1.0,

        //Bottom Diagonal Line
        //Front Face
        8.0, -1.0, 1.0,
        8.0, 0.5, 1.0,
        9.25, -1.75, 1.0,
        9.0, -2.0, 1.0,

        //Back Face
        8.0, -1.0, -1.0,
        8.0, 0.5, -1.0,
        9.25, -1.75, -1.0,
        9.0, -2.0, -1.0,

        //Top Face
        8.0, -1.0, -1.0,
        8.0, -1.0, 1.0,
        9.0, -2.0, 1.0,
        9.0, -2.0, -1.0,

        //Bottom Face
        8.0, 0.5, -1.0,
        8.0, 0.5, 1.0,
        9.25, -1.75, 1.0,
        9.25, -1.75, -1.0,

        //Right Face
        9.0, -2.0, -1.0,
        9.0, -2.0, 1.0,
        9.25, -1.75, 1.0,
        9.25, -1.75, -1.0





        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        cubeVertexPositionBuffer.itemSize = 3;
        cubeVertexPositionBuffer.numItems = 244;

        cubeVertexTextureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        var textureCoords = [
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Left face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Front face
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,

        // Back face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,

        // Top face
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,

        // Bottom face
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        // Right face
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0





        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
        cubeVertexTextureCoordBuffer.itemSize = 2;
        cubeVertexTextureCoordBuffer.numItems = 244;

        cubeVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        var cubeVertexIndices = [
        //Letter E
        0, 1, 2,      0, 2, 3,    // Front face
        4, 5, 6,      4, 6, 7,    // Back face
        8, 9, 10,     8, 10, 11,  // Top face
        12, 13, 14,   12, 14, 15, // Bottom face
        16, 17, 18,   16, 18, 19, // Right face
        20, 21, 22,   20, 22, 23,  // Left face
        24, 25, 26, 24, 26, 27,
        28, 29, 30, 28, 30, 31,
        32, 33, 34, 32, 34, 35,

        36, 37, 38, 36, 38, 39,
        40, 41, 42, 40, 42, 43,
        44, 45, 46, 44, 46, 47,

        48, 49, 50, 48, 50, 51,
        52, 53, 54, 52, 54, 55,
        56, 57, 58, 56, 58, 59,

        // Letter R
        60, 61, 62, 60, 62, 63,
        64, 65, 66, 64, 66, 67,
        68, 69, 70, 68, 70, 71,
        72, 73, 74, 72, 74, 75,
        76, 77, 78, 76, 78, 79,
        80, 81, 82, 80, 82, 83,

        84, 85, 86, 84, 86, 87,
        88, 89, 90, 88, 90, 91,
        92, 93, 94, 92, 94, 95,
        96, 97, 98, 96, 98, 99,
        100, 101, 102, 100, 102, 103,

        //Letter I
        104, 105, 106, 104, 106, 107,
        108, 109, 110, 108, 110, 111,
        112, 113, 114, 112, 114, 115,
        116, 117, 118, 116, 118, 119,
        120, 121, 122, 120, 122, 123,
        124, 125, 126, 124, 126, 127,

        128, 129, 130, 128, 130, 131,
        132, 133, 134, 132, 134, 135,
        136, 137, 138, 136, 138, 139,
        140, 141, 142, 140, 142, 143,
        144, 145, 146, 144, 146, 147,
        148, 149, 150, 148, 150, 151,

        //Letter K
        152, 153, 154, 152, 154, 155,
        156, 157, 158, 156, 158, 159,
        160, 161, 162, 160, 162, 163,
        164, 165, 166, 164, 166, 167,
        168, 169, 170, 168, 170, 171,
        172, 173, 174, 172, 174, 175,

        176, 177, 178, 176, 178, 179,
        180, 181, 182, 180, 182, 183,
        184, 185, 186, 184, 186, 187,
        188, 189, 190, 188, 190, 191,
        192, 193, 194, 192, 194, 195,

        196, 197, 198, 196, 198, 199,
        200, 201, 202, 200, 202, 203,
        204, 205, 206, 204, 206, 207,
        208, 209, 210, 208, 210, 211,
        212, 213, 214, 212, 214, 215,

        216, 217, 218, 216, 218, 219,
        220, 221, 222, 220, 222, 223,
        224, 225, 226, 224, 226, 227,
        228, 229, 230, 228, 230, 231,
        232, 233, 234, 232, 234, 235,
        236, 237, 238, 236, 238, 239
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
        cubeVertexIndexBuffer.itemSize = 1;
        cubeVertexIndexBuffer.numItems = 360;
        }


    var xRot = 0;
    var yRot = 0;
    var zRot = 0;
    var x = 0;
    var y = 0;
    var z = 0;

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, [0.0 + x, 0.0 + y, -15.0 + z]);

        mvPushMatrix();
        mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
        mat4.rotate(mvMatrix, degToRad(zRot), [0, 0, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, myTexture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        mvPopMatrix();
        }


    var lastTime = 0;

    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        xRot += (20 * elapsed) / 1000.0;
        yRot += (20 * elapsed) / 1000.0;
        zRot += (20 * elapsed) / 1000.0;
        }
    lastTime = timeNow;
    }
    var currentlyPressedKeys = {};

    function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
        }


    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
        }

    function handleKeys() {
        if (currentlyPressedKeys[37]) {
        // Left Arrow
        x += 0.1;
        }
    if (currentlyPressedKeys[39]) {
        // Right Arrow
        x -= 0.1;
        }
    if (currentlyPressedKeys[38]) {
        // Up Arrow
        y -= 0.1;
        }
    if (currentlyPressedKeys[40]) {
        // Down Arrow
        y += 0.1;
        }
    if (currentlyPressedKeys[90]) {
        // Z key
        z -= 0.1;
        }
    if (currentlyPressedKeys[88]) {
        // X key
        z += 0.1;
        }
    }

    function tick() {
        requestAnimFrame(tick);
        handleKeys();
        drawScene();
        animate();
        }


    function webGLStart() {
        var canvas = document.getElementById("canvas1");
        initGL(canvas);
        initShaders();
        initBuffers();
        initTexture();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

        tick();
        }
