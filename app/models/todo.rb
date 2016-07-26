class Todo < ApplicationRecord
  belongs_to :section_interaction

  validates :content, presence: true
  validates :section_interaction_id, presence: true

  STATES = %w(incomplete to_be_reviewed completed).freeze

  validates :state, presence: true,
    inclusion: { in: STATES, if: -> { state.present? } }

  state_machine :state, initial: :incomplete do
    event :review_todo do
      transition incomplete: :to_be_reviewed
    end

    event :incomplete_todo do
      transition to_be_reviewed: :incomplete
    end

    event :complete_todo do
      transition to_be_reviewed: :completed
    end
  end

  def serializable_hash(options)
    super({
      except: [:created_at, :updated_at]
    }.merge(options))
  end
end
