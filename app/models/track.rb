class Track < ApplicationRecord
  has_many :section_interactions
  belongs_to :mentor, foreign_key: :mentor_id, class_name: 'User'
  belongs_to :mentee, foreign_key: :mentee_id, class_name: 'User'

  validates :name, presence: true
  validates :desc, presence: true
  validates :type, presence: true

  mount_uploader :image, ImageUploader
  delegate :email, to: :mentor, allow_nil: true

  def serializable_hash(options)
    options ||= {}

    super({
      except: [:created_at, :updated_at, :type, :image],
      methods: [
        :image_url, :progress, :expected_progress,
        :recent_incomplete_section_interaction_id,
        :mentor_bot?
      ],
      include: [:mentee, :section_interactions]
    }.merge(options))
  end

  def incomplete_section_interactions
    section_interactions.where('state != ?', 'section_completed')
                        .order('created_at ASC')
  end

  def recent_incomplete_section_interaction_id
    section_interactions.where('state != ? AND state != ?',
                               'section_completed', 'feedback_captured')
                        .order('created_at ASC').limit(1).pluck(:id)[0]
  end

  def image_url
    image.try(:url) || image.try(:image).try(:url)
  end

  def progress
    no_of_s = section_interactions.count
    no_of_s_done = section_interactions.where(state: 'section_completed').count
    res = ((no_of_s_done.to_f / no_of_s.to_f) * 100).round(2)
    !res.nan? && res.finite? ? res : 0
  end

  def expected_progress
    return 0 if deadline.blank?

    res =
      (section_interactions_count.to_f / total_no_of_days) * no_of_days_since
    !res.nan? && res.finite? ? res.ceil : 0
  end

  def mentor_bot?
    return true if self.email.split('@')[0] == 'bot'
  end

  def self_paced?
    return true if self.mentor_id == self.mentee_id
  end

  private

  def section_interactions_count
    self.section_interactions.count
  end

  def total_no_of_days
    (deadline.to_date - created_at.to_date).to_f
  end

  def no_of_days_since
    days_over = (Time.current.to_date - created_at.to_date).to_i
    days_over.zero? ? 1 : days_over
  end
end
