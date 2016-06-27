require 'rails_helper'

describe Todo, :type => :model do

  let(:todo) {FactoryGirl.create(:todo)}
  subject { todo }

  describe :validation_errors do
    it 'should not have an invalid state' do
      FactoryGirl.build(:todo, state: "todo_state").should_not be_valid
    end

    it 'should not have an empty content' do
      FactoryGirl.build(:todo, content: nil).should_not be_valid
    end

    it 'should not have an empty section_interaction_id' do
      FactoryGirl.build(:todo, section_interaction_id: nil).should_not be_valid
    end
  end

  describe :state do
    it "should have state set to 'incomplete' by default" do
      expect(todo.state).to eq("incomplete")
    end

    context :review_todo do
      it "should transition the state to 'to_be_reviewed' from 'incomplete' state" do
        expect(todo.review_todo).to eq(true)
        expect(todo.state).to eq("to_be_reviewed")
      end
    end

    context :incomplete_todo do
      it "should transition the state to 'incomplete' state from 'to_be_reviewed' state" do
        todo.state = "to_be_reviewed"
        expect(todo.incomplete_todo).to eq(true)
        expect(todo.state).to eq("incomplete")
      end
    end

    context :complete_todo do
      it "should transition the state to 'completed' state from 'to_be_reviewed' state" do
        todo.state = "to_be_reviewed"
        expect(todo.complete_todo).to eq(true)
        expect(todo.state).to eq("completed")
      end
    end

  end
end
