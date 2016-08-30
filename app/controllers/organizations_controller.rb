class OrganizationsController < ApplicationController
  before_action :set_organization

  def edit
    @organization
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
