Rails.application.routes.draw do
  # Serve websocket cable requests in-process
  mount ActionCable.server => '/cable'

  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks',
    registrations: 'registrations'
  }

  resources :track_templates, except: [:edit] do
    resources :section_templates
  end

  resources :tracks, only: [] do
    resources :section_interactions, only: [:create, :edit, :update] do
      resources :todos
    end
  end

  resources :mentoring_tracks, only: [:new, :create, :index, :show]
  resources :organizations, only: [:update]

  get 'users/auth/failure', to: redirect('/')
  get 'board', to: 'board#index'
  get '/user/:mentee_id', to: 'mentoring_tracks#get_user_data'

  get '/organization', to: 'organizations#edit', as: 'edit_organization'

  root to: 'board#index'
end
