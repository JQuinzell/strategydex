json.array!(@pokemon) do |pokemon|
  json.extract! pokemon, :name, :hp, :attack, :defense, :speed, :sp_atk, :sp_def, :national_id
  json.types pokemon.types, :name
end