class BoardController < ApplicationController
  before_action :authenticate_user!

  def index
    ret = {
        mentoring_tracks: {},
        learning_tracks: {}
    }

    current_user.mentees.each do |mentee|
      ret[:mentoring_tracks][mentee.id] = {
          name: mentee.name,
          avatar_url: mentee.image,
          learning_tracks: mentee.learning_tracks
      }
    end

    current_user.learning_tracks.each do |l_track|
      ret[:learning_tracks][l_track.name] = l_track.as_json
      ret[:learning_tracks][l_track.name]["mentor"] = {
          name: l_track.mentor.name,
          id: l_track.mentor_id,
          avatar_url: l_track.mentor.image
      }
    end

    @board_data = ret
  end
end
