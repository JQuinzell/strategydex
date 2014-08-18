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
});

pokemon.
	directive('onlyDigits', function () {

		return {
			restrict: 'A',
			require: 'ngModel',
      scope: {
        maxDigits: '@',
        maxValue: '@'
      },
			link: function (scope, element, attrs, ngModel) {
				ngModel.$parsers.push(function (inputValue) {
          var digits = scope.maxDigits ? inputValue.substring(0, scope.maxDigits) : inputValue;
					digits = Number(digits.split('').filter(function (s) { return (!isNaN(s) && s != ' '); }).join(''));
					if(scope.maxValue && digits>scope.maxValue) { digits = Number(scope.maxValue); }
					ngModel.$viewValue = digits;
					ngModel.$render();
					return digits;
				});
			}
		};
	});