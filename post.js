/**
 * Created by Tsuguya Touma on 2014/08/23.
 */
if (Meteor.isClient) {
    Template.hello.greeting = function () {
        return "Welcome to Chatroid.";
    };

    Template.hello.login = function () {
        return "input";
    };

    Template.hello.events({
        'click input': function () {
            // template data, if any, is available in 'this'
            if (typeof console !== 'undefined')
                console.log("You pressed the button");
        }
    });
}