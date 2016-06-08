# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

=begin
["Sashank","Rushil"].each do |user_name|
  user = User.create(name: user_name)
  mentoring_track = user.mentoring_tracks.create(name: "Mentoring Track for #{user_name}")
  track = mentoring_track.track_instances.create(name: "Mentoring Track for #{user_name}")
  5.times {|t| track.section_interactions.create(title: "Section #{t + 1}") }
end
=end

["Rails","Ruby","Html"].each do |track|
  track = Track.create(name: track, track_type: "Web")
  5.times {|t| track.sections.create(title: "Section #{t+1}")}
end
