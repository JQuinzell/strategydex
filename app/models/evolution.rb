class Evolution < ActiveRecord::Base
  belongs_to :pokemon
  belongs_to :evolved_form, class_name: "Pokemon"
end
