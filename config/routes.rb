Rails.application.routes.draw do
  resources :tracks, except: [:edit] do
    resources :sections, except: [:index, :edit, :new]
  end

  root :to => 'board#index'
  resources :mentoring_tracks, only: [:new, :create, :index]
  resources :section_interactions, only: [:edit, :update]
  get "home/learning_tracks", to: "home#learning_tracks", as: :learning_tracks

  resources :todos, only: [:create]

  devise_for :users,  :controllers => { :omniauth_callbacks => "users/omniauth_callbacks",registrations: 'registrations'  }

  get 'users/auth/failure', to: redirect('/')

  get 'board', to: 'board#index'

  get 'track/:id/sections', to: "tracks#sections"
end
