class Track < ActiveRecord::Base
  has_many :section_interactions
  belongs_to :mentor, foreign_key: :mentor_id, class_name: 'User'
  belongs_to :mentee, foreign_key: :mentee_id, class_name: 'User'

  validates_presence_of :name, :desc, :type
  mount_uploader :image, ImageUploader

  def serializable_hash(options)
    super({
      except: [:created_at, :updated_at, :type]
    }.merge(options))
  end

  def incomplete_section_interactions
    section_interactions.where('state != ?', 'section_completed')
                        .order('created_at ASC')
  end

  def recent_incomplete_section_interactions
    return [] if incomplete_section_interactions.blank?
    ret = []

    incomplete_section_interactions.each_with_index do |section_interaction, i|
      if i.zero?
        ret = [section_interaction]
        next
      end

      ret.last.new? ? break : (ret << section_interaction)
    end

    ret
  end
end
