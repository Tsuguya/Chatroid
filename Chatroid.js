var Message = new Meteor.Collection('messages');

if (Meteor.isClient) {

  Template.login.input = function () {
      return "input";
  };

    Template.login.events({
        'click #submit': function (e) {

            Message.insert({
                content:$('#content').val(),
                post_hour:$('#post_hour').val(),
                post_minites:$('#post_minites').val(),
                post_week:$('#post_week').val()
            });
            $('#content').val('');
            $('#post_hour').val('');
            $('#post_minites').val('');
            $('#post_week').val('');
        }
    });

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

    Template.messages.messages = function() {
        //Message.find({}, {sort: {created_at: -1}});
        return Message.find();
    };

    Template.messages.body = function() {
        return this;
    }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
