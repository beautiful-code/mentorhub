Rails.application.routes.draw do
  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks',
    registrations: 'registrations'
  }

  resources :track_templates, except: [:edit] do
    member do
      get :section_templates
    end
  end

  resources :tracks, only: [] do
    resources :section_interactions, only: [:edit, :update] do
      resources :todos, only: [:new, :create, :update, :index]
    end
  end

  resources :mentoring_tracks, only: [:new, :create, :index, :show]

  get 'users/auth/failure', to: redirect('/')
  get 'board', to: 'board#index'

  root to: 'board#index'
end
