crumb :root do
  link 'Home', root_path
end

crumb :tracks do
  link 'All tracks', tracks_path
end

crumb :track do |track|
  link track.name, track_sections_path(track)
  parent :tracks
end

crumb :new_track do
  link 'Creating a track'
  parent :tracks
end

crumb :new_section do |track|
  link 'Creating a section'
  parent :track, track
end

crumb :mentoring_tracks do
  link 'My Mentees Tracks', mentoring_tracks_path
  parent :root
end

crumb :add_mentoring_track do
  link 'Add a mentee track', new_mentoring_track_path
  parent :mentoring_tracks
end
