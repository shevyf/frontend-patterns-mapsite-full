/*
TODO:
One marker selected at a time
*/

//Starting Variables

//google map object, to be accessible generally
var map; 

//map styles, just for the looks
var mapStyles = [
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "color": "#59a6dd" }
        ]
      },{
        "featureType": "road",
        "elementType": "all",
        "stylers": [
          { "visibility": "simplified" }
        ]
      },{
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          { "visibility": "on" }
        ]
      },{
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },{
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          { "color": "#0cca8a" }
        ]
      },{
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "off" }
        ]
      },
    ];

//list of locations, with name, location and type (for icons). 
var localMarkers = [
    {
        title: 'Capel Street',
        position: [53.346773, -6.267874],
        type: 'restaurant'
    },
    {
        title: 'Dublin Castle',
        position: [53.343174, -6.267567],
        type: 'restuarant'
    },
    {
        title: 'Georges Street',
        position: [53.343762, -6.264677],
        type: 'bar'
    },
    {
        title: 'Abby Street',
        position: [53.348746, -6.257595],
        type: 'entertainment'
    },
    {
        title: 'Trinity College',
        position: [53.344401, -6.257330],
        type: 'historic'
    },
    {
        title: 'Dame Street',
        position: [53.344252, -6.262458],
        type: 'restaurant'
    },
    {
        title: 'Temple bar',
        position: [53.345588, -6.263162],
        type:'bar'
    },
    {
        title: 'Millenium Walkway',
        position: [53.347149, -6.265395],
        type: 'restaurant'
    },
    {
        title: "O'Connell Street",
        position: [53.349884, -6.260418],
        type: 'shopping'
    },
    {
        title: 'Jervis Street',
        position: [53.348098, -6.266392],
        type: 'shopping'
    },
    {
        title: 'Merrion Square',
        position: [53.339656, -6.249180],
        type: 'art'
    },
    {
        title: 'St Stephens Green',
        position: [53.338197, -6.259118],
        type: 'art'
    },
    {
        title: "Grafton Street",
        position: [53.341731, -6.260119],
        type: 'shopping'
    },
    {
        title: 'Henry Street',
        position: [53.349456, -6.262274],
        type: 'shopping'
    }
];

//foursquare category codes for types in locations

var categories = {
    'art': '4bf58dd8d48988d166941735', // sculpture garden
    'shopping': '4d4b7105d754a06378d81259', //shop and service
    'restaurant': '4d4b7105d754a06374d81259', //food
    'entertainment': '4bf58dd8d48988d1f2931735',  //performing arts
    'historic': '4bf58dd8d48988d190941735', //4deefb944765f83613cdba6e historic site
    'bar': '4d4b7105d754a06376d81259' //nightlife spot
};

//function to take a location, name of location, two functions which set flickr and fourquare data in a popup, and a category type. Gets flicker and foursquare data, creates two strings and passes them to functions which set content of popup box.
//Note: Flickr's API requires that the callback name is specified with 'jsoncallback' instead of just 'callback' which is jQuery's default.

var getFlickr = function(pos, name, flickr, foursq, type) {
    
    var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7abca36c88c5c619545ef842155974d9&lat='+pos[0]+'&lon='+pos[1]+'&radius=0.01&per_page=8&page=1&format=json';
    
    $.ajax(flickrUrl, {
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        success: function(response) {
            var allPhotos = response.photos.photo;
            var flickrStr = '<div class="flickr col-md-7 col-sm-7">';
            
            for (i=0; i <allPhotos.length; i++) {
                var photoUrl = 'https://farm'+ allPhotos[i].farm +'.staticflickr.com/'+ allPhotos[i].server +'/'+ allPhotos[i].id +'_'+ allPhotos[i].secret +'_q.jpg';
                var thisImage = '<div><img class="img-responsive" src="'+photoUrl+'"></div>';
                flickrStr += thisImage;
            }
            flickrStr += '</div>';
            flickr(flickrStr);
        }
    });

    var foursqUrl = 'https://api.foursquare.com/v2/venues/search/?ll='+pos[0]+','+pos[1]+'&radius=200&categoryId='+categories[type]+'&intent=browse&limit=8&client_id=JILQ425OSSB1A4PVRXHIOSMZLBMQ2LDZPPSDPBVPYIMLSVDQ&client_secret=RT0YLMXT4DRGCVZLTNKLKBTXHDCHFFPAE5AKZKPQ3SP15Q0R&v=20130815';
    
    $.ajax(foursqUrl, {
        dataType: 'json',
        success: function(response) {
            var foursqStr = '<div class="foursquare col-md-5">';
            var allPlaces = response.response.venues;
            var placeData = '<div><h4>Nearby FourSquare Locations (<span class="titlecase">'+ type +'</span>)</h4></div>';
            for (i=0; i < allPlaces.length; i++) {
                var thisPlace = allPlaces[i];

                placeData += '<div class="singleplace"><div class="placename">'+thisPlace.name+'</div>';
                
                placeData += '<div class="placedetails">';
                if (thisPlace.location.formattedAddress[0] !== undefined) {
                    placeData += 'Address: '+ thisPlace.location.formattedAddress[0];
                }
                if (thisPlace.location.formattedAddress[1] !== undefined) {
                    placeData += ' ' + thisPlace.location.formattedAddress[1];
                }
                if (thisPlace.location.formattedAddress[2] !== undefined) {
                    placeData += ' ' + thisPlace.location.formattedAddress[2];
                }
                placeData += '</div>';
                
                if (thisPlace.contact.formattedPhone !== undefined) {
                    placeData += '<div class="placedetails">Phone: '+ thisPlace.contact.formattedPhone + '</div>';
                }
                placeData += '</div>';
            }
            foursqStr += placeData;
            foursqStr += '</div>';
            foursq(foursqStr);
        }
    });
};

