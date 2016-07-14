FactoryGirl.define do
  factory :user, class: User do |u|
    u.first_name 'robert'
    u.last_name 'junior'
    u.email 'user@example.com'
    u.password 'password'
  end

  factory :section_interaction, class: SectionInteraction do
    title 'SI Title'
    content 'SI Content'
    state 'new'
    type 'ExerciseSectionInteraction'
    track
  end

  factory :todo, class: Todo do
    content 'Todo Content'
    section_interaction
  end

  factory :section_template, class: SectionTemplate do
    title 'Section Title'
    content 'Section Content'
    type 'ExerciseSectionTemplate'
    track_template
  end

  factory :track_template, class: TrackTemplate do
    name 'Track Name'
    desc 'Track Description'
    type 'ExerciseTrackTemplate'
  end

  factory :track, class: Track do
    name 'HTML'
    desc 'Track Description'
    type 'ExerciseTrack'
  end
end
