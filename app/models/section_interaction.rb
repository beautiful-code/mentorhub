class SectionInteraction < ApplicationRecord
  has_many :todos
  has_many :notifications
  belongs_to :track

  validates :title, presence: true
  validates :content, presence: true
  validates :track, presence: true
  validates :type, presence: true

  before_save :set_state_to_review_pending, if: lambda {
    mentee_notes.present? && mentee_notes_changed? && !pending_todos?
  }

  serialize :resources, Array

  after_update_commit { TrackBroadcastJob.perform_later(self.track) }

  STATES =
    %w(new section_submitted tasks_pending
       review_pending section_completed).freeze

  validates :state, presence: true,
    inclusion: { in: STATES, if: -> { state.present? } }

  default_scope { order('id') }

  delegate :mentor_id, to: :track
  delegate :mentee_id, to: :track

  state_machine :state, initial: :new do
    event :submit_section do
      transition new: :section_submitted
    end

    event :pending_review do
      transition [:section_submitted, :tasks_pending] => :review_pending
    end

    event :pending_tasks do
      transition [:new, :section_submitted, :review_pending] => :tasks_pending
    end

    event :complete_section do
      transition review_pending: :section_completed,
        if: ->(si) { !si.pending_todos? }
    end
  end

  def pending_todos?
    todo_states = self.todos.pluck(:state).uniq
    todo_states.include?('incomplete') || todo_states.include?('to_be_reviewed')
  end

  def serializable_hash(options)
    options ||= {}

    super({
      except: [:goal, :created_at, :updated_at],
      include: [:todos],
      methods: [
        :notifications_for_mentee,
        :notifications_for_mentor
      ]
    }.merge(options))
  end

  def resources
    super.map(&:symbolize_keys).collect do |res|
      if res[:url].present?
        (res[:url] = "http://#{res[:url]}" unless res[:url].include?('http'))
      end

      res
    end
  end

  def notifications_for_mentor
    self.notifications.where(read: false, subscriber_id: self.mentor_id).count
  end

  def notifications_for_mentee
    self.notifications.where(read: false, subscriber_id: self.mentee_id).count
  end

  private

  def set_state_to_review_pending
    self.state = 'review_pending'
  end
end
