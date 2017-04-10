////××××××××××××××××××××××××××××××××××××××××××××××××××××××××××
////---------------------svg层管理----------------------------
////----------------创建日期：2012-6-1------------------------
////-------------------创建人：赵雪丹-------------------------
////命名规则：
////------------------*******************---------------------
////------------------*******************---------------------
////------------------*******************---------------------

XiaoFu.SVGLayers = function (p_type) {
    XiaoFu.Layer.apply(this, []);
    //地图图层
    this.map = null;
    //是否可见
    this.visiable = true;
    //图层类型
    this.type = p_type;
    //图层id
    this.id = null;
    //自身
    var _self = this;
    //是否加载了svg层
    var _isLoadSVG = false;
    //svg层
    var _svg_layers;
    //svg元素层
    var _svg_g;
    //哈希表—元素集合
    var _hashTable = new Object();

    this.isPolymerization = true;
    var _hashTable_juhe = new Object();
    var _hashTable_nun = new Object();
    var _hashTable_isLoad = new Object();
    this.distance = 10;
    var _fid = "";

    var _pointerEvents = "none";

    //×××××初始化×××××
    //p_layerId（图层id）
    this.init = function (p_layerId) {
        if (!_isLoadSVG) {
            _svg_g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            _svg_g.setAttribute("id", 'svg_g_' + p_layerId);
            var m_body = document.getElementById('layer_svg');
            m_body.appendChild(_svg_g);
            _isLoadSVG = true;
            _self.id = p_layerId;
            _self.update();
        }
    }

    //×××××添加子元素×××××
    //p_obj（子元素）
    this.addChild = function (p_obj) {
        if (_self.type == "point" && p_obj instanceof XiaoFu.SVG_Point) {
            addPoint(p_obj);
        } else if (_self.type == "line" && p_obj instanceof XiaoFu.SVG_Line) {
            addLine(p_obj);
        } else if (_self.type == "polygon" && p_obj instanceof XiaoFu.SVG_Polygon) {
            addPolygon(p_obj);
        }
    }

    //×××××根据id移除子元素×××××
    //p_id（子元素id）
    this.removeChildByID = function (p_id) {
        if (_self.type == "point") {
            if (p_id in _hashTable) {
                delete (_hashTable[p_id]);
                if (_isLoadSVG && _self.visiable) {
                    updatePoint();
                }
            }
        } else if (_self.type == "line") {
            if (p_id in _hashTable) {
                delete (_hashTable[p_id]);
                if (_isLoadSVG && _self.visiable) {
                    updateLine();
                }
            }
        } else if (_self.type == "polygon") {
            if (p_id in _hashTable) {
                delete (_hashTable[p_id]);
                if (_isLoadSVG && _self.visiable) {
                    updatePolygon();
                }
            }
        }
    };

    //×××××移除所有子元素×××××
    this.removeAll = function () {
        if (_self.type == "point") {
            _hashTable = new Object();
            updatePoint();
        } else if (_self.type == "line") {
            _hashTable = new Object();
            updateLine();
        } else if (_self.type == "polygon") {
            _hashTable = new Object();
            updatePolygon();
        }
    };

    //×××××修改子元素×××××
    //p_child（子元素）
    this.updateChild = function (p_child) {
        if (_self.type == "point" && p_child instanceof XiaoFu.SVG_Point) {
            if (p_child.id in _hashTable) {
                delete (_hashTable[p_child.id]);
                _hashTable[p_child.id] = p_child;
                if (_isLoadSVG && _self.visiable) {
                    updatePoint();
                }
            }
        } else if (_self.type == "line" && p_child instanceof XiaoFu.SVG_Line) {
            if (p_child.id in _hashTable) {
                delete (_hashTable[p_child.id]);
                _hashTable[p_child.id] = p_child;
                if (_isLoadSVG && _self.visiable) {
                    updateLine();
                }
            }
        } else if (_self.type == "polygon" && p_child instanceof XiaoFu.SVG_Polygon) {
            if (p_child.id in _hashTable) {
                delete (_hashTable[p_child.id]);
                _hashTable[p_child.id] = p_child;
                if (_isLoadSVG && _self.visiable) {
                    updatePolygon();
                }
            }
        }
    };

    //×××××根据id修改子元素可见性×××××
    //p_id（子元素id）
    //p_visiable（可见性）
    this.setChildVisiableByID = function (p_id, p_visiable) {
        if (_self.type == "point") {
            if (p_id in _hashTable) {
                _hashTable[p_id].visiable = p_visiable;
                if (_isLoadSVG && _self.visiable) {
                    updatePoint();
                }
            }
        } else if (_self.type == "line") {
            if (p_id in _hashTable) {
                _hashTable[p_id].visiable = p_visiable;
                if (_isLoadSVG && _self.visiable) {
                    updateLine();
                }
            }
        } else if (_self.type == "polygon") {
            if (p_id in _hashTable) {
                _hashTable[p_id].visiable = p_visiable;
                if (_isLoadSVG && _self.visiable) {
                    updatePolygon();
                }
            }
        }
    };

    //×××××设置图层可见性×××××
    //p_visiable（可见性）
    this.setVisiable = function (p_visiable) {
        if (_self.type == "point") {
            if (typeof (p_visiable) == "boolean") {
                _self.visiable = p_visiable;
                if (_self.visiable) {
                    updatePoint();
                } else {
                    $("#svg_g_" + _self.id).find("circle").remove();
                }
            }
        } else if (_self.type == "line") {
            if (typeof (p_visiable) == "boolean") {
                _self.visiable = p_visiable;
                if (_self.visiable) {
                    updateLine();
                } else {
                    $("#svg_g_" + _self.id).find("polyline").remove();
                }
            }
        } else if (_self.type == "polygon") {
            if (typeof (p_visiable) == "boolean") {
                _self.visiable = p_visiable;
                if (_self.visiable) {
                    updatePolygon();
                } else {
                    $("#svg_g_" + _self.id).find("path").remove();
                }
            }
        }
    }

    var _hashTable_Render = new Object();
    this.setPointerEvents = function (p_id, p_selfs) {
        if (p_id in _hashTable) {
            if (typeof (p_selfs) == "boolean") {
                if (p_selfs) {
                    _hashTable[p_id].pointerEvents = "auto";
                } else {
                    _hashTable[p_id].pointerEvents = "none";
                }
                if (p_id in _hashTable_Render) {
                    var m_all = _hashTable_Render[p_id].split("*");
                    for (var i = 0; i < m_all.length; i++) {
                        $("#" + m_all[i]).attr("pointer-events", _hashTable[p_id].pointerEvents);
                    }
                }
            }
        }
    }

    this.getPointerEvents = function (p_id) {
        if (p_id in _hashTable) {
            if (_hashTable[p_id].pointerEvents == "none") {
                return false;
            } else if (_hashTable[p_id].pointerEvents == "auto") {
                return true;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    //×××××清除该图层×××××
    this.destory = function () {
        var ob = document.getElementById('svg_g_' + _self.id);
        ob.parentNode.removeChild(ob);
    }

    //×××××更新图层×××××
    this.update = function () {
        if (_isLoadSVG && _self.visiable) {
            if (_self.type == "point") {
                updatePoint();
            } else if (_self.type == "line") {
                updateLine();
            } else if (_self.type == "polygon") {
                updatePolygon();
            }
        }
    }

    //×××××点图层聚合判断×××××
    //p_pointid（点id）
    //p_point（点对象）
    function polymerization(p_pointid, p_point) {
        for (var m_pointID in _hashTable_juhe) {
            var m_geoPoint = new XiaoFu.GeoPoint(_hashTable[m_pointID].x, _hashTable[m_pointID].y);
            var m_point = map.mapToPoint(m_geoPoint);
            if (-_self.distance < m_point.x - p_point.x && m_point.x - p_point.x < _self.distance) {
                if (-_self.distance < m_point.y - p_point.y && m_point.y - p_point.y < _self.distance) {
                    _hashTable_nun[m_pointID] = parseInt(_hashTable_nun[m_pointID]) + 1;
                    _hashTable_juhe[m_pointID] += "*" + p_pointid;
                    return m_pointID;
                }
            }
        }
        _hashTable_juhe[p_pointid] = p_pointid;
        _hashTable_nun[p_pointid] = 1;
        return "";
    };

    //×××××展开聚合点×××××
    //p_allid（点对象id集合）
    //p_top（top值）
    //p_left（left值）
    function showPoints(p_allid, p_top, p_left) {
        if (p_allid in _hashTable_isLoad) {
            return;
        }
        var m_allid = p_allid.split("*");
        if (m_allid.length > 10) {
            alert("请先放大地图至聚合量不大于10，再点击查看！");
            return;
        }
        _hashTable_isLoad[p_allid] = p_allid;
        var m_j = 360 / m_allid.length;
        for (var i = 0; i < m_allid.length; i++) {
            var m_id = m_allid[i];
            var m_point = _hashTable[m_id]
            var m_a = 0;
            var m_b = 0;
            var m_top = p_top;
            var m_left = p_left;
            var m_abc = m_j * i + 45;
            if (m_abc < 90) {
                m_b = 30 * Math.sin(m_abc * (3.1415926 / 180));
                m_a = 30 * Math.cos(m_abc * (3.1415926 / 180));
                m_top = p_top - m_b;
                m_left = p_left - m_a;
            } else if (m_abc == 90) {
                m_top = p_top - 30;
            } else if (m_abc < 180) {
                m_a = 30 * Math.sin((m_abc - 90) * (3.1415926 / 180));
                m_b = 30 * Math.cos((m_abc - 90) * (3.1415926 / 180));
                m_top = p_top - m_b;
                m_left = p_left + m_a;
            } else if (m_abc == 180) {
                m_left = p_left + 30;
            } else if (m_abc < 270) {
                m_b = 30 * Math.sin((m_abc - 180) * (3.1415926 / 180));
                m_a = 30 * Math.cos((m_abc - 180) * (3.1415926 / 180));
                m_top = p_top + m_b;
                m_left = p_left + m_a;
            } else if (m_abc == 270) {
                m_top = p_top + 30;
            } else if (m_abc < 360) {
                m_a = 30 * Math.sin((m_abc - 270) * (3.1415926 / 180));
                m_b = 30 * Math.cos((m_abc - 270) * (3.1415926 / 180));
                m_top = p_top + m_b;
                m_left = p_left - m_a;
            } else if (m_abc == 360) {
                m_left = p_left - 30;
            } else {
                m_a = 30 * Math.sin((m_abc - 360) * (3.1415926 / 180));
                m_b = 30 * Math.cos((m_abc - 360) * (3.1415926 / 180));
                m_top = p_top - m_a;
                m_left = p_left - m_b;
            }
            var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            m_rect.setAttribute("id", "svg_linshi_" + _self.id + "_" + m_id);
            m_rect.setAttribute("cx", m_left);
            m_rect.setAttribute("cy", m_top);
            m_rect.setAttribute("r", _hashTable[m_id].r);
            m_rect.setAttribute("fill", _hashTable[m_id].fill);
            m_rect.setAttribute("fill-opacity", _hashTable[m_id].fillOpacity);
            m_rect.setAttribute("stroke", _hashTable[m_id].stroke);
            m_rect.setAttribute("stroke-opacity", "1");
            m_rect.setAttribute("stroke-width", "1");
            m_rect.setAttribute("stroke-linecap", "round");
            m_rect.setAttribute("stroke-linejoin", "round");
            m_rect.setAttribute("stroke-dasharray", "none");
            m_rect.setAttribute("pointer-events", "visiblePainted");
            m_rect.setAttribute("cursor", "inherit");
            _svg_g.appendChild(m_rect);
            var m_doc = $("#svg_linshi_" + _self.id + "_" + m_id);
            m_doc.click(function () {
                var m_htid = this.id.split("_")[3];
                _hashTable[m_htid].dispatchEvent("click", _hashTable[m_htid]);
            })

            connectingLine(m_left, m_top, p_left, p_top, m_id);
        }
    };

    //×××××添加临时连接线×××××
    //p_x0（点1x坐标）
    //p_y0（点2x坐标）
    //p_x1（点1y坐标）
    //p_y1（点2y坐标）
    //p_id（点id）
    function connectingLine(p_x0, p_y0, p_x1, p_y1, p_id) {
        var m_strLine = p_x0 + "," + p_y0 + "," + p_x1 + "," + p_y1;
        var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        m_rect.setAttribute("id", "svg_linshi_" + _self.id + "_" + p_id);   //id唯一标识
        m_rect.setAttribute("points", m_strLine);   //点集合
        m_rect.setAttribute("fill", "none");   //填充颜色(rgb 值、颜色名或者十六进制值)
        m_rect.setAttribute("stroke", "red");   //边框的颜色
        m_rect.setAttribute("stroke-opacity", 1);   //边框颜色透明度(合法的范围是：0 - 1)
        m_rect.setAttribute("stroke-width", 1);   //边框宽度
        m_rect.setAttribute("stroke-linecap", "round");   //定义绘制轮廓时在轮廓的末尾使用的造型(butt|round|square)
        m_rect.setAttribute("stroke-linejoin", "round");   //定义绘制折线的角时使用的造型(miter|round|bevel|)
        m_rect.setAttribute("stroke-dasharray", "none");   //定义为得到点线所应用的阵列
        m_rect.setAttribute("pointer-events", "visiblePainted");   //指针事件
        m_rect.setAttribute("cursor", "inherit");   //独立于平台的光标
        if (_fid == "") {
            _svg_g.appendChild(m_rect);
        } else {
            $("#" + _fid).before(m_rect);
        }
    };

    //×××××向点图层添加元素×××××
    //p_point（点对象）
    function addPoint(p_point) {
        if (p_point.id in _hashTable) {
            alert("point已经存在");
            return;
        }
        _hashTable[p_point.id] = p_point;
        if (_isLoadSVG && _self.visiable == true && p_point.visiable == true) {
            var m_geoPoint = new XiaoFu.GeoPoint(p_point.x, p_point.y);
            var m_point = _self.map.mapToPoint(m_geoPoint);
            var m_mapHeight = document.getElementById("MapContainer").offsetHeight;
            var m_mapWidth = document.getElementById("MapContainer").offsetWidth;
            if (m_point.x > 0 && m_point.x < m_mapWidth && m_point.y > 0 && m_point.y < m_mapHeight) {
                var m_pid = "";
                if (_self.isPolymerization) {
                    m_pid = polymerization(p_point.id, m_point);
                }
                if (m_pid == "") {
                    if (_fid == "") {
                        _fid = "svg_" + _self.id + "_" + p_point.id;
                    }
                    var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    m_rect.setAttribute("id", "svg_" + _self.id + "_" + p_point.id);   //id唯一标识
                    m_rect.setAttribute("cx", m_point.x);   //x值
                    m_rect.setAttribute("cy", m_point.y);   //y值
                    m_rect.setAttribute("r", p_point.r);   //半径
                    m_rect.setAttribute("fill", p_point.fill);   //填充颜色(rgb 值、颜色名或者十六进制值)
                    m_rect.setAttribute("fill-opacity", p_point.fillOpacity);   //填充颜色透明度(合法的范围是：0 - 1)
                    m_rect.setAttribute("stroke", p_point.stroke);   //边框的颜色
                    m_rect.setAttribute("stroke-opacity", 1);   //边框颜色透明度(合法的范围是：0 - 1)
                    m_rect.setAttribute("stroke-width", 1);   //边框宽度
                    m_rect.setAttribute("stroke-linecap", "round");   //定义绘制轮廓时在轮廓的末尾使用的造型(butt|round|square)
                    m_rect.setAttribute("stroke-linejoin", "round");   //定义绘制折线的角时使用的造型(miter|round|bevel|)
                    m_rect.setAttribute("stroke-dasharray", "none");   //定义为得到点线所应用的阵列
                    m_rect.setAttribute("pointer-events", "visiblePainted");   //指针事件
                    m_rect.setAttribute("cursor", "inherit");   //独立于平台的光标
                    _svg_g.appendChild(m_rect);

                    var m_doc = $("#svg_" + _self.id + "_" + p_point.id);
                    m_doc.click(function () {
                        p_point.dispatchEvent("click", p_point);
                    })
                } else {
                    var m_color = "red";
                    var m_size = 10;
                    var m_r = 20;
                    var m_nun = _hashTable_nun[m_pid];
                    if (m_nun < 10) {
                        m_color = "yellow";
                        m_size = 16;
                        m_r = 10;
                    } else if (m_nun < 100) {
                        m_color = "orange";
                        m_size = 10;
                        m_r = 15;
                    }
                    var m_markerdiv = $("#svg_" + _self.id + "_" + m_pid);
                    m_markerdiv.unbind('click');
                    m_markerdiv.click(function () {
                        var m_htid = this.id.split("_")[2];
                        var m_allid = _hashTable_juhe[m_htid];
                        var m_geoPoint1 = new XiaoFu.GeoPoint(_hashTable[m_htid].x, _hashTable[m_htid].y);
                        var m_point1 = _self.map.mapToPoint(m_geoPoint1);
                        showPoints(m_allid, parseInt(m_point1.y) - 3, parseInt(m_point1.x) - 3);
                    })
                    var m_top = document.getElementById("svg_" + _self.id + "_" + m_pid).getAttributeNS(null, "cx");
                    var m_left = document.getElementById("svg_" + _self.id + "_" + m_pid).getAttributeNS(null, "cy");
                    document.getElementById("svg_" + _self.id + "_" + m_pid).setAttributeNS(null, "r", m_r);
                    document.getElementById("svg_" + _self.id + "_" + m_pid).setAttributeNS(null, "fill", m_color);
                    if ($("#text_nun_" + m_pid).length) {
                        $("#text_nun_" + m_pid).html(m_nun);
                        //document.getElementById("text_nun_" + m_pid).textContent = m_nun;
                    } else {
                        var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        m_rect.setAttribute("id", "text_nun_" + m_pid);
                        m_rect.setAttribute("x", parseInt(m_top) - 4);
                        m_rect.setAttribute("y", parseInt(m_left) + 6);
                        m_rect.setAttribute("fill", "blue");
                        m_rect.setAttribute("font-size", m_size);
                        m_rect.setAttribute("pointer-events", "none");
                        m_rect.setAttribute("cursor", "default");
                        _svg_g.appendChild(m_rect);
                        document.getElementById("text_nun_" + m_pid).textContent = m_nun;
                        var m_doc = $("#text_nun_" + m_pid);
                        m_doc.click(function () {
                            var m_htid = this.id.split("_")[2];
                            var m_allid = _hashTable_juhe[m_htid];
                            var m_geoPoint1 = new XiaoFu.GeoPoint(_hashTable[m_htid].x, _hashTable[m_htid].y);
                            var m_point1 = _self.map.mapToPoint(m_geoPoint1);
                            showPoints(m_allid, parseInt(m_point1.y) - 3, parseInt(m_point1.x) - 3);
                        })
                    }
                }
            }
        }
    };

    //×××××向线图层添加元素×××××
    //p_line（线对象）
    function addLine(p_line) {
        if (p_line.id in _hashTable) {
            alert("line已经存在");
            return;
        }
        _hashTable[p_line.id] = p_line;
        if (_isLoadSVG && _self.visiable == true && p_line.visiable == true) {
            for (var j = 0; j < p_line.geometry.path.length; j++) {
                var m_top = null;
                var m_bottom = null;
                var m_left = null;
                var m_right = null;
                var m_strLine = "";
                var m_array = p_line.geometry.path[j];
                for (var i = 0; i < m_array.length; i++) {
                    var m_point = _self.map.mapToPoint(m_array[i]);
                    m_strLine += m_point.x + "," + m_point.y + ",";
                    if (m_top == null || m_top > m_point.y) {
                        m_top = m_point.y;
                    }
                    if (m_bottom == null || m_bottom < m_point.y) {
                        m_bottom = m_point.y;
                    }
                    if (m_left == null || m_left > m_point.x) {
                        m_left = m_point.x;
                    }
                    if (m_right == null || m_right < m_point.x) {
                        m_right = m_point.x;
                    }
                }
                if (m_strLine != "" && isReader(m_top, m_bottom, m_left, m_right)) {
                    m_strLine = m_strLine.substring(0, (m_strLine.length - 1));
                    if (p_line.id in _hashTable_Render) {
                        _hashTable_Render[p_line.id] += "*svg_" + _self.id + "_" + p_line.id + "_" + j;
                    } else {
                        _hashTable_Render[p_line.id] = "svg_" + _self.id + "_" + p_line.id + "_" + j;
                    }
                    p_line.addChild(_svg_g, m_strLine, _self.id, j);
                }
            }
        }
    };

    //×××××向面图层添加元素×××××
    //p_polygon（面对象）
    function addPolygon(p_polygon) {
        if (p_polygon.id in _hashTable) {
            alert("polygon已经存在");
            return;
        }
        _hashTable[p_polygon.id] = p_polygon;
        if (_isLoadSVG && _self.visiable == true && p_polygon.visiable == true) {
            for (var j = 0; j < p_polygon.geometry.path.length; j++) {
                var m_array = p_polygon.geometry.path[j];
                var m_top = null;
                var m_bottom = null;
                var m_left = null;
                var m_right = null;
                var m_strPolygon = "";
                var m_strPolygon_star = "";
                for (var i = 0; i < m_array.length; i++) {
                    var m_point = _self.map.mapToPoint(m_array[i]);
                    m_strPolygon += m_point.x + "," + m_point.y + " ";
                    m_strPolygon_star = m_point.x + "," + m_point.y;
                    if (m_top == null || m_top > m_point.y) {
                        m_top = m_point.y;
                    }
                    if (m_bottom == null || m_bottom < m_point.y) {
                        m_bottom = m_point.y;
                    }
                    if (m_left == null || m_left > m_point.x) {
                        m_left = m_point.x;
                    }
                    if (m_right == null || m_right < m_point.x) {
                        m_right = m_point.x;
                    }
                }
                if (m_strPolygon != "" && isReader(m_top, m_bottom, m_left, m_right)) {
                    m_strPolygon = " M " + m_strPolygon + m_strPolygon_star + " z";
                    if (p_polygon.id in _hashTable_Render) {
                        _hashTable_Render[p_polygon.id] += "*svg_" + _self.id + "_" + p_polygon.id + "_" + j;
                    } else {
                        _hashTable_Render[p_polygon.id] = "svg_" + _self.id + "_" + p_polygon.id + "_" + j;
                    }
                    p_polygon.addChild(_svg_g, m_strPolygon, _self.id, j);
                }
            }
        }
    }

    //×××××更新点图层×××××
    function updatePoint() {
        _hashTable_isLoad = new Object();
        _hashTable_juhe = new Object();
        _hashTable_nun = new Object();
        $("#svg_g_" + _self.id).find("circle").remove();
        $("#svg_g_" + _self.id).find("text").remove();
        $("#svg_g_" + _self.id).find("polyline").remove();
        _fid = "";
        var m_mapHeight = document.getElementById("MapContainer").offsetHeight;
        var m_mapWidth = document.getElementById("MapContainer").offsetWidth;
        for (var m_pointID in _hashTable) {
            if (_hashTable[m_pointID].visiable) {
                var m_x = _hashTable[m_pointID].x;
                var m_y = _hashTable[m_pointID].y;
                var m_geoPoint = new XiaoFu.GeoPoint(m_x, m_y);
                var m_point = _self.map.mapToPoint(m_geoPoint);
                if (m_point.x > 0 && m_point.x < m_mapWidth && m_point.y > 0 && m_point.y < m_mapHeight) {
                    var m_pid = "";
                    if (_self.isPolymerization) {
                        m_pid = polymerization(_hashTable[m_pointID].id, m_point);
                    }
                    if (m_pid == "") {
                        if (_fid == "") {
                            _fid = "svg_" + _self.id + "_" + m_pointID;
                        }
                        var a = _self.map.getResolution();
                        var b = 20000;
                        var c = b / a;
                        var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        m_rect.setAttribute("id", "svg_" + _self.id + "_" + m_pointID);
                        m_rect.setAttribute("cx", m_point.x);
                        m_rect.setAttribute("cy", m_point.y);
                        m_rect.setAttribute("r", _hashTable[m_pointID].r);
                        m_rect.setAttribute("fill", _hashTable[m_pointID].fill);
                        m_rect.setAttribute("fill-opacity", _hashTable[m_pointID].fillOpacity);
                        m_rect.setAttribute("stroke", _hashTable[m_pointID].stroke);
                        m_rect.setAttribute("stroke-opacity", "1");
                        m_rect.setAttribute("stroke-width", "1");
                        m_rect.setAttribute("stroke-linecap", "round");
                        m_rect.setAttribute("stroke-linejoin", "round");
                        m_rect.setAttribute("stroke-dasharray", "none");
                        m_rect.setAttribute("pointer-events", "visiblePainted");
                        m_rect.setAttribute("cursor", "inherit");
                        _svg_g.appendChild(m_rect);
                        var m_doc = $("#svg_" + _self.id + "_" + m_pointID);
                        m_doc.click(function () {
                            var m_htid = this.id.split("_")[2];
                            _hashTable[m_htid].dispatchEvent("click", _hashTable[m_htid]);
                        })
                    } else {
                        var m_color = "red";
                        var m_size = 10;
                        var m_r = 20;
                        var m_nun = _hashTable_nun[m_pid];
                        if (m_nun < 10) {
                            m_color = "yellow";
                            m_size = 16;
                            m_r = 10;
                        } else if (m_nun < 100) {
                            m_color = "orange";
                            m_size = 10;
                            m_r = 15;
                        }
                        var m_markerdiv = $("#svg_" + _self.id + "_" + m_pid);
                        m_markerdiv.unbind('click');
                        m_markerdiv.click(function () {
                            var m_htid = this.id.split("_")[2];
                            var m_allid = _hashTable_juhe[m_htid];
                            var m_geoPoint1 = new XiaoFu.GeoPoint(_hashTable[m_htid].x, _hashTable[m_htid].y);
                            var m_point1 = _self.map.mapToPoint(m_geoPoint1);
                            showPoints(m_allid, parseInt(m_point1.y) - 3, parseInt(m_point1.x) - 3);
                        })
                        var m_top = document.getElementById("svg_" + _self.id + "_" + m_pid).getAttributeNS(null, "cx");
                        var m_left = document.getElementById("svg_" + _self.id + "_" + m_pid).getAttributeNS(null, "cy");
                        document.getElementById("svg_" + _self.id + "_" + m_pid).setAttributeNS(null, "r", m_r);
                        document.getElementById("svg_" + _self.id + "_" + m_pid).setAttributeNS(null, "fill", m_color);
                        if ($("#text_nun_" + m_pid).length) {
                            $("#text_nun_" + m_pid).html(m_nun);
                            //document.getElementById("text_nun_" + m_pid).textContent = m_nun;
                        } else {
                            var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                            m_rect.setAttribute("id", "text_nun_" + m_pid);
                            m_rect.setAttribute("x", parseInt(m_top) - 4);
                            m_rect.setAttribute("y", parseInt(m_left) + 6);
                            m_rect.setAttribute("fill", "blue");
                            m_rect.setAttribute("font-size", m_size);
                            m_rect.setAttribute("pointer-events", "none");
                            m_rect.setAttribute("cursor", "default");
                            _svg_g.appendChild(m_rect);
                            document.getElementById("text_nun_" + m_pid).textContent = m_nun;
                        }
                        var m_doc = $("#text_nun_" + m_pid);
                        m_doc.unbind('click');
                        m_doc.click(function () {
                            var m_htid = this.id.split("_")[2];
                            var m_allid = _hashTable_juhe[m_htid];
                            var m_geoPoint1 = new XiaoFu.GeoPoint(_hashTable[m_htid].x, _hashTable[m_htid].y);
                            var m_point1 = _self.map.mapToPoint(m_geoPoint1);
                            showPoints(m_allid, parseInt(m_point1.y) - 3, parseInt(m_point1.x) - 3);
                        })
                    }
                }
            }
        }
    }

    //×××××更新线图层×××××
    function updateLine() {
        var m_top = null;
        var m_bottom = null;
        var m_left = null;
        var m_right = null;
        for (var m_lineID in _hashTable) {
            if (_hashTable[m_lineID].visiable) {
                for (var j = 0; j < _hashTable[m_lineID].geometry.path.length; j++) {
                    var m_strLine = "";
                    var m_array = _hashTable[m_lineID].geometry.path[j];
                    for (var i = 0; i < m_array.length; i++) {
                        var m_point = _self.map.mapToPoint(m_array[i]);
                        m_strLine += m_point.x + "," + m_point.y + ",";
                        if (m_top == null || m_top > m_point.y) {
                            m_top = m_point.y;
                        }
                        if (m_bottom == null || m_bottom < m_point.y) {
                            m_bottom = m_point.y;
                        }
                        if (m_left == null || m_left > m_point.x) {
                            m_left = m_point.x;
                        }
                        if (m_right == null || m_right < m_point.x) {
                            m_right = m_point.x;
                        }
                    }
                    if (m_strLine != "" && isReader(m_top, m_bottom, m_left, m_right)) {
                        m_strLine = m_strLine.substring(0, (m_strLine.length - 1));
                        var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
                        m_rect.setAttribute("id", "svg_" + _self.id + "_" + m_lineID + "_" + j);
                        m_rect.setAttribute("points", m_strLine);
                        m_rect.setAttribute("fill", "none");
                        m_rect.setAttribute("stroke", _hashTable[m_lineID].stroke);
                        m_rect.setAttribute("stroke-opacity", _hashTable[m_lineID].strokeOpacity);
                        m_rect.setAttribute("stroke-width", _hashTable[m_lineID].strokeWidth);
                        m_rect.setAttribute("stroke-linecap", _hashTable[m_lineID].strokeLinecap);
                        m_rect.setAttribute("stroke-linejoin", _hashTable[m_lineID].strokeLinejoin);
                        m_rect.setAttribute("stroke-dasharray", "none");
                        m_rect.setAttribute("pointer-events", _hashTable[m_lineID].pointerEvents);
                        //m_rect.setAttribute("pointer-events", "visiblePainted"); 
                        m_rect.setAttribute("cursor", "inherit");
                        _svg_g.appendChild(m_rect);

                        if (m_lineID in _hashTable_Render) {
                            _hashTable_Render[m_lineID] += "*svg_" + _self.id + "_" + m_lineID + "_" + j;
                        } else {
                            _hashTable_Render[m_lineID] = "svg_" + _self.id + "_" + m_lineID + "_" + j;
                        }

                        var m_doc = $("#svg_" + _self.id + "_" + m_lineID + "_" + j);
                        m_doc.click(function () {
                            var m_htid = this.id.split("_")[2];
                            _hashTable[m_htid].dispatchEvent("click", _hashTable[m_htid]);
                        })
                    }
                }
            }
        }

//        $("#svg_g_" + _self.id).find("polyline").remove();
//        _hashTable_Render = new Object();
//        var m_top = null;
//        var m_bottom = null;
//        var m_left = null;
//        var m_right = null;
//        for (var m_lineID in _hashTable) {
//            if (_hashTable[m_lineID].visiable) {
//                for (var j = 0; j < _hashTable[m_lineID].geometry.path.length; j++) {
//                    var m_strLine = "";
//                    var m_array = _hashTable[m_lineID].geometry.path[j];
//                    for (var i = 0; i < m_array.length; i++) {
//                        var m_point = _self.map.mapToPoint(m_array[i]);
//                        m_strLine += m_point.x + "," + m_point.y + ",";
//                        if (m_top == null || m_top > m_point.y) {
//                            m_top = m_point.y;
//                        }
//                        if (m_bottom == null || m_bottom < m_point.y) {
//                            m_bottom = m_point.y;
//                        }
//                        if (m_left == null || m_left > m_point.x) {
//                            m_left = m_point.x;
//                        }
//                        if (m_right == null || m_right < m_point.x) {
//                            m_right = m_point.x;
//                        }
//                    }
//                    if (m_strLine != "" && isReader(m_top, m_bottom, m_left, m_right)) {
//                        m_strLine = m_strLine.substring(0, (m_strLine.length - 1));
//                        var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
//                        m_rect.setAttribute("id", "svg_" + _self.id + "_" + m_lineID + "_" + j);
//                        m_rect.setAttribute("points", m_strLine);
//                        m_rect.setAttribute("fill", "none");
//                        m_rect.setAttribute("stroke", _hashTable[m_lineID].stroke);
//                        m_rect.setAttribute("stroke-opacity", _hashTable[m_lineID].strokeOpacity);
//                        m_rect.setAttribute("stroke-width", _hashTable[m_lineID].strokeWidth);
//                        m_rect.setAttribute("stroke-linecap", _hashTable[m_lineID].strokeLinecap);
//                        m_rect.setAttribute("stroke-linejoin", _hashTable[m_lineID].strokeLinejoin);
//                        m_rect.setAttribute("stroke-dasharray", "none");
//                        m_rect.setAttribute("pointer-events", _hashTable[m_lineID].pointerEvents);
//                        //m_rect.setAttribute("pointer-events", "visiblePainted"); 
//                        m_rect.setAttribute("cursor", "inherit");
//                        _svg_g.appendChild(m_rect);

//                        if (m_lineID in _hashTable_Render) {
//                            _hashTable_Render[m_lineID] += "*svg_" + _self.id + "_" + m_lineID + "_" + j;
//                        } else {
//                            _hashTable_Render[m_lineID] = "svg_" + _self.id + "_" + m_lineID + "_" + j;
//                        }

//                        var m_doc = $("#svg_" + _self.id + "_" + m_lineID + "_" + j);
//                        m_doc.click(function () {
//                            var m_htid = this.id.split("_")[2];
//                            _hashTable[m_htid].dispatchEvent("click", _hashTable[m_htid]);
//                        })
//                    }
//                }
//            }
//        }
    }

    //×××××更新面图层×××××
    function updatePolygon() {
        $("#svg_g_" + _self.id).find("path").remove();
        var m_top = null;
        var m_bottom = null;
        var m_left = null;
        var m_right = null;
        for (var m_polygonID in _hashTable) {
            if (_hashTable[m_polygonID].visiable) {
                for (var j = 0; j < _hashTable[m_polygonID].geometry.path.length; j++) {
                    var m_array = _hashTable[m_polygonID].geometry.path[j];
                    var m_strPolygon = "";
                    var m_strPolygon_star = "";
                    for (var i = 0; i < m_array.length; i++) {
                        var m_point = _self.map.mapToPoint(m_array[i]);
                        m_strPolygon += m_point.x + "," + m_point.y + " ";
                        m_strPolygon_star = m_point.x + "," + m_point.y;
                        if (m_top == null || m_top > m_point.y) {
                            m_top = m_point.y;
                        }
                        if (m_bottom == null || m_bottom < m_point.y) {
                            m_bottom = m_point.y;
                        }
                        if (m_left == null || m_left > m_point.x) {
                            m_left = m_point.x;
                        }
                        if (m_right == null || m_right < m_point.x) {
                            m_right = m_point.x;
                        }
                    }
                    if (m_strPolygon != "" && isReader(m_top, m_bottom, m_left, m_right)) {
                        m_strPolygon = " M " + m_strPolygon + m_strPolygon_star + " z";
                        var m_rect = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        m_rect.setAttribute("id", "svg_" + _self.id + "_" + m_polygonID + "_" + j);
                        m_rect.setAttribute("d", m_strPolygon);
                        m_rect.setAttribute("fill-rule", "evenodd");
                        m_rect.setAttribute("fill", _hashTable[m_polygonID].fill);
                        m_rect.setAttribute("fill-opacity", _hashTable[m_polygonID].fillOpacity);
                        m_rect.setAttribute("stroke", _hashTable[m_polygonID].stroke);
                        m_rect.setAttribute("stroke-opacity", _hashTable[m_polygonID].strokeOpacity);
                        m_rect.setAttribute("stroke-width", _hashTable[m_polygonID].strokeWidth);
                        m_rect.setAttribute("stroke-linecap", "round");
                        m_rect.setAttribute("stroke-linejoin", "round");
                        m_rect.setAttribute("stroke-dasharray", "none");
                        m_rect.setAttribute("pointer-events", "visiblePainted");
                        m_rect.setAttribute("cursor", "inherit");
                        _svg_g.appendChild(m_rect);
                        var m_doc = $("#svg_" + _self.id + "_" + m_polygonID + "_" + j);
                        m_doc.click(function () {
                            var m_htid = this.id.split("_")[2];
                            _hashTable[m_htid].dispatchEvent("click", _hashTable[m_htid]);
                        })
                    }
                }
            }
        }
    }

    //×××××判断是否渲染对象×××××
    //p_top（对象最上坐标）
    //p_bottom（对象最下坐标）
    //p_left（对象最左坐标）
    //p_right（对象最右坐标）
    function isReader(p_top, p_bottom, p_left, p_right) {
        var m_mapHeight = document.getElementById("MapContainer").offsetHeight;
        var m_mapWidth = document.getElementById("MapContainer").offsetWidth;
        if (p_top > m_mapHeight)
            return false;
        if (p_bottom < 0)
            return false;
        if (p_left > m_mapWidth)
            return false;
        if (p_right < 0)
            return false;
        return true;
    }
}