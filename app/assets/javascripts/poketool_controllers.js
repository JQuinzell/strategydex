var PokedexControllers = angular.module('PokedexControllers', ['PokemonDirectives', 'PokemonServices']);

PokedexControllers.controller('PokedexController', ['$scope', 'pokedex', '$filter', function($scope, pokedex, $filter) {
  var pokedata;
  $scope.type_list = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
 $scope.query = {
    types: [],
    order: 'id',
    nfe: false
  };
  for(var i = 0; i<$scope.type_list.length; i++){
    $scope.query.types.push($scope.type_list[i]);
  }
	pokedex.all().success(function(data){
    pokedata = data;
		$scope.pokedex = $filter('fullyEvolved')(pokedata);
	});

  $scope.toggleType =function(type){
    var index = $scope.query.types.indexOf(type);
    if( index === -1){
      $scope.query.types.push(type);
    } else {
      $scope.query.types.splice(index, 1);
    }
    $scope.pokedex = $filter('onlyTypes')(pokedata, $scope.query.types);
  };
  
  $scope.toggleNfe = function(){
    if(!$scope.query.nfe){
      $scope.pokedex = pokedata
    } else {
      $scope.pokedex = $filter('fullyEvolved')(pokedata);
    }
    $scope.query.nfe = !$scope.query.nfe;
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

PokedexControllers.filter('fullyEvolved', function(){
  return function(pokemon){
    var list = [];
    for(var i = 0; i<pokemon.length; i++){
      var mon = pokemon[i];
      if(mon.evolutions.length === 0) {
        list.push(mon);
      }
    }
    return list;
  };
});

PokedexControllers.filter('onlyTypes',function(){
  return function(pokemon,valid_types){
    var list = [];
    for(var i = 0; i<pokemon.length; i++){
      var mon = pokemon[i];
      for(var j = 0; j<mon.types.length; j++){
        if(valid_types.indexOf(mon.types[j]) > -1){
          list.push(mon);
          break;
        }
      }
    }
    return list;
  };
});