////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------CoolBluesInfoWindow对象----------------------------
////----------------创建日期：2012-10-15------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××CoolBluesInfoWindow对象×××××
XiaoFu.CoolBluesInfoWindow = function () {
    XiaoFu.InfoWindow.apply(this, []);

    //自身
    var _self = this;
    var _isLoad = false;

    this.init = function (p_layerId) {
        if ($("#myInfoWindow").length) {
            clearInfoWindow();
        } else {
            var m_infoWindow = $("<div></div>")
                .attr("id", "myInfoWindow")
                .css("position", "absolute")
                .css("left", 0)
                .css("top", 0)
                .css("z-index", 307)
                .css("cursor", "default")
                .appendTo($("#MapContainer"));
        }
        _isLoad = true;
        _self.id = p_layerId;
        _self.update();
    }

    this.show = function () {
        if (_isLoad) {
            showInfoWindow();
        }
    }

    this.hide = function () {
        if (_isLoad) {
            clearInfoWindow();
        }
    }

    this.update = function () {
        if (_isLoad) {
            var m_geoPoint = new XiaoFu.GeoPoint(_self.x, _self.y);
            var m_point = map.mapToPoint(m_geoPoint);
            var m_left = m_point.x - 80;
            var m_top = m_point.y - 204;
            $("#extInfoWindow_coolBlues").css("left", m_left);
            $("#extInfoWindow_coolBlues").css("top", m_top);
        }
    }

    function clearInfoWindow() {
        $("#myInfoWindow").html("");
    }

    function showInfoWindow() {
        var m_geoPoint = new XiaoFu.GeoPoint(_self.x, _self.y);
        var m_point = map.mapToPoint(m_geoPoint);
        var m_left = m_point.x - 80;
        var m_top = m_point.y - 204;
        var m_iw = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues")
            .css("position", "absolute")
            .css("visibility", "visible")
            .css("display", "block")
            .css("width", 233)
            .css("left", m_left)
            .css("top", m_top)
            .appendTo($("#myInfoWindow"));
        var m_iw_div = $("<div></div>")
            .appendTo(m_iw);
        var m_iw_div_tl = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_tl")
            .css("position", "absolute")
            .css("width", 1)
            .css("height", 1)
            .css("top", 0)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_t = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_t")
            .css("position", "absolute")
            .css("width", 233)
            .css("height", 1)
            .css("top", 0)
            .css("left", 1)
            .appendTo(m_iw_div);
        var m_iw_div_tr = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_tr")
            .css("position", "absolute")
            .css("width", 1)
            .css("height", 1)
            .css("top", 0)
            .css("left", 234)
            .appendTo(m_iw_div);
        var m_iw_div_l = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_l")
            .css("position", "absolute")
            .css("width", 1)
            .css("height", 110)
            .css("top", 1)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_r = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_r")
            .css("position", "absolute")
            .css("width", 1)
            .css("height", 110)
            .css("top", 1)
            .css("left", 234)
            .appendTo(m_iw_div);
        var m_iw_div_bl = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_bl")
            .css("position", "absolute")
            .css("width", 1)
            .css("height", 1)
            .css("top", 111)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_b = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_b")
            .css("position", "absolute")
            .css("width", 233)
            .css("height", 1)
            .css("top", 111)
            .css("left", 1)
            .appendTo(m_iw_div);
        var m_iw_div_br = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_br")
            .css("position", "absolute")
            .css("width", 1)
            .css("height", 1)
            .css("top", 111)
            .css("left", 234)
            .appendTo(m_iw_div);
        var m_iw_div_beak = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_beak")
            .css("position", "absolute")
            .css("width", 235)
            .css("height", 93)
            .css("top", 111)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_contents = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_contents")
            .css("position", "absolute")
            .css("display", "block")
            .css("visibility", "visible")
            .css("overflow", "auto")
            .css("width", 233)
            .css("height", 110)
            .css("top", 1)
            .css("left", 1)
            .appendTo(m_iw_div);
        var m_p = $("<div></div>")
            .html(_self.strHtml)
            .appendTo(m_iw_div_contents);
        var m_iw_div_close = $("<div></div>")
            .attr("id", "extInfoWindow_coolBlues_close")
            .click(function () {
                $("#myInfoWindow").html("");
            })
            .css("position", "absolute")
            .css("width", 20)
            .css("height", 20)
            .css("top", 1)
            .css("left", 214)
            .appendTo(m_iw_div);
    }
}