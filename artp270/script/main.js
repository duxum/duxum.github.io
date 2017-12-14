//Handling closing of message box
$('.message .close')
.on('click', function() {
  $(this)
    .closest('.message')
    .transition('fade')
  ;
})
;


var geo_options = {
    enableHighAccuracy: true, 
    maximumAge        : 300000000000000, 
    timeout           : 2700
  };


$("#lookup").click(function(){
    var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);   
})
// var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
function geo_success(position) {
    update_middle(position.coords.latitude, position.coords.longitude)
}
  
function geo_error() {
    $('#message').html('<b>Searching your location Hopefully result are coming</b>')
}

function update_middle(latitude, longitude){
    $('#message').html('Latitude is <b>' + latitude + '° </b><br>Longitude is  <b>' + longitude + '°</b>')
    request_weather_data(latitude, longitude)

}

function request_weather_data(lat, long){
    $.ajax({
        
            url : 'https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+long+'&appid=705452fb3e386b82a3c62f07127c7219',
            type : 'GET',
            data : {
                'numberOfWords' : 10
            },
            dataType:'json',
            success : function(data) {              
                third(data)
            },
            error : function(request,error)
            {
                alert("Request: "+JSON.stringify(request));
            }
        });

}


function third(data){
    weatherState = data['weather'][0]['main']    //Rain, Snow, Extreme, Clear
    weatherStateDes = data['weather'][0]['description'] 
    cityName=data["name"]
    tempMax = data["main"]["temp_max"]-273.15
    tempMin = data["main"]["temp_min"]-273.15
    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    pressure = data["main"]["pressure"]
    icon = data['weather'][0]['icon']
    imageURL = "https://openweathermap.org/img/w/"+icon+".png"
    $("#icon").attr("src",imageURL);
    


    mine = `
    <p>The weather Information in ${cityName} is ${weatherStateDes}</p>
    <div class="ui horizontal segments">
    <div class="ui segment">
      <h5>Temperature</h5>
      <p>Highest: ${tempMax}</p>
      <p>Lowest: ${tempMin}</p>
    </div>
    <div class="ui segment">
      <h5>Pressure</h5>
      <p>${pressure}</p>
    </div>
    <div class="ui segment">
    <h5>Humidity</h>
    <p>${humidity}</p>
    </div>
    </div>
    `

    $('#content').html(mine)

    finarec(tempMax, tempMin, humidity)
}


$("#zipLook").click(function() {
    zip=$("#zip").val()
    if (1>(zip/10000) || (zip/10000)>10){
        $("#zipParent").attr("class","ui input error")
        return
    }
    $("#zipParent").attr("class","ui input focus")
    $.ajax({
            url : 'https://api.openweathermap.org/data/2.5/weather?zip='+zip+',us&appid=705452fb3e386b82a3c62f07127c7219',
            type : 'GET',
            data : {
                'numberOfWords' : 10
            },
            dataType:'json',
            success : function(data) {              
                third(data)
            },
            error : function(request,error)
            {
                alert("Request: "+JSON.stringify(request));
            }
        });

})




  //273.15
  
  cdb = {
    "Short":["M", 5, 100],
    "Male T-Shirt":["M", 5, 100],
    "Female T-Shirt":["F", 5, 100],
    "Tent":["F", -10, 50],
    "Pouf":["F", -10, 50],
    "Female Coat":["F", -100, 14],
    "Male Coat":["M", -100, 14],

  }
  
function finarec(high, low, hum){
    result = {male:[], female:[]}
    
    checkmale = []
    checkfemale = []
    for (var i in cdb){
      if (cdb[i][0] == "M"){
        if (cdb[i][1]<low && cdb[i][2]>high){
          checkmale.push(i) 
        }
        
      }else{ //Female
        if (cdb[i][1]<low && cdb[i][2]>high){
          checkfemale.push(i)
        }
      }
      
    }

    var $frec = $( '#female');
    for (clothe in checkfemale){
        $frec.append("<li>"+checkfemale[clothe]+"</li>")
    }
    var $mrec = $( '#male');
    for (clothe in checkmale){
        $mrec.append("<li>"+checkmale[clothe]+"</li>")
    }

}

