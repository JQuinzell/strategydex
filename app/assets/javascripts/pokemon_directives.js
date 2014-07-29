var pokemon = angular.module('PokemonDirectives', []);

pokemon.directive('pokemon', function(){
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      id: '@',
      name: '@',
      types: '=',
      hp: '@',
      attack: '@',
      defense: '@',
      speed: '@',
      spa: '@',
      spd: '@'
    },
    templateUrl: "pokemon.html"
  };
})