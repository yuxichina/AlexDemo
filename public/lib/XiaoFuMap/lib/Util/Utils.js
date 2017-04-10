//名称：Utils
//作者：GIS-Client Team YC
//说明：辅助参数
//更新
//2012-7-16
XiaoFu.Utils = {};
(function ($, u) {
    u.isNumber = function (num) {
        return !isNaN(num);
    };
    u.isString = function(s){
        return typeof s === "string";
    };
    u.isBoolean= function(s){
        return typeof s === "boolean";
    };
    u.isFunction = function(s){
        return typeof s === "function";
    };
    u.isNull = function(s){
        return  s === null;
    };
    u.isUndefined = function(s){
        return typeof s === "undefined";
    };
    u.isEmpty = function(s){
        return /^\s*$/.test(s);
    };
    u.isArray = function(s){
        return s instanceof Array;
    };
    u.trim = function(s){
        return s.replace(/^\s+|\s+$/g,"");  
    };
    u.version = function(){
        return "XiaoFu:Alpha2";
    };
    u.random = function(){
        return new Date().getTime();
    };
    u.getAngleRadians = function(angle){
         return Math.PI * angle / 180;    
    };
    //距离量算 WGS84坐标系下
    u.getDistance = function(fPoint,tPoint){
        var fX = u.getAngleRadians(fPoint.x);
        var fY = u.getAngleRadians(fPoint.y);
        var tX = u.getAngleRadians(tPoint.x);
        var tY = u.getAngleRadians(tPoint.y);
        return XiaoFu.Params.EarthRadius * Math.acos((Math.sin(fY) * Math.sin(tY) + Math.cos(fY) * Math.cos(tY) * Math.cos(fX-tX)));
    };
    u.pointToCircle = function(point,radius,count){
        var path = [];
        var angleGap = (2*Math.PI)/count;
        for(var i=0;i<count;i++){
            var angle = angleGap * i;
            var p = new XiaoFu.GeoPoint(point.x - Math.sin(angle)*radius, point.y - Math.cos(angle)*radius);
            path.push(p);
        
        }
        return path;
    };
    u.getMousePosition = function(mouseEvent, referDom){
        var top = $(referDom).position().top;
        var left = $(referDom).position().left;
        return new XiaoFu.Point(mouseEvent.pageX - left, mouseEvent.pageY - top);
    
    };
})(jQuery, XiaoFu.Utils);

XiaoFu.Params = {};
(function ($, u) {
    u.EarthRadius = 6378137;//6370996.81;
})(jQuery, XiaoFu.Params);