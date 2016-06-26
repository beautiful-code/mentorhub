Rails.application.routes.draw do
  resources :tracks do
    resources :sections
  end

  resources :mentoring_tracks, :only=> [:new ,:create, :index]
  root :to => 'board#index'

  devise_for :users,  :controllers => { :omniauth_callbacks => "users/omniauth_callbacks",registrations: 'registrations'  }

  get 'users/auth/failure', to: redirect('/')

  get 'board', to: 'board#index'
end
