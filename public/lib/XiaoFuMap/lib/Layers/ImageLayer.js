//名称：ImageLayer
//作者：GIS-Client Team YC
//说明：图片缓存图层
//更新
//2012-7-16
(function ($, xf) {
    xf.ImageLayer = function (_url, _params) {
        xf.Layer.apply(this, [_url]);
        this.type = "ImageLayer";
        //服务地址
        this.serverUrl = "";
        //是否是基础图层 比例尺分级以及范围界定
        this.isBaseLayer = true;
        //是否缓存图层
        this.isCacheLayer = true;
        //名称
        this.name = null;
        //地图
        this.map = null;
        //加载图片对象
        this.cacheImages = new Array();
        //当前范围
        this.currentExtent = null;
        //加载范围 
        this.loadExtent = null;
        //当前分辨率
        this.resolution = null;
        //加载比例尺
        this.level = 3;
        //Layer Container的偏移
        this.containerOffset = null;
        //图层中心点
        this.center = null;
        //分幅大小
        this.tileSize = 256;
        //标识ID
        this.tempID = "";
        init = function (self) {
            var args = self.constructor.arguments;
            if (args) {
                if (args[0] && xf.Utils.isString(args[0])) { self.url = args[0]; }
                initLayer(self);
            }
        };
        initLayer = function (self) {

        };
        init(this);
        /*****************************************************方法*****************************************/

        /*公有*/
        //设置参数
        this.setParams = function () { };
        //获取参数
        this.getParams = function () { };
        //初始化
        this.create = function () { };
        //图层刷新
        this.update = function (extent) { };
        //从缓存中获取Img
        this.getImgFromCache = function (id) { };
        this.getXYZID = function (id) { }
        this.addImgToCache = function (img) { };
        //更新地图空间参数
        this.updateMap = function () { };
        //偏移缓存
        this.offsetCache = function (x, y, update) { };
        //缩放 缩放中心点 缩放比例  
        this.zoom = function (center, radio, offset) { };
        //Utils
        //级别是否在范围内
        this.levelInLods = function (level) { };
        //根据中心点和分辨率 获取可视范围
        this.getViewExtentByCenter = function (center, res) { };
        //根据分辨率获取可视范围
        this.getGeoViewByRes = function (res) { };
        //是否包含
        this.incluedExtent = function (e1, e2) {
            if (e1.maxX < e2.minX || e1.minX > e2.maxX || e1.minY > e2.maxY || e1.maxY < e2.minY) {
                return true;
            }
            else {
                return false;
            }
        };
        //获取分幅图片范围
        this.getTileExtent = function (tileX, tileY) { };
        //获取某点的Tile分幅信息
        this.getContainingTileCoords = function (point, res) { };
        //获取左上角Tile信息
        this.getLeftTopTile = function () { };
        //获取右下角Tile信息
        this.getRightBottomTile = function () { };
        //根据分辨率获取最大加载范围
        this.getLoadMaxExtent = function (resolution) { };
        //获取中心点
        this.getCenter = function () { };
        //私有方法
        this._setLayerStatus = function (status) { };
        this._getUrl = function () { };
        this.getCenter = function () { };
    };
})(jQuery, XiaoFu);