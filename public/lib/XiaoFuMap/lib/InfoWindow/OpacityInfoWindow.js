////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------OpacityInfoWindow对象----------------------------
////----------------创建日期：2012-10-15------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××OpacityInfoWindow对象×××××
XiaoFu.OpacityInfoWindow = function () {
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
            var m_left = m_point.x - 171.5;
            var m_top = m_point.y - 208;
            $("#opacity_window").css("left", m_left);
            $("#opacity_window").css("top", m_top);
        }
    }

    function clearInfoWindow() {
        $("#myInfoWindow").html("");
    }

    function showInfoWindow() {
        var m_geoPoint = new XiaoFu.GeoPoint(_self.x, _self.y);
        var m_point = map.mapToPoint(m_geoPoint);
        var m_left = m_point.x - 171.5;
        var m_top = m_point.y - 208;
        var m_iw = $("<div></div>")
            .attr("id", "opacity_window")
            .css("position", "absolute")
            .css("visibility", "visible")
            .css("display", "block")
            .css("width", 300)
            .css("left", m_left)
            .css("top", m_top)
            .appendTo($("#myInfoWindow"));
        var m_iw_div = $("<div></div>")
            .appendTo(m_iw);
        var m_iw_div_tl = $("<div></div>")
            .attr("id", "opacity_window_tl")
            .css("position", "absolute")
            .css("width", 22)
            .css("height", 22)
            .css("top", 0)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_t = $("<div></div>")
            .attr("id", "opacity_window_t")
            .css("position", "absolute")
            .css("width", 300)
            .css("height", 22)
            .css("top", 0)
            .css("left", 22)
            .appendTo(m_iw_div);
        var m_iw_div_tr = $("<div></div>")
            .attr("id", "opacity_window_tr")
            .css("position", "absolute")
            .css("width", 21)
            .css("height", 22)
            .css("top", 0)
            .css("left", 322)
            .appendTo(m_iw_div);
        var m_iw_div_l = $("<div></div>")
            .attr("id", "opacity_window_l")
            .css("position", "absolute")
            .css("width", 22)
            .css("height", 124)
            .css("top", 22)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_r = $("<div></div>")
            .attr("id", "opacity_window_r")
            .css("position", "absolute")
            .css("width", 21)
            .css("height", 124)
            .css("top", 22)
            .css("left", 322)
            .appendTo(m_iw_div);
        var m_iw_div_bl = $("<div></div>")
            .attr("id", "opacity_window_bl")
            .css("position", "absolute")
            .css("width", 22)
            .css("height", 18)
            .css("top", 146)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_b = $("<div></div>")
            .attr("id", "opacity_window_b")
            .css("position", "absolute")
            .css("width", 300)
            .css("height", 18)
            .css("top", 146)
            .css("left", 22)
            .appendTo(m_iw_div);
        var m_iw_div_br = $("<div></div>")
            .attr("id", "opacity_window_br")
            .css("position", "absolute")
            .css("width", 21)
            .css("height", 18)
            .css("top", 146)
            .css("left", 322)
            .appendTo(m_iw_div);
        var m_iw_div_beak = $("<div></div>")
            .attr("id", "opacity_window_beak")
            .css("position", "absolute")
            .css("width", 50)
            .css("height", 62)
            .css("top", 146)
            .css("left", 146.5)
            .appendTo(m_iw_div);
        var m_iw_div_contents = $("<div></div>")
            .attr("id", "opacity_window_contents")
            .css("position", "absolute")
            .css("display", "block")
            .css("visibility", "visible")
            .css("overflow", "auto")
            .css("width", 300)
            .css("height", 124)
            .css("top", 22)
            .css("left", 22)
            .appendTo(m_iw_div);
        var m_p = $("<p></p>")
            .html(_self.strHtml)
            .appendTo(m_iw_div_contents);
        var m_iw_div_close = $("<div></div>")
            .attr("id", "opacity_window_close")
            .click(function () {
                $("#myInfoWindow").html("");
            })
            .css("position", "absolute")
            .css("width", 13)
            .css("height", 13)
            .css("top", 18)
            .css("left", 312)
            .appendTo(m_iw_div);
    }
}