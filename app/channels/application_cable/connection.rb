module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      logger.add_tags 'ActionCable', current_user.name
    end

    private

    def find_verified_user
      # Update config/initializers/warden_hooks.rb to set the expires_at cookie
      # if verified_user && cookies.signed['user.expires_at'] > Time.now
      verified_user = User.find_by(id: cookies.signed[:user_id])

      verified_user ? verified_user : reject_unauthorized_connection
    end
  end
end
