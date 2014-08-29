module Api
  module V1
    class MovesController < ApplicationController
      respond_to :json
      
      def index
        if params[:pokemon]
          respond_with Pokemon.find(params[:pokemon]).moves
        else
          respond_with Move.all
        end
      end
    end
  end
end