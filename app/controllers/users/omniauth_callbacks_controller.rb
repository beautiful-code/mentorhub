module Users
  class OmniauthCallbacksController < Devise::OmniauthCallbacksController
    include OmniauthCallbacksHelper
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
        create_organization_and_track(@user, company_domain)
        sign_in @user, event: :authentication
        flash[:notice] = 'Successfully created your organization.'
        redirect_to edit_organization_path
      end
    end

    def redirect_with_flash
      flash[:danger] = 'Please Log In with your organization\'s Google Account.'
      redirect_to new_user_session_path
    end

    def create_organization_and_track(user, company_domain)
      ActiveRecord::Base.transaction do
        user.organization = Organization.where(
          email_domain: company_domain
        ).first_or_create(name: company_domain)
        track_template = user.organization.track_templates.first
        track_template.update_attribute(:user_id, user.id)

        guide_track = Track.create!(options_for_track(track_template, user))
        create_section_interactions(user, guide_track)
      end
    end

    def options_for_track(track_template, user)
      options = track_template.dup.attributes.except(
        'type', 'id', 'organization_id', 'user_id'
      )
      options.merge!(
        mentor_id: Organization.where(
          email_domain: user.email.split('@')[1]
        ).first.users.where('email LIKE ?', 'bot@%').first.id,
        image: track_template.image,
        mentee_id: user.id,
        track_template_id: track_template.id,
        deadline: Time.now + 2.days,
        type: track_template.type.gsub('Template', '')
      )
    end

    def create_section_interactions(user, track)
      track_template = user.organization.track_templates.first
      track_template.section_templates.each do |section|
        options = section.dup.attributes.except('id', 'track_template_id')
        options[:type] = "#{track.type.gsub('Track', '')}SectionInteraction"
        track.section_interactions.create!(options)
      end
    end
  end
end
