Message = new Meteor.Collection('messages');

if (Meteor.isClient) {

  Template.send.input = function () {
      return "送信内容";
  };

    Template.send.events({

        'click #submit': function (e) {

            var insert = {
                room_id:$('#room_id').val(),
                content:$('#content').val(),
                post_hour:$('#post_hour').val(),
                post_minites:$('#post_minites').val(),
                post_week:[],
                created: new Date()
            };

            $('[name="post_week"]:checked').each(function(){
                insert.post_week.push($(this).val());
            });

            for(var i in insert) {
                if(insert[i] == '') return;
            }

            Message.insert(insert);
            $('#room_id').val('');
            $('#content').val('');
            $('#post_hour').val('');
            $('#post_minites').val('');
            $('[name="post_week"]:checked').each(function(){
                $(this).attr('checked', false);
            });
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
               var week = '';
               for(var i in e.post_week) {
                   switch(e.post_week[i]) {
                       case '0':week +='日曜日';break;
                       case '1':week +=',月曜日';break;
                       case '2':week +=',火曜日';break;
                       case '3':week +=',水曜日';break;
                       case '4':week +=',木曜日';break;
                       case '5':week +=',金曜日';break;
                       case '6':week +=',土曜日';break;
                   }
               }
               e.post_week = week;
           }
           if('content' in e) {
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
