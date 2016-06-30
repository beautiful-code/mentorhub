class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable,
    :omniauthable, :omniauth_providers => [:google_oauth2]

  has_many :mentoring_tracks, foreign_key: :mentee_id
  has_many :track_instances, foreign_key: :mentor_id

  validates :first_name, presence: true
  validates :last_name, presence: true

  def self.from_omniauth(access_token)
    data = access_token.info
    user = User.where(:email => data["email"]).first

    unless user
      user = User.create(first_name: data["first_name"],
                         last_name: data["last_name"],
                         email: data["email"],
                         password: Devise.friendly_token[0,20],
                         image: data["image"]
                        )
    end

    user
  end

  def name
    "#{first_name} #{last_name}"
  end

end
