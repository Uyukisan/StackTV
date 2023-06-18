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
		autoTheaterMode: true,
		tv_list: [{
			'tv_name': 'Stack TV',
			'tv_logo': 'https://tv.stackblog.cf/img/logo.png',
			'tv_url': 'https://vmcdn.stackblog.ml/video/simplestacktv_1.m3u8'
		}],
		controls: {
			playToggle: true,
			playPrev: true,
			playNext: true,
			volumePanel: true,
			fullScreen: true,
			pictureInPicture: true,
			timeProgress: true,
			currentTime: true,
			playRate: [0.5, 1, 1.5, 2],
			audioTrack: true,
			theaterMode: true
		}
	};
	var ICONS = new Map([
		['next',
			`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4L224 214.3V256v41.7L52.5 440.6zM256 352V256 128 96c0-12.4 7.2-23.7 18.4-29s24.5-3.6 34.1 4.4l192 160c7.3 6.1 11.5 15.1 11.5 24.6s-4.2 18.5-11.5 24.6l-192 160c-9.5 7.9-22.8 9.7-34.1 4.4s-18.4-16.6-18.4-29V352z"/></svg>`
		],
		['prev',
			`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M459.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4L288 214.3V256v41.7L459.5 440.6zM256 352V256 128 96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160C4.2 237.5 0 246.5 0 256s4.2 18.5 11.5 24.6l192 160c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V352z"/></svg>`
		],
		['play',
			`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>`
		],
		['pause',
			`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>`
		],
		['volume',
			`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>`
		],
		['fullscreen',
			`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M32 32C14.3 32 0 46.3 0 64v96c0 17.7 14.3 32 32 32s32-14.3 32-32V96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM64 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H64V352zM320 32c-17.7 0-32 14.3-32 32s14.3 32 32 32h64v64c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32H320zM448 352c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V352z"/></svg>`
		],
		['exitFullscreen',
			`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z"/></svg>`
		],
		['pinp',
			`<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M868.173913 534.26087h-178.086956A156.004174 156.004174 0 0 0 534.26087 690.086957v178.086956a156.004174 156.004174 0 0 0 155.826087 155.826087h178.086956a156.004174 156.004174 0 0 0 155.826087-155.826087v-178.086956A156.004174 156.004174 0 0 0 868.173913 534.26087zM890.434783 868.173913a22.26087 22.26087 0 0 1-22.26087 22.26087h-178.086956a22.26087 22.26087 0 0 1-22.26087-22.26087v-178.086956a22.26087 22.26087 0 0 1 22.26087-22.26087h178.086956a22.26087 22.26087 0 0 1 22.26087 22.26087z"  p-id="2385"></path><path d="M779.130435 0h-534.26087A245.136696 245.136696 0 0 0 0 244.869565v534.26087a245.136696 245.136696 0 0 0 244.869565 244.869565h212.368696a66.782609 66.782609 0 0 0 0-133.565217H244.869565A111.393391 111.393391 0 0 1 133.565217 779.130435v-534.26087A111.393391 111.393391 0 0 1 244.869565 133.565217h534.26087A111.393391 111.393391 0 0 1 890.434783 244.869565v222.608696a66.782609 66.782609 0 0 0 133.565217 0v-222.608696A245.136696 245.136696 0 0 0 779.130435 0z"></path></svg>`
		],
		['film',
			`<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM48 368v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H416zM48 240v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H416zM48 112v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zM416 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H416zM160 128v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H192c-17.7 0-32 14.3-32 32zm32 160c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V320c0-17.7-14.3-32-32-32H192z"/></svg>`
		]
	]);
	var hideLogTimer;
	var removeDisturbTimer;
	var AwesomeStackTV = function(option, undefined) {
		return new AwesomeStackTV.fn.init(option, undefined);
	};
	AwesomeStackTV.prototype = AwesomeStackTV.fn = {
		constructor: AwesomeStackTV,
		init: function(option, undefined) {
			let _this = this;
			_this._setting = extend({}, defaultSetting, option);
			_this.searchResult = [];
			this.hls = new Hls();
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
				},
				currentTVIndex: {
					get: function() {
						return this._currentTVIndex || 0;
					},
					set: function(newValue) {
						this._currentTVIndex = mod(newValue, _this._setting.tv_list.length);
						let newTV = _this._setting.tv_list[this._currentTVIndex]
						if (newTV) {
							_this.loadUrl(newTV.tv_url);
							_this._stackvideo.poster = newTV.tv_logo;
						} else {
							_this.log("没有节目了～～");
						}
					}
				},
				theaterMode: {
					get: function() {
						return this._theaterMode || false;
					},
					set: function(newValue) {
						this._theaterMode = !newValue ? false : true;
						if (this._theaterMode) {
							addClass("wide-screen", _this._tvbox);
							addClass("hidden", _this._stackswitchbox);
							addClass("stack-tv-theaterMode", document.querySelector("body"));
						} else {
							removeClass("wide-screen", _this._tvbox);
							removeClass("hidden", _this._stackswitchbox);
							removeClass("stack-tv-theaterMode", document.querySelector("body"));
						}
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
			addClass("undisturbed", tv);
			addClass("stack-tv-log-list", tvLog);
			switchs.appendChild(switchHead);
			switchs.appendChild(switchlist);
			switchs.appendChild(switchSearch);
			let video = document.createElement("video");
			video.autoplay = this._setting.autoPlay;
			video.controls = false;
			video.setAttribute('x5-playsinline', true);
			video.setAttribute('webkit-playsinline', true);
			video.playsInline = true;
			addClass("stack-tv-video", video);
			this._tvcontainer = div;
			this._stackvideo = video;
			this._tvbox = tv;
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
			this._createControlPanel();

			tv.addEventListener("mousemove",tvMoveHandler);
			function tvMoveHandler(e) {
				if (_this._setting.theaterMode) {
					let right = tv.getBoundingClientRect().width - e.x;
					if (right <= 32) {
						removeClass("hidden", _this._stackswitchbox);
						addClass("shown", _this._stackswitchbox);
					} else {
						removeClass("shown", _this._stackswitchbox);
						addClass("hidden", _this._stackswitchbox);
					}
				}
				removeClass("undisturbed", _this._tvbox);
				if (removeDisturbTimer) {
					clearTimeout(removeDisturbTimer);
				}
				removeDisturbTimer = setTimeout(function() {
					addClass("undisturbed", _this._tvbox);
				}, 3000);
			}
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
				// _this._stackswitchlist.scrollTop = 0;
				_this._stackswitchlist.scroll({
					left: 0,
					top: 0,
					behavior: 'smooth'
				});
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
				_this._stackvideo.removeAttribute("poster");
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
				_this.log("播放出现一点问题");
			});
			video.addEventListener("progress", function() {
				// let start = this.buffered.start(0);
				// let end = this.buffered.end(0);
				// let len = this.buffered.length;
				// console.log(`${start}-${end}-len:${len}`);
			});
			video.oncontextmenu = function() {
				return false;
			}

			window.addEventListener("orientationchange", function() {
				if (isMobile() && _this._setting.autoTheaterMode) {
					if (Math.abs(window.orientation) === 90) {
						_this._setting.theaterMode = true;
					} else {
						_this._setting.theaterMode = false;
					}
				}
			});

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
				if (lastSwitch != undefined && _this._setting.currentLoadIndex > 0 && _this._setting
					.currentLoadIndex + 1 < _this
					._setting.tv_list.length && isInViewPort(_this._stackswitchlist, lastSwitch)) {
					if (_this._setting.currentLoadIndex >= _this._setting.tv_list.length || (_this
							.searchResult.length > 0 && _this._setting.currentLoadIndex >= _this
							.searchResult.length)) {
						return false;
					}
					console.info("装载更多节目列表");
					_this._genSwitches();

				}

			}
		},
		_createControlPanel: function() {
			let _this = this;
			let panel = document.createElement("div");
			addClass("stack-tv-toolbox", panel);
			let toolbar = document.createElement("div");
			this._toolbox = panel;
			addClass("stack-tv-toolbar", toolbar);
			let option = this._setting.controls;
			if (option.volumePanel) {
				let div = document.createElement("div");
				addClass("stack-tv-toobar-volume", div);
				let div1 = document.createElement("div");
				addClass("volume-icon", div1);
				div1.innerHTML = ICONS.get("volume");
				let div2 = document.createElement("div");
				addClass("volume-bar", div2);
				let span = document.createElement("span");
				addClass("bar-item", span);
				div2.appendChild(span);
				div.appendChild(div1);
				div.appendChild(div2);
				toolbar.appendChild(div);
				this._stackvideo.addEventListener("loadeddata", function() {
					span.style.left = `${100 * _this._stackvideo.volume}%`;
					div2.style.setProperty('--current-volume', 100 * _this._stackvideo.volume +
						'%');
				});
				span.onmousedown = function(e) {
					let evt1 = e || event;
					let x1 = e.x;
					let y1 = e.y;
					let spanW = span.getBoundingClientRect().width;
					let divW = div2.getBoundingClientRect().width;
					// let trackLen = divW - spanW;
					let trackLen = divW;
					let spanOffsetL = span.offsetLeft;
					document.onmousemove = function(e) {
						let evt2 = e || event;
						let x2 = evt2.x;
						let y2 = evt2.y;
						let moveL = x2 - x1 + spanOffsetL + spanW / 2;
						if (moveL <= 0) {
							moveL = 0;
						}
						if (moveL > trackLen) {
							moveL = trackLen;
						}
						span.style.left = `${moveL * 100 /trackLen}%`;
						let volume = Math.floor(moveL * 100 / trackLen);
						div2.style.setProperty('--current-volume', volume + '%');
						_this._stackvideo.volume = moveL / trackLen;
					}
					document.onmouseup = function(e) {
						document.onmousemove = null;
					}
				}
				div2.onclick = function(e) {
					let evt = e || event;
					let spanW = span.getBoundingClientRect().width;
					let divW = div2.getBoundingClientRect().width;
					let divL = div2.getBoundingClientRect().left;
					// let trackLen = divW - spanW;
					let trackLen = divW;
					let newL = evt.x - divL;
					if (newL <= 0) {
						newL = 0;
					}
					if (newL > trackLen) {
						newL = trackLen;
					}
					span.style.left = `${newL * 100 /trackLen}%`;
					let volume = Math.floor(newL * 100 / trackLen);
					div2.style.setProperty('--current-volume', volume + '%');
					_this._stackvideo.volume = newL / trackLen;
				}
			}
			if (option.playPrev) {
				let div = document.createElement("div");
				addClass("stack-tv-toolbar-item", div);
				addClass("small", div);
				div.innerHTML = ICONS.get("prev");
				toolbar.appendChild(div);
				div.addEventListener("click", function() {
					_this._setting.currentTVIndex -= 1;
				});
			}
			if (option.playToggle) {
				let div = document.createElement("div");
				addClass("stack-tv-toolbar-item", div);
				div.innerHTML = ICONS.get("play");
				toolbar.appendChild(div);
				div.addEventListener("click", toggle);
				_this._stackvideo.addEventListener("play", function() {
					div.innerHTML = ICONS.get("pause");
				});

				function toggle() {
					if (_this._stackvideo.paused) {
						_this._stackvideo.play();
						div.innerHTML = ICONS.get("pause");
					} else {
						_this._stackvideo.pause();
						div.innerHTML = ICONS.get("play")
					}
				}
			}
			if (option.playNext) {
				let div = document.createElement("div");
				addClass("stack-tv-toolbar-item", div);
				addClass("small", div);
				div.innerHTML = ICONS.get("next");
				toolbar.appendChild(div);
				div.addEventListener("click", function() {
					_this._setting.currentTVIndex += 1;
				});
			}
			if (option.fullScreen || option.pictureInPicture || option.theaterMode) {
				let div = document.createElement("div");
				addClass("stack-tv-toobar-more", div);
				if (option.theaterMode) {
					let rectan = document.createElement("div");
					addClass("stack-tv-toolbar-item", rectan);
					addClass("s-small", rectan);
					rectan.innerHTML = ICONS.get("film");
					div.append(rectan);
					rectan.addEventListener("click", function() {
						let theaterMode = _this._setting.theaterMode;
						_this._setting.theaterMode = theaterMode ? false : true;
					});
				}
				if (option.fullScreen) {
					let div1 = document.createElement("div");
					addClass("stack-tv-toolbar-item", div1);
					addClass("s-small", div1);
					div1.innerHTML = ICONS.get("fullscreen");
					div.appendChild(div1);
					div1.addEventListener("click", toggleFullscreen);

					function toggleFullscreen() {
						if (isFullscreen()) {
							exitFullscreen(_this._tvbox);
						} else {
							let isFull = requestFullscreen(_this._tvbox);
							if (isFull == 'isIOS') {
								_this._stackvideo.webkitEnterFullscreen();
							}
						}
					}
					document.addEventListener("fullscreenchange", function() {
						if (isFullscreen()) {
							div1.innerHTML = ICONS.get("exitFullscreen");
						} else {
							div1.innerHTML = ICONS.get("fullscreen");
						}
					});

				}
				if (option.pictureInPicture) {
					let div2 = document.createElement("div");
					addClass("stack-tv-toolbar-item", div2);
					addClass("s-small", div2);
					div2.innerHTML = ICONS.get("pinp");
					div.appendChild(div2);
					div2.addEventListener("click", togglePictureInPicture);

					function togglePictureInPicture() {
						if (document.pictureInPictureElement) {
							document.exitPictureInPicture();
						} else {
							if (document.pictureInPictureEnabled) {
								_this._stackvideo.requestPictureInPicture().then((res) => {

								}).catch(e => {
									// _this.log("视频还没有准备好");
								})
							}
						}
					}

				}
				toolbar.appendChild(div);
			}
			panel.appendChild(toolbar);
			this._tvbox.appendChild(panel);
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
					// _this.loadUrl(div.getAttribute("tv_url"));
					// _this._stackvideo.poster = div.getAttribute("tv_logo");
					_this._setting.currentTVIndex = div.style.getPropertyValue('--stack-tv-index');
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
				item.tv_name = item.tv_name.length > 0 ? item.tv_name : `节目-${i}`;
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

	function isFullscreenEnabled() {
		return document.fullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.msFullscreenEnabled || false;
	}

	function isFullscreen() {
		return document.fullscreenElement ||
			document.msFullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement || false;
	}

	function requestFullscreen(elem) {
		if (!elem) {
			return false;
		}
		// ios?
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			return 'isIOS';
		} else if (elem.RequestFullScreen) {
			elem.RequestFullScreen();
		}
		//兼容火狐
		else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		}
		//兼容谷歌等
		else if (elem.webkitRequestFullScreen) {
			elem.webkitRequestFullScreen();
		}
		//兼容IE,只能写msRequestFullscreen
		else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else {
			_this.log("貌似不支持全屏");
		}
		return true;
	}

	function exitFullscreen(elem) {
		if (!elem) {
			return false;
		}
		if (document.exitFullScreen) {
			document.exitFullscreen()
		}
		//兼容火狐
		console.log(document.mozExitFullScreen)
		if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen()
		}
		//兼容谷歌等
		if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen()
		}
		//兼容IE
		if (document.msExitFullscreen) {
			document.msExitFullscreen()
		}
	}

	function isMobile() {
		return /(iPhone|iPad|iPod|iOS|Android|Linux armv8l|Linux armv7l|Linux aarch64)/i.test(navigator.userAgent);
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

	function mod(n, m) {
		return ((n % m) + m) % m;
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
