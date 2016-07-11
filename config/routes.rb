Rails.application.routes.draw do
  resources :tracks, except: [:edit] do
    resources :sections, except: [:index, :edit, :new]
  end

  resources :section_interactions, only: [:edit, :update] do
     resources :todos, only: [:new, :create, :update, :index]
  end
  root :to => 'board#index'
  resources :mentoring_tracks, only: [:new, :create, :index]

  get "learning_tracks", to: "home#learning_tracks"

  devise_for :users,  :controllers => { :omniauth_callbacks => "users/omniauth_callbacks",registrations: 'registrations'  }

  get 'users/auth/failure', to: redirect('/')

  get 'board', to: 'board#index'
end
