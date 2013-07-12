<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
<meta itemprop="name" content="Erik Paluka's Website">
<meta itemprop="description" content="Erik specializes in human-computer interaction and is currently working on his master's degree in computer science at the University of Ontario Institute of Technology.">
<meta itemprop="image" content="http://www.erikpaluka.com/images/erik.jpg">
<link REL="SHORTCUT ICON" HREF="http://www.erikpaluka.com/images/taz.ico">
      <title>Erik Paluka - WebGL</title>
      <link rel="stylesheet" href="../../style.css" type="text/css" media="screen" />
      <script type="text/javascript" src="glMatrix-0.9.5.min.js"></script>
    <script type="text/javascript" src="webgl-utils.js"></script>
    <script type="text/javascript" src="paluka.js"></script>
    <link rel="stylesheet" type="text/css" href="../../style.css"/>

    <script id="shader-fs" type="x-shader/x-fragment">
        precision mediump float;

        varying vec2 vTextureCoord;

        uniform sampler2D uSampler;

        void main(void) {
        gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
        }
    </script>

    <script id="shader-vs" type="x-shader/x-vertex">
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;

        varying vec2 vTextureCoord;


        void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;
        }
    </script>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-32905413-2']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
  </head>
  <body onload="webGLStart();"><div class="container">
  
 <?php include('../../includes/header.php'); ?>
      
      <div style="height: 150px"></div>  

          <div>
        <div style="width:900px; margin-top:40px;">
    <div id="content">
        <div id="webGL" style="text-align: center">
            <div><br />
                <h3>WebGL Example using JavaScript</h3>
<br />
                <span>Use the "X" and "S" keys to move along the X axis.<br>
                Use the "C" and "D" keys to move along the Y axis.<br>
                Use the "Z" and "A" keys to move along the Z axis.</span><br />
               <span>I learned how to use WebGL at <a href="http://learningwebgl.com/blog/?page_id=1217" target="_blank">Learning WebGL</a>. I am using glMatrix-0.9.5.min.js and webgl-utils.js.</span>
            </div>
            <br />
            <canvas id="canvas1" style="border: dotted;" width="900px" height="400"></canvas>

        </div>

    </div>
    
              
    </div></div>
          
      
      <?php include('../../includes/footer.php'); ?>
      </div>
      </body>
  </html>