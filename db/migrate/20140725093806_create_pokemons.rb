class CreatePokemons < ActiveRecord::Migration
  def change
    create_table :pokemons do |t|
      t.string "name"
      t.integer "national_id"
      t.integer "hp"
      t.integer "attack"
      t.integer "defense"
      t.integer "speed"
      t.integer "sp_atk"
      t.integer "sp_def"

      t.timestamps
    end
  end
end
