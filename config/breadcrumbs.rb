crumb :root do
  link "Home", root_path
end

crumb :tracks do
  link "All tracks", tracks_path
end

crumb :track do |track|
  link track.name, track_sections_path(track)
  parent :tracks
end

crumb :new_track do |track|
  link "Creating a track"
  parent :tracks
end

crumb :new_section do |track|
  link "Creating a section"
  parent :track, track
end

crumb :mentoring_tracks do |mentoring_track|
  link "My Mentees Tracks", mentoring_tracks_path
  parent :root
end

crumb :add_mentoring_track do |add_mtrack|
  link "Add a mentee track",new_mentoring_track_path
  parent :mentoring_tracks
end
