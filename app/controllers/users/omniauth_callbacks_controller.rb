module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def google_oauth2
      session[:token] = request.env['omniauth.auth']['credentials']['token']
      @user = User.from_omniauth(request.env['omniauth.auth'])

      if @user.email.split('@')[1] == 'beautifulcode.in'
        if @user.persisted?
          signing_in
        else
          session_store
        end
      else
        redirect_with_flash
      end
    end

    def signing_in
      flash[:notice] =
        I18n.t 'devise.omniauth_callbacks.success', kind: 'Google'
      company_domain = @user.email.split(/[@,.]/)[1]
      if company_domain != 'gmail'
        if Organization.where(email_domain: company_domain).first
          sign_in_and_redirect @user, event: :authentication
        else
          @user.organization = Organization.create(email_domain: company_domain, name: company_domain)
          sign_in @user, event: :authentication
          redirect_to edit_organization_path
        end
      end
    end

    def session_store
      session['devise.google_data'] = request.env['omniauth.auth']
      redirect_to new_user_registration_url
    end

    def redirect_with_flash
      flash[:danger] = 'Log in with beautiful-code account'
      redirect_to new_user_session_path
    end
  end
end
