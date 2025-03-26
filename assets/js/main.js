(function ($) {
	$(window).load(function () {
		btiAjax();
	});

	// ajax used to request php file
	function btiAjax() {
		var btiTheme = $('.bti-toolbar').data("theme");
		var btiFeatured = $('.bti-toolbar').data("featured");
		var btiButtonPosition = $('.bti-toolbar').data("button-position");
		var btiButtonHorizontal = $('.bti-toolbar').data("button-horizontal");
		var btiButtonAlt = $('.bti-toolbar').data("button-alt");
		var btiAso = getUrlParameter('aso');
		var btiAca = getUrlParameter('aca');
		var btiUtmCampaign = getUrlParameter('utm_campaign');
		var btiReferrer = document.referrer;

		$.ajax({
			url: 'http://landing.local/wp-json/themes/campaign/?theme=' + btiTheme,
			type: "GET",
			data: {
				theme: btiTheme,
				featured: btiFeatured,
				btnpos: btiButtonPosition,
				btnhorizontal: btiButtonHorizontal,
				btnalt: btiButtonAlt,
				aso: btiAso,
				aca: btiAca,
				utmCampaign: btiUtmCampaign,
				referrer: btiReferrer,
			},
			success: function (data) {
				$('.bti-toolbar').html(data);
				btiLazyLoad();
				btiListToggle();
				btiSmoothScrollCompatibility();
				showList();
			}
		});
	}

	function btiLoadScript(url, onSuccess) {
		jQuery.ajax({
			url: url,
			dataType: 'script',
			success: onSuccess,
			async: true
		});
	}

	// lazy-load
	function btiLazyLoad() {
		
			var imagePlaceholder = new Image();
			$(imagePlaceholder).on('load', function () {
				var load = function() {
					$('.bti-list .bti-lazy-load img:not(.bti-lazy-loading)').each(function (i, object) {
						object = $(object);
						var rect = object[0].getBoundingClientRect(),
							vh = ($(window).height() || document.documentElement.clientHeight),
							vw = ($(window).width() || document.documentElement.clientWidth),
							oh = object.outerHeight(),
							ow = object.outerWidth();
						
						
						if (
							(rect.top != 0 || rect.right != 0 || rect.bottom != 0 || rect.left != 0) &&
							(rect.top >= 0 || rect.top + oh >= 0) &&
							(rect.bottom >= 0 && rect.bottom - oh - vh <= 300) &&
							(rect.left >= 0 || rect.left + ow >= 0) &&
							(rect.right >= 0 && rect.right - ow - vw <= 0)
						) {
							
							object.addClass('bti-lazy-loading');
							
							var imageObj = new Image();
							
							$(imageObj).on('load', function () {
								var $this = $(this);
								object.attr('src', $this.attr('src'));
								object
									.removeAttr('data-image')
									.removeData('image')
									.removeClass('bti-lazy-loading');
								object.parent().removeClass('bti-lazy-load');
							}).attr('src', object.data('image'));
						}
					});
				}
				
				$('.bti-theme-dropdown .bti-btn').on('click', function () {
					setTimeout(function(){load();},500); //0.5s is animation time of toolbar showing
				});
				
				$(".bti-list").scroll(function() {
					load();
				});
				
			}).attr('src', 'https://toolbar.qodeinteractive.com/_toolbar/assets/img/rbt-placeholder.jpg');
	}

	// open/close logic
	function btiListToggle() {
		var opener = $('.bti-theme-dropdown .bti-btn'),
			list = $('.bti-sidearea'),
			splitScreenPresent = typeof $.fn.multiscroll !== 'undefined' && typeof $.fn.multiscroll.setMouseWheelScrolling !== 'undefined';
			fullPagePresent = typeof $.fn.fullpage !== 'undefined' && typeof $.fn.fullpage.setMouseWheelScrolling !== 'undefined';

		var toggleList = function () {
			opener.on('click', function () {
				if (list.hasClass('bti-active')) {
					list.removeClass('bti-active');
					splitScreenPresent && $.fn.multiscroll.setMouseWheelScrolling(true);
					fullPagePresent && $.fn.fullpage.setMouseWheelScrolling(true);
				} else {
					list.addClass('bti-active');
					splitScreenPresent && $.fn.multiscroll.setMouseWheelScrolling(false);
					fullPagePresent && $.fn.fullpage.setMouseWheelScrolling(false);
				}

				if (list.hasClass('bti-scrolled')) {
					list.removeClass('bti-scrolled');
				}
			});
		};

		var currentScroll = $(window).scrollTop();
		$(window).scroll(function () {
			var newScroll = $(window).scrollTop();
			if (Math.abs(newScroll - currentScroll) > 1000) {
				if (list.hasClass('bti-active')) {
					list.removeClass('bti-active');
					splitScreenPresent && $.fn.multiscroll.setMouseWheelScrolling(true);
					fullPagePresent && $.fn.fullpage.setMouseWheelScrolling(true);
				}

				if (!list.hasClass('bti-scrolled')) {
					list.addClass('bti-scrolled');
				}
			}
		});

		var clickAwayClose = function () {
			$(document).on('click', function (e) {
				if (!list.is(e.target) &&
					list.has(e.target).length === 0 &&
					list.hasClass('bti-active')) {
					list.removeClass('bti-active');
					splitScreenPresent && $.fn.multiscroll.setMouseWheelScrolling(true);
					fullPagePresent && $.fn.fullpage.setMouseWheelScrolling(true);
				}
			});
		};

		// init
		if (opener.length) {
			toggleList();
			clickAwayClose();
		}
	}

	// smooth-scroll compatibility
	function btiSmoothScrollCompatibility() {
		var smoothScrollEnabled = $('body[class*="smooth-scroll"]').length || $('body[class*="smooth_scroll"]').length;

		if (smoothScrollEnabled && !$('html').hasClass('touch')) {
			var opener = $('.bti-theme-dropdown .bti-btn'),
				list = $('.bti-sidearea');

			var disableScroll = function () {
				window.removeEventListener('mousewheel', smoothScrollListener, {passive: false});
				window.removeEventListener('DOMMouseScroll', smoothScrollListener, {passive: false});
			};

			var enableScroll = function () {
				window.addEventListener('mousewheel', smoothScrollListener, {passive: false});
				window.addEventListener('DOMMouseScroll', smoothScrollListener, {passive: false});
			};

			opener
				.on('click', function () {
					setTimeout(function () {
						list.hasClass('bti-active') ? disableScroll() : enableScroll();
					}, 100);
				});

			list
				.on('mouseenter', function () {
					list.hasClass('bti-active') && disableScroll();
				})
				.on('mouseleave', function () {
					enableScroll();
				});

		}
	}

	// initial load class
	function showList() {
		var list = $('.bti-sidearea');

		list.length && list.addClass('bti-loaded');
	}

	// get url parameter from url
	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
	};

})(jQuery);