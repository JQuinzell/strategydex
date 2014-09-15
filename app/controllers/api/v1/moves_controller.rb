module Api
  module V1
    class MovesController < ApplicationController
      respond_to :json
      
      def index
        if params[:pokemon]
          moves = Pokemon.find_by(national_id: params[:pokemon]).moves
          moves = moves.where("category IS NOT NULL") if params[:damage]
          respond_with moves
        else
          respond_with Move.all
        end
      end
    end
  end
end