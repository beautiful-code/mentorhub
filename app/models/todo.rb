class Todo < ApplicationRecord
  belongs_to :section_interaction

  validates :content, presence: true
  validates :section_interaction_id, presence: true

  STATES = %w(incomplete to_be_reviewed completed).freeze

  validates :state, presence: true,
    inclusion: { in: STATES, if: -> { state.present? } }

  after_commit :broadcast_section_interaction, on: [:create, :update, :destroy]
  after_commit :update_section_interaction_state, on: [:update, :destroy]

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

  private

  def broadcast_section_interaction
    SectionInteractionBroadcastJob.perform_later(self.section_interaction)
  end

  def update_section_interaction_state
    if section_interaction.pending_todos?
      section_interaction.pending_tasks unless section_interaction.tasks_pending?
    else
      section_interaction.pending_review
    end
  end
end
