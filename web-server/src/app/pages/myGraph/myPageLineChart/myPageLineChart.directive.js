/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
 (function () {
  'use strict';

  angular.module('BlurAdmin.pages.myPage')
  .directive('myPageLineChart', myPageLineChart);

  /** @ngInject */
  function myPageLineChart() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        options: '=',
        chartdata: '=',
        chart: '=?',
        height: '@',
        width: '@',
        id: '@'
      },
      controller: 'myPageLineChartCtrl',
      template: '<div id="myChart1"></div>'
      
  };
}


})();