var current_date = new Date().getDay();
Session.set("current_date", current_date);

var updateData = function(id, data) {
    for(var i in data) {
        if(data[i] == '') return false;
    }

    if(!Message.findOne({_id: id})) return false;

    Message.update({_id: id}, { $set: data });

    return true;
};

Template.send.events({

    'click #submit': function (e) {

        var insert_value = {
            room_id:$('#room_id').val(),
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

        for(var i in insert_value) {
            if(insert_value[i] == '') return;
        }

        Message.insert(insert_value);
        $('.inputform').val('');
        checked.forEach(function(e) {
            e.checked = false;
        });

        document.querySelector('#registToast').show();
    }
});

Template.tab.helpers({
    current: current_date
});

Template.tab.events({
    'core-select #tab': function(e) {
        var selected = e.target.selected;
        if(Session.get('current_date') == selected) return;
        Session.set('current_date', selected);
    }
});

Template.messages.events({
   'click .del_button': function(e) {
       var collapse = e.target.parentNode.parentNode;
       var data_id = e.target.dataset.id;
       collapse.addEventListener('core-collapse-open', function(e) {
           setTimeout(function() {
               Message.remove({_id:data_id});
           }, 330);
       });
       collapse.toggle();
   },

   'click .edit-link': function(e) {
       var $parent = $(e.target.parentNode.parentNode);
       $parent.find('.edit-content').css({display: 'block'});
       $parent.find('.view-content').css({display: 'none'});
   },

   'click .submit': function(e) {
       var $parent = $(e.target.parentNode.parentNode);
       var update_data = {
           room_id: $parent.find('.room-id').val(),
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
       if(updateData(id, update_data)) {
           $parent.find('.edit-content').css({display: 'none'});
           $parent.find('.view-content').css({display: 'block'});
           document.getElementById('updateToast').show();
       } else {
           document.getElementById('FailureToas').show();
       }

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
            return model;

        });
    }
});

Template.messages.preserve = function() {
    console.log('test');
};