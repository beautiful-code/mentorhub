require 'rails_helper'

describe TrackTemplate, type: :model do
  let(:track_template) { FactoryGirl.create(:track_template) }
  subject { track }

  describe :validation_errors do
    it 'should not be valid without a name' do
      FactoryGirl.build(:track_template, name: nil).should_not be_valid
    end

    it 'should not be valid without a description' do
      FactoryGirl.build(:track_template, desc: nil).should_not be_valid
    end

    it 'should not be valid without a description' do
      FactoryGirl.build(:track_template, desc: nil).should_not be_valid
    end
  end
end
