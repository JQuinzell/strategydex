var app = angular.module('PokemonServices', []);

app.factory('pokeBank', ['$http', '$cacheFactory', '$q', function($http, $cacheFactory, $q){
  var pokedex = {};
  var cache = $cacheFactory('pokemon');
  var pokeUri = "/api/v1/pokemons/";
  
  pokedex.all = function(id){
    var pokemon = cache.get(id);
    var d = $q.defer();
    if(pokemon){
      d.resolve(pokemon);
    } else {
      $http.get(pokeUri, {cache: true}).success(function(data){
        d.resolve(data);
      });
    }
    return d.promise;
  };
  return pokedex;
}]);