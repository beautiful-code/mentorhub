=begin
require 'spec_helper'

describe "Users::OmniauthCallbacksController", type: :controller do
  before do
    # request.env['omniauth.auth'] = OmniAuth.config.mock_auth[:google_oauth2]
  end

  describe "#google_oauth2", :type => :feature do
    #  include Capybara::DSL
    # before type: :request do
    #  get :user_auth_google_oauth2_callback_path
    # end

    it 'should show sign in page' do
      have_link 'Sign in'
    end

   #  it {should have_link('Sign in with Google', href: 'users_auth_google_oauth2_callback_path')}

    it 'should login a user', :root_path do
    #  include Capybara::DSL
      #get '/'
      #expect(page).to have_content "Sign in with google"
      # {:get =>'/users/auth/google_oauth2/callback'}.to respond_to(:routable)
      get 'users/auth/google_oauth2/callback'
      #  expect(page).to have_content 'Log out'
    end

    it 'should redirect the user to the callback url', :users_auth_google_oauth2_callback_path do
      have_link 'Log out'
    end

    context 'on failure' do
      it "should redirect to root",  :users_auth_failure_path do
        # get "/auth/failure"
        # expect(page).to redirect_to root_path
      end
    end

  end
end

describe 'destroying session' do
  it 'should destroy session', :destroy_user_session_path do
    have_link 'Log out'
  end

  it 'should redirect to root page', :type => :request do
      have_current_path(root_path)
  end
end

#def stub_env_for_omniauth
 # request.env["devise.mapping"] = Devise.mappings[:user]
 # Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[:google_oauth2]
#end
=end
