class PokemonsController < ApplicationController
  
  def index
    @pokemon = Pokemon.all
  end
end
