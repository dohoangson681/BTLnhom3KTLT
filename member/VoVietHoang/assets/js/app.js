

$(function () {
    // Page animation initialize
    new WOW().init();
});

$(document).ready(function () {

    /* Sticky nvigation */

    var sticky = {
        $sticky: $('.sticky'),
        offsets: [],
        targets: [],
        stickyTop: null,

        set: function () {
            var self = this;

            var windowTop = Math.floor($(window).scrollTop());

            self.offsets = [];
            self.targets = [];

            // Get current top position of sticky element
            self.stickyTop = self.$sticky.data('offset') ? self.$sticky.css('position', 'absolute').data('offset') : self.$sticky.css('position', 'absolute').offset().top;

            // Cache all targets and their top positions
            self.$sticky.find('a').map(function () {
                var $el = $(this),
                    href = $el.data('target') || $el.attr('href'),
                    $href = /^#./.test(href) && $(href);

                return $href && $href.length && $href.is(':visible') ? [[$href[0].getBoundingClientRect().top + windowTop, href]] : null;
            })
                .sort(function (a, b) { return a[0] - b[0] })
                .each(function () {
                    self.offsets.push(this[0]);
                    self.targets.push(this[1]);
                });
        },

        update: function () {
            var self = this;

            var windowTop = Math.floor($(window).scrollTop());
            var $stickyLinks = self.$sticky.find('.navbar-nav .nav-item').removeClass('active');
            var stickyPosition = 'fixed';
            var currentIndex = 0;

            // Toggle fixed position depending on visibility
            if ($(window).width() < 800 || $(window).height() < 500 || self.stickyTop > windowTop) {
                stickyPosition = 'absolute';
                self.$sticky.removeClass('floating');

            } else {

                for (var i = self.offsets.length; i--;) {
                    if (windowTop >= self.offsets[i] - 2 && (self.offsets[i + 1] === undefined || windowTop <= self.offsets[i + 1] + 2)) {
                        currentIndex = i;

                        break;
                    }
                }

            }

            self.$sticky.css({ 'position': stickyPosition });

            if (stickyPosition == 'absolute') {
                self.$sticky.removeClass('floating');
            }
            else {
                self.$sticky.addClass('floating');
            }

            $stickyLinks.eq(currentIndex).addClass('active');
        },

        init: function () {
            var self = this;

            $(window).on('resize', function () {
                self.set();

                self.update();
            });

            $(window).on('scroll', function () {
                self.update();
            });

            $(window).trigger('resize');
        }
    }

    if ($('.navbar').hasClass('sticky')) {
        sticky.init();
    }
});

