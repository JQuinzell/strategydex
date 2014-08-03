module Api
  module V1
    class PokemonsController < ApplicationController
      respond_to :json
      
      def index
        respond_with params[:nfe] == "true" ? Pokemon.all : Pokemon.fully_evolved
      end
            
      def show
        respond_with Pokemon.find_by_national_id(params[:id])
      end
    end
  end
end