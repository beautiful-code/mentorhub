class RegistrationsController < Devise::RegistrationsController

  private

  def sign_up_params
    byebug
    params.require(:user).permit(:first_name,:last_name, :email, :password, :password_confirmation)
  end
end
