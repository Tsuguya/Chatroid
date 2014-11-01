/**
 * Created by tsuguya on 14/11/01.
 */

Meteor.methods({
    insertData: function(data) {
        for(var i in data) {
            if(data[i] == '') return false;
        }

        Message.insert(data);

        return true;
    },

    updateData: function (id, data) {
        for(var i in data) {
            if(data[i] == '') return false;
        }

        if(!Message.findOne({_id: id})) return false;

        Message.update({_id: id}, { $set: data });

        return true;
    },

    deleteData: function(id) {
        Message.remove({_id: id});
    }
});