//名称：Layer
//作者：GIS-Client Team YC
//说明：图层对象基类
//更新
//2012-7-16
(function ($, xf) {
    xf.Layer = function (_url, _params) {
        xf.Dispatch.apply(this, []);
        var _layer = this;
        //所属地图
        this.map = null;
        //类型
        this.type = "XiaoFu.Layer";
        //状态
        this.states = 0;  //0:完成 1:完成
        //Id
        this.id = "";
        //透明度
        var _opacity = 1;
        //initparam
        var initParam = null;
        //坐标系
        this.spatialReference = null;
        //初始化范围
        this.initialExtent = null;
        //全幅范围
        this.fullExtent = null;
        //
        this.isCacheLayer = false;
        //设置透明度
        this.setOpacity = function (o) {
            if (_layer.container) {
                $(_layer.container).css("opacity", o);
            }
            _opacity = o;
        }
        this.getOpacity = function () { return _opacity; }
        //是否可见
        var _visiable = true;
        this.setVisiable = function (visiable) {
            _visiable = visiable;
            if (visiable && _layer.container) {
                _layer.show();
            }
            else {
                _layer.hide();
            }

        };
        this.getVisiable = function () {
            return _visiable;
        };
        //地图服务地址
        this.url = _url;
        //LayerContainer
        this.container = "";
        //加载完成
        this.loaded = null;

        //
        //隐藏
        this.hide = function () {
            _visiable = false;
            if (this.container) {
                $(this.container).hide();
            }
        };
        //显示
        this.show = function () {
            _visiable = true;
            if (this.container) {
                $(this.container).show();
            }
        };
        //刷新
        this.update = function (_viewbounds, _level) {


        }
        this.offset = function (_x, _y, _offsetCache) {
            //$(this.container).offset(_x, _y);
            var container = $(this.container);
            var imgs = container.find("img");
            for (var i = 0; i < imgs.length; i++) {
                //$(imgs[i]).offset(_x, _y);
                var img = $(imgs[i]);
                var left = img.css("left");
                left = left.substring(0, left.length - 2);
                var top = img.css("top");
                top = top.substring(0, top.length - 2);
                left = parseInt(left);
                top = parseInt(top);
                left += _x;
                top += _y;
                img
                .css("left", left)
                .css("top", top);
            }
            if (xf.Utils.isFunction(this.offsetCache)) {
                this.offsetCache(_x, _y, _offsetCache);
            }
        };
        this.zoom = function () { };

        //错误
        this.onError = null;
        this.onLoaded = null;
        this.destory = function () {
//            $(_layer.container).parent.remove();
//            _layer = null;
//            delete _layer;
        };
    };
})(jQuery, XiaoFu);
