Rails.application.routes.draw do
  resources :tracks do
    resources :sections
  end

  root :to => 'static_pages#view'

  devise_for :users,  :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  get 'users/auth/failure', to: redirect('/')
end
