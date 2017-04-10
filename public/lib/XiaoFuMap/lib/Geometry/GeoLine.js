//名称：GeoLine
//作者：GIS-Client Team YC
//说明：空间线对象脚本库
//更新
//2012-7-16
(function ($, xf) {
    xf.GeoLine = function (path, spatialReference) {
        xf.Geometry.apply(this, []);
        //线节点
        this.path = new Array();
        this.type = "XiaoFu.GeoLine";
        var _geoLine = this;
        //获取距离
        this.getDistance = function () {
            var lineCount = _geoLine.path.length;
            var distances = new Array();
            var measure = new xf.Measure();
            for (var i = 0; i < lineCount; i++) {
                var subLine = _geoLine.path[i];
                var subLineDistance = measure.getDistance(subLine, _geoLine.spatialReference);
                distances.push(subLineDistance);
            }

            measure.destroy();
            measure = null;
            return distances;
        };
        //获取范围
        this.getExtent = function () {
            var linePath = _geoLine.path;
            var minX, minY, maxX, maxY;
            minX = maxX = linePath[0][0].x;
            minY = maxY = linePath[0][0].y;
            for (var line in linePath) {
                for (var point in linePath[line]) {
                    minX = Math.min(linePath[line][point].x, minX);
                    minY = Math.min(linePath[line][point].y, minY);
                    maxX = Math.max(linePath[line][point].x, maxX);
                    maxY = Math.max(linePath[line][point].y, maxY);
                }
            }
            return new xf.Extent(minX, minY, maxX, maxY);
        };
        this.toJson = function () {
            var json = "";
            var path = _geoLine.path;

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
                itemJson = "["+ itemJson+"]";
                json += itemJson;
            }
            return "[" + json + "]";
        };
        this._fromServer = function (serverObj) {
            var serverPath = serverObj;
            _geoLine.path = [];
            for (var i = 0; i < serverPath.length; i++) {
                var subLine = [];
                var subServerLine = serverPath[i];
                for (var j = 0; j < subServerLine.length; j++) {
                    var point = new xf.GeoPoint();
                    point.x = subServerLine[j][0];
                    point.y = subServerLine[j][1];
                    subLine.push(point);
                }
                _geoLine.path.push(subLine);
            }
        };
        if (path instanceof Array) {
            this.path = path;
            //this.extent = getMaxExtent(this.path);
        }
        if (spatialReference != "undefined") {
            this.spatialReference = spatialReference;
        }
    };
})(jQuery, XiaoFu);
