class CreateEvolutions < ActiveRecord::Migration
  def change
    create_table :evolutions do |t|
      t.integer :pokemon_id
      t.integer :evolved_form_id
      t.timestamps
    end
  end
end
