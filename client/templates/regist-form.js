/**
 * Created by tsuguya on 14/11/03.
 */

Template.send.helpers({
    rooms: function(){
        var rooms_cursor = Rooms.find({});
        return rooms_cursor;
    }
});

Template.send.events({

    'click #submit': function (e) {
        var rooms_select_box = document.getElementById('room_id');

        var insert_value = {
            room_id:rooms_select_box.selected,
            content:$('#content').val(),
            post_week:[],
            created: new Date()
        };

        var post_time = $('#post_time').val().split(':');
        if(post_time.length !== 2) return;
        insert_value.post_hour = post_time[0];
        insert_value.post_minites = post_time[1];

        var checked = document.querySelectorAll('paper-checkbox[name="post_week"][checked]').array();

        checked.forEach(function(e) {
            insert_value.post_week.push(e.title);
        });

        Meteor.call('insertMessage', insert_value, function (error, result) {
            if (error || !result) {
                // handle error
                return;
            } else {
                //成功したときはフォームを空に
                $('.inputform').val('');
                checked.forEach(function(e) {
                    e.checked = false;
                });
                document.querySelector('#registToast').show();
            }
        });

    }
});
