Message = new Meteor.Collection('messages');
Rooms = new Mongo.Collection('rooms');

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
        if(!('TZ' in process.env && process.env.TZ  === 'Asia/Tokyo')) {
            process.env.TZ = 'Asia/Tokyo';
        }
        Meteor.methods({
            serverTime: function() {
                return new Date().toString();
            }
        });
    });
}
