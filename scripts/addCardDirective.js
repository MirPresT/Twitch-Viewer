(() => {
    angular.module('myApp')
        .controller('popupController', popupController)
        .directive('addcardDir', addcardDir );

        function popupController($scope, popupService, getTwitchData, parseDataService) {
            const vm = this;
            vm.service = popupService;
            vm.showPopup = popupService.showPopup;

            // passing input value to service to make httpRequest
            vm.makeRequest = stream => {
                if (stream.length > 1 ) {
                    getTwitchData.getStream( stream )
                        .then(response => {
                            let ret = parseDataService.checkOnline( response );
                            vm.userText="";
                            if( ret !== null && typeof ret !== 'string' ) {
                                animateCheckIcon();
                            }
                        })
                }
            }
            function animateCheckIcon() {
                $('#poly, #xOne, #xTwo').css({
                    "stroke-dashoffset":"0"
                });
            }
        }

        function addcardDir() {

            return {
                controller: 'popupController',
                controllerAs: "card",
                templateUrl: 'partials/addCard.html',
                link: (scope, element, attr, ctrl) => {

                }
            }
        }
})()
