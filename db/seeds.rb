# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
types = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy"]

pokedex = File.read("#{Rails.root}/db/dex.json")
pokedex = JSON.parse pokedex

moves = File.read("#{Rails.root}/db/moves.json")
moves = JSON.parse moves

moves.each do |data|
  move = Move.find_or_create_by name: data['name']
  move.power = data['power']
  move.category = data['category']
  move.save
end

pokedex.each do |data|
  pokemon = Pokemon.find_or_create_by(name: data["name"])
  pokemon.name = data["name"]
  pokemon.national_id = data["national_id"]
  pokemon.hp = data["hp"]
  pokemon.attack = data["attack"]
  pokemon.defense = data["defense"]
  pokemon.speed = data["speed"]
  pokemon.sp_def = data["sp_def"]
  pokemon.sp_atk = data["sp_atk"]
  pokemon.types.clear
  data["types"].each do |type|
    name = type["name"]
    pokemon.types << Type.find_or_create_by(name: name)
  end
  pokemon.abilities.clear
  data["abilities"].each do |ab|
    name = ab["name"]
    pokemon.abilities << Ability.find_or_create_by(name: name)
  end
  evos = []
  (evos << data["evolutions"]).flatten!
  pokemon.evolved_forms.clear
  evos.each do |name|
    pokemon.evolved_forms << Pokemon.find_or_create_by(name: name)
  end
  pokemon.moves.clear
  puts pokemon.moves
  data['moves'].each do |name|
    pokemon.moves << Move.find_by(name: name)
  end
  pokemon.save
end
