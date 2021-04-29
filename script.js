//Create Event Listner for page load to query station data
window.addEventListener('load', getStationData, false);

//Find button element
var formButton = document.getElementById('form-button');

//Create Event Listner on button to query train schedule on click
formButton.addEventListener('click', getTrainData, false);

//Immediately Invoked Function Expression
(function () {

    //Create Custom Type with properties using constructor function
    function Programmer(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    //Add Method to prototype property of custom type
    Programmer.prototype.fullName = function () {
        return this.firstName + " " + this.lastName;
    }

    //Create new object of custom type
    var me = new Programmer('Matthew', 'Flaig');
    //Find fullName element
    var fullName = document.getElementById('fullName');
    //Run method and set result to element's text
    fullName.textContent = me.fullName();

}());

// Run to request station data and populate Select Options 
function getStationData() {

    // Request parameters
    var params = {
        "api_key": "5b0a9a2c75344c419659aa7909c2c0ef",
    };

    //Make ajax request to D.C. Transit Authority API to GET a list of Metro Station data
    $.ajax({
        url: 'https://api.wmata.com/Rail.svc/json/jStations?' + $.param(params),
        type: 'GET',

        //On success place station data into Select options
        success: function (data) {

            //Cycle through all stations
            for (i = 0; i < data.Stations.length; i++) {
                //Use the Option() constructor to create a new HTMLOptionElement for the station and set it with text=Name and value=Code
                var option = new Option(data.Stations[i].Name, data.Stations[i].Code);
                //Convert the HTMLOptionElement into a JQuery object that can be used with the append method.
                $(option).html(data.Stations[i].Name);
                //Append the option to Select element.
                $("#stations").append(option);
            };

            //Change the text of the default "Loading" option.
            $('#Loading').text('Select a Station');

        },

        //On failure display error
        error: function (jqXHR) {
            alert('Error ' + jqXHR.status + ' ' + jqXHR.statusText);
        },
    });

};

//Run function to request train data and display results
function getTrainData() {

    //Find selected station
    var station = document.getElementById('stations');

    //Pull Station Code of selected station
    var stationValue = station.value;

    // Request parameters
    var params = {
        "api_key": "5b0a9a2c75344c419659aa7909c2c0ef",
    };

    //Make ajax request to D.C. Transit Authority API to GET a list of trains for selected station
    $.ajax({
        url: "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/" + stationValue + "?" + $.param(params),
        type: "GET",
    })

        //On data return create cards for results
        .done(function (data) {
            var content = '';

            //Cycle through all incoming trains
            for (i = 0; i < data.Trains.length; i++) {
                content += '<div class="card" style="width: 30rem;">';
                content += '<div class="card-header">';
                content += '<p class="card-text text-center">Train to: </p>';
                content += '</div>';
                content += '<div class="card-body">';
                content += '<h2 class="card-title text-center">' + data.Trains[i].Destination + '</h2>';
                //Pretty up line abbreviation for full name and add custom button for easy line recognition
                (function () {
                    return data.Trains[i].Line === 'RD'
                        ? content += '<button type="button" class="btn btn-danger btn-lg btn-block"><h4 class="card-subtitle">Red Line</h4></button>'
                        : data.Trains[i].Line === 'BL'
                            ? content += '<button type="button" class="btn btn-primary btn-lg btn-block"><h4 class="card-subtitle">Blue Line</h4></button>'
                            : data.Trains[i].Line === 'YL'
                                ? content += '<button type="button" class="btn btn-warning btn-lg btn-block"><h4 class="card-subtitle">Yellow Line</h4></button>'
                                : data.Trains[i].Line === 'OR'
                                    ? content += '<button type="button" class="btn btn-info btn-lg btn-block"><h4 class="card-subtitle">Orange Line</h4></button>'
                                    : data.Trains[i].Line === 'GR'
                                        ? content += '<button type="button" class="btn btn-success btn-lg btn-block"><h4 class="card-subtitle">Green Line</h4></button>'
                                        : data.Trains[i].Line === 'SV'
                                            ? content += '<button type="button" class="btn btn-secondary btn-lg btn-block"><h4 class="card-subtitle">Silver Line</h4></button>'
                                            : '<button type="button" class="btn btn-dark btn-lg btn-block"><h4 class="card-subtitle">No Passenger Line</h4></button>'
                })();
                content += '</div>';
                content += '<div class="card-footer">';
                content += '<p class="card-text text-right">Arriving in: ' + data.Trains[i].Min + '</p>';
                content += '</div></div>';
            }

            //Display cards
            document.getElementById('output').innerHTML = content;

        })

        //On failure display error
        .fail(function (jqXHR) {
            alert("Error " + jqXHR.status + ' ' + jqXHR.statusText);
        });
}
