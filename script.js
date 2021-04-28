

$(document).ready(function() {

    var params = {
        "api_key": "5b0a9a2c75344c419659aa7909c2c0ef",
        // Request parameters
    };

    //Make an Ajax request to a PHP script called car-models.php
    //This will return the data that we can add to our Select element.
    $.ajax({
        url: 'https://api.wmata.com/Rail.svc/json/jStations?' + $.param(params),
        type: 'GET',
        success: function(data){

            //Log the data to the console so that
            //you can get a better view of what the script is returning.
            console.log(data);

            for (i = 0; i < data.Stations.length; i++) {

                //Use the Option() constructor to create a new HTMLOptionElement.
                var option = new Option(data.Stations[i].Name, data.Stations[i].Name);
                //Convert the HTMLOptionElement into a JQuery object that can be used with the append method.
                $(option).html(data.Stations[i].Name);
                //Append the option to our Select element.
                $("#stations").append(option);
            };

            //Change the text of the default "loading" option.
            $('#loading').text('Select a Station');

        }
    });

});

const form = document.getElementById('form-button');

form.addEventListener('click', getJson, false);

function getJson() {

    var params = {
        "api_key": "5b0a9a2c75344c419659aa7909c2c0ef",
        // Request parameters
    };

    $.ajax({
        url: "https://api.wmata.com/StationPrediction.svc/json/GetPrediction/B03?" + $.param(params),
        type: "GET",
    })
        .done(function (data) {
            var content = '';
            for (i = 0; i < data.Trains.length; i++) {
                content += '<div class="card" style="width: 30rem;">';
                content += '<div class="card-header">';
                content += '<p class="card-text text-center">Train to: </p>';
                content += '</div>';
                content += '<div class="card-body">';
                content += '<h2 class="card-title text-center">' + data.Trains[i].Destination + '</h2>';
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
                //content += '<h4 class="card-subtitle">' + data.Trains[i].Line + ' Line</h4>';
                content += '</div>';
                content += '<div class="card-footer">';
                content += '<p class="card-text text-right">Arriving in: ' + data.Trains[i].Min + '</p>';
                content += '</div></div>';
            }

            document.getElementById('output').innerHTML = content;

        })
        .fail(function () {
            alert("error");
        });
}
