// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.directives', 'jrCrop'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  // Each tab has its own nav history stack:

  .state('app.vote', {
    url: '/vote',
    views: {
     'menuContent' :{
          templateUrl: "templates/vote.html",
          controller: 'VoteCtrl'
        }
    }
  })

  .state('app.gallery', {
      url: '/gallery',
      views: {
        'menuContent' :{
            templateUrl: 'templates/gallery.html',
            controller: 'GalleryCtrl'
        }
      }
    })

    .state('app.about', {
      url: '/about',
      views: {
        'menuContent' :{
            templateUrl: 'templates/about.html',
            controller: 'AboutCtrl'
        }
      }
    })

  .state('app.submit', {
    url: '/submit',
    views: {
      'menuContent' :{
        templateUrl: 'templates/submit.html',
        controller: 'SubmitCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/vote');

});
