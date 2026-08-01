import $ from 'jquery';

$(document).ready(function () {
  $('.menu-toggle-button').on('click', function () {
    $('#main-header').toggleClass('menu-open');
  });
});