require 'rails_helper'

RSpec.describe TodosController, type: :controller do
  before(:each) do
    user = double('user')
    allow(request.env['warden']).to receive(:authenticate!).and_return(user)
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'GET #index' do
    before(:each) do
      @section_interaction = FactoryGirl.create :section_interaction
      4.times { FactoryGirl.create :todo, section_interaction: @section_interaction }
      get :index, section_interaction_id: @section_interaction.id
    end

    it 'returns 4 records from the database' do
      todos_response = JSON.parse(response.body, symbolize_names: true)
      expect(todos_response[:todos].size).to eq(4)
    end

    it 'has a 200 status code' do
      expect(response.status).to eq(200)
    end
  end

  describe 'POST #create' do
    context 'when is successfully created' do
      before(:each) do
        section_interaction = FactoryGirl.create :section_interaction
        @todo_attributes = FactoryGirl.attributes_for :todo
        post :create, section_interaction_id: section_interaction.id, todo: @todo_attributes
      end

      it 'renders the json representation for the product record just created' do
        todo_response = JSON.parse(response.body, symbolize_names: true)
        expect(todo_response[:todo][:content]).to eq(@todo_attributes[:content])
      end

      it 'has a 201 status code' do
        expect(response.status).to eq(201)
      end
    end

    context 'when is not created' do
      before(:each) do
        section_interaction = FactoryGirl.create :section_interaction
        @invalid_todo_attributes = { content: '' }
        post :create, section_interaction_id: section_interaction.id, todo: @invalid_todo_attributes
      end

      it 'renders an errors json' do
        todo_response = JSON.parse(response.body, symbolize_names: true)
        expect(todo_response).to have_key(:errors)
      end

      it 'renders the json errors on why the user could not be created' do
        todo_response = JSON.parse(response.body, symbolize_names: true)
        expect(todo_response[:errors][:content]).to include "can't be blank"
      end

      it 'has a 422 status code' do
        expect(response.status).to eq(422)
      end
    end
  end

  describe 'PUT/PATCH #update' do
    before(:each) do
      @section_interaction = FactoryGirl.create(:section_interaction)
      @todo = FactoryGirl.create(:todo, section_interaction: @section_interaction)
    end

    context 'when is successfully updated' do
      before(:each) do
        patch :update, section_interaction_id: @section_interaction.id, id: @todo.id, todo: { content: 'Todo content' }
      end

      it 'renders the json representation for the updated section_interaction' do
        todo_response = JSON.parse(response.body, symbolize_names: true)
        expect(todo_response[:todo][:content]).to eq('Todo content')
      end

      it 'has a 200 status code' do
        expect(response.status).to eq(200)
      end
    end

    context 'when is not updated' do
      before(:each) do
        patch :update, section_interaction_id: @section_interaction.id, id: @todo.id, todo: { section_interaction_id: '' }
      end

      it 'renders an errors json' do
        todo_response = JSON.parse(response.body, symbolize_names: true)
        expect(todo_response).to have_key(:errors)
      end

      it 'renders the json errors on why the section_interaction could not be created' do
        todo_response = JSON.parse(response.body, symbolize_names: true)
        expect(todo_response[:errors][:section_interaction_id]).to include "can't be blank"
      end

      it 'has a 422 status code' do
        expect(response.status).to eq(422)
      end
    end
  end
end
