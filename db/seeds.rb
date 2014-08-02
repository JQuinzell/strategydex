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
  evos = []
  (evos << data["evolutions"]).flatten!
  evos.each do |p|
    name = p["to"]
    pokemon.evolved_forms << Pokemon.find_or_create_by(name: name) unless name.include?("-mega")
  end
  pokemon.save
end
