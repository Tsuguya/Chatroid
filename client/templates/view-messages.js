/**
 * Created by tsuguya on 14/11/03.
 */

var current_date = new Date().getDay();
Session.set("current_date", current_date);

/*****************************************************************
 *                        タブ設定                               *
 *****************************************************************/

Template.tab.helpers({
    // 初期の選択状態を今日の曜日に
    current: current_date
});

Template.tab.events({
    'core-select #tab': function(e) {
        var selected = e.target.selected;
        if(Session.get('current_date') == selected) return;
        Session.set('current_date', selected);
    }
});


/*****************************************************************
 *                     メッセージ設定                            *
 *****************************************************************/

Template.messages.events({
    'click .del-button': function(e) {
        var collapse = e.target.parentNode.parentNode;
        var id = this._id;
        collapse.addEventListener('core-collapse-open', function(e) {
            setTimeout(function() {
                Meteor.call('deleteMessage', id);
            }, 330);
        });
        collapse.toggle();
    },

    'click .edit-link': function(e, tpl) {
        var $parent = $(e.target.parentNode.parentNode);
        $parent.find('.edit-content').css({display: 'block'});
        $parent.find('.view-content').css({display: 'none'});
    },

    'click .submit': function(e) {
        var rooms_select_box = document.getElementById('edit_room_id');

        var $parent = $(e.target.parentNode.parentNode);
        var update_data = {
            room_id: rooms_select_box.selected,
            content: $parent.find('.input-content').val()
        };

        var post_time = $parent.find('.post-time-val').val().split(':');
        if(post_time.length !== 2) return;
        update_data.post_hour = post_time[0];
        update_data.post_minites = post_time[1];

        var $checked = $parent.find('[name="edit_post_week"][aria-checked!="false"]');

        update_data.post_week = [];
        $checked.each(function() {
            update_data.post_week.push(this.title);
        });

        var id = this._id;

        Meteor.call('updateMessage', id, update_data, function (error, result) {
            if (error || !result) {
                // handle error
                document.getElementById('FailureToast').show();
            } else {
                $parent.find('.edit-content').css({display: 'none'});
                $parent.find('.view-content').css({display: 'block'});
                document.getElementById('updateToast').show();
            }
        });
    }
});

Template.messages.helpers({
    messages: function() {
        var message = Message.find({post_week: String(Session.get("current_date"))}, {
            sort:{ created: -1 }
        });
        return message.map(function(model) {

            if('post_week' in model) {
                var week = '';
                for(var i in model.post_week) {
                    switch(model.post_week[i]) {
                        case '0':
                            week +=' 日曜日';
                            model.sunday = 'true';
                            break;
                        case '1':
                            week +=' 月曜日';
                            model.monday = 'true';
                            break;
                        case '2':
                            week +=' 火曜日';
                            model.tuesday = 'true';
                            break;
                        case '3':
                            week +=' 水曜日';
                            model.wednesday = 'true';
                            break;
                        case '4':
                            week +=' 木曜日';
                            model.thursday = 'true';
                            break;
                        case '5':
                            week +=' 金曜日';
                            model.friday = 'true';
                            break;
                        case '6':
                            week +=' 土曜日';
                            model.saturday = 'true';
                            break;
                    }
                }
                model.post_week = week;
            }
            if('content' in model) {
                model.input_content = model.content;
                model.content = model.content.replace(/[\n\r]/g, '<br />');
            }
            if('room_id' in model) {
                var room_data = Rooms.findOne({room_id: Number(model.room_id)});
                model.room_name = room_data && ('name' in room_data) ? room_data.name : model.room_id ;
            }

            if('post_hour' in model && model.post_hour.length === 1) {
                model.post_hour = '0' + model.post_hour;
            }

            return model;

        });
    },
    rooms: function() {
        var rooms_cursor = Rooms.find({});
        return rooms_cursor;
    }
});