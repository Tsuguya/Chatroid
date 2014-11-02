/**
 * Created by tsuguya on 14/11/03.
 */
Meteor.startup(function () {
    // タイムゾーンの指定
    if(!('TZ' in process.env && process.env.TZ  === 'Asia/Tokyo')) {
        process.env.TZ = 'Asia/Tokyo';
    }

    getNextCheckTime = function() {
        var seconds = new Date().getSeconds();
        return (60 - seconds) * 1000;
    };
});