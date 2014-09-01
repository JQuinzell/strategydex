var pokeTools = angular.module('pokeTools', [
	'ui.router',
	'PokedexControllers',
  'templates'
]);

pokeTools.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider.
	state('pokedex', {
    url: '/pokedex',
		templateUrl: "pokedex.html"
	}).
	state('details', {
    url: '/details/:pokemonId',
    templateUrl: "details.html"
	}).
  state('details.synergy', {
    url: '/synergy',
    templateUrl: 'synergy.html',
    controller: 'SynergyController'
  })
  
  $urlRouterProvider.otherwise("/pokedex");
}]);