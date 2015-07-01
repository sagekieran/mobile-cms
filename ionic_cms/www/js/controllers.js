angular.module('starter.controllers', [])

// .controller('VoteCtrl', function($scope, activePhotos) {
//
//   $scope.sortType     = 'id'; // set the default sort type
//   $scope.sortReverse  = true;  // set the default sort order
//
//   activePhotos.async().then(function(d) {
//     $scope.photos = d;
//   });
//
// })
//
// .controller('GalleryCtrl', function($scope, inactivePhotos) {
//
//   $scope.sortType     = 'id'; // set the default sort type
//   $scope.sortReverse  = true;  // set the default sort order
//
//   inactivePhotos.async().then(function(d) {
//     $scope.photos = d;
//   });
//
// })
//
// .controller('SubmitCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   }
// })
//
// .controller('AboutCtrl', function($scope) {});

// -------------------------------------------------

.controller('VoteCtrl', ['$scope', 'activePhotos', '$http', function($scope, activePhotos, $http) {

  $scope.sortType     = 'id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order

  $scope.upvote = function(id) {
    $http.get('http://intern-cms-dev.elasticbeanstalk.com/api/images/'+id+'/upvote/').
      success(function(data, status, headers, config) {
        $scope.load()
      }).
      error(function(data, status, headers, config) {
      });
  }

  $scope.downvote = function(id) {
    $http.get('http://intern-cms-dev.elasticbeanstalk.com/api/images/'+id+'/downvote/').
      success(function(data, status, headers, config) {
        $scope.load()
      }).
      error(function(data, status, headers, config) {
      });
  }

  $scope.load = function() {
    activePhotos.async().then(function(d) {
      $scope.photos = d;

      angular.forEach($scope.photos, function(item) {
        item.rank = 0.5 - Math.random()
      });
    });
  }

  $scope.load()

}])

.controller('GalleryCtrl', ['$scope', 'inactivePhotos', function($scope, inactivePhotos) {

  $scope.sortType     = 'id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order

  $scope.random = function() {
   $scope.load()
   $scope.sortType = 'rank'
  }

  $scope.load = function() {
    inactivePhotos.async().then(function(d) {
      $scope.photos = d;
      // return $scope.photos
      console.log('ctrl')

      angular.forEach($scope.photos, function(item) {
        item.rank = 0.5 - Math.random()
      });
    });
  }

  $scope.load()

}])

.controller('SubmitCtrl', ['$scope', '$http', function($scope, $http) {

  submit = function() {
        var form = new FormData();
        var data = $scope.imgData;
        form.append('name', data.first_name);
        form.append('campaign_id', 1);
        form.append('email', data.email);
        form.append('image', $scope.myFile);
        console.log($scope.myFile);


				$http.post('http://127.0.0.1:8000/api/images/',
                form, {
                    headers: {'Content-Type': undefined},
                    transformRequest: function(data){ return data;}
              })

			        .success(function(data) {
			            console.log(data);

			        })
              .error(function(data){
                console.log(data);
              });
			}

  var pictureSource;
  var destinationType;


  document.addEventListener("deviceready",onDeviceReady,false);

  function onDeviceReady() {
      pictureSource=navigator.camera.PictureSourceType;
      destinationType=navigator.camera.DestinationType;
  }


  function onPhotoDataSuccess(imageData) {
    console.log(imageData)
    var form = new FormData();
    var data
    form.append('name', 'sage');
    form.append('campaign_id', 1);
    form.append('email', 'sagekieran@gmail.com');
    form.append('image', imageData);
    // console.log($scope.myFile);
    console.log(form)


    $http.post('http://127.0.0.1:8000/api/images/',
            form, {
                headers: {'Content-Type': undefined},
                transformRequest: function(data){ return data;}
          })

          .success(function(data) {
              console.log(data);
              console.log('success')

          })
          .error(function(data){
            console.log(data);
            console.log('error')
          })
    // alert('success');

  }


  function onPhotoURISuccess(imageURI) {
    // console.log(imageURI);
    alert('success')
  }

  $scope.capturePhoto = function() {
    // Take picture using device camera and retrieve image as base64-encoded string
    console.log('photo')
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
      destinationType: destinationType.FILE_URI });
  }

  function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
      destinationType: destinationType.DATA_URL });
  }

  $scope.getPhoto = function(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
      destinationType: destinationType.FILE_URI,
      sourceType: pictureSource.PHOTOLIBRARY });
  }

  // Called if something bad happens.
  //
  function onFail(message) {
    alert('Failed because: ' + message);
  }

}])

.controller('AboutCtrl', function($scope) {});
