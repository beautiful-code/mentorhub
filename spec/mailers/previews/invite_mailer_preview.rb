# Preview all emails at http://localhost:3000/rails/mailers/invite_mailer
class InviteMailerPreview < ActionMailer::Preview
  def home
    InviteMailer.send_invite(User.last).deliver_now
  end
end
