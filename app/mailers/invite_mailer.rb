class InviteMailer < ApplicationMailer
  def send_invite(user, current_user)
    @user = user
    @current_user = current_user
    mail to: @user['primaryEmail'], subject: 'Invite Email'
  end

  def send_request_to_mentor(mentee, mentor, track)
    @mentor = mentor
    @mentee = mentee
    @track = track
    mail to: @mentor.email, subject: 'Request Mentor'
  end
end
