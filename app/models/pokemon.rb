class Pokemon < ActiveRecord::Base
  has_and_belongs_to_many :types
  
  def as_json
    super(except: [:id, :created_at, :updated_at], include: [types: {only: :name}])
  end
end
