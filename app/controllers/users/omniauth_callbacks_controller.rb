module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def google_oauth2
      @user = User.from_omniauth(request.env['omniauth.auth'])

      # Update the token
      token = request.env['omniauth.auth']['credentials']['token']
      @user.update_attribute(:token, token)

      sign_in_user
    end

    private

    def sign_in_user
      company_domain = @user.email.split('@').last
      redirect_with_flash if company_domain == 'gmail.com'
      if @user.organization.present?
        flash[:notice] =
          I18n.t 'devise.omniauth_callbacks.success', kind: 'Google'
        sign_in_and_redirect @user, event: :authentication
      else
        @user.organization = Organization.create(
          email_domain: company_domain,
          name: company_domain
        )
        sign_in @user, event: :authentication
        flash[:notice] = 'Successfully created your organization.'
        redirect_to edit_organization_path
      end
    end

    def redirect_with_flash
      flash[:danger] = 'Please Log In with your organization\'s Google Account.'
      redirect_to new_user_session_path
    end
  end
end
