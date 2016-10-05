class Question < ApplicationRecord
  belongs_to :section_interaction

  default_scope { order('id') }
end
