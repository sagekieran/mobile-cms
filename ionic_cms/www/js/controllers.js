angular.module('starter.controllers', [])

.controller('VoteCtrl', function($scope, activePhotos) {

  $scope.sortType     = 'id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order

  activePhotos.async().then(function(d) {
    $scope.photos = d;
  });

})

.controller('GalleryCtrl', function($scope, inactivePhotos) {

  $scope.sortType     = 'id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order

  inactivePhotos.async().then(function(d) {
    $scope.photos = d;
  });

})

.controller('SubmitCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  }
})

.controller('AboutCtrl', function($scope) {});
