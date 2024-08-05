imageLoad = new Image();
imageLoad.src = document.getElementById('imagen').src;
imageLoad.onload = () => {
    let
        canvas1 = document.getElementById('myCanvas'),
        canvas2 = document.getElementById('myCanvas2'),
        ctxCanvas1 = canvas1.getContext('2d'),
        ctxCanvas2 = canvas2.getContext('2d');

    canvas1.width = imageLoad.width;
    canvas2.width = imageLoad.width;
    canvas1.height = imageLoad.height;
    canvas2.height = imageLoad.height;

    ctxCanvas1.drawnImage(imageLoad, 0, 0);

    let
        imgData_ctxCanvas1 = ctxCanvas1.getImageData(0, 0, canvas1.width, canvas1.height),
        imgData_ctxCanvas2 = ctxCanvas2.createImageData(canvas1.width, canvas1.height);

    for (let i = 0; i != imgData_ctxCanvas2.data.length; i += 4) {

        let
            val_R = imgData_ctxCanvas1.data[i + 0],
            val_G = imgData_ctxCanvas1.data[i + 1],
            val_B = imgData_ctxCanvas1.data[i + 2],
            avg_rgb = (val_R + val_G + val_B) / 3,
            rel_RG = val_R / val_G,
            rel_RB = val_R / val_B,
            rel_GB = (val_G / val_B),
            rel_BG = (val_B / val_G),
            rel_R_Avg_min = 1 * val_R / avg_rgb;

        if (val_G < 20 && val_B < 20) {
            imgData_ctxCanvas2.data[i + 0] = 255;
            imgData_ctxCanvas2.data[i + 1] = 0;
            imgData_ctxCanvas2.data[i + 2] = 0;
        } else if (
            rel_RG > rel_R_Avg_min &&
            rel_RB > rel_R_Avg_min) {
            imgData_ctxCanvas2.data[i + 0] = imgData_ctxCanvas1.data[i + 0];
            imgData_ctxCanvas2.data[i + 1] = imgData_ctxCanvas1.data[i + 1];
            imgData_ctxCanvas2.data[i + 2] = imgData_ctxCanvas1.data[i + 2];
            // imgData_ctxCanvas2.data[i + 0] = 0;
            // imgData_ctxCanvas2.data[i + 1] = 0;
            // imgData_ctxCanvas2.data[i + 2] = 0;
        } else if (Math.abs(rel_GB - rel_BG) > avg_rgb / 255000) {
            imgData_ctxCanvas2.data[i + 0] = 255;
            imgData_ctxCanvas2.data[i + 1] = 255;
            imgData_ctxCanvas2.data[i + 2] = 255;
        } else {
            imgData_ctxCanvas2.data[i + 0] = 255;
            imgData_ctxCanvas2.data[i + 1] = 255;
            imgData_ctxCanvas2.data[i + 2] = 255;
        }
        imgData_ctxCanvas2.data[i + 3] = imgData_ctxCanvas1.data[i + 3];
    }

    ctxCanvas2.putImageData(imgData_ctxCanvas2, 0, 0);
}