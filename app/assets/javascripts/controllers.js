var PokedexControllers = angular.module('PokedexControllers', ['PokemonDirectives', 'PokemonServices']);

PokedexControllers.controller('PokedexController', ['$scope', 'pokedex', '$filter', function($scope, pokedex, $filter) {
  var pokedata;
  var type_list = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"];
  
  $scope.stat_map = [{title: "HP", name: "hp"}, {title: "Attack", name: "attack"}, {title: "Defense",name: "defense"}, {title: "Sp. Attack", name: "sp_atk"},{title:"Sp. Defense", name: "sp_def"},{title: "speed",name: "speed"}];
  $scope.type_list = type_list;
  $scope.dex_q = {
    types: [],
    order: 'national_id',
    nfe: false
  };
  for(var i = 0; i<type_list.length; i++){
    $scope.dex_q.types.push(type_list[i]);
  }
	pokedex.all().success(function(data){
    pokedata = data;
		$scope.pokedex = $filter('fullyEvolved')(pokedata);
	});

  this.toggleType =function(type){
    var index = $scope.dex_q.types.indexOf(type);
    if( index === -1){
      $scope.dex_q.types.push(type);
    } else {
      $scope.dex_q.types.splice(index, 1);
    }
    $scope.pokedex = $filter('onlyTypes')(pokedata, $scope.dex_q.types);
  };
  
  this.toggleNfe = function(){
    if(!$scope.dex_q.nfe){
      $scope.pokedex = pokedata
    } else {
      $scope.pokedex = $filter('fullyEvolved')(pokedata);
    }
    $scope.dex_q.nfe = !$scope.dex_q.nfe;
  };
  
}]);

PokedexControllers.controller('DetailsController',
['$scope', '$stateParams', '$filter', 'pokedex', function($scope, $stateParams, $filter, pokedex) {
  var pokeId = Number($stateParams.pokemonId);
  var last = 718;
  $scope.pokeId = pokeId;
  $scope.prevPoke = pokeId > 1 ? pokeId-1 : last;
  $scope.nextPoke = pokeId < last ? pokeId+1 : 1;
     
	pokedex.find(pokeId).then(function(data){
    $scope.pokemon = data;
  });
  
}]);

PokedexControllers.controller('DamageController',
  ['$scope', 'pokedex', 'statService', 'damageService', function($scope, pokedex, statService, damageService){
  $scope.natures = ["hardy", "lonely", "brave", "adamant", "naughty", "bold", "docile", "relaxed", "impish", "lax", "timid", "hasty", "serious", "jolly", "naive", "modest", "mild", "quiet", "bashful", "rash", "calm", "gentle", "sassy", "careful", "quirky"];
  var stats = $scope.stat_map;
  $scope.stats = stats;
  var pokeId = $scope.pokeId;  
  
	pokedex.find(pokeId).then(function(data){
    $scope.pokemon = data;
    pokedex.moves_for(pokeId).then(function(moves){
      $scope.pokemon.moves = moves;
    });
    set_stats($scope.pokemon);    
  });
  
  $scope.addPoke = function(poke){
    set_stats(poke);
    $scope.comparison = poke;
    $scope.search_q.find = null;
  };
  
  $scope.removePoke = function(){
    $scope.comparison = null;
  };
  $scope.set_move = function(move){
    console.log($scope.move);
  };
  
  $scope.calc_damage = function(move, user, target){
    damageService.damage_range(move, user, target);
    move.calced = true;
  };
      
  $scope.recalc_stats = function(poke){
    for(var i = 0; i<stats.length; i++){
      var stat = stats[i].name;
      var base = poke[stat];
      poke.stats[stat].value = statService.calc_stat(stat, base, poke.stats[stat].iv_val, poke.stats[stat].ev_val, poke.nature);
     }
   };
  
  $scope.poke_stat = function(stat, poke){
    poke.stats[stat].value = statService.calc_stat(stat, poke[stat], poke.stats[stat].iv_val, poke.stats[stat].ev_val, poke.nature);
  };
    
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

}]);

PokedexControllers.controller('SynergyController',
  ['$scope', '$filter', 'pokedex', 'weaknessChecker', function($scope, $filter, pokedex, weaknessChecker){
  var pokes;
  $scope.syn_query = {order: 'total', dir: 'reverse'};

  pokedex.find($scope.pokeId).then(function(data){
    $scope.pokemon = data;
  
    pokedex.all().success(function(data){
      pokes = data;

      var list;
      var unsorted = [];
      list = $filter('fullyEvolved')(pokes);
      $scope.synergy_scores = [];
      for(var i = 0; i<list.length; i++){      
        var variants = weaknessChecker.ability_typings(list[i]);
        for(var z = 0; z<variants.length; z++){
          console.log(variants[z]);
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
    });
  });
      
  $scope.synergy_order = function(q){
    if($scope.syn_query.order === q){
      $scope.syn_query.dir = !$scope.syn_query.dir;
    } else {
      $scope.syn_query.order = q;
      $scope.syn_query.dir = 'reverse';
    }
  };    
}]);

PokedexControllers.controller('ThreatController', ['$scope', 'pokedex', '$filter', function($scope, pokedex, $filter){
  var speed;
  pokedex.find($scope.pokeId).then(function(data){
    $scope.pokemon = data;
    speed = data.speed;
    
    pokedex.all().success(function(data){
      var pokes = $filter('fullyEvolved')(data);
      var faster = [];
      //find faster
      for(var i = 0; i<pokes.length; i++){
        if(speed <= pokes[i].speed)
          faster.push(pokes[i])
      }
      $scope.threats = faster;
    });
  });
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
        if(valid_types.indexOf(mon.types[j].name) > -1){
          list.push(mon);
          break;
        }
      }
    }
    return list;
  };
});