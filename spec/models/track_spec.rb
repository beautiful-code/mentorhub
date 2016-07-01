require 'rails_helper'

describe Track, :type => :model do

  let(:track) { FactoryGirl.create(:track) }
  subject{ track }

  describe :validation_errors do
    it "should not be valid without a name" do
      FactoryGirl.build(:track, name: nil).should_not be_valid
    end

    it "should not be valid without a description" do
      FactoryGirl.build(:track, desc: nil).should_not be_valid
    end
  end

end
