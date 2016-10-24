class MentoringTrack < ApplicationRecord
  has_many :tracks
  belongs_to :mentee, class_name: 'User', foreign_key: :mentee_id
  attr_writer :current_step

  def serializable_hash(options)
    super({
      except: [:created_at, :updated_at, :name]
    }.merge(options))
  end
end
