require 'rails_helper'

RSpec.describe Users::OmniauthCallbacksController, type: :controller do
  before do
    request.env['omniauth.auth'] = OmniAuth.config.mock_auth[:google_oauth2]
  end

  describe "#google_oauth2" do

    it 'should show sign in page' do
      have_link 'Log in with Google'
    end

    it 'should redirect the user to the callback url', :type => :request do
      # post :google_oauth2, provider: :google_oauth2
      # response.should redirect_to user_google_oauth2_omniauth_callback_path
      expect(post('/users/auth/google_oauth2/callback')).should redirect_to root_path
      have_link 'Log out'
    end

    context 'on failure' do
      it "should redirect to root", :type => :request do
        # get "users/auth/failure"
        # expect(page).to redirect_to root_path
        expect(get('/users/auth/failure')).should redirect_to root_path
      end
    end

  end

  describe 'destroying session' do
    it 'should destroy session and redirect to root', :type => :request do
      have_link 'Log out'
      #delete '/users/sign_out'
      expect(delete("/users/sign_out")).to redirect_to root_path
      have_link 'Log in with Google'
    end
  end
end
