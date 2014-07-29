var PokedexControllers = angular.module('PokedexControllers', ['PokemonDirectives']);

PokedexControllers.controller('PokedexController', ['$scope', 'pokeBank', function($scope, pokeBank) {
	pokeBank.all().then(function(data){
		$scope.pokedex = data;
		$scope.order = 'national_id';
	});
  $scope.query = {
    types: []
  };
  $scope.stat_map = [
    {name: "hp", abbr: "hp"},
    {name: "attack", abbr: "attack"},
    {name: "defense", abbr: "defense"},
    {name: "speed", abbr: "speed"},
    {name: "special attack", abbr: "sp_atk"},
    {name: "special defense", abbr: "sp_def"}
  ];
  $scope.type_list = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  
  $scope.current_stat = "hp";
  
  $scope.setStat = function(stat){
    $scope.current_stat = stat;
  }
  
  $scope.toggleType =function(type){
    var index = $scope.query["types"].indexOf(type);
    if( index === -1){
      $scope.query["types"].push(type);
    } else {
      $scope.query["types"].splice(index, 1);
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

PokedexControllers.filter('onlyTypes',function(){
  return function(pokemon,valid_types,active){
    if(active === true){
      var list = [];

      for(var i = 0; i<pokemon.length; i++){
        var mon = pokemon[i];
        for(var j = 0; j<mon.types.length; j++){
          if(valid_types.indexOf(mon.types[j].name) > -1){
            list.push(mon);
            break;
          }
        }
      }
      return list;
    }
    return pokemon;
  };
});

PokedexControllers.filter('statSort', function(){
  return function(pokemon, stat, dir, active){
    if(active === true){
      console.log("Called with:", stat, dir);
      pokemon.sort(function(a,b){
        console.log("Sorting ", stat);
        console.log(a[stat]-b[stat]);
        return b[stat]-a[stat];
      });
      if(dir === "reverse") {pokemon.reverse()}
    }
    return pokemon;
  };
});