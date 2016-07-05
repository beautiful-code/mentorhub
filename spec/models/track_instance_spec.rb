require 'rails_helper'

describe TrackInstance, type: :model do
  let(:ti) { FactoryGirl.create(:track_instance) }
  subject { ti }

  describe :recent_incomplete_section_interactions do
    it 'should return the first section interaction if its state is new' do
      ret = []
      si = double('SectionInteraction')
      allow(si).to receive(:state).and_return('new')
      expect(si.state).to eq('new')
      ret << si

      expect(ret).to have_exactly(1).items
    end

    it 'should return first 2 section interactions if the state of the second one is new ' do
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

    it 'should return the first three section interactions if the state of the third one is new' do
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

    it 'should return the first three section interactions if the third and fourth section interaction states are new' do
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
