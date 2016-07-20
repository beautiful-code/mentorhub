require 'rails_helper'

describe Track, type: :model do
  let(:t) { FactoryGirl.create(:track) }
  subject { t }

  describe ':validation_errors' do
    it 'should be invalid without name' do
      FactoryGirl.build(:track, name: nil).should_not be_valid
    end

    it 'should be invalid without desc' do
      FactoryGirl.build(:track, desc: nil).should_not be_valid
    end
    it 'should be invalid without type' do
      FactoryGirl.build(:track, type: nil).should_not be_valid
    end
  end

  describe :recent_incomplete_section_interactions do
    context 'user is mentor' do
      it 'should not return any si if the first si itself is new' do
        ret = []
        si = double('SectionInteraction')
        allow(si).to receive(:state).and_return('new')
        expect(si.state).to eq('new')

        expect(ret).to have_exactly(0).items
      end

      it 'should return first si if the state of the second si is new' do
        ret = []

        si1 = double('SectionInteraction')
        allow(si1).to receive(:state).and_return('tasks_pending')
        expect(si1.state).to eq('tasks_pending')
        ret << si1

        si2 = double('SectionInteraction')
        allow(si2).to receive(:state).and_return('new')
        expect(si2.state).to eq('new')

        expect(ret).to have_exactly(1).items
      end

      it "should return the first two si's if third si state is new" do
        ret = []

        si1 = double('SectionInteraction')
        allow(si1).to receive(:state).and_return('tasks_pending')
        expect(si1.state).to eq('tasks_pending')
        ret << si1

        si2 = double('SectionInteraction')
        allow(si2).to receive(:state).and_return('review_pending')
        expect(si2.state).to eq('review_pending')
        ret << si2

        si3 = double('SectionInteraction')
        allow(si3).to receive(:state).and_return('new')
        expect(si3.state).to eq('new')

        expect(ret).to have_exactly(2).items
      end

      it "should return the first two si's if 3rd and 4th si states are new" do
        ret = []

        si1 = double('SectionInteraction')
        allow(si1).to receive(:state).and_return('tasks_pending')
        expect(si1.state).to eq('tasks_pending')
        ret << si1

        si2 = double('SectionInteraction')
        allow(si2).to receive(:state).and_return('review_pending')
        expect(si2.state).to eq('review_pending')
        ret << si2

        si3 = double('SectionInteraction')
        allow(si3).to receive(:state).and_return('new')
        expect(si3.state).to eq('new')

        si4 = double('SectionInteraction')
        allow(si4).to receive(:state).and_return('new')
        expect(si4.state).to eq('new')

        expect(ret).to have_exactly(2).items
      end
    end

    context 'user is mentee' do
      it 'should return the first section interaction if its state is new' do
        ret = []
        si = double('SectionInteraction')
        allow(si).to receive(:state).and_return('new')
        expect(si.state).to eq('new')
        ret << si

        expect(ret).to have_exactly(1).items
      end

      it 'should return first 2 si if the state of the second si is new' do
        ret = []

        si1 = double('SectionInteraction')
        allow(si1).to receive(:state).and_return('tasks_pending')
        expect(si1.state).to eq('tasks_pending')
        ret << si1

        si2 = double('SectionInteraction')
        allow(si2).to receive(:state).and_return('new')
        expect(si2.state).to eq('new')
        ret << si2

        expect(ret).to have_exactly(2).items
      end

      it "should return the first three si's if third si state is new" do
        ret = []

        si1 = double('SectionInteraction')
        allow(si1).to receive(:state).and_return('tasks_pending')
        expect(si1.state).to eq('tasks_pending')
        ret << si1

        si2 = double('SectionInteraction')
        allow(si2).to receive(:state).and_return('review_pending')
        expect(si2.state).to eq('review_pending')
        ret << si2

        si3 = double('SectionInteraction')
        allow(si3).to receive(:state).and_return('new')
        expect(si3.state).to eq('new')
        ret << si3

        expect(ret).to have_exactly(3).items
      end

      it "should return the first three si's
if 3rd and 4th si states are new" do
        ret = []

        si1 = double('SectionInteraction')
        allow(si1).to receive(:state).and_return('tasks_pending')
        expect(si1.state).to eq('tasks_pending')
        ret << si1

        si2 = double('SectionInteraction')
        allow(si2).to receive(:state).and_return('review_pending')
        expect(si2.state).to eq('review_pending')
        ret << si2

        si3 = double('SectionInteraction')
        allow(si3).to receive(:state).and_return('new')
        expect(si3.state).to eq('new')
        ret << si3

        si4 = double('SectionInteraction')
        allow(si4).to receive(:state).and_return('new')
        expect(si4.state).to eq('new')

        expect(ret).to have_exactly(3).items
      end
    end
  end
end
