require 'spec_helper'

describe 'User', type: :model do
  let(:user) { FactoryGirl.create(:user) }
  #  before(:each) do
  #@user.save
  # end

  it 'is valid' do
    expect(build(:user)).to be_valid
  end

  context "validation" do
    it { should validate_presence_of :email}
    it { should validate_presence_of :password}

    it 'is invalid without an email' do 
      FactoryGirl.build(:user, email: nil).should_not be_valid
    end

    it 'is invalid without a password' do
      FactoryGirl.build(:user, password: nil).should_not be_valid
    end
  end

  context "is validated for the uniqueness" do 
    it  { should validate_uniqueness_of(:email)}
    it { should validate_uniqueness_of(:password)}
  end
end
