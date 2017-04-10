////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------InfoWindow对象----------------------------
////----------------创建日期：2012-9-25------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××InfoWindow对象×××××
XiaoFu.InfoWindow = function () {
    XiaoFu.Layer.apply(this, []);
    //地图图层
    this.map = null;
    //id
    this.id = null;
    this.x = 0;
    this.y = 0;
    this.width = 440;
    this.height = 90;
    this.title = "";
    this.strHtml = "";
    //自身
    var _self = this;
    var _isLoad = false;

    this.init = function (p_layerId) {
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
            var m_w = _self.width;
            var m_h = _self.height;
            var m_geoPoint = new XiaoFu.GeoPoint(_self.x, _self.y);
            var m_point = map.mapToPoint(m_geoPoint);
            var m_left = m_point.x - (m_w - 97) / 2;
            var m_top = m_point.y - 96 - m_h + 25;
            $("#myInfoWindow_news").css("left", m_left);
            $("#myInfoWindow_news").css("top", m_top);
        }
    }

    function clearInfoWindow() {
        $(_self.map.infoWindowContainer).html("");
    }

    function showInfoWindow() {
        var m_w = _self.width;
        var m_h = _self.height;
        var m_geoPoint = new XiaoFu.GeoPoint(_self.x, _self.y);
        var m_point = map.mapToPoint(m_geoPoint);
        var m_left = m_point.x - (m_w - 97) / 2;
        var m_top = m_point.y - 96 - m_h + 25;
        var m_iw = $("<div></div>")
            .attr("id", "myInfoWindow_news")
            .css("position", "absolute")
            .css("left", m_left)
            .css("top", m_top)
            .appendTo($(_self.map.infoWindowContainer));
        var m_iw0 = $("<div></div>")
            .css("position", "relative")
            .css("left", 0)
            .css("top", 0)
            .css("z-index", 10)
            .css("width", m_w)
            .css("height", m_h)
            .appendTo(m_iw);
        var m_iw_close = $("<img></img>")
            .click(function () {
                $(_self.map.infoWindowContainer).html("");
            })
            .css("position", "absolute")
            .css("left", m_w - 30)
            .css("top", 5)
            .css("width", 12)
            .css("height", 12)
            .css("border", 0)
            .css("padding", 0)
            .css("margin", 0)
            .css("cursor", "pointer")
            .css("z-index", 300)
            .attr("src", "../image/InfoWindow/iw_close.gif")
            .appendTo(m_iw0);
        var m_iw_div = $("<div></div>")
            .css("position", "absolute")
            .css("left", 16)
            .css("top", 16)
            .css("width", m_w - 32)
            .css("height", m_h - 32)
            .css("z-index", 10)
            .css("overflow", "auto")
            .html(_self.strHtml)
            .appendTo(m_iw0);
        var m_iw1 = $("<div></div>")
            .css("width", 25)
            .css("height", 25)
            .css("overflow", "hidden")
            .css("z-index", 1)
            .css("position", "absolute")
            .css("left", 0)
            .css("top", 0)
            .appendTo(m_iw);
        var m_iw_img1 = $("<img></img>")
            .css("position", "absolute")
            .css("left", 0)
            .css("top", 0)
            .css("width", 690)
            .css("height", 786)
            .css("border", 0)
            .css("padding", 0)
            .css("margin", 0)
            .attr("src", "../image/InfoWindow/iw3.png")
            .appendTo(m_iw1);
        var m_iw2 = $("<div></div>")
            .css("width", 25)
            .css("height", 25)
            .css("overflow", "hidden")
            .css("z-index", 1)
            .css("position", "absolute")
            .css("left", m_w - 25)
            .css("top", 0)
            .appendTo(m_iw);
        var m_iw_img2 = $("<img></img>")
            .css("position", "absolute")
            .css("left", -665)
            .css("top", 0)
            .css("width", 690)
            .css("height", 786)
            .css("border", 0)
            .css("padding", 0)
            .css("margin", 0)
            .attr("src", "../image/InfoWindow/iw3.png")
            .appendTo(m_iw2);
        var m_iw3 = $("<div></div>")
            .css("width", 97)
            .css("height", 96)
            .css("overflow", "hidden")
            .css("z-index", 1)
            .css("position", "absolute")
            .css("left", (m_w - 97) / 2)
            .css("top", m_h - 25)
            .appendTo(m_iw);
        var m_iw_img3 = $("<img></img>")
            .css("position", "absolute")
            .css("left", 0)
            .css("top", -691)
            .css("width", 690)
            .css("height", 786)
            .css("border", 0)
            .css("padding", 0)
            .css("margin", 0)
            .attr("src", "../image/InfoWindow/iw3.png")
            .appendTo(m_iw3);
        var m_iw4 = $("<div></div>")
            .css("width", 25)
            .css("height", 25)
            .css("overflow", "hidden")
            .css("z-index", 1)
            .css("position", "absolute")
            .css("left", 0)
            .css("top", m_h - 25)
            .appendTo(m_iw);
        var m_iw_img4 = $("<img></img>")
            .css("position", "absolute")
            .css("left", 0)
            .css("top", -665)
            .css("width", 690)
            .css("height", 786)
            .css("border", 0)
            .css("padding", 0)
            .css("margin", 0)
            .attr("src", "../image/InfoWindow/iw3.png")
            .appendTo(m_iw4);
        var m_iw5 = $("<div></div>")
            .css("width", 25)
            .css("height", 25)
            .css("overflow", "hidden")
            .css("z-index", 1)
            .css("position", "absolute")
            .css("left", m_w - 25)
            .css("top", m_h - 25)
            .appendTo(m_iw);
        var m_iw_img5 = $("<img></img>")
            .css("position", "absolute")
            .css("left", -665)
            .css("top", -665)
            .css("width", 690)
            .css("height", 786)
            .css("border", 0)
            .css("padding", 0)
            .css("margin", 0)
            .attr("src", "../image/InfoWindow/iw3.png")
            .appendTo(m_iw5);

        var m_iw6 = $("<div></div>")
            .css("position", "absolute")
            .css("left", 25)
            .css("top", 0)
            .css("width", m_w - 50)
            .css("height", 25)
            .css("background-color", "white")
            .css("border-top-width", 1)
            .css("border-top-style", "solid")
            .css("border-top-color", "rgb(171, 171, 171)")
            .appendTo(m_iw);
        var m_iw7 = $("<div></div>")
            .css("position", "absolute")
            .css("left", 0)
            .css("top", 25)
            .css("width", m_w - 2)
            .css("height", m_h - 50)
            .css("background-color", "white")
            .css("border-left-width", 1)
            .css("border-left-style", "solid")
            .css("border-left-color", "rgb(171, 171, 171)")
            .css("border-right-width", 1)
            .css("border-right-style", "solid")
            .css("border-right-color", "rgb(171, 171, 171)")
            .appendTo(m_iw);
        var m_iw8 = $("<div></div>")
            .css("position", "absolute")
            .css("left", 25)
            .css("top", m_h - 25)
            .css("width", m_w - 50)
            .css("height", 24)
            .css("background-color", "white")
            .css("border-bottom-width", 1)
            .css("border-bottom-style", "solid")
            .css("border-bottom-color", "rgb(171, 171, 171)")
            .appendTo(m_iw);
    }
}