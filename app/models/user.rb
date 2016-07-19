class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise(
    :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable,
    :omniauthable, omniauth_providers: [:google_oauth2]
  )

  has_many :mentoring_tracks, foreign_key: :mentor_id, class_name: 'Track'
  has_many :learning_tracks, foreign_key: :mentee_id, class_name: 'Track'

  validates :first_name, presence: true
  validates :last_name, presence: true

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
    mentoring_tracks.collect {|m_track| m_track.mentee }
  end

  def avatar_url
    image ||= gravatar_url
  end

  def gravatar_url
    gravatar_id = Digest::MD5::hexdigest(self.email.downcase)
    "https://secure.gravatar.com/avatar/#{gravatar_id}"
  end
end