// location object to go in MVVM array. Contains info about the location inc. whether it's visible in the search buttons or not, plus the marker and popup objects for each location (and listeners with closures)

function maplocation(pos, name, type, showhideMarkers) {
    var self = this;
    self.position = pos;
    self.latlng = new google.maps.LatLng(pos[0], pos[1]);
    self.name = name;
    self.type = type;
    self.loaded = false;
    self.icon = 'icons/'+type.toLowerCase()+'.png';
    self.flickr = ko.observable('<img src="images/ajax-loader.gif">');
    self.foursquare = ko.observable('<img src="images/ajax-loader.gif">');
    self.visibleMarker = ko.observable(true);
    self.selected = ko.observable(false);
    
    self.marker = new google.maps.Marker({
        position: self.latlng,
        title: self.name,
        map: map,
        icon: self.icon
    });
    
    self.popup = new google.maps.InfoWindow({
        content: '<div><h3>' + name + '</h3></div>'  });
    
    //if either flickr or foursquare change, update popup content
    self.popupdate = ko.computed(function (){
        var newContent = '<div class="container-fluid popup"><div class="row popup"><div class="col-md-12"><h3>'+self.name+'</h3></div></div><div class="row">' + self.flickr() + self.foursquare() + '</div></div>';
        //console.log(newContent);
        self.popup.setContent(newContent);
    });
    
    self.selectMarker = ko.computed(function() {
        if (!self.loaded){
            getFlickr(self.position, self.name, self.flickr, self.foursquare, self.type);
            self.loaded = true;
        }
    });
    
    self.toggleSelected = function() { 
        showhideMarkers(self.selected);
        };
    
    google.maps.event.addListener(self.marker, 'click', (function(toggle) {return toggle;} )(self.toggleSelected));
    
    google.maps.event.addListener(self.popup, 'closeclick', (function(toggle) {return toggle;} )(self.toggleSelected));    

    self.hideButton = function(){self.visibleMarker(false);};
    self.showButton = function(){self.visibleMarker(true);};
}

// viewmodel initialises an array of the objects above (sorted alphabetically)

function markerViewModel() {
    self = this;
    
    // function to close other markers and only show the info for selected marker. Passed to objects as they are initialised.
    // this is then called whenever the click or closeclick events are triggered, or when the buttons in the search box are pressed.
    self.showhideMarkers = function(markerselected) {
        self.locations.forEach(function(location){ location.selected(false); });
        markerselected(true);
    };
    
    //array of location objects, initialised from the list of locations given previously, plus the function above.
    self.locations = (function(){
        var locationList = [];
        localMarkers.forEach(function(item) {
            locationList.push(new maplocation(item.position, item.title, item.type, self.showhideMarkers));
        });
        locationList.sort( function(first, second) { 
            return first.name < second.name ? -1 : (first.name > second.name ? 1 : 0 );
        });
        return locationList;
    })();
    
    // function to show/hide the buttons in the list as the search box is typed into. Resets when content has 0 length, i.e. is empty.
    // TODO: this doesn't work in Firefox, as the includes function isn't implemented. Find another way!
    self.search = function() {
        var searchTerm = $('#searchbox').val().toLowerCase();
        if (searchTerm.length > 0) {
                self.locations.forEach(function(location){
                    if (location.name.toLowerCase().includes(searchTerm)) { location.visibleMarker(true);} else {location.visibleMarker(false);}
                });
            }
        else {
            //console.log("searchterm less than 0");
            self.locations.forEach(function(location){location.visibleMarker(true);});
            }
    };
    
    // computed function which watches all objects and sets them to marker bounce and visible popup if self.selected() returns true.
    self.showhide = ko.computed(function(){
        self.locations.forEach(function(location){
            
            if (location.selected()) { 
                location.popup.open(map, location.marker);
                location.marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            else {
                location.popup.close();
                location.marker.setAnimation(null);
            }
        });
    });

}

// function to initialise google map and knockout
function initialise() {
    var mapbox = document.getElementById('map-container');
    var mapOptions = {
        center: new google.maps.LatLng(53.34486891755311, -6.258903140600515), //centre of dublin
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapStyles
    };
    
    map = new google.maps.Map(mapbox, mapOptions);
    
    ko.applyBindings(new markerViewModel());
        
}

// go!
google.maps.event.addDomListener(window, 'load', initialise);


/*
for my future reference: docs on AJAX flickr
https://www.flickr.com/services/api/explore/flickr.photos.search
https://www.flickr.com/services/api/flickr.photos.search.html
https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=fc778e032734a15eb7f780767d7994ba&lat=53.343174&lon=-6.267567&radius=0.01&per_page=20&page=1&format=json&nojsoncallback=1&api_sig=865d52131b668519cec3b571100e3b65
*/