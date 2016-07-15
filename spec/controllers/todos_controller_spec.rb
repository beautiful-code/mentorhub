require 'rails_helper'

RSpec.describe TodosController, type: :controller do
  before(:each) do
    user = double('user')
    allow(request.env['warden']).to receive(:authenticate!).and_return(user)
    allow(controller).to receive(:current_user).and_return(user)
  end

  describe 'GET #index' do
    before(:each) do
      @track = FactoryGirl.create :track
      @section_interaction = FactoryGirl.create(
        :section_interaction,
        track: @track
      )

      4.times do
        FactoryGirl.create :todo, section_interaction: @section_interaction
      end

      get :index, track_id: @track.id,
        section_interaction_id: @section_interaction.id
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
        track = FactoryGirl.create :track
        section_interaction = FactoryGirl.create(
          :section_interaction,
          track: track
        )
        @todo_attributes = FactoryGirl.attributes_for :todo
        post(
          :create,
          track_id: track.id,
          section_interaction_id: section_interaction.id,
          todo: @todo_attributes
        )
      end

      it 'renders the json representation for the
      product record just created' do
        todos_response = JSON.parse(response.body, symbolize_names: true)
        expect(todos_response[:todo][:content])
          .to eq(@todo_attributes[:content])
      end

      it 'has a 201 status code' do
        expect(response.status).to eq(201)
      end
    end

    context 'when is not created' do
      before(:each) do
        track = FactoryGirl.create :track
        section_interaction = FactoryGirl.create(
          :section_interaction,
          track: track
        )
        @invalid_todo_attributes = { content: '' }
        post :create, section_interaction_id: section_interaction.id,
          todo: @invalid_todo_attributes, track_id: track.id
      end

      it 'renders an errors json' do
        todos_response = JSON.parse(response.body, symbolize_names: true)
        expect(todos_response).to have_key(:errors)
      end

      it 'renders the json errors on why the user could not be created' do
        todos_response = JSON.parse(response.body, symbolize_names: true)
        expect(todos_response[:errors][:content]).to include "can't be blank"
      end

      it 'has a 422 status code' do
        expect(response.status).to eq(422)
      end
    end
  end

  describe 'PUT/PATCH #update' do
    context 'when is successfully updated' do
      before(:each) do
        track = FactoryGirl.create :track
        section_interaction = FactoryGirl.create(
          :section_interaction,
          track: track
        )
        @todo_attributes = FactoryGirl.create(
          :todo,
          section_interaction: section_interaction
        )
        patch :update, section_interaction_id: section_interaction.id,
          track_id: track.id, todo: { content: 'Todo' }, id: @todo_attributes.id
      end

      it 'renders the json representation for
      the updated section_interaction' do
        todos_response = JSON.parse(response.body, symbolize_names: true)
        expect(todos_response[:todo][:content]).to eq('Todo')
      end

      it 'has a 200 status code' do
        expect(response.status).to eq(200)
      end
    end

    context 'when is not updated' do
      before(:each) do
        track = FactoryGirl.create :track
        section_interaction = FactoryGirl.create(
          :section_interaction,
          track: track
        )
        @invalid_todo_attributes = FactoryGirl.create(
          :todo,
          section_interaction: section_interaction
        )
        patch :update, section_interaction_id: section_interaction.id,
          track_id: track.id, todo: { content: '' },
          id: @invalid_todo_attributes.id
      end

      it 'renders an errors json' do
        todos_response = JSON.parse(response.body, symbolize_names: true)
        expect(todos_response).to have_key(:errors)
      end

      it 'renders the json errors on why the
      section_interaction could not be created' do
        todos_response = JSON.parse(response.body, symbolize_names: true)
        expect(todos_response[:errors][:content]).to include
        "can't be blank"
      end

      it 'has a 422 status code' do
        expect(response.status).to eq(422)
      end
    end
  end
end
