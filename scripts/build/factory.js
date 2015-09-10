'use strict';

(function () {
    angular.module('factories', []).factory('getTwitchData', ['$http', '$q', getTwitchData]);

    function getTwitchData($http) {

        var baseUrl = 'https://api/twitch.tv/kraken';
        var defChannels = ['comster404', 'freecodecamp', 'kittyplaysgames', 'twosync', 'krzjn', 'kaypealol', 'mrgoldensports', 'vgbootcamp', 'sodapoppin', 'femsteph', 'streamerhouse', 'joshog'];

        var url = 'https://api.twitch.tv/kraken/streams/';
        var channelUrl = 'https://api.twitch.tv/kraken/channels/';
        var callBack = '?callback=JSON_CALLBACK';

        var obj = {
            async: function async() {
                var promises = [];
                setPromises();

                // make a request for each channel with a promise
                function setPromises() {
                    defChannels.map(function (channel) {
                        var promise = $http.jsonp(url + channel + callBack).then(function (data) {
                            return data;
                        });
                        promises.push([channel, promise]);
                    });
                };

                return promises;
            },
            getChannel: function getChannel(userName) {
                return $http.jsonp(channelUrl + userName + callBack).then(function (data) {
                    return data;
                });
            }
        };

        return obj;
    }
})();
//# sourceMappingURL=factory.js.map
