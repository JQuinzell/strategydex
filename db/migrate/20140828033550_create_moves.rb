class CreateMoves < ActiveRecord::Migration
  def change
    create_table :moves do |t|
      t.string :name
      t.string :category
      t.integer :power

      t.timestamps
    end
    
    create_join_table :moves, :pokemons do |t|
    end
  end
end
