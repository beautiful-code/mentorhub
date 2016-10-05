class Organization < ApplicationRecord
  after_create :create_bot
  has_many :users, dependent: :destroy
  has_many :track_templates, dependent: :destroy
  validates :name, presence: true
  validates :email_domain, presence: true

  def find_bot_id
    self.users.find_by_email("bot@#{self.email_domain}").id
  end

  private

  def create_bot
    self.users.create(
      email: 'bot@' + self.email_domain,
      first_name: self.email_domain.split('.')[0],
      last_name: 'Bot',
      password: 'password',
      password_confirmation: 'password'
    )

    options = YAML.load(File.open('config/track_data.yml'))
    options['track_data']['image'] = Rack::Multipart::UploadedFile.new(
      Rails.root.join('app/assets/images/default_track_logo.png')
    )

    track_template = self.track_templates.create!(options['track_data'])
    track_template.section_templates.create!(options['sections_data'])
  end
end
