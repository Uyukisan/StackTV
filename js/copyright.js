/**
 * Date: 2023-05-07 10:36:29
 * Author: Stack Dev
 * Blog: https://stackblog.cf
 */
; (function (window) {
    "use strict";
    var defaultSetting = {
        "selector": ".copyright",
        "start": 2022,
        "link": {
            "title": "Stack Dev",
            "href": "https://stackblog.cf",
            "target": "_blank"
        }
    }
    var MyukiCopyright = function(option, undefined) {
		return new MyukiCopyright.fn.init(option, undefined);
	};
    MyukiCopyright.prototype = MyukiCopyright.fn = {
        constructor: MyukiCopyright,
        init: function (option, undefined) {
            let _this = this;
            _this._setting = extend({}, defaultSetting, option);
            let copyright = document.querySelectorAll(_this._setting.selector)[0];
            if (copyright) {
							if(this._setting.start != new Date().getFullYear()){
								copyright.innerHTML = `&copy;${this._setting.start}&nbsp;-&nbsp;${new Date().getFullYear()}&nbsp;By&nbsp;`;
								
							}else{
								copyright.innerHTML = `&copy;${this._setting.start}&nbsp;By&nbsp;`;
							}
							
                let link = document.createElement("a");
                link.href = _this._setting.link.href;
                link.innerText = _this._setting.link.title;
                link.target = _this._setting.link.target;
                copyright.appendChild(link);
            }else{
                console.error("Copyright dom not found.");
            }
        }
    }
    function extend() {
        let length = arguments.length;
        let target = arguments[0] || {};
        if (typeof target != "object" && typeof target != "function") {
            target = {};
        }
        if (length == 1) {
            target = this;
            i--;
        }
        for (var i = 1; i < length; i++) {
            let source = arguments[i];
            for (let key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    if (typeof source[key] == "object") {
                        target[key] = Object.assign({}, target[key], source[key])
                        Array.prototype.isPrototypeOf(source[key]) ? target[key] = Object.values(target[key]) : "";
                    } else {
                        target[key] = source[key];
                    }

                }
            }
        }
        return target;
    }
    MyukiCopyright.fn.init.prototype = MyukiCopyright.fn;
    window.MyukiCopyright = MyukiCopyright;
    window.$MCR = MyukiCopyright;
    return this;
})(window);
$MCR({"start":2023});