class OrganizationsController < ApplicationController
  before_action :set_organization

  def edit
    if session[:token]
      token = session[:token]
      contacts_json = JSON.parse(open('https://www.google.com/m8/feeds/contacts/default/full?access_token=' + token + '&alt=json').read)
      @contacts = contacts_json['feed']['entry'].collect | p | {
        name: p['title']['$t'],
        email: p['gd$email'][0]['address']
      }
    end
    @current_user = current_user
  end

  def update
    if @organization.update(organization_params)
      render json: { msg: 'success',
                     organization: @organization }, status: 200
    end
  end

  private

  def set_organization
    @organization = current_user.organization
  end

  def organization_params
    params.fetch(:organization, {}).permit(:name, :email_domain)
  end
end
