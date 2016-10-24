class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise(
    :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable,
    :omniauthable, :timeoutable, omniauth_providers: [:google_oauth2]
  )

  has_many :mentoring_tracks, foreign_key: :mentor_id, class_name: 'Track'
  has_many :learning_tracks, foreign_key: :mentee_id, class_name: 'Track'

  has_many :mentor_request, foreign_key: :mentor_id,
                            class_name: 'MentoringRequest'
  has_many :mentee_request, foreign_key: :mentee_id,
                            class_name: 'MentoringRequest'
  belongs_to :organization

  validates :first_name, presence: true
  validates :last_name, presence: true

  default_scope { order('id') }

  def self.from_omniauth(access_token)
    data = access_token.info
    user = User.find_by(email: data['email'])

    user = User.create(
      first_name: data['first_name'],
      last_name: data['last_name'],
      email: data['email'],
      password: Devise.friendly_token[0, 20],
      image: data['image']
    ) unless user

    user
  end

  def name
    "#{first_name} #{last_name}"
  end

  def mentees
    mentoring_tracks.collect(&:mentee)
  end

  def all_mentoring_tracks
    mentoring_tracks.where('mentor_id != mentee_id')
  end
end
