require 'rails_helper'

describe Section, type: :model do
  let(:section) { FactoryGirl.create(:section) }
  subject { section }

  describe :validation_errors do
    it 'should not be valid without a title' do
      FactoryGirl.build(:section, title: nil).should_not be_valid
    end

    it 'should not be valid without content' do
      FactoryGirl.build(:section, content: nil).should_not be_valid
    end
  end
end
