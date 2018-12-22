//定义画布宽高和生成点的个数
let WIDTH = window.innerWidth, 
    HEIGHT = window.innerHeight, 
    POINT = 35;

let canvas = document.getElementById('Mycanvas');
canvas.width = WIDTH,
canvas.height = HEIGHT;
let context = canvas.getContext('2d');
context.strokeStyle = 'rgba(90,80,50,0.02)',
context.strokeWidth = 1,
context.fillStyle = 'rgba(90,30,50,0.05)';
let circleArr = [];

//线条：开始xy坐标，结束xy坐标，线条透明度
let Line = (x, y, _x, _y, o) => {
    var {beginX, beginY, closeX, closeY, o} = {beginX:x, beginY:y, closeX:_x, closeY:_y, o:o};
    let line = {beginX, beginY, closeX, closeY, o};

    return line;
};

//点：圆心xy坐标，半径，每帧移动xy的距离
let Circle = (x, y, r, moveX, moveY) => {
    var {x, y, r, moveX, moveY} = {x:x, y:y, r:r, moveX:moveX, moveY:moveY};
    let circle = {x, y, r, moveX, moveY};
    
    return circle;
};
//生成max和min之间的随机数
let num = (max, ..._min) => {
    let min = _min[1] || 0;
    return Math.floor(Math.random()*(max-min+1)+min);
}
// 绘制原点
let drawCricle = (cxt, x, y, r, moveX, moveY) => {
    let circle = Circle(x, y, r, moveX, moveY);
    cxt.beginPath();
    cxt.arc(circle.x, circle.y, circle.r, 0, 2*Math.PI);
    cxt.closePath();
    cxt.fill();
    return circle;
}
//绘制线条
let drawLine = (cxt, x, y, _x, _y, o) => {
    let line = Line(x, y, _x, _y, o);
    cxt.beginPath();
    cxt.strokeStyle = 'rgba(0,0,0,'+ o +')';
    cxt.moveTo(line.beginX, line.beginY);
    cxt.lineTo(line.closeX, line.closeY);
    cxt.closePath();
    cxt.stroke();
}
//初始化生成原点
let init = () => {
    circleArr = [];
    for (var i = 0; i < POINT; i++) {
        circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10)/40, num(10, -10)/40));
    }
    draw();
}

//每帧绘制
let draw = () => {
    context.clearRect(0,0,canvas.width, canvas.height);
    for (let i = 0; i < POINT; i++) {
        drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
    }
    for (let i = 0; i < POINT; i++) {
        for (let j = 0; j < POINT; j++) {
            if (i + j < POINT) {
                let A = Math.abs(circleArr[i+j].x - circleArr[i].x),
                    B = Math.abs(circleArr[i+j].y - circleArr[i].y);
                let lineLength = Math.sqrt(A*A + B*B);
                let C = 1/lineLength*7-0.009;
                let lineOpacity = C > 0.03 ? 0.03 : C;
                if (lineOpacity > 0) {
                    drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i+j].x, circleArr[i+j].y, lineOpacity);
                }
            }
        }
    }
}

//调用执行
window.onload = () => {
    init();
    setInterval(function () {
        for (let i = 0; i < POINT; i++) {
            let cir = circleArr[i];
            cir.x += cir.moveX;
            cir.y += cir.moveY;
            if (cir.x > WIDTH) cir.x = 0;
            else if (cir.x < 0) cir.x = WIDTH;
            if (cir.y > HEIGHT) cir.y = 0;
            else if (cir.y < 0) cir.y = HEIGHT;
        }
        draw();
    }, 16);
}