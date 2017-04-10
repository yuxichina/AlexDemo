////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------Marker层管理-------------------------
////----------------创建日期：2012-6-21-----------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

XiaoFu.MarkerLayers = function (p_type) {
    XiaoFu.Layer.apply(this, []);
    //地图图层
    this.map = null;
    //是否可见
    this.visiable = true;
    //图层类型
    this.type = p_type;
    //图层id
    this.id = null;
    //是否加载了Marker层
    var _isLoadMarker = false;
    //哈希表—Marker元素集合
    var _hashTable_Marker = new Object();
    //哈希表—Marker渲染元素集合
    var _hashTable_MarkerRender = new Object();
    //自身
    var _self = this;

    //×××××初始化×××××
    //p_layerId（图层id）
    this.init = function (p_layerId) {
        if (!_isLoadMarker) {
            var m_svgdiv = $("#layer_svgdiv");
            var m_z = m_svgdiv.css("z-index");
            var m_layerContainer = $("<div></div>")
                .attr("id", p_layerId)
                .addClass("Mask")
                .css("position", "absolute")
                .css("z-index", parseInt(m_z) + 1)
                .appendTo($("#layerContainer"));
            _isLoadMarker = true;
            _self.id = p_layerId;
            _self.update();
        }
    };

    //×××××添加子元素×××××
    //p_obj（子元素）
    this.addChild = function (p_obj) {
        var m_isAddMarker = false;
        if (_self.type == "marker" && p_obj instanceof XiaoFu.Marker) {
            m_isAddMarker = true;
        } else if (_self.type == "string" && p_obj instanceof XiaoFu.Marker_String) {
            m_isAddMarker = true;
        } else if (_self.type == "jQuery" && p_obj instanceof XiaoFu.Marker_jQuery) {
            m_isAddMarker = true;
        }
        if (m_isAddMarker) {
            addMarker(p_obj);
        }
    };

    //×××××更新图层×××××
    this.update = function () {
        if (_isLoadMarker && _self.visiable) {
            if (_self.type == "marker" || _self.type == "string" || _self.type == "jQuery") {
                updateMarker();
            }
        }
    };

    //×××××根据id移除子元素×××××
    //p_id（子元素id）
    this.removeChildByID = function (p_id) {
        if (_self.type == "marker" || _self.type == "string" || _self.type == "jQuery") {
            if (p_id in _hashTable_Marker) {
                delete (_hashTable_Marker[p_id]);
                if (_isLoadMarker && _self.visiable && p_id in _hashTable_MarkerRender) {
                    _hashTable_MarkerRender[p_id].deleteMarker();
                    delete (_hashTable_MarkerRender[p_id]);
                }
            }
        }
    };

    //×××××移除所有子元素×××××
    this.removeAll = function () {
        if (_self.type == "marker" || _self.type == "string" || _self.type == "jQuery") {
            if (_isLoadMarker && _self.visiable) {
                for (var m_markerID in _hashTable_MarkerRender) {
                    _hashTable_MarkerRender[m_markerID].deleteMarker();
                }
            }
            _hashTable_Marker = new Object();
            _hashTable_MarkerRender = new Object();
        }
    };

    //×××××修改子元素×××××
    //p_child（子元素）
    this.updateChild = function (p_child) {
        var m_isHF = false;
        if (_self.type == "marker" && p_child instanceof XiaoFu.Marker) {
            m_isHF = true;
        } else if (_self.type == "string" && p_child instanceof XiaoFu.Marker_String) {
            m_isHF = true;
        } else if (_self.type == "jQuery" && p_child instanceof XiaoFu.Marker_jQuery) {
            m_isHF = true;
        }
        if (m_isHF) {
            var m_isUpdateChild = false;
            if (p_child.id in _hashTable_Marker) {
                delete (_hashTable_Marker[p_child.id]);
                _hashTable_Marker[p_child.id] = p_child;
                if (p_child.id in _hashTable_MarkerRender) {
                    delete (_hashTable_MarkerRender[p_child.id]);
                    _hashTable_MarkerRender[p_child.id] = p_child;
                    if (_isLoadMarker && _self.visiable) {
                        m_isUpdateChild = true;
                    }
                }
            }
            if (m_isUpdateChild) {
                p_child.deleteMarker();
                var m_geoPoint = new XiaoFu.GeoPoint(p_child.x, p_child.y);
                var m_point = map.mapToPoint(m_geoPoint);
                var m_mapHeight = document.getElementById("MapContainer").offsetHeight;
                var m_mapWidth = document.getElementById("MapContainer").offsetWidth;
                if (m_point.x > 0 && m_point.x < m_mapWidth && m_point.y > 0 && m_point.y < m_mapHeight) {
                    p_child.addMarker(m_point, _self.id);
                }
            }
        }
    };

    //×××××根据id修改子元素可见性×××××
    //p_id（子元素id）
    //p_visiable（可见性）
    this.setChildVisiableByID = function (p_id, p_visiable) {
        if (typeof (p_visiable) == "boolean") {
            if (_self.type == "marker" || _self.type == "string" || _self.type == "jQuery") {
                if (p_id in _hashTable_Marker) {
                    if (_hashTable_Marker[p_id].visiable != p_visiable) {
                        _hashTable_Marker[p_id].visiable = p_visiable;
                        if (p_id in _hashTable_MarkerRender) {
                            //p_visiable一定false
                            _hashTable_MarkerRender[p_id].visiable = p_visiable;
                            _hashTable_MarkerRender[p_id].deleteMarker();
                            delete (_hashTable_MarkerRender[p_id]);
                        } else if (p_visiable) {
                            if (_isLoadMarker && _self.visiable == true) {
                                var m_geoPoint = new XiaoFu.GeoPoint(_hashTable_Marker[p_id].x, _hashTable_Marker[p_id].y);
                                var m_point = map.mapToPoint(m_geoPoint);
                                var m_mapHeight = document.getElementById("MapContainer").offsetHeight;
                                var m_mapWidth = document.getElementById("MapContainer").offsetWidth;
                                if (m_point.x > 0 && m_point.x < m_mapWidth && m_point.y > 0 && m_point.y < m_mapHeight) {
                                    _hashTable_Marker[p_id].addMarker(m_point, _self.id);
                                    _hashTable_MarkerRender[p_id] = _hashTable_Marker[p_id];
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    //×××××设置图层可见性×××××
    //p_visiable（可见性）
    this.setVisiable = function (p_visiable) {
        if (typeof (p_visiable) == "boolean") {
            if (_self.type == "marker" || _self.type == "string" || _self.type == "jQuery") {
                if (_self.visiable != p_visiable) {
                    _self.visiable = p_visiable;
                    if (p_visiable) {
                        updateMarker();
                    } else {
                        for (var m_markerID in _hashTable_MarkerRender) {
                            _hashTable_MarkerRender[m_markerID].deleteMarker();
                        }
                        _hashTable_MarkerRender = new Object();
                    }
                }
            }
        }
    };

    //×××××清除该图层×××××
    this.destory = function () {
        var ob = document.getElementById(_self.id);
        ob.parentNode.removeChild(ob);
    };

    //×××××向图层添加Marker元素×××××
    //p_marker（Marker元素）
    function addMarker(p_marker) {
        if (p_marker.id in _hashTable_Marker) {
            alert("marker:'" + p_marker.id + "'已经存在");
            return;
        }
        _hashTable_Marker[p_marker.id] = p_marker;
        if (_isLoadMarker && _self.visiable == true && p_marker.visiable == true) {
            var m_geoPoint = new XiaoFu.GeoPoint(p_marker.x, p_marker.y);
            var m_point = map.mapToPoint(m_geoPoint);
            var m_mapHeight = document.getElementById("MapContainer").offsetHeight;
            var m_mapWidth = document.getElementById("MapContainer").offsetWidth;
            if (m_point.x > 0 && m_point.x < m_mapWidth && m_point.y > 0 && m_point.y < m_mapHeight) {
                p_marker.addMarker(m_point, _self.id);
                _hashTable_MarkerRender[p_marker.id] = p_marker;
            }
        }
    };

    //×××××更新Marker图层×××××
    function updateMarker() {
        if (_isLoadMarker && _self.visiable) {
            var m_mapHeight = document.getElementById("MapContainer").offsetHeight;
            var m_mapWidth = document.getElementById("MapContainer").offsetWidth;
            for (var m_markerID in _hashTable_Marker) {
                var m_marker = _hashTable_Marker[m_markerID];
                var m_x = m_marker.x;
                var m_y = m_marker.y;
                var m_geoPoint = new XiaoFu.GeoPoint(m_x, m_y);
                var m_point = map.mapToPoint(m_geoPoint);
                if (m_markerID in _hashTable_MarkerRender) {
                    if (m_point.x > 0 && m_point.x < m_mapWidth && m_point.y > 0 && m_point.y < m_mapHeight) {
                        m_marker.updataMarker(m_point);
                    }
                    else {
                        m_marker.deleteMarker();
                        delete (_hashTable_MarkerRender[m_markerID]);
                    }
                }
                else if (m_point.x > 0 && m_point.x < m_mapWidth && m_point.y > 0 && m_point.y < m_mapHeight && m_marker.visiable) {
                    m_marker.addMarker(m_point, _self.id);
                    _hashTable_MarkerRender[m_markerID] = m_marker;
                }
            }
        }
    };

    function addJump(p_img) {
        //new JumpObj(p_img, 10);
        //$(p_img).hover(function () { this.parentNode.className = "hover" });
    };
}