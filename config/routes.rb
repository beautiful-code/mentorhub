Rails.application.routes.draw do
  resources :tracks do
    resources :sections
  end

  resources :mentoring_tracks, :only=> [:new ,:create, :index]
  root :to => 'static_pages#view'

  devise_for :users,  :controllers => { :omniauth_callbacks => "users/omniauth_callbacks",registrations: 'registrations'  }

  get 'users/auth/failure', to: redirect('/')
end
