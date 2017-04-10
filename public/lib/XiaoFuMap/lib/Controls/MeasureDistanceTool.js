//名称：Tool
//作者：GIS-Client Team YC
//说明：工具
//更新
//2012-8-15
(function ($, xf) {
    //量算返回结果
    xf.MeasureDistanceResult = function () {
        this.type = "XiaoFu.MeasureDistanceResult";
        //返回控件对象
        this.geometry = null;
        //量算距离
        this.distances = null;
    };
    //量算工具
    xf.MeasureDistanceTool = function (imgUrl) {
        //事件 click mouseover mousedown mouseout
        xf.Tool.apply(this, []);
        //工具
        var _tool = this;
        //显示SVG图层
        var _svgLayer = null;
        this.type = "XiaoFu.MeasureDistanceTool";
        //容器
        this.container = null;
        //依托工具条
        this.toolBar = null;
        //量算显示SVG图层
        this.drawLine = null;
        //是否激活
        this.active = false;
        //激活工具
        this.run = function () {
            _tool.active = true;
            _tool.container.css("border-bottom", "2px solid blue");
            _svgLayer = new XiaoFu.SVGLayers("line");
            _tool.toolBar.map.addLayer(_svgLayer);
            _tool._startMeasure();
        };
        //隐藏工具
        this.hide = function () {
            _tool.active = false;
            _tool.toolBar.map.setAction();
            _tool.toolBar.map.removeLayer(_svgLayer.id);
            _tool.drawLine.removeEventListener("drawprogress", "MeasureDistanceTool");
            _tool.drawLine.removeEventListener("drawend", "MeasureDistanceTool");
            _tool.drawLine.destory();
            _tool.container.css("border-bottom", "2px solid transparent");
        };
        //创建工具
        this._create = function (_toolBar) {
            _tool.toolBar = _toolBar;
            if (!imgUrl) { imgUrl = "../image/measure.png"; }
            _tool.container = $("<img/>")
            .attr("width", "30px")
            .attr("height", "30px")
            .attr("alt", "距离量算")
            .attr("src", imgUrl)
            .css("cursor", "pointer")
            .css("border-radius", "30px")
            .css("border-bottom", "2px solid transparent")
            .css("margin", "0px 3px 0px 3px")
            .click(function (evt) {
                _tool.dispatchEvent("click", evt);
                if (_tool.active) {
                    _tool.hide();
                }
                else {
                    _tool.run();
                }
            })
             .mouseover(function (evt) {
                 _tool.dispatchEvent("mouseover", evt);
             })
              .mouseout(function (evt) {
                  _tool.dispatchEvent("mouseout", evt);
              })
               .mousemove(function (evt) {
                   _tool.dispatchEvent("mousemove", evt);
               })
               .mousedown(function (evt) {
                   _tool.dispatchEvent("mousedown", evt);
               });
        };
        //开始量算
        this._startMeasure = function () {
            _tool.drawLine = new xf.DrawLineAction();
            _tool.toolBar.map.setAction(_tool.drawLine);
            _tool.drawLine.addEventListener("drawend", function (evtType, evt) {
                _svgLayer.removeChildByID("MeasureTemp");
                var geo = evt.geometry;
                var path = new Array(geo.path[0].length);
                for (var i = 0; i < geo.path[0].length; i++) {
                    path[i] = new xf.GeoPoint(geo.path[0][i].x, geo.path[0][i].y);
                }
                var gl = new xf.GeoLine([path]);
                var geoLine = new xf.SVG_Line("MeasureTemp", "MeasureTemp", gl);
                geoLine.stroke = "blue";
                geoLine.strokeWidth = 5;
                geoLine.strokeOpacity = 0.5;
                _svgLayer.addChild(geoLine);
                var distance = geo.getDistance()[0];
                var result = new xf.MeasureDistanceResult();
                result.geometry = geo;
                result.distance = distance;
                _tool.dispatchEvent("measureresult", result);
            }, "MeasureDistanceTool");
            _tool.drawLine.addEventListener("drawprogress", function (evtType, evt) {
                _svgLayer.removeChildByID("MeasureTemp");
                var geo = evt.geometry;
                var path = new Array(geo.path[0].length);
                for (var i = 0; i < geo.path[0].length; i++) {
                    path[i] = new xf.GeoPoint(geo.path[0][i].x, geo.path[0][i].y);
                }
                var gl = new xf.GeoLine([path]);
                var geoLine = new xf.SVG_Line("MeasureTemp", "MeasureTemp", gl);
                geoLine.stroke = "blue";
                geoLine.strokeWidth = 5;
                geoLine.strokeOpacity = "0.5";
                _svgLayer.addChild(geoLine);
                var distance = geo.getDistance()[0];
                var result = new xf.MeasureDistanceResult();
                result.geometry = geo;
                result.distance = distance;
                _tool.dispatchEvent("measureprogress", result);
            }, "MeasureDistanceTool");
        };
        //销毁
        this.distroy = function () {
            _tool.toolBar.map.setAction();
            _tool.toolBar.map.removeLayer(_svgLayer.id);
            _tool.drawLine.removeEventListener("drawprogress", "MeasureDistanceTool");
            _tool.drawLine.removeEventListener("drawend", "MeasureDistanceTool");
            _tool.drawLine.destory();
        };
    };
})(jQuery, XiaoFu);



