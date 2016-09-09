FactoryGirl.define do
  factory :organization, class: Organization do |o|
    o.id 1
    o.name 'beautifulcode'
    o.email_domain 'beautifulcode.in'
  end

  factory :user, class: User do |u|
    u.first_name 'Sashank'
    u.last_name 'challa'
    u.email 'sashank@beautifulcode.in'
    u.password 'password'
    u.token nil
    u.organization_id 1
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
    mentee_id 70
    mentor_id 10
  end
end
