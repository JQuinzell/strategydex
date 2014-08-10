var pokeTools = angular.module('pokeTools', [
	'ngRoute',
	'PokedexControllers',
  'templates'
]);

pokeTools.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/pokedex', {
		templateUrl: "pokedex.html",
		controller: 'PokedexController'
	}).
	when('/details/:pokemonId', {
    templateUrl: "details.html",
		controller: 'detailsController'
	}).
	otherwise({
		redirectTo: '/pokedex'
	});
}]);