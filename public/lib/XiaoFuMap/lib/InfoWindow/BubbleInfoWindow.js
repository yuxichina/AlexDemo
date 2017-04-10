////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------BubbleInfoWindow对象----------------------------
////----------------创建日期：2012-10-15------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××BubbleInfoWindow对象×××××
XiaoFu.BubbleInfoWindow = function () {
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
            var m_left = m_point.x - 175;
            var m_top = m_point.y - 243;
            $("#custom_info_window_bubble").css("left", m_left);
            $("#custom_info_window_bubble").css("top", m_top);
        }
    }

    function clearInfoWindow() {
        $("#myInfoWindow").html("");
    }

    function showInfoWindow() {
        var m_geoPoint = new XiaoFu.GeoPoint(_self.x, _self.y);
        var m_point = map.mapToPoint(m_geoPoint);
        var m_left = m_point.x - 175;
        var m_top = m_point.y - 243;
        var m_iw = $("<div></div>")
            .attr("id", "custom_info_window_bubble")
            .css("position", "absolute")
            .css("visibility", "visible")
            .css("display", "block")
            .css("width", 350)
            .css("left", m_left)
            .css("top", m_top)
            .appendTo($("#myInfoWindow"));
        var m_iw_div = $("<div></div>")
            .appendTo(m_iw);
        var m_iw_div_tl = $("<div></div>")
            .attr("id", "custom_info_window_bubble_tl")
            .css("position", "absolute")
            .css("width", 48)
            .css("height", 48)
            .css("top", 0)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_t = $("<div></div>")
            .attr("id", "custom_info_window_bubble_t")
            .css("position", "absolute")
            .css("width", 258)
            .css("height", 48)
            .css("top", 0)
            .css("left", 48)
            .appendTo(m_iw_div);
        var m_iw_div_tr = $("<div></div>")
            .attr("id", "custom_info_window_bubble_tr")
            .css("position", "absolute")
            .css("width", 48)
            .css("height", 48)
            .css("top", 0)
            .css("left", 306)
            .appendTo(m_iw_div);
        var m_iw_div_l = $("<div></div>")
            .attr("id", "custom_info_window_bubble_l")
            .css("position", "absolute")
            .css("width", 2)
            .css("height", 78)
            .css("top", 48)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_r = $("<div></div>")
            .attr("id", "custom_info_window_bubble_r")
            .css("position", "absolute")
            .css("width", 2)
            .css("height", 78)
            .css("top", 48)
            .css("left", 352)
            .appendTo(m_iw_div);
        var m_iw_div_bl = $("<div></div>")
            .attr("id", "custom_info_window_bubble_bl")
            .css("position", "absolute")
            .css("width", 48)
            .css("height", 48)
            .css("top", 126)
            .css("left", 0)
            .appendTo(m_iw_div);
        var m_iw_div_b = $("<div></div>")
            .attr("id", "custom_info_window_bubble_b")
            .css("position", "absolute")
            .css("width", 258)
            .css("height", 48)
            .css("top", 126)
            .css("left", 48)
            .appendTo(m_iw_div);
        var m_iw_div_br = $("<div></div>")
            .attr("id", "custom_info_window_bubble_br")
            .css("position", "absolute")
            .css("width", 48)
            .css("height", 48)
            .css("top", 126)
            .css("left", 306)
            .appendTo(m_iw_div);
        var m_iw_div_beak = $("<div></div>")
            .attr("id", "custom_info_window_bubble_beak")
            .css("position", "absolute")
            .css("width", 49)
            .css("height", 69)
            .css("top", 172)
            .css("left", 152.5)
            .appendTo(m_iw_div);
        var m_iw_div_contents = $("<div></div>")
            .attr("id", "custom_info_window_bubble_contents")
            .css("position", "absolute")
            .css("visibility", "visible")
            .css("display", "block")
            .css("overflow", "auto")
            .css("width", 350)
            .css("height", 78)
            .css("top", 48)
            .css("left", 2)
            .appendTo(m_iw_div);
        var m_p = $("<p></p>")
            .html(_self.strHtml)
            .appendTo(m_iw_div_contents);
        var m_iw_div_close = $("<div></div>")
            .attr("id", "custom_info_window_bubble_close")
            .css("position", "absolute")
            .css("width", 20)
            .css("height", 20)
            .css("top", 2)
            .css("left", 332)
            .appendTo(m_iw_div);
    }
}