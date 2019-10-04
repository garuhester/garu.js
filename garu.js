window.Garu = {
    canvasObj: "",
    canvas: "",
    ctx: "",
    drawingObjs: [],
    clickItem: ""
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

Garu.add = function (obj) {
    var _this = Garu;
    _this.drawingObjs.push(obj);
}

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
        }
    }
    requestAnimationFrame(Garu.update);
}

Garu.drawRect = function (obj) {
    var _this = Garu;

    _this.ctx.fillStyle = obj.bgColor;
    _this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

Garu.FitValue = function (nowVaule, defaultValue) {
    return nowVaule ? nowVaule : defaultValue;
}

Garu.initDrag = function () {
    var _this = Garu;
    _this.canvas.onmousemove = function (e) {
        var startX = e.offsetX;
        var startY = e.offsetY;
        _this.getClickItem(startX, startY);
        if (_this.clickItem != null) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }
    }
    _this.canvas.onmousedown = function (e) {
        var startX = e.offsetX;
        var startY = e.offsetY;
        _this.getClickItem(startX, startY);
        var clickX = _this.clickItem.x;
        var clickY = _this.clickItem.y;
        _this.canvas.onmousemove = function (e) {
            var moveX = e.offsetX;
            var moveY = e.offsetY;
            var offsetX = moveX - startX;
            var offsetY = moveY - startY;
            if (_this.clickItem != null) {
                _this.clickItem.x = clickX + offsetX;
                _this.clickItem.y = clickY + offsetY;
                document.body.style.cursor = "pointer";
            }
        }
        _this.canvas.onmouseup = function () {
            _this.canvas.onmousemove = function (e) {
                var startX = e.offsetX;
                var startY = e.offsetY;
                _this.getClickItem(startX, startY);
                if (_this.clickItem != null) {
                    document.body.style.cursor = "pointer";
                } else {
                    document.body.style.cursor = "default";
                }
            }
        }
    }
}

Garu.getClickItem = function (x, y) {
    var _this = Garu;
    var clickItem = null;
    for (var i = _this.drawingObjs.length - 1; i >= 0; i--) {
        var ele = _this.drawingObjs[i];
        if (x >= ele.x && (x <= ele.x + ele.width) && y >= ele.y && (y <= ele.y + ele.height)) {
            clickItem = ele;
            break;
        }
    }
    _this.clickItem = clickItem;
}