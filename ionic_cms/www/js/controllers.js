angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope) {
})

.controller('VoteCtrl', ['$scope', 'activePhotos', 'activeCampaign', '$http', function($scope, activePhotos, activeCampaign, $http) {

  $scope.sortType     = 'id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.isClicked = false

  $scope.upvote = function(id) {
    $http.get( 'http://intern-cms-dev.elasticbeanstalk.com/api/images/'+id+'/upvote/', {params: {device_id: device.uuid}}).
      success(function(data, status, headers, config) {
        // $scope.load()
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

  $scope.changeImage = function(photo){
    // console.log($sco.isClicked)
    // console.log(photo.id);
    // console.log(document.getElementById("emptyHeart"+photo.id))
    document.getElementById("emptyHeart"+photo.id).src = 'img/FullHeartRed.png'
    document.getElementById("emptyHeart"+photo.id).id = 'fullHeart'
    // photo.isClicked=true
  };


  $scope.reloadRoute = function($scope) {
   $route.reload()
  }

  $scope.load = function() {
    console.log('refresh')
    activePhotos.async(device.uuid).then(function(d) {
      $scope.photos = d;
      }).then(function(d){
        angular.forEach($scope.photos, function(item) {
          item.loadHeart = {};
          if (item.voted){
            item.loadHeart.id = "fullHeart";
            item.loadHeart.src="img/FullHeartRed.png";
            item.isClicked=true;

            }
          else {
            item.loadHeart.id = ("emptyHeart" + item.id);
            item.loadHeart.src = "img/EmptyHeartRed.png";
          }
      })
      $scope.$broadcast('scroll.refreshComplete')
    })
    activeCampaign.async().then(function(d){
      $scope.campaign = d;
    });
  }
  $scope.selectedFilter = 'newest';
  $scope.setSelectedFilter = function(selectedFilter) {
      $scope.selectedFilter = selectedFilter;
   }

  $scope.selectedFilter = 'newest';
  $scope.setSelectedFilter = function(selectedFilter) {
      $scope.selectedFilter = selectedFilter;
      console.log(selectedFilter);
   }

  document.addEventListener("deviceready", function(){
    $scope.load()
 },true);

}])

.controller('GalleryCtrl', ['$scope', 'inactivePhotos', function($scope, inactivePhotos) {

  $scope.sortType     = 'id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order
  $scope.filterOptions = {
      opts: [
        {id : 2, name : 'Campaigns', campaign: 'All' }
      ]
    };


    $scope.filterItem = {
     opt: $scope.filterOptions.opts[0]
   }




    $scope.customFilter = function (data) {
    if (data.campaign === $scope.filterItem.opt.campaign) {
      return true;
    } else if ($scope.filterItem.opt.campaign === "All") {
      return true;
    } else {
      return false;
    }
  };

  // $scope.random = function() {
  //  $scope.load()
  // }

  $scope.load = function() {
    inactivePhotos.async().then(function(d) {
      $scope.photos = d;
      console.log('ctrl')
      angular.forEach($scope.photos, function(item) {
        if ($scope.filterOptions.opts.indexOf(item.campaign) == -1) {
          console.log(item)
          $scope.filterOptions.opts.push({name: item.campaign, campaign: item.campaign}, item.campaign)
        }
      });
      angular.forEach($scope.filterOptions.opts, function(item, key){
        if (item.name == undefined) {
          console.log(item)
          $scope.filterOptions.opts.splice(key,1)
        }
        else {
          // console.log(item)
        }
      })
      console.log($scope.filterOptions.opts)
    });
  }

  $scope.selectedFilter = 'newest';
  $scope.setSelectedFilter = function(selectedFilter) {
      $scope.selectedFilter = selectedFilter;
   }

  $scope.load();

}])

.controller('SubmitCtrl', ['$scope', '$http', '$jrCrop', 'activeCampaign', function($scope, $http, $jrCrop, activeCampaign) {
  correctOrientation: true

  var pictureSource;
  var destinationType;

  $scope.storeData = function(name, email, i) {
  //   console.log('clicked')
    if (name && email && i == 1) {
      $scope.name = name
      $scope.email = email
      $scope.capturePhoto()
    }
   else if (name && email && i == 2) {
      $scope.name = name
      $scope.email = email
      $scope.getPhoto()
    }
    else {
      alert('Please enter your name and email address.')
      return false
    }
  }


  document.addEventListener("deviceready",onDeviceReady,false);

  function onDeviceReady() {
      pictureSource=navigator.camera.PictureSourceType;
      destinationType=navigator.camera.DestinationType;
  }


  function onPhotoDataSuccess(imageData) {

  $jrCrop.crop({
    url: imageData,
    width: 400,
    height: 300
  }).then(function(canvas) {
    // success!
    var image = canvas.toDataURL();
    var url = 'http://intern-cms-dev.elasticbeanstalk.com/api/images/';
    var params = {
      name: $scope.name,
      email: $scope.email,
      image: image
      };
      console.log(params.name)

    $http.post(url, params)

          .success(function(data) {
              console.log(data);
              alert('Your image has been uploaded and is awaiting approval by a moderator.')
              // document.getElementById("name").value = ''
              // document.getElementById("email").value = ''

          })
          .error(function(data){
            console.log(data);
            alert('An error occured, please try again in a few minutes.')
          })
  }, function() {
    // User canceled or couldn't load image.
  });

  }


  $scope.capturePhoto = function() {
    // Take picture using device camera and retrieve image as base64-encoded string
    console.log('photo')
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 100,
      correctOrientation: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      destinationType: destinationType.FILE_URI
      });
  }

  function capturePhotoEdit() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
      destinationType: destinationType.DATA_URL });
  }

  $scope.getPhoto = function(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
      correctOrientation: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 800,
      destinationType: destinationType.FILE_URI,
      sourceType: pictureSource.PHOTOLIBRARY });
  }

  $scope.load = function(){
    activeCampaign.async().then(function(d){
      $scope.campaign = d;
    })
  }

  $scope.load();
  // Called if something bad happens.
  //
  function onFail(message) {
    console.log('Failed because: ' + message);
  }

}])

.controller('AboutCtrl', ['$scope', 'winningPhotos', function($scope, winningPhotos) {

  $scope.sortType     = 'id'; // set the default sort type
  $scope.sortReverse  = true;  // set the default sort order

  $scope.load = function() {
    winningPhotos.async().then(function(d) {
      $scope.photos = d;
      photo = $scope.photos[d.length-1]
      photo.newId = "winning-icon"
      photo.newSrc = "img/winner-ribbon7.png"
    });
  }
  $scope.load()

}])

.controller("ShareCtrl", function($scope, $cordovaSocialSharing) {
    $scope.shareAnywhere = function() {
        $cordovaSocialSharing.share("Hey check out this cool app for putting content on the MTA Kiosk!", "Cool Contest!", "img/GoogleWhite.png", "http://www.intern-cms-dev.elasticbeanstalk.com");
    }
   $scope.shareViaTwitter = function(message, image, link) {
    console.log("Twitter");
     $cordovaSocialSharing
       .shareViaTwitter(message, image, link)
       .then(function(result) {
         // Success!
         alert("success : "+result);
       }, function(err) {
         // An error occurred. Show a message to the user
         alert("Cannot share on Twitter");
       });
   }

   $scope.shareViaFacebook = function(message, image, link) {
    console.log("facebook");
     $cordovaSocialSharing
       .shareViaFacebook(message, image, link)
       .then(function(result) {
         // Success!
       }, function(err) {
         // An error occurred. Show a message to the user
         alert("Cannot share on Facebook");
       });
   }
});
