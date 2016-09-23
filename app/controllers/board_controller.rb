class BoardController < ApplicationController
  before_action :authenticate_user!, except: [:home_page]

  def index
    @board_data = {
      mentoring_tracks: current_user_mentoring_tracks,
      learning_tracks: current_user_learning_tracks
    }
    @mentor_requests = current_user.mentor_request.where(
      state: 'new'
    )
    respond_to do |format|
      format.html
      format.json { render json: @board_data }
    end

    # TODO: Refactor the board index
    render layout: false
  end

  def home_page
  end

  private

  def current_user_mentoring_tracks
    ret = {}

    current_user.mentees.each do |mentee|
      ret[mentee.id] = {
        name: mentee.name,
        avatar_url: mentee.image,
        learning_tracks: mentee.learning_tracks.where(
          mentor_id: current_user.id
        )
      }
    end

    ret
  end

  def current_user_learning_tracks
    ret = {}

    current_user.learning_tracks.each do |l_track|
      ret[l_track.id] = l_track.as_json
      ret[l_track.id]['mentor'] = {
        name: l_track.mentor.name,
        id: l_track.mentor_id,
        avatar_url: l_track.mentor.image
      }
    end

    ret
  end
end
