crumb :root do
  link 'Home', root_path
end

crumb :track_templates do
  link 'All track_templates', track_templates_path
end

crumb :track_template do |track_template|
  link track_template.name, track_template_path(track_template)
  parent :track_templates
end

crumb :new_track_template do
  link 'Creating a track_template'
  parent :track_templates
end

crumb :new_section do |track_template|
  link 'Creating a section'
  parent :track_template, track_template
end

crumb :mentoring_tracks do
  link 'My Mentees Tracks', mentoring_tracks_path
  parent :root
end

crumb :add_mentoring_track do
  link 'Add a mentee track', new_mentoring_track_path
  parent :mentoring_tracks
end
