// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
// Vendor
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require material
//= require angular/angular.min
//= require angular-animate/angular-animate.min
//
// Channels
//= require action_cable
//= require_self
//require_tree ./channels
//
// Custom
//= require handlebars_helpers
//= require tracks
//= require mentoring_tracks
//= require mentoring_track_show
//= require_tree ./angular
//

(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
