function fGetElement() {
    for (var a = new Array, b = 0; b < arguments.length; b++) {
        var c = arguments[b];
        if ("string" == typeof c && (c = document.getElementById(c)), 1 == arguments.length) return c;
        a.push(c)
    }
    return a
}
var DCILayoutControl = {
    nLeftWidth: 300,
    nTopHeight: 50,
    nLayoutWidth: 0,
    nLayoutHeight: 0,
    bMapSpreadState: !1,
    bIsFullScreen: !1,
    oMapSpread: null,
    oShadeV: null,
    oShadeH: null,
    oMapTool: null,
    oMap: null,
    oMapContainer: null,
    oMapNav: null,
    oFullScreen: null,
    nMapH: 0,
    nMapW: 0,
    aDomAry: [],
    nWindowMinWidth: 1024,
    nMapMinWidth: 694,
    InitLayout: function () {
        var a = this;
        window.innerWidth ? this.nLayoutWidth = window.innerWidth : document.body && document.body.clientWidth && (this.nLayoutWidth = document.body.clientWidth), window.innerHeight ? this.nLayoutHeight = window.innerHeight : document.body && document.body.clientHeight && (this.nLayoutHeight = document.body.clientHeight), document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth && (this.nLayoutHeight = document.documentElement.clientHeight, this.nLayoutWidth = document.documentElement.clientWidth), this.bIsFullScreen ? (this.nMapW = this.nLayoutWidth, this.nMapH = this.nLayoutHeight - 28) : (this.nMapW = this.nLayoutWidth - this.nLeftWidth, this.nMapH = this.nLayoutHeight - this.nTopHeight - 28), this.bMapSpreadState ? (this.nMapW = this.nLayoutWidth, this.nMapW = this.nMapW < this.nWindowMinWidth ? this.nWindowMinWidth : this.nMapW) : (this.nMapW = this.nLayoutWidth - this.nLeftWidth, this.nMapW = this.nMapW < this.nMapMinWidth ? this.nMapMinWidth : this.nMapW), this.aDomAry.length <= 0 && (this.aDomAry = fGetElement("map", "tool_container", "mapSpread", "content", "sidebar")), this.oMapTool = this.aDomAry[1], this.oMapTool.style.display = "block", this.oMapTool.style.width = this.nMapW + "px", this.oMapContainer = this.aDomAry[3], this.oMap = this.aDomAry[0], this.oMapContainer.style.width = this.oMap.style.width = (this.nMapW < this.nMapMinWidth ? this.nMapMinWidth : this.nMapW) + "px", this.oMapContainer.style.height = this.nMapH + 28 + "px", this.bIsFullScreen && (this.oMapContainer.style.height = this.nMapH + 31 + 73 + "px"), this.oMap.style.height = this.nMapH + "px", this.oMapSpread = this.aDomAry[2], this.oMapSpread.style.display = "block";
        var b = parseInt(this.nMapH / 2 + 30);
        150 > b && (b = 150), this.oMapSpread.style.top = b + "px", this.oMapSpread.title = "收起左栏", this.oMapNav = this.aDomAry[4], this.oMapNav.style.height = this.nMapH + 28 + "px", this.oMapSpread.onclick = function () {
            a.MidifyLayout(this)
        }
    },
    MidifyLayout: function (a) {
        var b = a.id;
        if ("mapSpread" == b &&
            (this.bMapSpreadState ?
            (this.oMapSpread.style.backgroundPosition = "-412px -7px",
            this.oMapSpread.title = "收起左栏",
            this.bMapSpreadState = !1,
            this.bIsFullScreen && (this.oMapNav.style.marginTop = "0px"),
            this.oMapNav.style.display = "block",
            this.nMapW = this.nMapW - this.nLeftWidth,
            this.oMap.style.width = this.nMapW + "px",
            this.oMapTool.style.width = this.oMapContainer.style.width =
            (this.nMapW < this.nMapMinWidth ? this.nMapMinWidth : this.nMapW) + "px") :
            (this.oMapSpread.style.backgroundPosition = "-429px -7px",
            this.oMapSpread.title = "显示左栏",
            this.bMapSpreadState = !0,
            this.oMapNav.style.display = "none",
            this.nMapW = this.nMapW + this.nLeftWidth,
            this.oMapContainer.style.left = "0px",
            this.oMapTool.style.width = this.oMapContainer.style.width = this.nMapW + "px",
            this.oMapTool.style.width = this.nMapW + "px",
            this.oMap.style.width = this.nMapW + "px")), "fullScreen" == b) {
            var c = fGetElement("header"),
                d = fGetElement("sidebar");
            if (this.bIsFullScreen) {
                this.oMapNav.style.display = "block",
                c.style.display = "block",
                this.bIsFullScreen = !1,
                this.oMapContainer.style.marginTop = "0px",
                this.nMapW = this.bMapSpreadState ? this.nMapW - this.nLeftWidth : this.nMapW,
                this.oMapNav.style.marginTop = "0px",
                this.nMapH = this.nMapH - this.nTopHeight,
                this.bMapSpreadState = !1,
                this.oMapTool.style.width = this.oMapContainer.style.width = this.nMapW + "px",
                this.oMap.style.width = this.nMapW + "px",
                this.oMap.style.height = this.nMapH + "px",
                this.oMapContainer.style.height = parseInt(this.nMapH + 31) + "px",
                this.oMapSpread.style.backgroundPosition = "-412px -7px";
                var e = fGetElement("fullScreen");
                e.innerHTML = "<a href='javascript:void(0)' class='screenbg'><span class='scrlabel'></span>全屏</a>"
            } else {
                this.oMapNav.style.display = "none", c.style.display = "none", this.bIsFullScreen = !0, this.oMapContainer.style.marginTop = "0px", this.nMapW = this.bMapSpreadState ? this.nMapW : this.nMapW + this.nLeftWidth, this.nMapH = this.nMapH + this.nTopHeight, this.oMapContainer.style.left = "0px", this.bMapSpreadState = !0, this.oMapTool.style.width = this.oMapContainer.style.width = (this.nMapW < 1024 ? 1024 : this.nMapW) + "px", this.oMap.style.width = this.nMapW + "px", this.oMap.style.height = this.nMapH + "px", this.oMapContainer.style.height = parseInt(this.nMapH + 28) + "px", this.oMapSpread.style.backgroundPosition = "-429px -7px";
                var e = fGetElement("fullScreen");
                e.innerHTML = "<a href='javascript:void(0)' class='screenbg'><span class='scrlabelout'></span>退出</a>"
            }
            //d.style.height = this.nMapH + 28 + "px", T.Map.map && T.Map.map.checkResize(), T.Mutual.resizeMap("full", this.bIsFullScreen)
        }
    },
    WinResizeHandle: function () {
        this.InitLayout();
    },
    ModifyChannelList: function () {
        //var a = T.Util.fGetElement("busShowList_scroll");
        //a.style.height = parseInt(this.nMapH - 2) + "px"
    }
};
DCILayoutControl.InitLayout();
window.onresize = function () {
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        var a = document.documentElement.clientHeight, b = document.documentElement.clientWidth;
        if (b === DCILayoutControl.nLayoutWidth && a === DCILayoutControl.nLayoutHeight) return;
    }
    DCILayoutControl.WinResizeHandle();
}