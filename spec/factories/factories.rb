
FactoryGirl.define do
  factory :user, :class => User do |u|
    u.email "user@example.com"
    u.password "password"
  end
end
