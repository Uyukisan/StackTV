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
		autoPlay: true,
		autoPlayFirst: true,
		showAbout: true,
		showLog: true,
		fetchTimeOut: 30000,
		lazyLoadSize: 100,
		tv_list: [{
			'tv_name': 'Stack TV',
			'tv_logo': 'https://tv.stackblog.cf/img/logo.png',
			'tv_url': 'https://vmcdn.stackblog.ml/video/simplestacktv_1.m3u8'
		}]
	}
	var hideLogTimer;
	var AwesomeStackTV = function(option, undefined) {
		return new AwesomeStackTV.fn.init(option, undefined);
	};
	AwesomeStackTV.prototype = AwesomeStackTV.fn = {
		constructor: AwesomeStackTV,
		init: function(option, undefined) {
			let _this = this;
			_this._setting = extend({}, defaultSetting, option);
			_this.searchResult = [];
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
				},
				currentLoadIndex: {
					get: function() {
						// return _this._setting.tv_list.filter(item=>item.loaded==true).length || 0;
						return this._currentLoadIndex || 0;
					},
					set: function(newValue) {
						this._currentLoadIndex = newValue;

					}
				}
			});

			_this._initTV();
			// _this._genSwitches();
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
					this.hls.on(Hls.Events.ERROR, function(event, data) {
						// _this.log("hls:视频加载出错");
						if (data.fatal) {
							switch (data.type) {
								case Hls.ErrorTypes.NETWORK_ERROR:
									_this.log("hls:网络错误，尝试修复...");
									_this.hls.startLoad();
									break;
								case Hls.ErrorTypes.MEDIA_ERROR:
									_this.log("hls:媒体错误，尝试修复...");
									_this.hls.recoverMediaError();
									break;
								default:
									_this.log("hls:出错了!");
									break;
							}
						}	
					});
					this.hls.loadSource(url);
					this.hls.attachMedia(this._setting.tv);
				} else {
					this.log("hls不支持!");
					this._setting.tv.src = url;
				}
			} else {
				this._setting.tv.src = url;
			}

		},
		loadTVList: function(list) {
			this.log("准备加载节目列表...");
			if (!list || typeof list == 'string' || !list.length) {
				this.log("节目列表数据格式不对!");
				return false;
			}
			this._setting.tv_list = list;
			if (!this._setting.showAbout && this._setting.autoPlayFirst && this._setting.tv_list[0]) {
				this.log("自动载入第一个节目");
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
			video.autoplay = this._setting.autoPlay;
			video.controls = true;
			video.setAttribute('x5-playsinline', true);
			video.setAttribute('webkit-playsinline', true);
			video.playsInline = true;
			addClass("stack-tv-video", video);
			this._stackvideo = video;
			this._stackswitchbox = switchs;
			this._stackswitchlist = switchlist;
			this._stacktvlog = tvLog;
			//图片懒加载
			this._stackswitchlist.addEventListener("scroll", lazyLoad);
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
				_this._stackswitchlist.scrollTop = 0;
				_this.searchResult = [];
				_this._setting.currentLoadIndex = 0;
				if (inputValue.length > 0) {
					_this._setting.tv_list.forEach((item, index) => {
						if (!item.tv_name) {
							return false;
						}
						if (item.tv_name.toUpperCase().indexOf(inputValue.toUpperCase()) >=
							0) {
							let searchItem = {};
							searchItem.index = index;
							searchItem.tv_name = item.tv_name;
							searchItem.tv_logo = item.tv_logo;
							searchItem.tv_url = item.tv_url;
							searchItem.loaded = item.loaded;
							searchItem.hidden = false;
							_this._setting.tv_list[index].hidden = false;
							_this.searchResult.push(searchItem);
							searchItem = null;
						} else {
							_this._setting.tv_list[index].hidden = true;
						}

					});

					// console.log(_this.searchResult);
					_this._genSwitches();

					// _this._genSwitches();
				} else {
					_this._setting.tv_list.forEach((item, index) => {
						_this._setting.tv_list[index].hidden = false
					})
					_this._genSwitches();
				}
				// _this.searchResult = null;

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

			video.oncontextmenu = function() {
				return false;
			}

			_this.log("~Stack TV加载完成~");

			function lazyLoad() {
				let lazyImgs = _this._stackswitchlist.querySelectorAll(".lazyImg");
				lazyImgs.forEach((img) => {
					if (isInViewPort(_this._stackswitchlist, img)) {
						img.src = img.parentNode.getAttribute("tv_logo");
						removeClass("lazyImg", img);
						addClass("loadedImg", img);
					}
				});

				let lazySwitches = _this._stackswitchlist.querySelectorAll(".shown");
				let lastSwitch = lazySwitches[lazySwitches.length - 1];
				if (lastSwitch != undefined && _this._setting.currentLoadIndex > 0 && _this._setting.currentLoadIndex + 1 < _this
					._setting.tv_list.length && isInViewPort(_this._stackswitchlist, lastSwitch)) {
					if(_this._setting.currentLoadIndex >= _this._setting.tv_list.length || (_this.searchResult.length > 0 && _this._setting.currentLoadIndex >= _this.searchResult.length)){
						return false;
					}
					console.info("装载更多节目列表");
					_this._genSwitches();

				}

			}
		},
		_genSwitches: function() {
			let _this = this;
			// _this._stackswitchlist.innerHTML = "";
			let gen_list;
			let flag = false;
			if (this.searchResult && this.searchResult.length > 0) {
				gen_list = this.searchResult;
			} else {
				gen_list = _this._setting.tv_list;
				flag = true;
			}
			_this._stackswitchlist.childNodes.forEach((item) => {
				let _item = item;
				if (flag == true || gen_list.find(item => item.index == parseInt(_item.style
						.getPropertyValue("--stack-tv-index")))) {
					removeClass("hidden", item);
					addClass("shown", item);
				} else {
					removeClass("shown", item);
					addClass("hidden", item);
				}
			});
			for (let j = 0; j < _this._setting.lazyLoadSize; j++) {
				let i = _this._setting.currentLoadIndex;
				if (i >= gen_list.length) {
					// _this._setting.currentLoadIndex += 1;
					return false;
				}
				if (gen_list[i].loaded) {
					_this._setting.currentLoadIndex += 1
					continue;
				}
				let div = document.createElement("div");
				let img = new Image();
				let tvname = document.createElement("div");
				addClass("tv-name", tvname);
				tvname.innerText = gen_list[i].tv_name ? gen_list[i].tv_name :
					`节目-${i+1}`;
				addClass("stack-tv-switch-item", div);
				(gen_list[i].hidden != undefined && gen_list[i].hidden) ? addClass("hidden", div): addClass(
					"shown", div);
				div.setAttribute("tv_name", gen_list[i].tv_name);
				div.setAttribute("tv_url", gen_list[i].tv_url);
				div.setAttribute("tv_logo", gen_list[i].tv_logo);
				let tv_index = gen_list[i].index || _this._setting.currentLoadIndex;
				div.style.setProperty("--stack-tv-index", tv_index);
				img.src = _this._setting.default_logo;
				addClass("lazyImg", img);
				div.appendChild(img);
				div.appendChild(tvname);
				div.addEventListener("click", function() {
					_this.loadUrl(div.getAttribute("tv_url"));
					_this._stackvideo.poster = div.getAttribute("tv_logo");
				});
				_this._stackswitchlist.appendChild(div);
				_this._setting.tv_list[tv_index].loaded = true;
				_this._setting.currentLoadIndex += 1;
				if (isInViewPort(_this._stackswitchlist, img)) {
					img.src = img.parentNode.getAttribute("tv_logo");
					removeClass("lazyImg", img);
					addClass("loadedImg", img);
				}
				img.onerror = function() {
					img.src = _this._setting.default_logo;
					img.onerror = null;
				}

			}



		},
		log: function(msg) {
			if (hideLogTimer) {
				clearTimeout(hideLogTimer);
			}
			if (!this._setting.showLog) {
				console.info(msg);
				return false;
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
		fetchM3U: function(url) {
			let _this = this;

			if (!url || typeof url != 'string' || !url.match(/(http|https).*\.(m3u8|m3u|txt).*/)) {
				this.log("m3u链接格式不对!");
				console.warn("m3u链接格式不对!");
				return false;
			}
			this.log("开始请求节目列表");
			Promise.race([
					fetchData(url),
					new Promise(function(resolve, reject) {
						setTimeout(() => reject(new Error('request timeout')), _this._setting
							.fetchTimeOut)
					})
				])
				.then((data) => {
					_this.log('节目列表请求成功');
					_this.loadTVList(_this.m3uToJson(data));

				})
				.catch(err => {
					_this.log("节目列表请求失败或超时!");
					console.error("请求发生错误:" + url);
					console.error(err);
				});

		},
		m3uToJson: function(m3uStr) {
			let m3u = typeof m3uStr == 'string' ? m3uStr : "";
			let TV_List = [];
			let tv_items = m3u.split('#EXTINF');
			if (tv_items.length <= 1) {
				console.warn("m3u文件格式不对!");
				return false;
			}
			for (let i = 1; i < tv_items.length; i++) {
				let item = {};
				item.tv_name = tv_items[i].match(/tvg-name=\"(.*?)\"/);
				item.tv_name = item.tv_name ? item.tv_name.pop() : "";
				let tv_id = tv_items[i].match(/tvg-id=\"(.*?)\"/);
				tv_id = tv_id ? tv_id.pop() : "";
				item.tv_name = item.tv_name.length > 0 ? item.tv_name : tv_id;
				item.tv_name = item.tv_name.length >0 ? item.tv_name : `节目-${i}`;
				item.tv_url = ('http' + tv_items[i].split('http').pop()).trim();
				item.tv_url == 'http' ? item.tv_url = this._setting.default_url : "";
				item.tv_logo = tv_items[i].match(/tvg-logo=\"(.*?)\"/);
				item.tv_logo = item.tv_logo ? item.tv_logo.pop() : this._setting.default_logo;
				TV_List.push(item);
			}
			return TV_List;
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

	function fetchData(url, type = 'text') {
		return new Promise(function(resolve, reject) {
			fetch(url, {
				method: "GET"
			}).then((response) => {
				if (type == 'json') {
					return response.json();
				}
				return response.text();
			}).then((response) => {
				resolve(response);
			}).catch((err) => {
				reject(err);
			});
		});
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
		// if (!hasClass(cla, element)) {
		// 	if (element.setAttribute) {
		// 		let newClass = element.getAttribute("class") ? element.getAttribute("class") + " " + cla :
		// 			cla;
		// 		element.setAttribute("class", newClass);
		// 	} else {
		// 		element.className = element.className + " " + cla;
		// 	}

		// }
		if (!element) {
			return false;
		}
		element.classList.add(cla);
	}

	function removeClass(cla, element) {
		// let classList = element.getAttribute("class").split(" ");
		// for (let i = 0; i < classList.length; i++) {
		// 	if (classList[i] == cla) {
		// 		classList.splice(i, 1);
		// 	}
		// }

		// element.setAttribute("class", classList.join(" "));
		if (!element) {
			return false;
		}
		element.classList.remove(cla);

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

	AwesomeStackTV.fn.init.prototype = AwesomeStackTV.fn;
	window.AwesomeStackTV = AwesomeStackTV;
	window.$ASTV = AwesomeStackTV;
	return this;
})(window);
