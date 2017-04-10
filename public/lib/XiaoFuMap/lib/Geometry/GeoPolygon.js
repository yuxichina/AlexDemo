//名称：geoPolygon
//作者：GIS-Client Team YC
//说明：空间多边形对象脚本库
//更新
//2012-7-16
(function ($, xf) {
    xf.GeoPolygon = function (path, spatialReference) {
        xf.Geometry.apply(this, []);
        var _gp = this;
        this.path = new Array();
        this.type = "XiaoFu.GeoPolygon";
        //获取外接矩形
        this.getExtent = function () {
            var path = _gp.path;
            minX = maxX = path[0][0].x;
            minY = maxY = path[0][0].y;
            for (var p in path) {
                for (var point in path[p]) {
                    minX = Math.min(path[p][point].x, minX);
                    minY = Math.min(path[p][point].y, minY);
                    maxX = Math.max(path[p][point].x, maxX);
                    maxY = Math.max(path[p][point].y, maxY);
                }
            }
            return new xf.Extent(minX, minY, maxX, maxY);
        };
        
        this.toJson = function () {
            var json = "";
            var path = _gp.path;

            for (var i = 0; i < path.length; i++) {
                var item = path[i];
                var itemJson = "";
                if (json != "") {
                    json += ",";
                }
                for (var j = 0; j < item.length; j++) {
                    if (itemJson != "") {
                        itemJson += ",";
                    }
                    itemJson += item[i].toJson();
                }
                itemJson = "[" + itemJson + "]";
                json += itemJson;
            }
            return "[" + json + "]";
        };
        this._fromServer = function (serverObj) {
            var serverPath = serverObj[0];
            _gp.path = [];
            for (var i = 0; i < serverPath.length; i++) {
                var subLine = [];
                var subServerLine = serverPath[i];
                for (var j = 0; j < subServerLine.length; j++) {
                    var point = new xf.GeoPoint();
                    point.x = subServerLine[j][0];
                    point.y = subServerLine[j][1];
                    subLine.push(point);
                }
                _gp.path.push(subLine);
            }
        };
        //检查节点是否闭合
        function pathCheck(_polygonPath) {
            for (var polygon in _polygonPath) {
                var pointStart = _polygonPath[polygon][0];
                var len = _polygonPath[polygon].length;
                var pointStop = _polygonPath[polygon][len - 1];
                if (pointStart[0] == pointStop[0] && pointStart[1] == pointStop[1]) { }
                else {
                    _polygonPath[polygon].push(pointStart);
                }
            }
            return _polygonPath;
        }
        if (path instanceof Array) {
            this.path = pathCheck(path);
        }
        if (spatialReference != "undefined") {
            this.spatialReference = spatialReference;
        }

        // instanceof
    };
})(jQuery, XiaoFu);
