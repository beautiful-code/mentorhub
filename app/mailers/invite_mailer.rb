class InviteMailer < ApplicationMailer
  def send_invite(user, current_user)
    @user = user
    @current_user = current_user
    mail to: @user['primaryEmail'], subject: 'Invite Email'
  end
end
