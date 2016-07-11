class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    @user = User.from_omniauth(request.env['omniauth.auth'])

    if request.env['omniauth.auth'].info['email'].split('@')[1] == 'beautifulcode.in'
      if @user.persisted?
        flash[:notice] = I18n.t 'devise.omniauth_callbacks.success', kind: 'Google'
        sign_in_and_redirect @user, event: :authentication
      else
        session['devise.google_data'] = request.env['omniauth.auth']
        redirect_to new_user_registration_url
      end
    else
      flash[:danger] = 'Sorry, but you need to have a beautiful-code account to log in'
      redirect_to new_user_session_path
    end
  end
end
