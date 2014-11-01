var chatWorkUrl = "https://api.chatwork.com/v1";
var accessToken = process.env.CHATWORK_ACCESS_TOKEN; // AccessToken
var content = ""; // 投稿内容
var oneMinutes = "60000";
var week = [
    {index:0,label:'日'},
    {index:1,label:'月'},
    {index:2,label:'火'},
    {index:3,label:'水'},
    {index:4,label:'木'},
    {index:5,label:'金'},
    {index:6,label:'土'}
];

var roomList = [];

/*
 * ChatWorkAPIを使ってroom_listを取得する
 * $params
 *   accessToken = チャットワークのアクセストークン
 *
 * $return
 *   ChetWorkAPIドキュメントを参照
 *   http://developer.chatwork.com/ja/endpoint_rooms.html#GET-rooms
 */
var getRoomList = function(accessToken){

    if(accessToken === null || accessToken === "" || accessToken === undefined){
        console.log('You need set AccessToken');
        return false;
    }

    endPoint = chatWorkUrl + '/rooms';
    options  = {
        headers: { "X-ChatWorkToken": accessToken }
    };

    return HTTP.get(
        endPoint,
        options
    );
};


/**
 * ChatWorkの指定したチャットルームにメッセージを送る
 * accessToken = チャットワークのAccessToken
 * roomId = メッセージを送るチャットルームのID
 * content = 送信するメッセージの内容
 */
var postMsgToChat = function(accessToken, roomId, content){
    if(accessToken === null || accessToken === "" || accessToken === undefined){
        console.log('You need set AccessToken');
        return false;
    }

    if(roomId === null || accessToken === "" || accessToken === undefined){
        console.log('You need set RoomId');
        return false;
    };

    var chatPostPath = chatWorkUrl + "/rooms/" + roomId + "/messages";
    var postOption = {
        params: { body: content},
        headers: { "X-ChatWorkToken": accessToken }
    };

    return HTTP.post(
        chatPostPath,
        postOption);
};


/**
 * 現在時刻にChatへ投稿することが予約されている投稿を取得する
 */
var getReservedPosts = function(now){
    searchObj = getNowFormatedForMSG();
    messages =  Message.find(
        searchObj,
        {sort:{ created: -1 }});

    console.log( searchObj );

    messages.forEach(function(msg){
        console.log(msg.content);
        console.log(msg.post_hour);
        console.log(msg.post_minites);
        console.log(msg.post_week);
    });

    return messages;
};


var getNowFormatedForMSG = function(){
    var now = new Date();
    var weekday = getWeekday(now);
    return {
        post_hour:String(now.getHours()),
        post_minites:String(now.getMinutes()),
        post_week:String(weekday.index)
    };
};

var getWeekday = function(dateObj){
    return week[dateObj.getDay()];
};


Meteor.startup(function () {
    var next = function() {
        console.log(process.env.TZ);
        var seconds = new Date().getSeconds();
        return (60 - seconds) * 1000;
    };

    var postCheck = function() {
        var reservedPosts = getReservedPosts();

        reservedPosts.forEach(function(msg){
            postMsgToChat(accessToken, msg.room_id, msg.content);
        });

        Meteor.setTimeout(postCheck,next());
    };

    Meteor.setTimeout(postCheck,next());

});
