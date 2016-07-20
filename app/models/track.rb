class Track < ActiveRecord::Base
  has_many :section_interactions
  belongs_to :mentor, foreign_key: :mentor_id, class_name: 'User'
  belongs_to :mentee, foreign_key: :mentee_id, class_name: 'User'

  validates :name, presence: true
  validates :desc, presence: true
  validates :type, presence: true

  mount_uploader :image, ImageUploader

  def serializable_hash(options)
    options ||= {}

    super({
      except: [:created_at, :updated_at, :type, :image],
      methods: [:image_url, :recent_incomplete_section_interactions]
    }.merge(options))
  end

  def incomplete_section_interactions
    section_interactions.where('state != ?', 'section_completed')
                        .order('id ASC')
  end

  def recent_incomplete_section_interactions
    ret = []

    return ret if incomplete_section_interactions.blank?

    incomplete_section_interactions.each_with_index do |section_interaction, i|
      if i.zero?
        ret = [section_interaction]
        next
      end

      ret.last.new? ? break : (ret << section_interaction)
    end

    ret
  end

  def image_url
    image.try(:url) || image.try(:image).try(:url)
  end

end
