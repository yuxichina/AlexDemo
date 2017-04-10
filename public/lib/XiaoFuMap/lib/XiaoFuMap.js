//名称：XiaoFu地图加载类库
//作者：GIS-Client Team YC
//说明：解决XiaoFu地图加载和Device识别问题
//更新
//2012-7-16
(function () {
    //注册命名空间
    if (typeof window.XiaoFu == "undefined") {
        window.XiaoFu = {};
    }
    //浏览器是否支持Touch事件
    XiaoFu.Touch = false;
    //浏览器控件定位对象
    XiaoFu.Geolocation = null;
    //浏览器是否采用Mobile布局
    XiaoFu.Mobile = false;
    //浏览器对象
    XiaoFu.Device = {};
    if (navigator) {
        var ua = XiaoFu.Device.ua = navigator.userAgent;
        var pf = XiaoFu.Device.platform = navigator.platform;
        var version = XiaoFu.Device.version = navigator.version;
        var geo = XiaoFu.Geolocation = navigator.geolocation;
    }
    //Xiaofu.hasOwnProperty
    if (window.hasOwnProperty("TouchEvent")) {
        XiaoFu.Touch = true;
    }
    if (XiaoFu.Device.platform.match("Linux") || XiaoFu.Device.platform == "iPad" || XiaoFu.Device.platform == "iPhone" || XiaoFu.Device.platform == "iPod") {
        XiaoFu.Mobile = true;
    }




    var scriptName = "XiaoFuMap.js";
    _getScriptLocation = (function () {
        var r = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)"),
                s = document.getElementsByTagName('script'),
                src, m, l = "";
        for (var i = 0, len = s.length; i < len; i++) {
            src = s[i].getAttribute('src');
            if (src) {
                var m = src.match(r);
                if (m) {
                    l = m[1];
                    break;
                }
            }
        }
        return (function () { return l; });
    })();
    var host = _getScriptLocation(scriptName);
    //脚本库
    var jsFiles = [
        "jQuery/jquery-1.7.2.min.js",
        "jQuery/UI/jquery.ui.core.js",
        "jQuery/UI/jquery.ui.widget.js",
        "jQuery/UI/jquery.ui.mouse.js",
        "jQuery/UI/jquery.ui.draggable.js",
        "jQuery/UI/jquery.ui.slider.js",
        "proj4/lib/proj4js-compressed.js",
        "../sample/Config.js",
        "Util/Console.js",
        "Util/Utils.js",
        "Util/json2.js",
        "Util/Unit.js",
        "Action/Action.js",
        "Action/PanAction.js",
        "Action/DrawPointAction.js",
        "Action/DrawLineAction.js",
        "Action/DrawPolygonAction.js",
        "Action/DrawRectAction.js",
        "Event/Event.js",
        "Event/Dispatch.js",
        "Core/Map.js",
        "Layers/Layer.js",
        "Layers/ImageLayer.js",
        "Layers/ArcGISCacheLayer.js",
        "Layers/NewGoogleCacheLayer.js",
        "Layers/GoogleCacheLayer.js",
        "Layers/BingCacheLayer.js",
        "Layers/BaiDuCacheLayer.js",
        "Geometry/Geometry.js",
        "Geometry/GeoPoint.js",
        "Geometry/GeoLine.js",
        "Geometry/GeoPolygon.js",
		"Geometry/Extent.js",
        "Element/Point.js",
        "Element/Size.js",
        "SVG/SVG_Point.js",
        "SVG/SVG_Line.js",
        "SVG/SVG_Polygon.js",
        "SVG/SVGLayers.js",
        "Marker/Marker.js",
        "Marker/MarkerLayers.js",
        "Request/Request.js",
        "Request/Query/Query.js",
        "Request/Query/QueryResult.js",
        "Measure/Measure.js",
        "Measure/MeasureResult.js",
        "Projection/Projection.js",
        "Projection/Transform.js",
        "Controls/Control.js",
        "Controls/NavigationBar.js",
        "Controls/ToolBar.js",
        "Controls/Tool.js",
        "Controls/MeasureDistanceTool.js",
        "Marker/base.js",
        "Marker/Marker_String.js",
        "Marker/Marker_jQuery.js",
		"InfoWindow/InfoWindow.js",
		"InfoWindow/BubbleInfoWindow.js",
		"InfoWindow/CoolBluesInfoWindow.js",
		"InfoWindow/FunkyBoxInfoWindow.js",
		"InfoWindow/OpacityInfoWindow.js",
		"InfoWindow/RedInfoWindow.js"
	];
    //样式库
    var cssFiles = [
        "jQuery/UI/themes/base/jquery.ui.all.css",
        "XiaoFuMap.css"
    ];
    var scriptTags = new Array(jsFiles.length);
    for (var i = 0, len = jsFiles.length; i < len; i++) { scriptTags[i] = "<script src='" + host + jsFiles[i] + "'></script>"; }
    if (scriptTags.length > 0) { document.write(scriptTags.join("")); }
    var cssTags = new Array(cssFiles.length);
    for (var i = 0, len = cssFiles.length; i < len; i++) { cssTags[i] = "<link href='" + host + cssFiles[i] + "' rel='stylesheet' type='text/css'/>"; }
    if (cssTags.length > 0) { document.write(cssTags.join("")); }

})();