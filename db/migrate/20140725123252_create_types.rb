class CreateTypes < ActiveRecord::Migration
  def change
    create_table :types do |t|
      t.string "name"

      t.timestamps
    end
    
    create_join_table :pokemons, :types do |t|
    end
  end
end
