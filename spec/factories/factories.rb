FactoryGirl.define do
  factory :user, :class => User do |u|
    u.first_name "robert"
    u.last_name "junior"
    u.email "user@example.com"
    u.password "password"
  end

  factory :section_interaction, :class => SectionInteraction do
    title "SI Title"
    content "SI Content"
    state "new"
  end

  factory :todo, :class => Todo do
    content "Todo Content"
    section_interaction_id 1
  end

  factory :section, :class => Section do
    title "Section Title"
    content "Section Content"
  end

   factory :track, :class => Track do
    name "Track Name"
    desc "Track Description"
  end
end
