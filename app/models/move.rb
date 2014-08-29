class Move < ActiveRecord::Base
  has_and_belongs_to_many :pokemons
  
  def as_json(options = {})
    super(except: [:id, :created_at, :updated_at])
  end
end
