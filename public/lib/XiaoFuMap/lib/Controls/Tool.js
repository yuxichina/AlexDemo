//名称：Tool
//作者：GIS-Client Team YC
//说明：工具
//更新
//2012-8-15
(function ($, xf) {
    xf.Tool = function (imgUrl) {
        //事件 click mouseover mousedown mouseout mouse
        xf.Control.apply(this, []);
        var _tool = this;
        this.type = "XiaoFu.Tool";
        //容器
        this.container = null;
        //工具条
        this.toolBar = null;
        //创建工具
        this._create = function () {
            _tool.container = $("<img/>")
            .attr("width", "30px")
            .attr("height", "30px")
            .attr("src", imgUrl)
            .css("cursor", "pointer")
            .css("padding", "0px 3px 0px 3px")
            .click(function (evt) {
                _tool.dispatchEvent("onclick", evt);
            })
             .mouseover(function (evt) {
                 _tool.dispatchEvent("onmouseover", evt);
             })
              .mouseout(function (evt) {
                  _tool.dispatchEvent("onmouseout", evt);
              })
               .mousemove(function (evt) {
                   _tool.dispatchEvent("onmousemove", evt);
               })
            ;

        }
        //销毁工具
        this.destory = function () { this.container.remove(); };


    };
})(jQuery, XiaoFu);



