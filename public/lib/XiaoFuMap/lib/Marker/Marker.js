////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------Marker—点对象----------------------------
////----------------创建日期：2012-7-6------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××Marker对象×××××
//p_id（点id）
//p_name（名称）
//p_x（x坐标）
//p_y（y坐标）
XiaoFu.Marker = function (p_id, p_name, p_x, p_y) {
    XiaoFu.Dispatch.apply(this, []);
    this.id = null;
    this.x = null;
    this.y = null;
    this.name = null;
    //简介
    this.description = "";
    //w（宽度）
    this.w = 10;
    //h（高度）
    this.h = 10;
    //图片路径
    this.url = "../image/red.png";
    //对齐方式—0：中间对齐，1：左对齐，2：右对齐，3：上对齐，4：下对齐，5：左上对齐，6：左下对齐，7：右上对齐，8：右下对齐
    this.alignment = 0;
    //名称文字大小
    this.nameSize = 10;
    //名称文字颜色
    this.nameColor = "red";
    //名称是否可见
    this.nameVisiable = false;
    //需要关联的数据
    this.data = null;
    //是否可见
    this.visiable = true;
    //自身
    var _self = this;
    //点击事件
    //this.onclick = null;
    init = function (p_self) {
        p_self.id = p_id;
        p_self.x = p_x;
        p_self.y = p_y;
        p_self.name = p_name;
    }

    this.addMarker = function (p_point, p_id) {
        if (!_self.visiable)
            return;
        var m_top = p_point.y;
        var m_left = p_point.x;
        //0：中间对齐，
        if (_self.alignment == 0) {
            m_top = m_top - _self.h / 2;
            m_left = m_left - _self.w / 2;
        }
        //1：左对齐，
        else if (_self.alignment == 1) {
            m_top = m_top - _self.h / 2;
        }
        //2：右对齐，
        else if (_self.alignment == 2) {
            m_top = m_top - _self.h / 2;
            m_left = m_left - _self.w;
        }
        //3：上对齐，
        else if (_self.alignment == 3) {
            m_left = m_left - _self.w / 2;
        }
        //4：下对齐，
        else if (_self.alignment == 4) {
            m_left = m_left - _self.w / 2;
        }
        //5：左上对齐，
        else if (_self.alignment == 5) {
            m_top = m_top;
            m_left = m_left;
        }
        //6：左下对齐，
        else if (_self.alignment == 6) {
            m_top = m_top - _self.h;
        }
        //7：右上对齐，
        else if (_self.alignment == 7) {
            m_left = m_left - _self.w;
        }
        //8：右下对齐
        else if (_self.alignment == 8) {
            m_top = m_top - _self.h;
            m_left = m_left - _self.w;
        }
        var m_img = $("<img/>")
                    .attr("id", "marker_" + _self.id)
                    .click(function () {
                        _self.dispatchEvent("click", _self);
                    })
                    .attr("src", _self.url)
                    .css("width", _self.w)
                    .css("height", _self.h)
                    .css("position", "absolute")
                    .css("top", m_top)
                    .css("left", m_left)
                    .css("cursor", "pointer")
                    .css("border", "0px solid white")
                    .hover(function () {
                        _self.dispatchEvent("onMouseOver", this);
                    }, function () {
                        _self.dispatchEvent("onMouseOut", this);
                    })
                    .appendTo($("#" + p_id));
    }

    this.updataMarker = function (p_point) {
        if (!_self.visiable) {
            _self.deleteMarker();
            return;
        }
        var m_top = p_point.y;
        var m_left = p_point.x;
        //0：中间对齐，
        if (_self.alignment == 0) {
            m_top = m_top - _self.h / 2;
            m_left = m_left - _self.w / 2;
        }
        //1：左对齐，
        else if (_self.alignment == 1) {
            m_top = m_top - _self.h / 2;
        }
        //2：右对齐，
        else if (_self.alignment == 2) {
            m_top = m_top - _self.h / 2;
            m_left = m_left - _self.w;
        }
        //3：上对齐，
        else if (_self.alignment == 3) {
            m_left = m_left - _self.w / 2;
        }
        //4：下对齐，
        else if (_self.alignment == 4) {
            m_left = m_left - _self.w / 2;
        }
        //5：左上对齐，
        else if (_self.alignment == 5) {
            m_top = m_top;
            m_left = m_left;
        }
        //6：左下对齐，
        else if (_self.alignment == 6) {
            m_top = m_top - _self.h;
        }
        //7：右上对齐，
        else if (_self.alignment == 7) {
            m_left = m_left - _self.w;
        }
        //8：右下对齐
        else if (_self.alignment == 8) {
            m_top = m_top - _self.h;
            m_left = m_left - _self.w;
        }
        $("#marker_" + _self.id).css("top", m_top);
        $("#marker_" + _self.id).css("left", m_left);
    }

    this.deleteMarker = function () {
        try {
            var ob = document.getElementById("marker_" + _self.id);
            ob.parentNode.removeChild(ob);
        }
        catch (e) {

        }
    }

    init(this);
};