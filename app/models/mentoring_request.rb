class MentoringRequest < ApplicationRecord
  belongs_to :mentor, foreign_key: :mentor_id, class_name: 'User'
  belongs_to :mentee, foreign_key: :mentee_id, class_name: 'User'

  state_machine initial: :new do
    event :accept do
      transition new: :accepted
    end
    event :reject do
      transition new: :rejected
    end
  end
end
