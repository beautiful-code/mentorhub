require 'rails_helper'

describe SectionInteraction, type: :model do
  let(:si) { FactoryGirl.create(:section_interaction) }
  subject { si }

  describe :validation_errors do
    it 'should not have an invalid state' do
      FactoryGirl.build(:section_interaction, state: 'hello').should_not be_valid
    end

    it 'should not have an empty title' do
      FactoryGirl.build(:section_interaction, title: nil).should_not be_valid
    end

    it 'should not have an empty content' do
      FactoryGirl.build(:section_interaction, content: nil).should_not be_valid
    end
  end

  describe :pending_todos? do
    it 'should return true if the todos state is incomplete' do
      todo = double('Todo')
      allow(todo).to receive(:state).and_return('incomplete')
      expect(todo.state).to eq('incomplete')

      allow(si).to receive(:pending_todos?).and_return(true)
      expect(si.pending_todos?).to eq(true)
    end

    it 'should return true if the todos state is to_be_reviewed' do
      todo = double('Todo')
      allow(todo).to receive(:state).and_return('to_be_reviewed')
      expect(todo.state).to eq('to_be_reviewed')

      allow(si).to receive(:pending_todos?).and_return(true)
      expect(si.pending_todos?).to eq(true)
    end

    it 'should return false if the todos state is complete' do
      todo = double('Todo')
      allow(todo).to receive(:state).and_return('complete')
      expect(todo.state).to eq('complete')

      allow(si).to receive(:pending_todos?).and_return(false)
      expect(si.pending_todos?).to eq(false)
    end
  end

  describe :state do
    it "should have state set to 'new' by default" do
      expect(si.state).to eq('new')
    end

    context :submit_section do
      it "should transition the state to 'section_submitted' from 'new' on event submit_section" do
        expect(si.submit_section).to eq(true)
        expect(si.state).to eq('section_submitted')
      end
    end

    context :pending_review do
      it "should transition the state to 'review_pending' from 'section_submitted' state on event pending_review to indicate pending review" do
        si.state = 'section_submitted'
        expect(si.pending_review).to eq(true)
        expect(si.state).to eq('review_pending')
      end
    end

    context :pending_tasks do
      it "should transition the state to 'pending_tasks' from 'review_pending' state on event pending_tasks to indicate that the mentor assigned tasks to the mentee" do
        si.state = 'review_pending'
        expect(si.pending_tasks).to eq(true)
        expect(si.state).to eq('tasks_pending')
      end
    end

    context :complete_section do
      it 'should return false to indicate that there are pending tasks before completing the section' do
        si.state = 'tasks_pending'
        allow(si).to receive(:pending_todos?).and_return(true)
        expect(si.pending_todos?).to eq(true)
        expect(si.complete_section).to eq(false)
      end

      it "should transition the state to 'section_completed' from 'review_pending' state on event complete_section to indicate that the section is completed" do
        si.state = 'review_pending'
        expect(si.complete_section).to eq(true)
        expect(si.state).to eq('section_completed')
      end
    end
  end
end
