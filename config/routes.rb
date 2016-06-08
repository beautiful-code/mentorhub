Rails.application.routes.draw do
  root 'static_pages#home'

  resources :tracks do
    resources :sections
  end

end
