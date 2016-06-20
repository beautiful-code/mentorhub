Rails.application.routes.draw do
  resources :tracks do
    resources :sections
  end

<<<<<<< HEAD
  resources :mentoring_tracks
=======
  resources :mentoring_tracks, :only=> [:new ,:create]
>>>>>>> 47b723ebdb6816c4f1d999ed01bb77c32696d082
  root :to => 'static_pages#view'

  devise_for :users,  :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  get 'users/auth/failure', to: redirect('/')
end
