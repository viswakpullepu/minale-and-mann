/**
 * Minale + Mann - Master Interaction Controller
 * Handles Loading Screen, Full-Bleed Slider, Flickity Sync, Video Backgrounds,
 * Cursor Tracking, Dual View Toggle, Multi-level Menu, and Contact Drawer.
 */

$(function () {
    "use strict";

    var $body = $("body");
    var $html = $("html");
    var $sliderWrapper = $(".slider-nav > .slider-wrapper");
    var $slidesList = $(".slider-nav > .slider-wrapper > .slides");
    var $captionsList = $(".slider-nav .captions-full ul");
    var $viewToggle = $(".view-toggle");
    var $burger = $(".navbar-toggle-overlay");
    var $overlayMenu = $(".overlay-menu");
    var $progressBar = $(".progress-bar");
    var $progressTrack = $(".progress-wrap");
    var $sectionCurrent = $(".section-wrap .current");
    var $countdownBar = $(".countdown .bar");
    var isZoomedOut = false;
    var isMenuOpen = false;
    TweenMax.set($sliderWrapper, { scale: 1, opacity: 1, force3D: "auto" });
    $sliderWrapper.css("opacity", 1);

    var autoPlayTimer = null;
    var countdownTween = null;
    var AUTO_ADVANCE_TIME = 8; // seconds

    // -------------------------------------------------------------
    // 1. MOBILE RESPONSIVE BACKGROUNDS
    // -------------------------------------------------------------
    function checkMobileBackgrounds() {
        if ($(window).width() < 768) {
            $slidesList.find("li.cell .background").each(function () {
                var mob = $(this).attr("data-mobile");
                if (mob) {
                    $(this).css("background-image", "url('" + mob + "')");
                }
            });
        }
    }
    checkMobileBackgrounds();
    $(window).on("resize", checkMobileBackgrounds);

    // -------------------------------------------------------------
    // 2. PRELOADER ANIMATION
    // -------------------------------------------------------------
    var $preloader = $(".component-loading-screen.-text");
    if (window.location.search.indexOf("nopreload") > -1) {
        $(".captions-full").css({ "visibility": "visible", "opacity": 1, "display": "block" });
        TweenMax.set(".captions-full, .captions-full .is-selected .subtitle, .captions-full .is-selected h4, .captions-full .is-selected p", { autoAlpha: 1 });
        $(".captions-full .is-selected button").addClass("in").css("visibility", "visible");
        if ($preloader.length) $preloader.remove();
        $html.removeClass("preload");
        playCurrentSlideVideo(0);
        animateCaption(0);
        startCountdown();
    } else if ($preloader.length) {
        var $st0 = $preloader.find(".st0");
        TweenMax.set(".minale-logo", { autoAlpha: 0 });
        TweenMax.fromTo(".minale-logo", 1.5, { autoAlpha: 0 }, { autoAlpha: 1, delay: 0.1 });
        TweenMax.staggerFrom($st0, 2, { autoAlpha: 0, ease: Cubic.easeOut }, 0.08);
        TweenMax.staggerTo($st0, 1.2, { autoAlpha: 0, ease: Cubic.easeInOut, delay: 0.9 }, 0.06);

        TweenMax.allTo([".component-loading-screen .background > .top", ".component-loading-screen .background > .bottom"], 1, {
            height: 0,
            ease: Cubic.easeOut,
            delay: 0.9,
            onStart: function () {
                TweenMax.set(".minale-logo", { autoAlpha: 0 });
                $(".captions-full").css("display", "block");
            },
            onComplete: function () {
                $preloader.fadeOut(400, function () {
                    $preloader.remove();
                });
                $html.removeClass("preload");
                playCurrentSlideVideo(0);
                animateCaption(0);
                startCountdown();
            }
        });
    } else {
        $html.removeClass("preload");
        playCurrentSlideVideo(0);
        animateCaption(0);
        startCountdown();
    }

    // -------------------------------------------------------------
    // 3. BUTTON HOVER BORDER EFFECT
    // -------------------------------------------------------------
    $(".captions-full ul li button").each(function () {
        var $btn = $(this);
        if (!$btn.find(".left").length) {
            $btn.append('<div class="left"></div><div class="top"></div><div class="right"></div><div class="bottom"></div>');
        }
    });

    // -------------------------------------------------------------
    // 4. FLICKITY SLIDER INITIALIZATION
    // -------------------------------------------------------------
    var slider = $slidesList.flickity({
        initialIndex: 0,
        draggable: false,
        autoPlay: false,
        pauseAutoPlayOnHover: true,
        pageDots: false,
        prevNextButtons: false,
        selectedAttraction: 0.0101,
        friction: 0.18,
        dragThreshold: 10,
        sync: ".captions-full ul",
        wrapAround: false
    }).data("flickity");

    var captionsSlider = $captionsList.flickity({
        initialIndex: 0,
        draggable: false,
        autoPlay: false,
        pageDots: false,
        prevNextButtons: false,
        selectedAttraction: 0.0101,
        friction: 0.18,
        dragThreshold: 10,
        wrapAround: false
    }).data("flickity");

    // Video Management
    function playCurrentSlideVideo(index) {
        $slidesList.find("li.cell").each(function (i) {
            var video = $(this).find("video").get(0);
            if (video) {
                if (i === index) {
                    video.currentTime = 0;
                    var playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(function () {
                            // Autoplay was prevented
                        });
                    }
                } else {
                    video.pause();
                }
            }
        });
    }

    // Caption Animation
    function animateCaption(index) {
        $(".captions-full").css({ "visibility": "visible", "opacity": 1, "display": "block" });
        TweenMax.set(".captions-full", { autoAlpha: 1 });

        var $activeLi = $captionsList.find("li.cell").eq(index);
        var $subtitle = $activeLi.find(".subtitle");
        var $h4 = $activeLi.find("h4");
        var $p = $activeLi.find("p");
        var $btn = $activeLi.find("button");
        var $seo = $activeLi.find(".seo-title");

        if (window.location.search.indexOf("nopreload") > -1) {
            TweenMax.set([$subtitle, $h4, $p, $seo], { autoAlpha: 1 });
            $btn.addClass("in").css("visibility", "visible");
        } else {
            TweenMax.set([$subtitle, $h4, $p, $seo], { autoAlpha: 0 });
        }
        $btn.removeClass("in").css("visibility", "hidden");

        // Stagger in
        TweenMax.to($subtitle, 0.8, { autoAlpha: 1, delay: 0.1, ease: Cubic.easeOut });
        TweenMax.to($h4, 1.0, { autoAlpha: 1, delay: 0.25, ease: Cubic.easeOut });
        TweenMax.to($p, 1.0, {
            autoAlpha: 1, delay: 0.4, ease: Cubic.easeOut, onComplete: function () {
                $btn.addClass("in").css("visibility", "visible");
            }
        });
        if ($(window).width() < 767) {
            TweenMax.to($seo, 0.8, { autoAlpha: 0.5, delay: 0.15, ease: Cubic.easeOut });
        }
    }

    // Update section ribbon & progress
    function updateSlideUI(index) {
        var total = slider.cells.length;
        var progressPercent = (index / (total - 1)) * 100;
        $progressBar.css("width", Math.max(8, progressPercent) + "%");

        var sectionName = $slidesList.find("li.cell").eq(index).attr("data-section") || "";
        if (sectionName && sectionName !== $sectionCurrent.text()) {
            TweenMax.to($sectionCurrent, 0.3, {
                autoAlpha: 0, ease: Cubic.easeOut, onComplete: function () {
                    $sectionCurrent.text(sectionName);
                    TweenMax.to($sectionCurrent, 0.4, { autoAlpha: 1, ease: Cubic.easeOut });
                }
            });
            TweenMax.to(".section-wrap .inner", 0.3, { autoAlpha: 1 });
        } else if (!sectionName) {
            TweenMax.to(".section-wrap .inner", 0.3, { autoAlpha: 0 });
            $sectionCurrent.empty();
        }

        // Arrow visibility
        if (index > 0) {
            $(".slider-nav .back").css("display", "block");
        } else {
            $(".slider-nav .back").css("display", "none");
        }
        if (index < total - 1) {
            $(".slider-nav .next").css("display", "block");
        } else {
            $(".slider-nav .next").css("display", "none");
        }

        // Reset countdown timer
        startCountdown();
    }

    $slidesList.on("select.flickity", function () {
        var index = slider.selectedIndex;
        $captionsList.flickity("select", index);
        var index = slider.selectedIndex;
        playCurrentSlideVideo(index);
        if (!isZoomedOut) {
            animateCaption(index);
        }
        updateSlideUI(index);
    });

    updateSlideUI(0);

    // -------------------------------------------------------------
    // 5. COUNTDOWN / AUTOPLAY PROGRESS
    // -------------------------------------------------------------
    function startCountdown() {
        if (countdownTween) countdownTween.kill();
        if (isZoomedOut || isMenuOpen || $(".mm-overlay").is(":visible")) {
            TweenMax.set($countdownBar, { width: "0%" });
            return;
        }
        TweenMax.set($countdownBar, { width: "0%" });
        countdownTween = TweenMax.to($countdownBar, AUTO_ADVANCE_TIME, {
            width: "100%",
            ease: Linear.easeNone,
            onComplete: function () {
                if (!isZoomedOut && !isMenuOpen && !$(".mm-overlay").is(":visible")) {
                    var nextIndex = (slider.selectedIndex + 1) % slider.cells.length;
                    $slidesList.flickity("select", nextIndex);
                }
            }
        });
    }

    function pauseCountdown() {
        if (countdownTween) countdownTween.pause();
    }

    function resumeCountdown() {
        if (countdownTween && !isZoomedOut && !isMenuOpen && !$(".mm-overlay").is(":visible")) {
            countdownTween.resume();
        }
    }

    $sliderWrapper.on("mouseenter", pauseCountdown).on("mouseleave", resumeCountdown);

    // -------------------------------------------------------------
    // 6. FLOATING CURSOR AND CLICK NAVIGATION
    // -------------------------------------------------------------
    $(".left.back, .right.next").on("mousemove", function (e) {
        var $cursor = $(this).find(".cursor");
        var offset = $(this).offset();
        var relX = e.pageX - offset.left;
        var relY = e.pageY - offset.top;
        TweenMax.to($cursor, 0.1, { x: relX, y: relY, ease: Power1.easeOut });
    });

    $(".left.back").on("click", function (e) {
        e.preventDefault();
        $slidesList.flickity("previous");
    });

    $(".right.next").on("click", function (e) {
        e.preventDefault();
        $slidesList.flickity("next");
    });

    // Keyboard navigation
    $(document).on("keydown", function (e) {
        if (isMenuOpen || $(".mm-overlay").is(":visible")) return;
        if (e.keyCode === 37) { // Left arrow
            $slidesList.flickity("previous");
        } else if (e.keyCode === 39) { // Right arrow
            $slidesList.flickity("next");
        }
    });

    // Mousewheel navigation with debounce
    var wheelTimeout;
    $(window).on("wheel", function (e) {
        if (isMenuOpen || $(".mm-overlay").is(":visible") || isZoomedOut) return;
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(function () {
            var delta = e.originalEvent.deltaY || e.originalEvent.deltaX;
            if (delta > 30) {
                $slidesList.flickity("next");
            } else if (delta < -30) {
                $slidesList.flickity("previous");
            }
        }, 60);
    });

    // -------------------------------------------------------------
    // 7. DUAL-MODE VIEW TOGGLE (FULLSCREEN vs ZOOMED-OUT CAROUSEL)
    // -------------------------------------------------------------
    function zoomIn() {
        isZoomedOut = false;
        slider.options.draggable = false;
        slider.options.selectedAttraction = 0.025;
        slider.options.friction = 0.28;
        slider.updateDraggable();

        $(".next, .back").css({ width: "20%" });
        TweenMax.to($sliderWrapper.find(".append"), 0.5, { autoAlpha: 0 });

        setTimeout(function () {
            $sliderWrapper.removeClass("zoom");
            if ($(".nav-container").hasClass("black")) $(".nav-container").removeClass("black");
        }, 300);

        TweenMax.to($sliderWrapper, 2, {
            scale: 1,
            ease: Cubic.easeInOut,
            onStart: function () {
                $sliderWrapper.removeClass("zoomed-out");
                $(".captions-full ul li").find("button").removeClass("in").css("visibility", "hidden");
            },
            onComplete: function () {
                if (!$sliderWrapper.hasClass("ready")) $sliderWrapper.addClass("ready");
                TweenMax.set(".captions-full .is-selected .subtitle, .captions-full .is-selected h4, .captions-full .is-selected p, .captions-full .is-selected .seo-title", { autoAlpha: 0 });
                TweenMax.to(".slider-nav>.slider-wrapper .caption, .slider-nav .captions-full", 1, {
                    autoAlpha: 1,
                    onComplete: function () {
                        if ($(window).width() < 767) {
                            TweenMax.to($(".captions-full .is-selected").find(".seo-title"), 1, {
                                autoAlpha: 0.5, delay: 0.35, ease: Cubic.easeOut,
                                onComplete: function () { $(".captions-full ul li.is-selected").find("button").not(".in").addClass("in").css("visibility", "visible"); }
                            });
                        } else {
                            TweenMax.to($(".captions-full .is-selected").find("p"), 1, {
                                autoAlpha: 1, delay: 0.5, ease: Cubic.easeOut,
                                onComplete: function () { $(".captions-full ul li.is-selected").find("button").not(".in").addClass("in").css("visibility", "visible"); }
                            });
                        }
                        TweenMax.to($(".captions-full .is-selected").find("h4"), 1, { autoAlpha: 1, delay: 0.2, ease: Cubic.easeOut });
                        TweenMax.to($(".captions-full .is-selected").find(".subtitle"), 1, {
                            autoAlpha: 1, delay: 0.1, ease: Cubic.easeOut,
                            onComplete: function () {
                                TweenMax.to($(".captions-full").find("p"), 0.5, { autoAlpha: 1 });
                                $(".captions-full ul li.is-selected").find("button").not(".in").addClass("in").css("visibility", "visible");
                            }
                        });
                        TweenMax.to($(".captions-full .is-selected").find(".subtitle").find(".seo-title"), 1, { autoAlpha: 0.5, delay: 0.15, ease: Cubic.easeOut });
                    }
                });
                startCountdown();
            }
        });

        TweenMax.to(".slider-nav .arrow", 0.5, { autoAlpha: 1, delay: 0.5 });
        TweenMax.to(".progress-wrap, .section-wrap", 0.5, { autoAlpha: 0 });
        TweenMax.to(".countdown", 0.5, { delay: 0.5, autoAlpha: 1 });
        $viewToggle.removeClass("active");
    }

    function zoomOut(instant) {
        instant = instant || false;
        var b = $(window).width() < 768 ? 38 : 45;
        var c = $(window).width() < 768 ? 0.5 : 0.4;
        isZoomedOut = true;
        slider.options.draggable = true;
        slider.options.selectedAttraction = 0.01;
        slider.options.friction = 0.18;
        slider.updateDraggable();
        pauseCountdown();

        $(".next, .back").css({ width: "5%" });
        $viewToggle.addClass("active");

        if (instant) {
            $sliderWrapper.addClass("zoom");
            TweenMax.set(".slides", { top: 0 });
            TweenMax.set(".progress-wrap", { autoAlpha: 1 });
            TweenMax.set(".countdown, .slider-nav .arrow, .slider-nav>.slider-wrapper .caption, .slider-nav .captions-full", { autoAlpha: 0 });
            TweenMax.set($sliderWrapper, { transformOrigin: "50vw " + b + "vh", scale: c });
            $sliderWrapper.removeClass("ready").addClass("zoomed-out");
            TweenMax.set($sliderWrapper.find(".append"), { autoAlpha: 1 });
        } else {
            TweenMax.to(".captions-full", 0.2, { autoAlpha: 0 });
            $sliderWrapper.addClass("zoom");
            TweenMax.to(".progress-wrap, .section-wrap", 0.5, { delay: 1.2, autoAlpha: 1 });
            TweenMax.to(".countdown", 0.5, { autoAlpha: 0 });
            TweenMax.to(".slider-nav>.slider-wrapper .caption, .slider-nav .captions-full", 0.4, { autoAlpha: 0 });
            TweenMax.to(".slider-nav .arrow", 0.4, { autoAlpha: 0 });

            TweenMax.to($sliderWrapper, 2, {
                transformOrigin: "50vw " + b + "vh",
                scale: c,
                ease: Cubic.easeInOut,
                onComplete: function () {
                    TweenMax.to($sliderWrapper.find(".append"), 0.5, {
                        autoAlpha: 1,
                        onStart: function () {
                            $sliderWrapper.removeClass("ready").addClass("zoomed-out");
                            TweenMax.to(".captions-full", 0.2, { autoAlpha: 0 });
                        }
                    });
                }
            });
            TweenMax.to(".slides", 2, { top: 0, ease: Cubic.easeInOut });
        }
    }

    $viewToggle.on("click", function () {
        if ($overlayMenu.is(":visible")) {
            closeOverlayMenu();
        }
        if (isZoomedOut) {
            zoomIn();
        } else {
            zoomOut();
        }
    });

    // In zoomed-out mode, clicking on a slide zooms into it
    $slidesList.on("click", "li.cell", function (e) {
        if (isZoomedOut) {
            e.preventDefault();
            var cellIndex = $(this).index();
            $slidesList.flickity("select", cellIndex);
            zoomIn();
        }
    });

    // Scrubber progress update on flickity scroll
    $slidesList.on("scroll.flickity", function (event, progress) {
        var b = Math.max(0, Math.min(1, progress));
        var c = $(".progress").width();
        var d = $(".progress-bar").width();
        var e = c - d;
        TweenMax.set(".progress-bar", { x: b * e + "px" });
    });

    // Click on progress bar to seek
    $(".progress").on("click", function (e) {
        var offset = $(this).offset();
        var width = $(this).width();
        var clickX = e.pageX - offset.left;
        var ratio = Math.max(0, Math.min(1, clickX / width));
        var targetIndex = Math.round(ratio * (slider.cells.length - 1));
        $slidesList.flickity("select", targetIndex);
    });

    // -------------------------------------------------------------
    // 8. MULTI-LEVEL OVERLAY NAVIGATION (EXACT MATCH TO ORIGINAL)
    // -------------------------------------------------------------
    function dimMenuLinks() {
        TweenMax.to($('ul.text-menu li a:not(".hovering, .active")'), 0.5, { alpha: 0.5, ease: Cubic.easeOut });
    }

    function openOverlayMenu() {
        isMenuOpen = true;
        pauseCountdown();
        $burger.addClass("active");
        $overlayMenu.fadeIn(300);
        $(".project").addClass("hidden");
        $(".nav-container .image, .view-toggle").addClass("white");
        TweenMax.set($(".side-menu-container .main"), { x: "100%" });
        TweenMax.set($(".submenu"), { x: "100%", autoAlpha: 0 });
        TweenMax.staggerFromTo(".menu-wrapper>ul.text-menu>li, .first-level li, .second-level li", 1, { x: 100, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: Cubic.easeOut }, 0.1);
        dimMenuLinks();
    }

    function closeOverlayMenu() {
        isMenuOpen = false;
        $burger.removeClass("active");
        $(".project").removeClass("hidden");
        $(".nav-container .image, .view-toggle").removeClass("white");
        TweenMax.staggerTo(".menu-wrapper>ul.text-menu>li, .first-level li, .second-level li", 0.5, {
            x: 50,
            autoAlpha: 0,
            ease: Cubic.easeInOut,
            onComplete: function () {
                $overlayMenu.fadeOut(200);
                TweenMax.set($(".main"), { x: 0 });
                TweenMax.set($(".submenu.first, .submenu.second"), { x: 0, autoAlpha: 0 });
                $("#side-menu-container, #desktop-nav").removeClass("extended expanded");
                $(".first-level, .second-level, .submenu.first .line, .submenu.second .line").css("display", "none");
                TweenMax.set($(".side-menu-container .main, .submenu"), { x: "100%" });
                TweenMax.set($(".submenu"), { autoAlpha: 0 });
                $(".submenu.first").removeClass("active");
                $(".main a, .submenu a").removeClass("active");
                resumeCountdown();
            }
        }, 0.05);
    }

    $burger.on("click", function () {
        if (isMenuOpen) {
            closeOverlayMenu();
        } else {
            openOverlayMenu();
        }
    });

    function openSubmenu(triggerId, level) {
        level = level || 0;
        var c;
        if (level === 2) {
            c = $(window).width() < 768 ? "-11%" : "20%";
            var d = "hidden" === $(".submenu.second").css("visibility") ? 0 : 0.5;
            TweenMax.to(".submenu.second", d, {
                autoAlpha: 0,
                onComplete: function () {
                    $("#side-menu-container, #desktop-nav").addClass("extended");
                    $("a[data-trigger='" + triggerId + "']").addClass("active");
                    $(".submenu.second .text-menu, .submenu.second .line").css({ display: "none" });
                    $(".submenu.second").find("." + triggerId).css({ display: "table-cell" });
                    $(".submenu.second").find("." + triggerId).parent().find(".line").css({ display: "table-cell" });
                    TweenMax.set($(".submenu.second li"), { x: 50, autoAlpha: 0 });
                    TweenMax.set($(".submenu.second").find("." + triggerId).parent().find(".line"), { scaleY: 0 });
                    TweenMax.to($(".sub-link[data-trigger='" + triggerId + "']"), 0.5, { autoAlpha: 1 });
                    TweenMax.to($(".main"), 1, { x: c, ease: Cubic.easeInOut });
                    TweenMax.to($(".submenu.first, .submenu.second"), 1, {
                        x: c,
                        autoAlpha: 1,
                        ease: Cubic.easeInOut,
                        onComplete: function () { dimMenuLinks(); }
                    });
                    TweenMax.staggerTo($(".submenu.second").find("." + triggerId).find("li"), 1, { x: 0, autoAlpha: 1, ease: Cubic.easeOut, delay: 0.5 }, 0.1);
                    TweenMax.to($(".submenu.second").find("." + triggerId).parent().find(".line"), 2, {
                        scaleY: 1,
                        transformOrigin: "top left",
                        force3D: "auto",
                        delay: 1,
                        ease: Cubic.easeOut
                    });
                    $(".submenu.second").attr("data-current", triggerId);
                }
            });
        } else {
            c = "50%";
            var d = "hidden" === $(".submenu.first").css("visibility") ? 0 : 0.5;
            TweenMax.to(".submenu.second", 0.5, { autoAlpha: 0, ease: Cubic.easeOut });
            TweenMax.to(".submenu.first", d, {
                autoAlpha: 0,
                onComplete: function () {
                    $("#side-menu-container, #desktop-nav").addClass("expanded");
                    $("a[data-trigger='" + triggerId + "']").addClass("active");
                    $(".submenu.first .text-menu, .submenu.first .line").css({ display: "none" });
                    $(".submenu.first").find("." + triggerId).css({ display: "table-cell" });
                    $(".submenu.first").find("." + triggerId).parent().find(".line").css({ display: "table-cell" });
                    TweenMax.to(".submenu.second", 1, { x: c, autoAlpha: 0, ease: Cubic.easeInOut });
                    TweenMax.set($(".submenu.first li"), { x: 50, autoAlpha: 0 });
                    TweenMax.set($(".submenu.first").find("." + triggerId).parent().find(".line"), { scaleY: 0 });
                    TweenMax.to($(".sub-link[data-trigger='" + triggerId + "']"), 0.5, { autoAlpha: 1 });
                    TweenMax.to($(".main"), 1, { x: c, ease: Cubic.easeInOut });
                    TweenMax.to($(".submenu.first"), 1, {
                        x: c,
                        autoAlpha: 1,
                        ease: Cubic.easeInOut,
                        onComplete: function () { dimMenuLinks(); }
                    });
                    TweenMax.staggerTo($(".submenu.first").find("." + triggerId).find("li"), 1, { x: 0, autoAlpha: 1, ease: Cubic.easeOut, delay: 0.5 }, 0.1);
                    TweenMax.to($(".submenu.first").find("." + triggerId).parent().find(".line"), 2, {
                        scaleY: 1,
                        transformOrigin: "top left",
                        force3D: "auto",
                        delay: 1,
                        ease: Cubic.easeOut
                    });
                    $(".submenu.first").attr("data-current", triggerId);
                }
            });
        }
    }

    $(".submenu.first .back").on("click", function () {
        $("#side-menu-container, #desktop-nav").removeClass("expanded");
        $(".main a").removeClass("active");
        TweenMax.to(".submenu.first", 1, { x: "100%", autoAlpha: 0, ease: Cubic.easeInOut, overwrite: "all" });
        TweenMax.to(".main.menu-wrapper, .submenu.second", 1, {
            x: "100%",
            autoAlpha: 1,
            ease: Cubic.easeInOut,
            onComplete: function () { dimMenuLinks(); }
        });
    });

    $(".submenu.second .back").on("click", function () {
        $("#side-menu-container, #desktop-nav").removeClass("extended");
        $(".submenu.first a").removeClass("active");
        TweenMax.to(".submenu.second", 1, { x: "50%", autoAlpha: 0, ease: Cubic.easeInOut, overwrite: "all" });
        TweenMax.to(".main.menu-wrapper, .submenu.first", 1, {
            x: "50%",
            autoAlpha: 1,
            ease: Cubic.easeInOut,
            onComplete: function () { dimMenuLinks(); }
        });
    });

    $(".side-menu-container .main>ul>li").each(function () {
        var $li = $(this), $a = $li.find(".parent>a");
        $li.hover(function () {
            if (!$a.hasClass("active")) TweenMax.to($a, 0.4, { autoAlpha: 1 });
        }, function () {
            if (!$a.hasClass("active")) TweenMax.to($a, 0.4, { autoAlpha: 0.5 });
        });
        if ($li.find(".parent").hasClass("has-children")) {
            $a.on("click", function (e) {
                e.preventDefault();
                $(".main, .first-level").find(".active").removeClass("active");
                $a.addClass("active");
                openSubmenu($a.attr("data-trigger"));
                dimMenuLinks();
            });
        }
    });

    $(".first-level li").each(function () {
        var $li = $(this), $a = $li.find("a");
        $li.hover(function () {
            if (!$a.hasClass("active")) TweenMax.to($a, 0.4, { autoAlpha: 1 });
        }, function () {
            if (!$a.hasClass("active")) TweenMax.to($a, 0.4, { autoAlpha: 0.5 });
        });
        if ($a.attr("data-trigger")) {
            $a.on("click", function (e) {
                e.preventDefault();
                $(".first-level").find(".active").removeClass("active");
                $a.addClass("active");
                openSubmenu($a.attr("data-trigger"), 2);
                dimMenuLinks();
            });
        }
    });

    $(".second-level li").each(function () {
        var $li = $(this), $a = $li.find("a");
        $li.hover(function () {
            if (!$a.hasClass("active")) TweenMax.to($a, 0.4, { autoAlpha: 1 });
        }, function () {
            if (!$a.hasClass("active")) TweenMax.to($a, 0.4, { autoAlpha: 0.5 });
        });
    });

    // Direct Slide Links in Menu (data-slide)
    $(document).on("click", "[data-slide]", function (e) {
        e.preventDefault();
        var targetSlide = parseInt($(this).attr("data-slide"), 10);
        if (isMenuOpen) closeOverlayMenu();
        if (isZoomedOut) zoomIn();

        $slidesList.flickity("select", targetSlide);

        if (targetSlide === 10) {
            setTimeout(openContactModal, 400);
        }
    });

    // Header Logo Click -> Returns to Home Slide
    $(".nav-container .image").on("click", function (e) {
        e.preventDefault();
        if (isMenuOpen) closeOverlayMenu();
        if ($mmOverlay.is(":visible")) closeContactModal();
        if (isZoomedOut) zoomIn();
        $slidesList.flickity("select", 0);
    });

    // -------------------------------------------------------------
    // 9. CONTACT MODAL OVERLAY DRAWER
    // -------------------------------------------------------------
    var $mmOverlay = $(".mm-overlay");
    var $mmClose = $(".mm-close");

    function openContactModal() {
        if (isMenuOpen) closeOverlayMenu();
        pauseCountdown();

        $mmOverlay.css("display", "block");
        $mmClose.css("display", "block");
        $body.css("overflow-y", "hidden");

        var title = $mmOverlay.attr("data-title") || "Contact us";
        var content = $mmOverlay.attr("data-content") || "";

        $mmOverlay.find(".wrap .title").html(title);
        $mmOverlay.find(".wrap .content").html(content);
        $mmOverlay.find(".form-wrap").css("display", "block");

        if (window.location.search.indexOf("nopreload") > -1) {
            TweenMax.set(".mm-overlay .shade", { autoAlpha: 1 });
            TweenMax.set(".mm-overlay .inner", { x: "0%" });
            TweenMax.set(".mm-close", { autoAlpha: 1 });
        } else {
            TweenMax.fromTo(".mm-overlay .shade", 0.5, { autoAlpha: 0 }, { autoAlpha: 1, ease: Cubic.easeOut });
            TweenMax.fromTo(".mm-overlay .inner", 0.7, { x: "100%" }, { x: "0%", ease: Cubic.easeOut });
            TweenMax.to(".mm-close", 0.3, { autoAlpha: 1 });
        }
    }

    function closeContactModal() {
        TweenMax.to(".mm-overlay .shade", 0.4, { autoAlpha: 0, ease: Cubic.easeOut });
        TweenMax.to(".mm-overlay .inner", 0.6, {
            x: "100%", ease: Cubic.easeOut, onComplete: function () {
                $mmOverlay.css("display", "none");
                $mmClose.css("display", "none");
                $body.css("overflow-y", "auto");
                resumeCountdown();
            }
        });
        TweenMax.to(".mm-close", 0.2, { autoAlpha: 0 });
    }

    // Trigger on "Get in touch" button (slide 11) or contact links
    $(".captions-full li:last-child button, a.menu-link-contact").on("click", function (e) {
        e.preventDefault();
        openContactModal();
    });

    $(".mm-overlay .shade, .mm-close").on("click", function () {
        closeContactModal();
    });

    // Handle Contact Form Submission
    $(".wpcf7-form").on("submit", function (e) {
        e.preventDefault();
        var $out = $(this).find(".wpcf7-response-output");
        $out.text("Thank you for your enquiry. We will be in touch shortly.").css({
            "display": "block",
            "padding": "15px",
            "background": "#00222b",
            "color": "#fff",
            "margin-top": "15px",
            "border": "1px solid rgba(255,255,255,0.2)"
        });
        setTimeout(function () {
            closeContactModal();
        }, 2500);
    });

    // "Read More" button click behavior for project slides
    $(".captions-full ul li button").not(":last").on("click", function () {
        var cellIndex = $(this).closest("li").index();
        if (cellIndex < slider.cells.length - 1) {
            $slidesList.flickity("next");
        }
    });

    
    // Handle URL state param for instant state testing/verification
    if (window.location.search.indexOf("state=slide2") > -1) {
        $slidesList.flickity("select", 1);
        $captionsList.flickity("select", 1);
        animateCaption(1);
    } else if (window.location.search.indexOf("state=overview") > -1) {
        setTimeout(function() {
            zoomOut();
        }, 100);
    } else if (window.location.search.indexOf("state=menu") > -1) {
        setTimeout(function() {
            openOverlayMenu();
        }, 100);
    } else if (window.location.search.indexOf("state=contact") > -1) {
        openContactModal();
    }

    console.log("Minale + Mann clone initialized successfully.");
});
