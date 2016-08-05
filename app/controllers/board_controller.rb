class BoardController < ApplicationController
  before_action :authenticate_user!

  def index
    @board_data = {
      mentoring_tracks: current_user_mentoring_tracks,
      learning_tracks: current_user_learning_tracks
    }

    respond_to do |format|
      format.html
      format.json { render json: @board_data }
    end
  end

  private

  def current_user_mentoring_tracks
    ret = {}
    current_user.mentees.each do |mentee|
      ret[mentee.id] = {
        name: mentee.name,
        avatar_url: mentee.image,
        learning_tracks: mentee.learning_tracks
      }
    end
    ret
  end

  def current_user_learning_tracks
    ret = {}

    current_user.learning_tracks.each do |l_track|
      ret[l_track.name] = l_track.as_json
      ret[l_track.name]['mentor'] = {
        name: l_track.mentor.name,
        id: l_track.mentor_id,
        avatar_url: l_track.mentor.image
      }
    end

    ret
  end
end
