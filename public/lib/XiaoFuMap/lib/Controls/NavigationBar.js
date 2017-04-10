//名称：Layer
//作者：GIS-Client Team YC
//说明：图层对象基类
//更新
//2012-8-2
(function ($, xf) {
    xf.Navigation = function (options) {
        xf.Control.apply(this, []);
        var _option = {
            scaleBar: false,
            navBar: false,
            zoomInBar: false,
            zoomOuBar: false,
            locationBar: false,
            position: { left: 0, top: 0 },
            touchType: false,
            visiable: true
        };
        //图标资源
        var _zoomInImgUrl = "../image/zoom-in.png";
        var _zoomOutImgUrl = "../image/zoom-out.png";
        var _unZoomInImgUrl = "../image/un-zoom-in.png";
        var _unZoomOutImgUrl = "../image/un-zoom-out.png";
        var _navImgUrl = "../image/nav.png";
        var _locationUrl = "../image/location.png";
        //是否开始平移
        var _startPan = false;
        //正在平移过程中
        var _paning = false;
        //面板位置
        var _offsetX = null;
        var _offsetY = null;
        //控件
        var _control = this;
        //关联地图
        this.map = null;
        //容器
        this.container = null;
        //导航面板
        this.navBar = null;
        //比例尺工具
        this.scaleBar = null;
        //放大工具
        this.zoomInBar = null;
        //缩小工具
        this.zoomOutBar = null;
        //定位控件
        this.locationBar = null;
        //当前位置
        this.currentLoaction = null;
        //位置显示SVG层
        this.locationLayer = null;
        //创建控件
        this._create = function (map) {

            this.map = map;
            var index = map.LayerIndexList.Control + map.controls.length;
            //alert(index);
            this.container = _option.visiable ? this._createContainer(index) : this._createContainer(index).fadeOut(0);
            this.navBar = _option.navBar ? this._createNavBar(index) : this._createNavBar(index).hide();
            this.locationBar = _option.locationBar ? this._createLocationBar(index) : this._createLocationBar(index).hide();
            this.zoomInBar = _option.zoomInBar ? this._createZoomInBar(index) : this._createZoomInBar(index).hide();
            this.scaleBar = _option.scaleBar ? this._createScaleBar(index) : this._createScaleBar(index).hide();
            this.zoomOutBar = _option.zoomOutBar ? this._createZoomOutBar(index) : this._createZoomOutBar(index).hide();
            if (_control.map.getBaseLayer().lods) {
                this._initScaleBar();
            }
            else {
                this.map.addEventListener("init", this._initScaleBar);
            }
            //}
            this.map.addEventListener("zoomstart", function (eventType, event) {
                var _level = event.toLevel;
                if (!$.mobile) {
                    _control.scaleBar.slider("value", _level);
                }
            }
            );
            this.map.addEventListener("panstart", function () {
                _paning = true;
            }
            );
            this.map.addEventListener("panend", function () {
                _paning = false;
                if (_startPan && !_paning) {
                    var res = _control.map.getResolution();
                    _control.map.panBy(-_offsetX * res, _offsetY * res);
                }
            }
            );
            this.map.addEventListener("_toMaxLevel", function () {
                _control._zoomInBarDisable();
                _control._zoomOutBarUse();
            }
            );
            this.map.addEventListener("_toMinLevel", function () {
                _control._zoomInBarUse();
                _control._zoomOutBarDisable();
            }
            );
            this.map.addEventListener("_toNormalLevel", function () {
                _control._zoomInBarUse();
                _control._zoomOutBarUse();
            }
            );
        };
        //创建容器
        this._createContainer = function (index) {
            if (_option.touchType) {
                return $("<div></div>")
                            .attr("id", index + "_Control")
                            .css("width", "47px")
                //.css("height", "250px")
                            .css("position", "absolute")
                            .css("z-index", index)
                            .css("right", _option.position.right)
                            .css("bottom", _option.position.bottom)
                            .css("opacity", 1)
                            .appendTo(this.map.container);
            }
            else {
                return $("<div></div>")
                            .attr("id", index + "_Control")
                            .css("width", "47px")
                            .css("height", "250px")
                            .css("position", "absolute")
                            .css("z-index", index)
                            .css("left", _option.position.left)
                            .css("top", _option.position.top)
                            .css("opacity", 0.5)
                            .hover(
                                function () {
                                    $(this).css("opacity", 1);
                                }, function () {
                                    $(this).css("opacity", 0.5);
                                }
                            )
                            .appendTo(this.map.container);
            }
        };
        //创建导航控件
        this._createNavBar = function (index) {
            return $("<div></div>")
                            .attr("id", index + "_Control_Nav")
                            .css("width", "47px")
                            .css("height", "47px")
                            .css("margin", "5px")
                            .css("overflow", "hidden")
                            .css("background-image", "url(" + _navImgUrl + ")")
                            .css("background-position", "0px -48px")
                            .hover(function () {
                                _control.navBar.css("background-position", "0px 0px");
                                _control.navBar.css("cursor", "default");

                            }, function () {
                                _startPan = false;
                                _control.navBar.css("background-position", "0px -48px");
                            })
                        .mousemove(function (event) {
                            _offsetX = event.offsetX - 21;
                            _offsetY = event.offsetY - 21;
                            if (_startPan && !_paning) {
                                var max = 23;
                                var center = _control.map.getCenter();
                                var tileSize = _control.map.tileSize;
                                var res = _control.map.getResolution();
                                var point = _control.map.mapToPoint(center);
                                var toPan = new xf.Point(point.x + _offsetX / max, point.y + _offsetY / max);
                                var toGeo = _control.map.pointToMap(toPan);
                                _control.map.panBy(-_offsetX * res, _offsetY * res);
                            }
                            event.preventDefault();
                            return true;
                        })
                            .mouseout(function (event) {
                                _startPan = false;
                            })
                .mousedown(function (event) {
                    _startPan = true;
                    _control.navBar.css("cursor", "default");
                    event.preventDefault();
                    return true;
                })
                .mouseup(function (event) {
                    _startPan = false;
                })
                .appendTo(this.container);
        };
        //创建定位控件
        this._createLocationBar = function (index) {
            //alert(_option.touchType);
            if (_option.touchType) {
                return $("<div></div>")
                .attr("id", index + "_Control_Location")
                .css("width", "40px")
                .css("height", "40px")
                .css("margin-left", "0px")
                .css("background-image", "url(" + _locationUrl + ")")
                .css("background-size", "50px")
                .css("background-repeat", "no-repeat")
                .css("background-position", "-5px -4px")
                .css("border", "3px solid transparent")
                .css("border-radius", "5px")
                .bind("touchstart", _control.getLocation)

                .appendTo(_control.container);
            }
            else {
                return $("<div></div>")
            .attr("id", index + "_Control_Location")
            .css("width", "20px")
            .css("height", "20px")
            .css("margin-left", "15px")
            .css("background-image", "url(" + _locationUrl + ")")
            .css("background-size", "30px 30px")
            .css("-o-background-size", "30px 30px")
              .css("-webkit-background-size", "30px 30px")
            .css("background-repeat", "no-repeat")
            .css("background-position", "-5px -5px")
            .css("border", "3px solid transparent")
            .css("border-radius", "5px")
             .css("-moz-border-radius", "5px")
            
            .bind("click", _control.getLocation)
            .hover(function () {
                _control.locationBar.css("cursor", "default");
                $(this).css("border", "3px solid #C1D5EB");
            }, function () {
                $(this).css("border", "3px solid transparent");
            })
            .appendTo(_control.container);
            }
        };
        //创建放大控件
        this._createZoomInBar = function (index) {
            if (_option.touchType) {
                return $("<img/>")
                            .attr("id", index + "_Control_ZoomIn")
                            .css("height", "40px")
                             .css("width", "40px")
                            .css("margin-top", "5px")
                            .css("margin-right", "6px")
                            .css("border-radius", "5px")
                            .css("border", "3px solid transparent")
                            .bind("touchstart", function () {
                                _control.map.zoomIn();
                            })
                            .attr("src", _zoomInImgUrl)
                                .appendTo(this.container);
            }
            else {
                return $("<img/>")
                            .attr("id", index + "_Control_ZoomIn")
                            .css("height", "20px")
                            .css("width", "20px")
                            .css("margin-top", "5px")
                            .css("margin-left", "16px")
                            .css("border-radius", "5px")
                            .css("border", "3px solid transparent")
                            .click(function () {
                                _control.map.zoomIn();
                            })
                           .hover(function () {
                               $(this).css("cursor", "default");
                               $(this).css("border", "3px solid #C1D5EB");
                           }, function () {
                               $(this).css("border", "3px solid transparent");
                           })
                            .attr("src", _zoomInImgUrl)
                                .appendTo(this.container);
            }
        };
        //创建缩小控件
        this._createZoomOutBar = function (index) {
            if (_option.touchType) {
                return $("<img/>")
                            .attr("id", index + "_Control_ZoomIn")
                            .css("height", "40px")
                            .css("width", "40px")
                            .css("margin-top", "5px")
                            .css("margin-right", "6px")
                            .css("border-radius", "5px")
                            .css("border", "3px solid transparent")
                            .bind("touchstart", function () {
                                _control.map.zoomOut();
                            })
                            .attr("src", _zoomOutImgUrl)
                                .appendTo(this.container);
            }
            else {
                return $("<img/>")
                            .attr("id", index + "_Control_ZoomIn")
                            .css("height", "20px")
                            .css("width", "20px")
                            .css("margin-top", "5px")
                            .css("margin-left", "16px")
                            .css("border-radius", "5px")
                            .css("border", "3px solid transparent")
                            .click(function () {
                                _control.map.zoomOut();
                            })
                            .hover(function () {
                                $(this).css("cursor", "default");
                                $(this).css("border", "3px solid #C1D5EB");
                            }, function () {
                                $(this).css("border", "3px solid transparent");
                            })
                            .attr("src", _zoomOutImgUrl)
                                .appendTo(this.container);
            }

        };
        //创建鱼骨控件
        this._createScaleBar = function (index) {
            return $("<div></div>")
                            .attr("id", index + "_Control_Scale")
                            .css("height", "200px")
                            .css("margin-top", "5px")
                            .css("margin-left", "21px")
                                .appendTo(this.container);
        };
        //初始化鱼骨控件
        this._initScaleBar = function () {
            if ($.mobile) { _control.scaleBar.hide(); return; }
            var lods = _control.map.getBaseLayer().lods;
            var level = _control.map.getBaseLayer().level;
            _control.scaleBar.slider({
                orientation: "vertical",
                range: "min",
                min: 0,
                max: lods.length - 1,
                step: 1,
                value: level,
                slide: function (event, ui) {
                    var _level = _control.map.getBaseLayer().level;
                    var _toLevel = ui.value + 1 - _level;
                    _control.map.zoom(_toLevel);
                }
            });
            _control.scaleBar.find(".ui-slider-range").css("background", "#C1D5EB");
            if (level == 0) {
                _control._zoomInBarUse();
                _control._zoomOutBarDisable();
            }
            else if (level == lods.length - 1) {
                _control._zoomInBarDisable();
                _control._zoomOutBarUse();
            }
        };
        //隐藏控件
        this.hide = function () {
            _option.visiable = false;
            _control.container.fadeOut();
        };
        //显示控件
        this.show = function () {
            _option.visiable = true;
            _control.container.fadeIn();
        };
        //隐藏导航面板
        this.hideNavBar = function () {
            _option.navBar = false;
            _control.navBar.slideUp();
        };
        //显示导航面板
        this.showNavBar = function () {
            if (!_option.touchType) {
                _option.navBar = true;
                _control.navBar.slideDown();
            }
        };
        //隐藏比例尺工具
        this.hideScaleBar = function () {
            _option.scaleBar = false;
            _control.scaleBar.hide();
        };
        //显示比例尺工具
        this.showScaleBar = function () {
            if (!_option.touchType) {
                _option.scalseBar = true;
                _control.scaleBar.show();
            }
        };
        this.showZoomInBar = function () {
            _option.zoomInBar = true;
            _control.zoomInBar.slideDown();
        };
        this.hideZoomInBar = function () {
            _option.zoomInBar = false;
            _control.zoomInBar.slideUp();
        };
        this.showZoomOutBar = function () {
            _option.zoomOutBar = true;
            _control.zoomOutBar.slideDown();
        };
        this.hideZoomOutBar = function () {
            _option.zoomOutBar = false;
            _control.zoomOutBar.slideUp();
        };
        this.showLocationBar = function () {
            if (_option.locationBar) {
                _control.locationBar.show();
            }
        }
        this.hideLocationBar = function () {
            if (_option.locationBar) {
                _control.locationBar.hide();
            }
        }
        //设置放大控件失效
        this._zoomInBarDisable = function () { _control.zoomInBar.attr("src", _unZoomInImgUrl); };
        //设置缩小控件失效
        this._zoomOutBarDisable = function () { _control.zoomOutBar.attr("src", _unZoomOutImgUrl); };
        //设置放大控件可用
        this._zoomInBarUse = function () { _control.zoomInBar.attr("src", _zoomInImgUrl); };
        //设置缩小控件可用
        this._zoomOutBarUse = function () { _control.zoomOutBar.attr("src", _zoomOutImgUrl); };
        //定位
        this.getLocation = function () {

            if (_control.currentLoaction) {
                _control.locationBar.css("background-color", "transparent");
                _control.currentLoaction = null;
                _control.dispatchEvent("ClearLocation", new xf.Event());
            }
            else {

                navigator.geolocation.getCurrentPosition(function (p) {

                    var lat = p.coords.latitude;
                    var lon = p.coords.longitude;
                    var acc = p.coords.accuracy;
                    _control.locationBar.css("background-color", "#C1D5EB");
                    _control.currentLoaction = new xf.GeoPoint(lon, lat, "WGS84");
                    var evt = new xf.Event();
                    evt.location = _control.currentLoaction;
                    evt.accuracy = acc;
                    evt.heading = p.coords.heading;
                    evt.speed = p.coords.speed;
                    evt.altitudeAccuracy = p.coords.altitudeAccuracy;
                    _control.dispatchEvent("GetLocation", evt);
                }, function () { });

            }
        };
        //销毁控件
        this.destory = function () { };
        //清除定位状态
        this.clearLoaction = function () {
            _control.locationBar.css("background-color", "transparent");
            _control.currentLoaction = null;
        }

        //如果是触屏手机  显示手机版控件
        if (xf.Touch && xf.Mobile) {
            _option.touchType = true;
        }
        else {
            _option.touchType = false;
        }
        //如果可以定位 显示定位信息
        if (xf.Geolocation) {
            _option.locationBar = true;
        }
        else {
            _option.locationBar = false;
        }

        options = options || {};
        //options.touchType = options.touchType || _option.touchType;
        //options.locationBar = options.locationBar || _option.locationBar;
        _option.visiable = options.visiable == false ? false : options.visiable || true;
        if (_option.touchType) {
            _option.position = options.position || { right: 0, bottom: 0 };
            _option.navBar = false;
            _option.scaleBar = false;
            _option.zoomInBar = options.zoomInBar == false ? false : options.zoomInBar || true;
            _option.zoomOutBar = options.zoomOutBar == false ? false : options.zoomOutBar || true;
        }
        else {
            _option.position = options.position || { left: 0, top: 0 };
            _option.navBar = options.navBar == false ? false : options.navBar || true;
            _option.scaleBar = options.scaleBar == false ? false : options.scaleBar || true;
            _option.zoomInBar = options.zoomInBar == false ? false : options.zoomInBar || true;
            _option.zoomOutBar = options.zoomOutBar == false ? false : options.zoomOutBar || true;
        }
        //_option = options;
    };
})(jQuery, XiaoFu);



