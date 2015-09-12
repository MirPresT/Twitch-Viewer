(()=>{
    angular.module('myApp')
        .service('menuService',menuService)
        .service('popupService',popupService)
        .service('parseDataService',parseDataService);

        function menuService($http,$q) {

            const vm = this;

            vm.online = true;
            vm.offline = true;

            vm.setView = (boolOne,boolTwo) => {
                vm.online = boolOne;
                vm.offline = boolTwo;
            }
        }

        function popupService(){
            // this service is being injected into two instances of the popup controller to communicate via ng show values
            const vm = this;

            vm.showMe = false;

            vm.showPopup = (bool) => {
                vm.showMe = bool;
            }
        }

        function parseDataService(getTwitchData, $q) {

            const vm = this;
            const promises = getTwitchData.async();

        /*
         * Arrays to hows parsed card data used in templates
        */
            vm.channels = {
                online: [],
                offline: []
            }

        /*
         * Map and request stream and or channel for each
        */
            let P = $q.all(promises).then( response => {
                response.map( vm.checkOnline );
            });

            vm.checkOnline = obj => {

                // if error
                if (obj.data.error) {return obj.data.message}
                // destructure object
                const { data, data: {stream} } = obj;
                // if online
                if (stream) {
                    console.log(stream);
                    const { channel } = stream,
                    { display_name:name, game , status } = channel,
                     parsedInfo = vm.setDataOnline(stream);
                     vm.channels.online.push(parsedInfo);
                  } else {
                    // if offline
                    const {_links:{channel:url}} = data;
                    getTwitchData.getChannel(url)
                        .then( data => {
                        console.log(data);
                            // send data into function to be parsed and set to card
                            const parsedInfo = vm.setDataOffline(data.data);
                            vm.channels.offline.push(parsedInfo);
                        });
                    }
            }

        /*
         * Parse Data and Set To Cards Variable
        */
            vm.setDataOffline = data => {
                // channel object later used for ng repeat
                let ci = SetDataBoth(data);
                ci.live = false;
                ci.game = 'Offline';
                ci.frontAction = 'Go to channel';
                return ci;
            }
            vm.setDataOnline = stream => {
                // channel object later used for ng repeat
                const { channel, live, game, viewers, preview:{large:large} } = stream;

                let ci = SetDataBoth(channel);

                ci.live = true;
                ci.game = game;
                ci.viewers = abbreviateNumber(viewers);
                ci.previewImg = large;
                ci.strmDscr = concatDscr(status);
                ci.frontAction = 'Watch Now';
                return ci;
            }
            function SetDataBoth(channel){
                // channel object later used for ng repeat
                const { display_name:name, followers, url, status } = channel;
                // construct object using const variables above
                console.log(status);
                return {
                    name,
                    followers: abbreviateNumber(followers),
                    url,
                    status: concatDscr(status)
                };
            }

        /*
         * further manipulate certain data...
         */
            // abbreviate number
            function abbreviateNumber(value) {
                var newValue = value.toString();

                if (value >= 1000){
                    if ( value < 1000000 ){
                        return `${Math.floor(newValue / 1000)} k`;
                    }
                    else {
                        let n = newValue / 1000000;
                        let s = n.toString();
                        n = `${s.slice(0, s.indexOf('.')+2)}m`;
                        if(n.slice(2,-1) === '0'){
                            return `${n.slice(0,1)}m`;
                        } else return n;
                    }
                }
                return newValue;
            }
            // concat the status
            function concatDscr(str) {
                if (str === null) {return ''}
                return  `${str.slice(0,30)} ...`;
            }
        }
})()