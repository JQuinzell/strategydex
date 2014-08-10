class CreateAbilities < ActiveRecord::Migration
  def change
    create_table :abilities do |t|
      t.string :name

      t.timestamps
    end
    
    create_join_table :abilities, :pokemons do |t|
      
    end
  end
end
