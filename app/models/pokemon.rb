class Pokemon < ActiveRecord::Base
  has_and_belongs_to_many :types
  has_many :evolutions
  has_many :evolved_forms, through: :evolutions
  
  def as_json(options = {})
    super(except: [:id, :created_at, :updated_at], include: [types: {only: :name}])
  end
  
  def to_param
    national_id
  end
  
  def fully_evolved?
    self.evolutions.empty?
  end
end
