Message = new Meteor.Collection('messages');

if (Meteor.isClient) {

  Template.login.input = function () {
      return "input";
  };

    Template.login.events({

        'click #submit': function (e) {

            var insert = {
                room_id:$('#room_id').val(),
                content:$('#content').val(),
                post_hour:$('#post_hour').val(),
                post_minites:$('#post_minites').val(),
                post_week:$('#post_week').val(),
                created: new Date()
            };

            for(var i in insert) {
                if(insert[i] == '') return;
            }

            Message.insert(insert);
            $('#room_id').val('');
            $('#content').val('');
            $('#post_hour').val('');
            $('#post_minites').val('');
            $('#post_week').val('0');
        }
    });

    Template.messages.events({
       'click .del_button': function(e) {
           Message.remove({_id:$(e.target).attr('data-id')});
       }
    });

    Template.messages.messages = function() {
        var message = Message.find({},{sort:{ created: -1 }});
        var map = message.map(function(e){
           if('post_week' in e) {
               var week = e.post_week;
               switch(week) {
                   case '0':week='月曜日';break;
                   case '1':week='火曜日';break;
                   case '2':week='水曜日';break;
                   case '3':week='木曜日';break;
                   case '4':week='金曜日';break;
                   case '5':week='土曜日';break;
                   case '6':week='日曜日';break;
               }
               e.post_week = week;

           }
            console.log(e);
           if('content' in e) {
               console.log(111);
               e.content = e.content.replace(/[\n\r]/g, "<br />");
           }
           return e;

        });
        return map;
    };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
