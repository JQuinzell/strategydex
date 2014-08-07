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
['$scope', '$routeParams', '$filter', 'pokedex', 'weaknessChecker', function($scope, $routeParams, $filter, pokedex, weaknessChecker) {

  var pokes;
  pokedex.all().success(function(data){
    pokes = data;
	});

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

	pokedex.find($routeParams.pokemonId).then(function(data){
    console.log(data);
    $scope.pokemon = data;
  });
  
  $scope.synergize = function(){
    var list;
    list = $filter('fullyEvolved')(pokes);
    $scope.synergy_scores = [];
    for(var i = 0; i<list.length; i++){
      var types = [];
      var score = {name: list[i].name};
      for(var j = 0; j<$scope.pokemon.types.length; j++){
        types.push($scope.pokemon.types[j].name);
      }
      //How well current pokemon is defended by x
      score.defended = weaknessChecker.check_synergy(list[i].types, types);
      //How well current pokemon defends x
      score.defends = weaknessChecker.check_synergy(types, list[i].types);
      $scope.synergy_scores.push(score);
    }
  };
  
  
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