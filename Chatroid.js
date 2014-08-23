var Message = new Meteor.Collection('messages');

if (Meteor.isClient) {

  Template.login.input = function () {
      return "input";
  };

    Template.login.events({
        'click #submit': function (e) {

            Message.insert({
                room_id:$('#room_id').val(),
                content:$('#content').val(),
                post_hour:$('#post_hour').val(),
                post_minites:$('#post_minites').val(),
                post_week:$('#post_week').val(),
                created: new Date()
            });
            $('#content').val('');
            $('#post_hour').val('');
            $('#post_minites').val('');
            $('#post_week').val('');
        }
    });

    Template.messages.events({
       'click .del_button': function(e) {
           Message.remove({_id:$(e.target).attr('data-id')});
       }
    });

    Template.messages.messages = function() {
        return Message.find({},{sort:{ created: -1 }});
    };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
