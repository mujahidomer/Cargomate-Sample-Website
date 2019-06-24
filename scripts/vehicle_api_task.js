var scopes = 'https://www.googleapis.com/auth/userinfo.email';
var client_id = '729428235723-c3qhs74jmuc928m8cge7a26ss2n68lsl.apps.googleusercontent.com';

function handleAuth() {
    var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
        if (!resp.code) {
            // User is signed in, so hide the button
            //listTypes();
        }
    });
}

function signin(mode, callback) {
    gapi.auth.authorize({client_id: client_id,scope: scopes, immediate: mode},callback);
}

function init() {
    var apisToLoad;
    var callback = function() {
        /*if (--apisToLoad == 0) {
            signin(true, handleAuth);
        }*/
        listTypes();
        listConfig();
        listCapacity();
        listMakes();
        listModels();
    };

    document.getElementById('insert-type').onclick = function () {
        insertType();
    };

    apisToLoad = 2;
    //Parameters are APIName,APIVersion,CallBack function,API Root
    //gapi.client.load('quoteendpoint', 'v1', callback, 'http://localhost:8888/_ah/api');
    gapi.client.load('vehicleApi', 'v1', callback, 'https://prologix-5cc3c.appspot.com/_ah/api');
    //gapi.client.load('oauth2','v2',callback);

}

var openRow = '<tr>';
var closeRow = '</tr>';
var openColumn = '<td>';
var closeColumn = '</td>';


function insertType() {
    var requestData = {};
    /*var vehicleType = {};
    vehicleType.name = document.getElementById('type-name').value;
    vehicleType.image = document.getElementById('type-image').value;
    vehicleType.description = document.getElementById('type-description').value;
    vehicleType.isEquipment = document.getElementById('type-isEquipment').value;*/
    requestData.vehicleType = {
        name: 'Testing',
        image: 'http://www.google.com',
        description: 'Testing element description',
        isEquipment:'true'
    };
    requestData.langCode = 'en';
    console.log(requestData);
    gapi.client.vehicleApi.insertVehicleType(requestData).execute(function(response) {
        if (!response.code) {
            console.log(response);
            response.items = response.items || [];
            if (response.items != null) {
                Materialize.toast('Vehicle Type is inserted!', 4000);
                listTypes();
            } else Materialize.toast('Vehicle Type is not inserted! Please try again', 4000);
        }
    });
}

//List Quotes function that will execute the listQuote call
function listMakes() {
    var requestData = {};
    requestData.langCode = "en";
    gapi.client.vehicleApi.listTypes(requestData).execute(function(response) {
        if (!response.code) {
            console.log(response);
            response.items = response.items || [];
            var result ='';
            for (var i=0;i<response.items.length;i++) {
                result = result + openRow + openColumn + '<img src="' + response.items[i].image + '" style="height: 50px"/>' + closeColumn
                    + openColumn  + response.items[i].name + closeColumn
                    + openColumn  + response.items[i].country + closeColumn;
                result = result + closeRow;
            }
            document.getElementById('make-table').innerHTML = result;
        }
    });
}

function listModels() {
    var requestData = {};
    requestData.langCode = "en";
    gapi.client.vehicleApi.listModels(requestData).execute(function(response) {
        if (!response.code) {
            console.log(response);
            response.items = response.items || [];
            var result ='';
            for (var i=0;i<response.items.length;i++) {
                result = result + openRow + openColumn + '<img src="' + response.items[i].image + '" style="height: 50px"/>' + closeColumn
                    + openColumn  + response.items[i].name + closeColumn
                    + openColumn  + response.items[i].parent + closeColumn;
                result = result + closeRow;
            }
            document.getElementById('model-table').innerHTML = result;
        }
    });
}

function listYears() {
    var requestData = {};
    requestData.langCode = "en";
    gapi.client.vehicleApi.listYears(requestData).execute(function(response) {
        if (!response.code) {
            console.log(response);
            response.items = response.items || [];
            var result ='';
            for (var i=0;i<response.items.length;i++) {
                result = result + openRow + openColumn + '<img src="' + response.items[i].image + '" style="height: 50px"/>' + closeColumn
                    + openColumn  + response.items[i].year + closeColumn;
                result = result + closeRow;
            }
            document.getElementById('year-table').innerHTML = result;
        }
    });
}

function listTypes() {
    var requestData = {};
    requestData.langCode = "en";
    gapi.client.vehicleApi.listTypes(requestData).execute(function(response) {
        if (!response.code) {
            console.log(response);
            response.items = response.items || [];
            var result ='';
            for (var i=0;i<response.items.length;i++) {
                result = result + openRow + openColumn + '<img src="' + response.items[i].image + '" style="height: 50px"/>' + closeColumn
                    + openColumn  + response.items[i].name + closeColumn
                    + openColumn  + response.items[i].description + closeColumn;
                if (response.items[i].isEquipment != null && response.items[i].isEquipment)
                    result = result + openColumn  + '<i class="material-icons">done</i>' + closeColumn;
                else result = result + openColumn  + '<i class="material-icons">cancel</i>' + closeColumn;
                result = result + closeRow;
            }
            document.getElementById('type-table').innerHTML = result;
        }
    });
}

function listConfig() {
    var requestData = {};
    requestData.langCode = "en";
    gapi.client.vehicleApi.listConfigs(requestData).execute(function(response) {
        if (!response.code) {
            response.items = response.items || [];
            var result ='';
            for (var i=0;i<response.items.length;i++) {
                result = result + openRow + openColumn + '<img src="' + response.items[i].image + '" style="height: 50px"/>' + closeColumn
                    + openColumn  + response.items[i].name + closeColumn
                    + openColumn  + response.items[i].description + closeColumn;
                result = result + closeRow;
            }
            document.getElementById('config-table').innerHTML = result;
        }
    });
}

function listCapacity() {
    var requestData = {};
    requestData.langCode = "en";
    gapi.client.vehicleApi.listCapacities(requestData).execute(function(response) {
        if (!response.code) {
            response.items = response.items || [];
            var result ='';
            for (var i=0;i<response.items.length;i++) {
                result = result + openRow + openColumn + response.items[i].name + closeColumn
                    + openColumn  + response.items[i].capacity + closeColumn
                    + openColumn  + response.items[i].length + closeColumn
                    + openColumn + response.items[i].pallet + closeColumn;
                result = result + closeRow;
            }
            document.getElementById('capacity-table').innerHTML = result;
        }
    });
}

$(document).ready(function() {
    $('select').material_select();
});