////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------SVGLayers—线对象----------------------------
////----------------创建日期：2012-7-6------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

//×××××SVGLayers—线对象×××××
//p_id（线id）
//p_name（名称）
//p_array（点集合）
XiaoFu.SVG_Line = function (p_id, p_name, p_geometry) {
    XiaoFu.Dispatch.apply(this, []);
    this.id = null;
    //this.array = null;
    this.geometry = null;
    this.name = null;
    //简介
    this.description = "";
    //颜色
    this.stroke = "#ee9900";
    //宽度
    this.strokeWidth = 1;
    //透明度
    this.strokeOpacity = 1;
    //头尾类型
    this.strokeLinecap = "round";
    //折角类型
    this.strokeLinejoin = "round";

    this.strokeDasharray = "none";
    this.pointerEvents = "none";
    this.cursor = "inherit";

    //名称文字大小
    this.nameSize = 10;
    //名称文字颜色
    this.nameColor = "red";
    //需要关联的数据
    this.data = null;
    //是否可见
    this.visiable = true;
    //自身
    var _self = this;
    //自身id
    var _sid = "";
    //点击事件
    //this.onclick = null;
    init = function (p_self) {
        p_self.id = p_id;
        p_self.name = p_name;
        //p_self.array = p_array;
        p_self.geometry = p_geometry;
    }

    this.addChild = function (p_svg, p_strPoints, p_id, p_j) {
        _sid = "svg_" + p_id + "_" + _self.id + "_" + p_j;
        var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        m_rect.setAttribute("id", _sid);   //id唯一标识
        m_rect.setAttribute("points", p_strPoints);   //点集合
        m_rect.setAttribute("fill", "none");   //填充颜色(rgb 值、颜色名或者十六进制值)
        m_rect.setAttribute("stroke", _self.stroke);   //边框的颜色
        m_rect.setAttribute("stroke-opacity", _self.strokeOpacity);   //边框颜色透明度(合法的范围是：0 - 1)
        m_rect.setAttribute("stroke-width", _self.strokeWidth);   //边框宽度
        m_rect.setAttribute("stroke-linecap", _self.strokeLinecap);   //定义绘制轮廓时在轮廓的末尾使用的造型(butt|round|square)
        m_rect.setAttribute("stroke-linejoin", _self.strokeLinejoin);   //定义绘制折线的角时使用的造型(miter|round|bevel|)
        m_rect.setAttribute("stroke-dasharray", _self.strokeDasharray);   //定义为得到点线所应用的阵列
        m_rect.setAttribute("pointer-events", _self.pointerEvents);   //指针事件
        m_rect.setAttribute("cursor", _self.cursor);   //独立于平台的光标
        p_svg.appendChild(m_rect);
        var m_doc = $("#" + _sid);
        m_doc.click(function () {
            _self.dispatchEvent("click", _self);
        })
    }

    this.updataChild = function (p_strPoints) {
        $("#" + _sid).attr("points", p_strPoints);
    }

    this.deleteChild = function () {
        try {
            var ob = document.getElementById(_sid);
            ob.parentNode.removeChild(ob);
        }
        catch (e) {

        }
    }

    init(this);
    return this;
};