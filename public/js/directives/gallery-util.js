/**
 * Created by derek on 2015/6/22.
 */
;(function(angular, $) {
    'use-strict';
    angular.module('app')
        .directive('a', [
            function blueImpFix() {
                function prevent(e) {
                    e.preventDefault();
                }

                function unprevent() {
                    $(this).unbind('click', prevent);
                }

                return {
                    restrict: 'E',
                    link: function(scope, elem, attrs) {
                        if('gallery' in attrs) {
                            elem.bind('click', prevent).on('$destroy', unprevent);
                        }
                        return elem;
                    }
                };
            }
        ])

        .directive('links', [
            function() {
                return {
                    restrict: 'A',
                    link: function(scope, elem, attrs) {
                        elem.onclick = function (event) {
                            event = event || window.event;
                            var target = event.target || event.srcElement,
                                link = target.src ? target.parentNode : target,
                                options = {index: link, event: event},
                                links = this.getElementsByTagName('a');
                            blueimp.Gallery(links, options);
                        };
                    }
                }
            }
        ]);
})(
    window.angular,
    window.jQuery
);