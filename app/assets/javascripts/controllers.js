var PokedexControllers = angular.module('PokedexControllers', ['PokemonDirectives', 'PokemonServices']);

PokedexControllers.controller('PokedexController', ['$scope', 'pokedex', '$filter', function($scope, pokedex, $filter) {
  var pokedata;
  $scope.type_list = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
 $scope.query = {
    types: [],
    order: 'national_id',
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

PokedexControllers.controller('DetailsController',
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
    $scope.pokemon = [data];
  });
  
  $scope.setOrder = function(q){
    if($scope.syn_query.order === q){
      $scope.syn_query.dir = !$scope.syn_query.dir;
    } else {
      $scope.syn_query.order = q;
      $scope.syn_query.dir = 'reverse';
    }
  };
  
  $scope.addPoke = function(poke){
    var unique = true;
    for(var i = 0; i<$scope.pokemon.length; i++){
      if(poke.name === $scope.pokemon[i].name){
        unique = false;
        break;
      }
    }
    
    if(unique) {
      $scope.pokemon.push(poke);
      $scope.query.find = null;
    }
  };
  
  $scope.removePoke = function(poke){
    for(var i = 0; i<$scope.pokemon.length; i++){
      if(poke.name === $scope.pokemon[i].name){
        $scope.pokemon.splice(i, 1);
        break;
      }
    }
  };
  
  $scope.synergize = function(){
    $scope.syn_query = {order: 'total', dir: 'reverse'}
    var list;
    var unsorted = [];
    list = $filter('fullyEvolved')(pokes);
    $scope.synergy_scores = [];
    for(var i = 0; i<list.length; i++){      
      var variants = weaknessChecker.ability_typings(list[i]);
      console.log("Variants", variants);
      for(var z = 0; z<variants.length; z++){
        console.log("WTF",variants[z]);
        var score = weaknessChecker.synergy_scores(variants[z], $scope.pokemon);
        unsorted.push(score);
      }
    }

    $scope.synergy_scores.push(unsorted[0]);
    //literate through all unsorted
    for(var j = 1; j<unsorted.length; j++){
      //iterate through all with filtered value
      var current = unsorted[j];
      current.added = false;
      for(var k = 0; k<$scope.synergy_scores.length; k++){
        var item = $scope.synergy_scores[k];
//         console.log("Comparing", current,"to", item);
        if(current.type === item.type) {
          item.names.push(current.names[0]);
          current.added = true;
          break;
        }
      }
      if(!current.added){
        delete current.added;
        $scope.synergy_scores.push(current);
      }
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

function lists_equal(list, comparison){
//   console.log("Testing equal lists:", list, "and", comparison);
  if(list.length === comparison.length){
    list.sort(); comparison.sort();
    for(var i = 0; i<list.length; i++){
      if(list[i] !== comparison[i]){
        return false;
      }
    }
    return true;
  }
  return false;
}