console.log("ok")

/*
pela clara 0 - rgba(253,233,215,1)
pele clara 1 - rgba(213,150,124,1)

 */

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
var image = new Image()
image.src = "./src/teste.jpg"
image.onload = function () {
    ctx.drawImage(image, 0, 0, 300, 300)
    console.log(identify())
}

function destaque(x, y, sx, sy) {
    ctx.fillStyle = "black"
    ctx.globalCompositeOperation = 'source-over'


    ctx.strokeRect(x, y, sx, sy)
}

function identify() {
    invert()
    var imgData = ctx.getImageData(0, 0, 500, 400)

    var red = imgData.data[0],
        green = imgData.data[1],
        blue = imgData.data[2],
        alpha = imgData.data[3]

    var matriz = [];
    var matrizStr = []

    var xSize = canvas.width,
        ySize = canvas.height;

    var posIniX, posFimX, posIniY, posFimY;

    var elems = ["cabelo", "testa", "sobrancelha", "olho", "boca", "queixo"]
    var elemsOrder = 0;
    var partesDoCorpo = [];
    
    for (var y = 1; y < ySize; y++) {
        for (var x = 1; x < xSize; x++) {
            // let result = {
            //     x: x,
            //     y: y,
            //     r: r(x, y),
            //     g: g(x, y),
            //     b: b(x, y)
            // }
            // matriz[x.toString().concat(",", y)] = result
            if (r(x, y) !== r(x - 1, y)) {
                if (!posIniX && !posIniY) {
                    posIniX = x;
                    posIniY = y;
                    xSize = 0;
                }
            }

        }
        if (xSize == 0) {
            if ((r(posIniX, y) - r(posIniX, y - 1)) > 10) {
                if (!partesDoCorpo[elemsOrder]) {
                    partesDoCorpo[elems[elemsOrder]] = {
                        x: posIniX,
                        y: y    
                    }
                    elemsOrder++
                }
            }
        }
    }

    var m = matriz["20,1"];



    // destaque(10, 10, 100, 100)
    invert()
    return partesDoCorpo;
}



function rgba(x, y) {
    var pixel = ctx.getImageData(x, y, 1, 1)
    var data = pixel.data
    return "rgba(" + data[0] + "," + data[1] +
        "," + data[2] + "," + (data[3] / 255) + ")"
}

function r(x, y) {
    var pixel = ctx.getImageData(x, y, 1, 1)
    var data = pixel.data
    return data[0]
}
function g(x, y) {
    var pixel = ctx.getImageData(x, y, 1, 1)
    var data = pixel.data
    return data[1]
}
function b(x, y) {
    var pixel = ctx.getImageData(x, y, 1, 1)
    var data = pixel.data
    return data[2]
}



function invert() {
    var imgData = ctx.getImageData(0, 0, 500, 400)

    var red = imgData.data[0],
        green = imgData.data[1],
        blue = imgData.data[2],
        alpha = imgData.data[3]

    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // invert colors
    for (var i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i];
        imgData.data[i + 1] = 255 - imgData.data[i + 1];
        imgData.data[i + 2] = 255 - imgData.data[i + 2];
        imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
}

var color = document.getElementById('color');
function pick(event) {
    var x = event.layerX;
    var y = event.layerY;
    var pixel = ctx.getImageData(x, y, 1, 1);
    var data = pixel.data;
    var rgba = 'rgba(' + data[0] + ',' + data[1] +
        ',' + data[2] + ',' + (data[3] / 255) + ')' +
        "\n -> x: " + x + " - y: " + y;
    color.style.background = rgba;
    color.textContent = rgba;
}
canvas.addEventListener('mousemove', pick);