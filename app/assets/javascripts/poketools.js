var pokeTools = angular.module('pokeTools', [
	'ngRoute',
	'PokedexControllers',
  'templates'
]);

pokeTools.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/pokedex', {
		templateUrl: "pokedex.html"
	}).
	when('/details/:pokemonId', {
    templateUrl: "details.html",
		controller: 'DetailsController'
	}).
	otherwise({
		redirectTo: '/pokedex'
	});
}]);