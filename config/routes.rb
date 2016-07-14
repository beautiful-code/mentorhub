Rails.application.routes.draw do
  resources :tracks, except: [:edit] do
    resources :sections, except: [:index, :edit, :new]
  end

  resources :section_interactions, only: [:new, :create, :edit, :update] do
     resources :todos, only: [:new, :create, :update, :index]
  end
  root :to => 'board#index'
  resources :mentoring_tracks, only: [:new, :create, :index, :show]

  get "learning_tracks", to: "home#learning_tracks"

  devise_for :users,  :controllers => { :omniauth_callbacks => "users/omniauth_callbacks",registrations: 'registrations'  }

  get 'users/auth/failure', to: redirect('/')

  get 'board', to: 'board#index'

  get 'track/:id/sections', to: "tracks#sections"

  get 'mentoring_tracks/section_interactions/:id/todos', to: "mentoring_tracks#get_todos"
end
