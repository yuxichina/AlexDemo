////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------FunkyBoxInfoWindow对象----------------------------
////----------------创建日期：2012-10-15------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××FunkyBoxInfoWindow对象×××××
XiaoFu.FunkyBoxInfoWindow = function () {
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
            var m_left = m_point.x - 131;
            var m_top = m_point.y - 153;
            $("#extInfoWindow_funkyBox").css("left", m_left);
            $("#extInfoWindow_funkyBox").css("top", m_top);
        }
    }

    function clearInfoWindow() {
        $("#myInfoWindow").html("");
    }

    function showInfoWindow() {
        var m_geoPoint = new XiaoFu.GeoPoint(_self.x, _self.y);
        var m_point = map.mapToPoint(m_geoPoint);
        var m_left = m_point.x - 131;
        var m_top = m_point.y - 153;
        var m_iw = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox")
            .css("position", "absolute")
            .css("visibility", "visible")
            .css("display", "block")
            .css("width", 240)
            .css("left", m_left)
            .css("top", m_top)
            .appendTo($("#myInfoWindow"));
        var m_iw_div = $("<div></div>")
            .appendTo(m_iw);
        var m_iw_div_tl = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_tl")
            .css("position", "absolute")
            .css("width", 23)
            .css("height", 23)
            .css("top", 0)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_t = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_t")
            .css("position", "absolute")
            .css("width", 220)
            .css("height", 23)
            .css("top", 0)
            .css("left", 23)
            .appendTo(m_iw_div);
        var m_iw_div_tr = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_tr")
            .css("position", "absolute")
            .css("width", 22)
            .css("height", 23)
            .css("top", 0)
            .css("left", 243)
            .appendTo(m_iw_div);
        var m_iw_div_l = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_l")
            .css("position", "absolute")
            .css("width", 23)
            .css("height", 68)
            .css("top", 23)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_r = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_r")
            .css("position", "absolute")
            .css("width", 2)
            .css("height", 68)
            .css("top", 23)
            .css("left", 263)
            .appendTo(m_iw_div);
        var m_iw_div_bl = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_bl")
            .css("position", "absolute")
            .css("width", 23)
            .css("height", 23)
            .css("top", 91)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_b = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_b")
            .css("position", "absolute")
            .css("width", 220)
            .css("height", 23)
            .css("top", 91)
            .css("left", 23)
            .appendTo(m_iw_div);
        var m_iw_div_br = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_br")
            .css("position", "absolute")
            .css("width", 22)
            .css("height", 23)
            .css("top", 91)
            .css("left", 243)
            .appendTo(m_iw_div);
        var m_iw_div_beak = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_beak")
            .css("position", "absolute")
            .css("width", 175)
            .css("height", 42)
            .css("top", 112)
            .css("left", 45)
            .appendTo(m_iw_div);
        var m_iw_div_contents = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_contents")
            .css("position", "absolute")
            .css("display", "block")
            .css("visibility", "visible")
            .css("overflow", "auto")
            .css("width", 240)
            .css("height", 68)
            .css("top", 23)
            .css("left", 23)
            .appendTo(m_iw_div);
        var m_p = $("<p></p>")
            .html(_self.strHtml)
            .appendTo(m_iw_div_contents);
        var m_iw_div_close = $("<div></div>")
            .attr("id", "extInfoWindow_funkyBox_close")
            .click(function () {
                $("#myInfoWindow").html("");
            })
            .css("position", "absolute")
            .css("width", 14)
            .css("height", 14)
            .css("top", 2)
            .css("left", 249)
            .appendTo(m_iw_div);
    }
}