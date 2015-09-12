(()=>{
    angular.module('myApp')
        .controller('navController',navController)
        .controller('addbtnController',addbtnController);

        function navController($http,$q,menuService) {
            const nav = this;
            nav.setView = menuService.setView;
        }
        function addbtnController(popupService){
            const vm = this;
            vm.showPopup = popupService.showPopup;
        }
})()
