/**
 * Date: 2023-06-12
 * Author: Stack Dev
 * Blog: https://stackblog.cf
 */
;
(function(window) {
	"use strict";
	var defaultSetting = {
		selector: "body",
		default_url: "https://vmcdn.stackblog.ml/video/aboutstacktv.m3u8",
		default_logo: "https://stackblog.cf/img/logo.png",
		hls:true,
		tv_list:[{
			'tv_name': 'Stack TV',
			'tv_logo': 'https://stackblog.cf/img/logo.png',
			'tv_url': 'https://vmcdn.stackblog.ml/video/aboutstacktv.m3u8'
		}]
	}
	var SimpleStackTV = function(option, undefined) {
		return new SimpleStackTV.fn.init(option, undefined);
	};
	SimpleStackTV.prototype = SimpleStackTV.fn = {
		constructor: SimpleStackTV,
		init: function(option, undefined) {
			let _this = this;
			_this._setting = extend({}, defaultSetting, option);
			_this._initTV();
			_this._genSwitches();
			Object.defineProperties(this._setting, {
				tv: {
					get: function() {
						this._tv = _this._stackvideo ? _this._stackvideo : document.querySelector("video");
						return this._tv;
					}
				},
				tv_list:{
					get: function(){
						return this._tv_list || [];
					},
					set: function(newValue){
						if(newValue instanceof Array){
							this._tv_list = newValue;
							_this._genSwitches();
						}else{
							console.warn("赋值类型必须是数组！");
						}
					}
				}
			});

			_this.loadUrl(_this._setting.default_url);
			_this.help();
			return this;
		},
		loadUrl: function(url) {
			if(this._setting.hls){
				if(Hls.isSupported()){
					console.info("将使用hls播放视频");
					this.hls = new Hls();
					this.hls.loadSource(url);
					this.hls.attachMedia(this._setting.tv);
				}else{
					this._setting.tv.src = url;
				}
			}else if(this._setting.tv.canPlayType('application/vnd.apple.mpegurl')){
				this._setting.tv.src = url;
			}else{
				alert("The current browser does not support playing this video!\n当前浏览器不支持播放该视频！")
			}
			
		},
		loadTVList:function(list){
			this._setting.tv_list = list;
		},
		_initTV: function(){
			let div = document.createElement('div');
			let tv = document.createElement("div");
			let switchs = document.createElement("div");
			let switchlist = document.createElement("div");
			let switchHead = document.createElement("div");
			switchHead.innerText = "节目单";
			addClass("stack-tv-switch-head",switchHead);
			addClass("stack-tv-container", div);
			addClass("stack-tv-switch", switchs);
			addClass("stack-tv-switch-list",switchlist);
			addClass("stack-tv-box", tv);
			switchs.appendChild(switchHead);
			switchs.appendChild(switchlist);
			let video = document.createElement("video");
			video.autoplay = true;
			video.controls = true;
			addClass("stack-tv-video",video);
			this._stackvideo = video;
			this._stackswitchbox = switchs;
			this._stackswithlist = switchlist;
			tv.appendChild(video);
			div.appendChild(tv);
			div.appendChild(switchs);
			let container = document.querySelector(this._setting.selector) ? document.querySelector(this._setting.selector) : document.querySelector("body");
			container.appendChild(div);
		},
		_genSwitches: function(){
			let _this = this;
			_this._stackswithlist.innerHTML = "";
			for(let i=0;i<_this._setting.tv_list.length;i++){
				let div = document.createElement("div");
				let img = new Image();
				let tvname = document.createElement("div");
				addClass("tv-name",tvname);
				tvname.innerText = _this._setting.tv_list[i].tv_name ? _this._setting.tv_list[i].tv_name : `节目-${i+1}`;
				addClass("stack-tv-switch-item", div);
				div.setAttribute("tv_name",_this._setting.tv_list[i].tv_name);
				div.setAttribute("tv_url",_this._setting.tv_list[i].tv_url);
				div.setAttribute("tv_logo",_this._setting.tv_list[i].tv_logo);
				img.src = _this._setting.tv_list[i].tv_logo ? _this._setting.tv_list[i].tv_logo : _this._setting.default_logo;
				div.appendChild(img);
				div.appendChild(tvname);
				div.addEventListener("click",function(){
					_this.loadUrl(_this._setting.tv_list[i].tv_url);
					_this._stackvideo.poster = img.src;
				});
				_this._stackswithlist.appendChild(div);
			}
		},
		help: function() {

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
					target[key] = source[key];
				}
			}
		}
		return target;
	}

	function hasClass(cla, element) {
		if (element.className.trim().length === 0) return false;
		let allClass = element.className.trim().split(" ");
		return allClass.indexOf(cla) > -1;
	}

	function addClass(cla, element) {
		if (!hasClass(cla, element)) {
			if (element.setAttribute) {
				let newClass = element.getAttribute("class") ? element.getAttribute("class") + " " + cla :
					cla;
				element.setAttribute("class", newClass);
			} else {
				element.className = element.className + " " + cla;
			}

		}
	}

	function removeClass(cla, element) {
		let classList = element.getAttribute("class").split(" ");
		for (let i = 0; i < classList.length; i++) {
			if (classList[i] == cla) {
				classList.splice(i, 1);
			}
		}

		element.setAttribute("class", classList.join(" "));

	}

	SimpleStackTV.fn.init.prototype = SimpleStackTV.fn;
	window.SimpleStackTV = SimpleStackTV;
	window.$STV = SimpleStackTV;
	return this;
})(window);