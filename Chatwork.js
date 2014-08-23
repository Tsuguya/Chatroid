var chatWorkUrl = "https://api.chatwork.com/v1";
var accessToken = process.env.CHATWORK_ACCESS_TOKEN; // AccessToken
var roomId = "21049030"; // 投稿する先のRoomID
var content = "" // 投稿内容
var oneMinutes = "60000";


/**
 * ChatWorkの指定したチャットルームにメッセージを送る
 * accessToken = チャットワークのAccessToken
 * roomId = メッセージを送るチャットルームのID
 * content = 送信するメッセージの内容 
 */
var postMsgToChat = function(accessToken, roomId, content){
    if(accessToken === null || accessToken === ""){
        console.log('You need set AccessToken');
        return false;
    }

    if(roomId === null || accessToken === ""){
        console.log('You need set RoomId');
        return false;
    };

    var chatPostPath = chatWorkUrl + "/rooms/" + roomId + "/messages";
    var postOption = {
        params: { body: "HelloWorld"},
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
    
    return {
        accessToken:"",
        roomId:"",
        content:""
    }
};


if (Meteor.isServer) {
  Meteor.startup(function () {
    
    Meteor.setInterval(function(){
        postMsgToChat(accessToken, roomId, content);
    },oneMinutes);

  });
}
