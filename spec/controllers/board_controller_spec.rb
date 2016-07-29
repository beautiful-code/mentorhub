require 'rails_helper'

RSpec.describe BoardController, type: :controller do
  context 'user is a mentor' do
    it "should show 'Your Menteee Exercises'" do
      user = double('user')
      allow(request.env['warden']).to receive(:authenticate!).and_return(user)
      allow(controller).to receive(:current_user).and_return(user)

      allow(user).to receive(:mentor).and_return(true)
      expect(user.mentor).to eq(true)
    end
  end

  context 'user is a mentee' do
    it "should show 'Your Exercises'" do
      user = double('user')
      allow(request.env['warden']).to receive(:authenticate!).and_return(user)
      allow(controller).to receive(:current_user).and_return(user)

      allow(user).to receive(:mentor).and_return(false)
      expect(user.mentor).to eq(false)
    end
  end
end
