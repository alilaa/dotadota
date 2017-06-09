/**
 * Created by an-ali on 2017-06-03.
 */
var setupHub = function (gotDataCallback) {
    var connection = $.hubConnection();
    var myHub = connection.createHubProxy('myHub1');

    console.log("connection setup.");

    myHub.on('dataPump', function (data) {
        gotDataCallback(data);
    });

    console.log("subscription done");

    console.log("running hub start");

    connection.logging = true;
    connection.start({ transport: 'longPolling' }).done(function () {
    //connection.start({}).done(function () {
        console.log("Connection done");
    }).fail(function (error) {
        console.log('Could not connect:' + error);
    });
    console.log("hubstart passed");
};

module.exports = setupHub;