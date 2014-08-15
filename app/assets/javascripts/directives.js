var pokemon = angular.module('PokemonDirectives', []);

pokemon.directive('pokemon', function(){
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      pkmn: '='
    },
    templateUrl: "pokemon.html"
  };
})