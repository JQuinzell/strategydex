var PokedexControllers = angular.module('PokedexControllers', []);

PokedexControllers.controller('PokedexController', ['$scope', 'pokeBank', function($scope, pokeBank) {
	pokeBank.all().then(function(data){
		$scope.pokedex = data;
		$scope.order = 'national_id';
	});
  $scope.query = {
    types: {}
  };
  $scope.type_list = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  
  $scope.toggleType =function(type){
    if(!$scope.query["types"][type]){
      $scope.query["types"][type] = true;
    } else {
      $scope.query["types"][type] = false;
    }
    console.log($scope.query["types"]);
  };
}]);

PokedexControllers.controller('detailsController',
['$scope', '$routeParams', 'pokeBank', function($scope, $routeParams, pokeBank) {

	function set_directions(){
		var last = 718;
		$scope.pokeIndex = Number($routeParams.pokemonId);

		if($scope.pokeIndex > 1) {
			$scope.prevPoke = $scope.pokeIndex-1;
		} else {
			$scope.prevPoke = last;
		}

		if($scope.pokeIndex < last) {
			$scope.nextPoke = $scope.pokeIndex + 1;
		} else {
			$scope.nextPoke = 1;
		}		
	}

	set_directions();

	pokeBank.get($routeParams.pokemonId).then(
		function(pokemon){
      console.log("wtf");
			console.log(pokemon);
			$scope.pokemon = pokemon;
			pokeBank.put(pokemon);
		}
	);
}]);

