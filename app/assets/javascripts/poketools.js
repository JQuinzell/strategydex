var pokeTools = angular.module('pokeTools', [
	'ngRoute',
	'PokedexControllers',
	'angular-data.DSCacheFactory'
]);

pokeTools.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/pokedex', {
		templateUrl: 'assets/pokedex.html',
		controller: 'PokedexController'
	}).
	when('/details/:pokemonId', {
		templateUrl: 'assets/details.html',
		controller: 'detailsController'
	}).
	otherwise({
		redirectTo: '/pokedex'
	});
}]);

pokeTools.factory('pokeBank', ['DSCacheFactory', 'pokedexAPI', '$q', function(DSCacheFactory, pokedexAPI, $q){
	var cache = DSCacheFactory('pokeCache');
	var banker = {};
	banker.put = function(pokemon){
		cache.put(pokemon.national_id, pokemon);
	};
	banker.get = function(id) {
		var deferred = $q.defer();
		var pokeData = cache.get(id);
		console.log(pokeData);
		if(pokeData){
			console.log("Served from cache");
			deferred.resolve(pokeData);
		} else {
			pokedexAPI.find(id).success(function(data){
				deferred.resolve(data);
			});
		}
		return deferred.promise;
	};
	banker.all = function(){
		var deferred = $q.defer();
		pokedexAPI.all().success(function(data){
			deferred.resolve(data);
		});
		return deferred.promise;
	}


	return banker;
}]);

pokeTools.factory('pokedexAPI', ['$http', function($http){
	var pokeUri = "http://pokeapi.co/api/v1/pokemon/";
	var dexUri = "http://pokeapi.co/api/v1/pokedex/1";
	dex = {};
	var cb = "/?callback=JSON_CALLBACK";

	dex.find = function(id){
		return $http.jsonp(pokeUri + id + cb);
	};

	dex.all = function() {
		return $http.jsonp(dexUri + cb);
	};

	return dex;
}]);