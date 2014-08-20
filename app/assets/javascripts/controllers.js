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
['$scope', '$routeParams', '$filter', 'pokedex', 'weaknessChecker', 'statService', 'damageService',
 function($scope, $routeParams, $filter, pokedex, weaknessChecker, statService, damageService) {
  var pokes;
  pokedex.all().success(function(data){
    pokes = data;
	});
   
  console.log(pokes);
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

  var stats = [{title: "HP", name: "hp"}, {title: "Attack", name: "attack"}, {title: "Defense",name: "defense"}, {title: "Sp. Attack", name: "sp_atk"},{title:"Sp. Defense", name: "sp_def"},{title: "speed",name: "speed"}];
  $scope.stats = stats;
   
  $scope.natures = ["hardy", "lonely", "brave", "adamant", "naughty", "bold", "docile", "relaxed", "impish", "lax", "timid", "hasty", "serious", "jolly", "naive", "modest", "mild", "quiet", "bashful", "rash", "calm", "gentle", "sassy", "careful", "quirky"];
  function set_stats(poke){
    poke.stats = {};
    for(var i = 0; i<stats.length; i++){     
      var stat = stats[i].name
      var base = poke[stat];
      poke.stats[stat] = {};
      poke.stats[stat].ev_val = 0;
      poke.stats[stat].iv_val = 31;
      poke.stats[stat].value = statService.calc_stat(stat, base);
    }
  }
  
  $scope.calc_damage = function(move, user, target){
    var attack = move.category === "special" ? user.stats.sp_atk.value : user.stats.attack.value;
    var defense = move.category === "special" ? target.stats.sp_def.value : target.stats.defense.value;
    
    var raw = damageService.raw_damage(attack, defense, move.power);
    console.log(raw);
    var stab = 1;
    for(var i = 0; i<user.types.length; i++){
      if(user.types[i].name === move.type)
        stab = 1.5;
    }
    var type_mult = weaknessChecker.type_multipliers(target)[move.type];
    type_mult = type_mult === undefined ? 1 : type_mult;
    console.log(raw, stab, type_mult);
    move.min_dmg = Math.floor(Math.floor(Math.floor(raw*0.85)*stab)*type_mult);
    move.max_dmg = Math.floor(Math.floor(raw*stab)*type_mult);
    move.calced = true;
  };
   
	pokedex.find($routeParams.pokemonId).then(function(data){
    console.log(data);
    $scope.pokemon = data;
    set_stats($scope.pokemon);    
  });
   
  $scope.recalc_stats = function(poke){
    for(var i = 0; i<stats.length; i++){
      var stat = stats[i].name;
      var base = poke[stat];
      poke.stats[stat].value = statService.calc_stat(stat, base, poke.stats[stat].iv_val, poke.stats[stat].ev_val, poke.nature);
     }
   }
  $scope.poke_stat = function(stat, poke){
    poke.stats[stat].value = statService.calc_stat(stat, poke[stat], poke.stats[stat].iv_val, poke.stats[stat].ev_val, poke.nature);
  };
  
  $scope.setOrder = function(q){
    if($scope.syn_query.order === q){
      $scope.syn_query.dir = !$scope.syn_query.dir;
    } else {
      $scope.syn_query.order = q;
      $scope.syn_query.dir = 'reverse';
    }
  };
  
  $scope.addPoke = function(poke){
    set_stats(poke);
    $scope.comparison = poke;
    $scope.query.find = null;
  };
  
  $scope.removePoke = function(){
    $scope.comparison = null;
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