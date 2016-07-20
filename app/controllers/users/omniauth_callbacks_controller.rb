module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    def google_oauth2
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
      sign_in_and_redirect @user, event: :authentication
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
