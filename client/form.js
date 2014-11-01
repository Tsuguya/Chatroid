var current_date = new Date().getDay();
Session.set("current_date", current_date);

Template.send.events({

    'click #submit': function (e) {

        var insert = {
            room_id:$('#room_id').val(),
            content:$('#content').val(),
            post_week:[],
            created: new Date()
        };

        var post_time = $('#post_time').val().split(':');
        if(post_time.length !== 2) return;
        insert.post_hour = post_time[0];
        insert.post_minites = post_time[1];

        var checked = document.querySelectorAll('paper-checkbox[name="post_week"][checked]').array();

        checked.forEach(function(e) {
            insert.post_week.push(e.title);
        });

        for(var i in insert) {
            if(insert[i] == '') return;
        }

        Message.insert(insert);
        $('.inputform').val('');
        checked.forEach(function(e) {
            e.checked = false;
        });

        document.querySelector('#registToast').show();
    }
});

Template.tab.current = function() {
    return current_date;
};

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
   }
});

Template.messages.messages = function() {
    var message = Message.find({post_week: String(Session.get("current_date"))}, {
        sort:{ created: -1 }
    });
    return message.map(function(model){
       if('post_week' in model) {
           var week = '';
           for(var i in model.post_week) {
               switch(model.post_week[i]) {
                   case '0':week +=' 日曜日';break;
                   case '1':week +=' 月曜日';break;
                   case '2':week +=' 火曜日';break;
                   case '3':week +=' 水曜日';break;
                   case '4':week +=' 木曜日';break;
                   case '5':week +=' 金曜日';break;
                   case '6':week +=' 土曜日';break;
               }
           }
           model.post_week = week;
       }
       if('content' in model) {
           model.content = model.content.replace(/[\n\r]/g, '<br />');
       }
       return model;

    });
};

Template.messages.preserve = function() {
    console.log('test');
};