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
		default_url: "https://vmcdn.stackblog.ml/video/simplestacktv_1.m3u8",
		default_logo: "https://tv.stackblog.cf/img/logo.png",
		maxLog: 6,
		autoPlayFirst: true,
		showAbout: true,
		tv_list: [{
			'tv_name': 'Stack TV',
			'tv_logo': 'https://tv.stackblog.cf/img/logo.png',
			'tv_url': 'https://vmcdn.stackblog.ml/video/simplestacktv_1.m3u8'
		}]
	}
	var hideLogTimer;
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
						this._tv = _this._stackvideo ? _this._stackvideo : document
							.querySelector("video");
						return this._tv;
					}
				},
				tv_list: {
					get: function() {
						return this._tv_list || [];
					},
					set: function(newValue) {
						if (newValue instanceof Array) {
							this._tv_list = newValue;
							console.info("节目列表已更新");
							_this._genSwitches();
						} else {
							console.warn("赋值类型必须是数组!");
						}
					}
				}
			});

			if (_this._setting.showAbout) {
				_this.log("准备播放Stack TV介绍...");
				_this.loadUrl(defaultSetting.default_url);
			}
			_this.help();
			return this;
		},
		loadUrl: function(playUrl) {
			let _this = this;
			let url = "";
			try {
				url = playUrl ? playUrl.trim() : defaultSetting.default_url;
			} catch (err) {
				this.log("视频链接有误!");
				return;
			}
			this.log("准备播放视频:" + url);
			let canPlayM3u8 = this._stackvideo.canPlayType('application/vnd.apple.mpegurl');
			if (!canPlayM3u8 && url.match(/.*\.(m3u8).*/gi)) {
				this.log("当前浏览器不支持播放m3u8!");
				this.log("将尝试使用hls播放视频...");
				if (Hls.isSupported()) {
					this.log("正在载入hls...");
					this.hls = new Hls();
					this.hls.on(Hls.Events.ERROR,function(){
						_this.log("hls:视频加载失败");
					});
					this.hls.loadSource(url);
					this.hls.attachMedia(this._setting.tv);
				} else {
					this.log("hls不支持!");
					this._setting.tv.src = url;
				}
			} else{
				this._setting.tv.src = url;
			}

		},
		loadTVList: function(list) {
			this.log("准备加载节目列表...");
			this._setting.tv_list = list;
			if (!this._setting.showAbout && this._setting.autoPlayFirst && this._setting.tv_list[0]) {
				this.log("自动播放第一个节目");
				this.loadUrl(this._setting.tv_list[0].tv_url);
			}
		},
		_initTV: function() {
			let _this = this;
			let div = document.createElement('div');
			let tv = document.createElement("div");
			let tvLog = document.createElement("div");
			let switchs = document.createElement("div");
			let switchlist = document.createElement("div");
			let switchHead = document.createElement("div");
			switchHead.innerText = "节目单";
			let switchSearch = document.createElement("div");
			let input = document.createElement("input");
			input.placeholder = "搜索节目";
			switchSearch.appendChild(input);
			addClass("stack-tv-switch-foot", switchSearch);
			addClass("stack-tv-switch-head", switchHead);
			addClass("stack-tv-container", div);
			addClass("stack-tv-switch", switchs);
			addClass("stack-tv-switch-list", switchlist);
			addClass("stack-tv-box", tv);
			addClass("stack-tv-log-list", tvLog);
			switchs.appendChild(switchHead);
			switchs.appendChild(switchlist);
			switchs.appendChild(switchSearch);
			let video = document.createElement("video");
			video.autoplay = true;
			video.controls = true;
			addClass("stack-tv-video", video);
			this._stackvideo = video;
			this._stackswitchbox = switchs;
			this._stackswithlist = switchlist;
			this._stacktvlog = tvLog;
			//图片懒加载
			this._stackswithlist.addEventListener("scroll", lazyLoad);
			window.addEventListener("resize", lazyLoad);
			window.addEventListener("orientationChange", lazyLoad);
			tv.appendChild(video);
			tv.appendChild(tvLog);
			div.appendChild(tv);
			div.appendChild(switchs);
			let container = document.querySelector(this._setting.selector) ? document.querySelector(this
				._setting.selector) : document.querySelector("body");
			container.appendChild(div);

			//节目搜索
			input.addEventListener("keyup", function(e) {
				let priventList = [13, 32];
				let key = e.keyCode;
				let inputValue = input.value.trim()
				if (priventList.indexOf(key) >= 0 && inputValue.length <= 0) {
					input.value = "";
					e.stopPropagation();
					return;
				}
				if (inputValue.length > 0) {
					for (let i = 0; i < _this._setting.tv_list.length; i++) {
						if (!_this._setting.tv_list[i].tv_name) {
							continue;
						}
						if (_this._setting.tv_list[i].tv_name.toUpperCase().indexOf(inputValue
								.toUpperCase()) < 0) {
							_this._setting.tv_list[i].hidden = true;
						} else {
							_this._setting.tv_list[i].hidden = false;
						}
					}
					_this._genSwitches();
				} else {
					for (let i = 0; i < _this._setting.tv_list.length; i++) {
						_this._setting.tv_list[i].hidden = false;

					}
					_this._genSwitches();
				}

			});
			video.addEventListener("loadstart", function() {
				_this.log("开始加载...");
			});
			video.addEventListener("loadeddata", function() {
				_this.log("努力加载...");

			});
			video.addEventListener("canplaythrough", function() {
				_this.log("开始播放...");
				hideLogTimer = setTimeout(function() {
					addClass("hidden", _this._stacktvlog);
					let logs = _this._stacktvlog.childNodes;
					for (let i = 0; i < _this._setting.maxLog; i++) {
						addClass("hidden", logs[logs.length - 1 - i]);
					}
					clearTimeout(hideLogTimer);
				}, 3000);
			});
			video.addEventListener("error", function() {
				_this.log("加载失败!");
			});

			_this.log("~Stack TV加载完成~");

			function lazyLoad() {
				let lazyImgs = _this._stackswithlist.querySelectorAll(".lazyImg");
				lazyImgs.forEach((img) => {
					if (isInViewPort(_this._stackswithlist, img)) {
						img.src = img.parentNode.getAttribute("tv_logo");
						img.addEventListener("error", function() {
							img.src = _this._setting.default_logo;
							img.removeEventListener("error");
						});
						removeClass("lazyImg", img);
						addClass("loadedImg", img);
					}
				});
			}
		},
		_genSwitches: function() {
			let _this = this;
			_this._stackswithlist.innerHTML = "";
			for (let i = 0; i < _this._setting.tv_list.length; i++) {
				let div = document.createElement("div");
				let img = new Image();
				let tvname = document.createElement("div");
				addClass("tv-name", tvname);
				tvname.innerText = _this._setting.tv_list[i].tv_name ? _this._setting.tv_list[i].tv_name :
					`节目-${i+1}`;
				addClass("stack-tv-switch-item", div);
				_this._setting.tv_list[i].hidden ? addClass("hidden", div) : "";
				div.setAttribute("tv_name", _this._setting.tv_list[i].tv_name);
				div.setAttribute("tv_url", _this._setting.tv_list[i].tv_url);
				div.setAttribute("tv_logo", _this._setting.tv_list[i].tv_logo);
				img.src = _this._setting.default_logo;
				addClass("lazyImg", img);
				div.appendChild(img);
				div.appendChild(tvname);
				div.addEventListener("click", function() {
					_this.loadUrl(div.getAttribute("tv_url"));
					_this._stackvideo.poster = div.getAttribute("tv_logo");
				});
				_this._stackswithlist.appendChild(div);
				if (isInViewPort(_this._stackswithlist, img)) {
					img.src = img.parentNode.getAttribute("tv_logo");
					removeClass("lazyImg", img);
					addClass("loadedImg", img);
				}
			}

		},
		log: function(msg) {
			if (hideLogTimer) {
				clearTimeout(hideLogTimer);
			}
			let logItem = document.createElement("div");
			removeClass("hidden", this._stacktvlog);
			addClass("stack-tv-log-item", logItem);
			logItem.innerText = msg;
			let logs = this._stacktvlog.childNodes;
			this._stacktvlog.appendChild(logItem);
			if (logs.length > this._setting.maxLog) {
				addClass("hidden", logs[logs.length - 1 - this._setting.maxLog]);
			}
		},
		help: function() {
			console.info("🎉欢迎使用Stack TV🎉");
			console.log(
				"%cAuthor: Stack Dev",
				"background-color: #0D98D8 ; color: #ffffff ; font-weight: bold ; margin:32px;padding: 4px ;"
			);
			console.log(
				"%cBlog: https://stackblog.cf",
				"background-color: #0D98D8 ; color: #ffffff ; font-weight: bold ; margin:32px;padding: 4px ;"
			);
			console.log(
				"%cGitHub: https://github.com/Uyukisan",
				"background-color: #0D98D8 ; color: #ffffff ; font-weight: bold ; margin:32px;padding: 4px ;"
			);
			console.log(
				"%cInfo: 📺A simple television.☕️",
				"background-color: #0D98D8 ; color: #ffffff ; font-weight: bold ; margin:32px;padding: 4px ;"
			);
			console.groupEnd();
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

	function isInViewPort(parent, sub, param, threshold = 0) {
		const parentClient = parent.getBoundingClientRect();
		const subClient = sub.getBoundingClientRect();
		const params = ['bottom', 'right', 'left', 'top']
		if (params.indexOf(param) >= 0 && params) {
			return (parentClient[param] - subClient[param]) >= threshold;
		}
		let bottom = parentClient.bottom - subClient.bottom;
		let right = parentClient.right - subClient.right;
		return (bottom >= threshold && right >= threshold);
	}

	SimpleStackTV.fn.init.prototype = SimpleStackTV.fn;
	window.SimpleStackTV = SimpleStackTV;
	window.$STV = SimpleStackTV;
	return this;
})(window);
