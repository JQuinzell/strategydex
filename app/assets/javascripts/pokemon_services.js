var app = angular.module('PokemonServices', []);

app.factory('pokeBank', ['$http', '$cacheFactory', '$q', function($http, $cacheFactory, $q){
  var pokedex = {};
  var cache = $cacheFactory('pokemon');
  var pokeUri = "/api/v1/pokemons/";
  
  pokedex.all = function(){
    var d = $q.defer();
    var path = pokeUri + "?nfe=true"
    $http.get(path, {cache: true}).success(function(data){
      d.resolve(data);
    });
    return d.promise;
  };
  
  pokedex.fully_evolved = function(){
    var d = $q.defer();
    $http.get(pokeUri, {cache: true}).success(function(data){
      d.resolve(data);
    });
    return d.promise;
  }
  return pokedex;
}]);