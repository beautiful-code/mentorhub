class OrganizationsController < ApplicationController
  include ApplicationHelper
  before_action :authenticate_user!
  before_action :set_organization

  def edit
    @current_user = current_user
  end

  def invite_members
    @current_user = current_user
    token = current_user.token
    domain = current_user.email.split('@')[1]
    @contacts = get_contacts(token, domain)
    @users = @organization.users
  end

  def update
    if @organization.update(organization_params)
      render json: { msg: 'success',
                     organization: @organization }, status: 200
    end
  end

  def invite
    InviteMailer.send_invite(JSON.parse(invite_contact_params.to_json), current_user)
                .deliver_now
    render json: { msg: 'success' }, status: 200
  end

  private

  def set_organization
    @organization = current_user.organization
  end

  def organization_params
    params.fetch(:organization, {}).permit(:name, :email_domain)
  end

  def invite_contact_params
    params.fetch(:contact).permit!
  end
end
