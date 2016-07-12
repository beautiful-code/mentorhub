require 'rails_helper'

describe SectionTemplate, type: :model do
  let(:section_template) { FactoryGirl.create(:section_template) }
  subject { section_template }

  describe :validation_errors do
    it 'should not be valid without a title' do
      FactoryGirl.build(:section_template, title: nil).should_not be_valid
    end

    it 'should not be valid without content' do
      FactoryGirl.build(:section_template, content: nil).should_not be_valid
    end

    context 'validating track_template for the seciton_template' do
      it 'should not be valid without a track_template_id' do
        FactoryGirl.build(:section_template, track_template_id: nil).should_not be_valid
      end

      it 'should be an integer' do
        track_template_id.should_be_an(Integer)
      end
    end
    it 'should not be valid without a type' do
      FactoryGirl.build(:section_template, type: nil).should_not be_valid
    end
  end
end
