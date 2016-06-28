Rails.application.routes.draw do
  resources :tracks, except: [:edit] do
    resources :sections, except: [:index, :edit, :new]
  end

  resources :mentoring_tracks, :only=> [:new ,:create, :index]
  root :to => 'static_pages#view'

  devise_for :users,  :controllers => { :omniauth_callbacks => "users/omniauth_callbacks",registrations: 'registrations'  }

  get 'users/auth/failure', to: redirect('/')
end
