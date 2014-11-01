/**
 * Created by tsuguya on 14/11/01.
 */

Meteor.methods({
    insertMessage: function(data) {
        for(var i in data) {
            if(data[i] == '') return false;
        }

        if(data.post_hour.length === 2 && data.post_hour[0] === '0' ){
            data.post_hour = data.post_hour[1];
        }

        Message.insert(data);

        return true;
    },

    updateMessage: function (id, data) {
        for(var i in data) {
            if(data[i] == '') return false;
        }

        if(!Message.findOne({_id: id})) return false;

        if(data.post_hour.length === 2 && data.post_hour[0] === '0' ){
            data.post_hour = data.post_hour[1];
        }

        Message.update({_id: id}, { $set: data });

        return true;
    },

    deleteMessage: function(id) {
        Message.remove({_id: id});
    }
});
