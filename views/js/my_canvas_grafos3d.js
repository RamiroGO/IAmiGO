
let
    canvas1 = document.getElementById('myCanvas'),
    ctxCanvas1 = canvas1.getContext('2d'),
    imgData_ctxCanvas;

const cubo = [
    [0, 0],
    [0, 10],
    [10, 0],
    [10, 10],
]

canvas1.width = 600;
canvas1.height = 600;

imgData_ctxCanvas = ctxCanvas1.getImageData(0, 0, canvas1.width, canvas1.height);


imgData_ctxCanvas = clean_canvas(imgData_ctxCanvas);
imgData_ctxCanvas = Dibujar_Figur2D(imgData_ctxCanvas, "linea",{coords:cubo, pos_ini_correct:[0,0]}, [[0,0,0,255], [0,0,0,255]]);

ctxCanvas1.putImageData(imgData_ctxCanvas, 0, 0);


