require 'rails_helper'

describe 'User', type: :model do
  let(:user) { FactoryGirl.create(:user) }
  subject { user }

  it { should be_valid }
  it { should respond_to(:first_name) }
  it { should respond_to(:last_name) }
  it { should respond_to(:email) }
  it { should respond_to(:password) }
  it { should respond_to(:password_confirmation) }

  it 'is invalid without a first name' do
    FactoryGirl.build(:user, first_name: nil).should_not be_valid
  end

  it 'is invalid without a last_name' do
    FactoryGirl.build(:user, last_name: nil).should_not be_valid
  end

  it 'is invalid without an email' do
    FactoryGirl.build(:user, email: nil).should_not be_valid
  end

  it 'is invalid without a password' do
    FactoryGirl.build(:user, password: nil).should_not be_valid
  end

  describe 'invalid email address' do
    describe "no '@' symbol" do
      before { user.email = 'somethingat_rategmail.com' }
      it { should_not be_valid }
    end

    describe 'no domain name' do
      before { user.email = 'something@' }
      it { should_not be_valid }
    end
  end

  describe 'valid email address' do
    describe 'all capital letters' do
      before { user.email = 'SOMETING@BEAUTIFULCODE.IN' }
      it { should be_valid }
    end

    describe 'camel case letters' do
      before { user.email = 'SoMeThInG@BEAUtifulCODE.IN' }
      it { should be_valid }
    end

    describe 'all small letters' do
      before { user.email = 'something@beautifulcode.in' }
      it { should be_valid }
    end
  end

  describe 'password and confirm_password do not match' do
    before { user.password = 'abcdefg' }
    it { should_not be_valid }
  end

  describe 'password length is less then 6' do
    before { user.password = user.password_confirmation = 'a' }
    it { should_not be_valid }
  end
end
