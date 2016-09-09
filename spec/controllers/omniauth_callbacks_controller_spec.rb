require 'rails_helper'

RSpec.describe Users::OmniauthCallbacksController, type: :controller do
  before do
    request.env['omniauth.auth'] = OmniAuth.config.mock_auth[:google_oauth2]
  end

  describe '#google_oauth2' do
    it 'should show sign in page' do
      have_link 'Log in with Google'
    end

    it 'should redirect the user to the edit_organization_url
    while creating the organisation', type: :request do
      url = '/users/auth/google_oauth2/callback'
      expect(post(url)).should redirect_to edit_organization_path
      have_link 'Log out'
    end

    it 'should redirect the user to the root_url if the user
    is part of an existing organisation', type: :request do
      @user = FactoryGirl.create(:user)
      @user.organization = FactoryGirl.create(:organization)
      url = '/users/auth/google_oauth2/callback'
      expect(post(url)).should redirect_to root_path
      have_link 'Log out'
    end

    context 'on failure' do
      it 'should redirect to root', type: :request do
        # get "users/auth/failure"
        # expect(page).to redirect_to root_path
        expect(get('/users/auth/failure')).should redirect_to root_path
      end
    end
  end

  describe 'destroying session' do
    it 'should destroy session and redirect to root', type: :request do
      have_link 'Log out'
      # delete '/users/sign_out'
      expect(delete('/users/sign_out')).to redirect_to root_path
      have_link 'Log in with Google'
    end
  end
end
