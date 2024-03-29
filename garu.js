window.Garu = {
    canvasObj: "",
    canvas: "",
    ctx: "",
    drawingObjs: [],
    clickItem: "",
    chooseCursor: "move",
    defaultCursor: "default"
};

Garu.init = function (obj) {
    var _this = Garu;
    _this.canvasObj = obj;
    _this.canvasId = _this.canvasObj.id;
    _this.startCanvas();
    _this.update();

    if (_this.canvasObj.isDrag) {
        _this.initDrag();
    }
}

Garu.startCanvas = function (obj) {
    var _this = Garu;
    _this.canvas = document.getElementById(_this.canvasId);
    _this.ctx = _this.canvas.getContext("2d");

    _this.canvas.width = _this.canvasObj.width;
    _this.canvas.height = _this.canvasObj.height;

    _this.ctx.fillStyle = _this.canvasObj.bgColor ? _this.canvasObj.bgColor : "#fff";
    _this.ctx.fillRect(0, 0, _this.canvasObj.width, _this.canvasObj.height);
}

// -------------------------------------
// Object
Garu.Rect = function (obj) {
    var _this = Garu;

    var obj = obj ? obj : {};
    obj.type = "rect";
    obj.x = _this.FitValue(obj.x, 0);
    obj.y = _this.FitValue(obj.y, 0);
    obj.width = _this.FitValue(obj.width, 100);
    obj.height = _this.FitValue(obj.height, 100);
    obj.bgColor = _this.FitValue(obj.bgColor, "skyblue");
    obj.isDrag = _this.FitValue(obj.isDrag, _this.canvasObj.isDrag);

    return obj;
}

Garu.Circle = function (obj) {
    var _this = Garu;

    var obj = obj ? obj : {};
    obj.type = "circle";
    obj.x = _this.FitValue(obj.x, 0);
    obj.y = _this.FitValue(obj.y, 0);
    obj.r = _this.FitValue(obj.r, 100);
    obj.bgColor = _this.FitValue(obj.bgColor, "skyblue");
    obj.isDrag = _this.FitValue(obj.isDrag, _this.canvasObj.isDrag);

    return obj;
}

Garu.Line = function (obj) {
    var _this = Garu;

    var obj = obj ? obj : {};
    obj.type = "line";
    obj.x = _this.FitValue(obj.x, 0);
    obj.y = _this.FitValue(obj.y, 0);
    obj.ex = _this.FitValue(obj.ex, 0);
    obj.ey = _this.FitValue(obj.ey, 0);
    obj.lineWidth = _this.FitValue(obj.lineWidth, 0);
    obj.bgColor = _this.FitValue(obj.bgColor, "skyblue");
    obj.isDrag = _this.FitValue(obj.isDrag, _this.canvasObj.isDrag);

    return obj;
}
// -------------------------------------

Garu.drawRect = function (obj) {
    var _this = Garu;

    _this.ctx.fillStyle = obj.bgColor;
    _this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

Garu.drawCircle = function (obj) {
    var _this = Garu;
    _this.ctx.fillStyle = obj.bgColor;
    _this.ctx.beginPath();
    _this.ctx.arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI);
    _this.ctx.fill();
}

Garu.drawLine = function (obj) {
    var _this = Garu;
    _this.ctx.lineWidth = obj.lineWidth;
    _this.ctx.strokeStyle = obj.bgColor;
    _this.ctx.beginPath();
    _this.ctx.moveTo(obj.x, obj.y);
    _this.ctx.lineTo(obj.ex, obj.ey);
    _this.ctx.stroke();
}

//添加到渲染队列
Garu.add = function (obj) {
    var _this = Garu;
    _this.drawingObjs.push(obj);
}

//刷新画布
Garu.update = function () {
    var _this = Garu;
    _this.ctx.fillStyle = _this.canvasObj.bgColor ? _this.canvasObj.bgColor : "#fff";
    _this.ctx.fillRect(0, 0, _this.canvasObj.width, _this.canvasObj.height);
    for (var i = 0; i < _this.drawingObjs.length; i++) {
        var ele = _this.drawingObjs[i];
        switch (ele.type) {
            case "rect":
                _this.drawRect(ele);
                break;
            case "circle":
                _this.drawCircle(ele);
                break;
            case "line":
                _this.drawLine(ele);
                break;
        }
    }
    requestAnimationFrame(Garu.update);
}

Garu.FitValue = function (nowVaule, defaultValue) {
    return nowVaule ? nowVaule : defaultValue;
}

//元素拖拽
Garu.initDrag = function () {
    var _this = Garu;
    _this.canvas.onmousemove = function (e) {
        var startX = e.offsetX;
        var startY = e.offsetY;
        _this.getClickItem(startX, startY);
        if (_this.clickItem != null) {
            document.body.style.cursor = _this.chooseCursor;
        } else {
            document.body.style.cursor = _this.defaultCursor;
        }
    }
    _this.canvas.onmousedown = function (e) {
        var startX = e.offsetX;
        var startY = e.offsetY;
        _this.getClickItem(startX, startY);
        if (_this.clickItem != null) {
            if (_this.clickItem.type == "line") {
                var clickX = _this.clickItem.x;
                var clickY = _this.clickItem.y;
                var clickeX = _this.clickItem.ex;
                var clickeY = _this.clickItem.ey;
            } else {
                var clickX = _this.clickItem.x;
                var clickY = _this.clickItem.y;
            }
        }
        _this.canvas.onmousemove = function (e) {
            var moveX = e.offsetX;
            var moveY = e.offsetY;
            var offsetX = moveX - startX;
            var offsetY = moveY - startY;
            if (_this.clickItem != null) {
                if (_this.clickItem.type == "line") {
                    _this.clickItem.x = clickX + offsetX;
                    _this.clickItem.y = clickY + offsetY;
                    _this.clickItem.ex = clickeX + offsetX;
                    _this.clickItem.ey = clickeY + offsetY;
                } else {
                    _this.clickItem.x = clickX + offsetX;
                    _this.clickItem.y = clickY + offsetY;
                }
                document.body.style.cursor = _this.chooseCursor;
            }
        }
        _this.canvas.onmouseup = function () {
            _this.canvas.onmousemove = function (e) {
                var startX = e.offsetX;
                var startY = e.offsetY;
                _this.getClickItem(startX, startY);
                if (_this.clickItem != null) {
                    document.body.style.cursor = _this.chooseCursor;
                } else {
                    document.body.style.cursor = _this.defaultCursor;
                }
            }
        }
    }
}

//获取点中元素
Garu.getClickItem = function (x, y) {
    var _this = Garu;
    var clickItem = null;
    for (var i = _this.drawingObjs.length - 1; i >= 0; i--) {
        var ele = _this.drawingObjs[i];
        if (ele.type == "rect") {
            if (x >= ele.x && (x <= ele.x + ele.width) && y >= ele.y && (y <= ele.y + ele.height)) {
                clickItem = ele;
                break;
            }
        } else if (ele.type == "circle") {
            if (x >= (ele.x - ele.r) && (x <= ele.x + ele.r) && y >= (ele.y - ele.r) && (y <= ele.y + ele.r)) {
                clickItem = ele;
                break;
            }
        } else if (ele.type == "line") {
            if (x >= (ele.x - ele.lineWidth / 2) && (x <= ele.x + ele.lineWidth / 2) && y >= ele.y && (y <= ele.y + (ele.ey - ele.y))) {
                clickItem = ele;
                break;
            }
        }
    }
    _this.clickItem = clickItem;
}