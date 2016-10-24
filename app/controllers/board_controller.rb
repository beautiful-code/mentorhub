class BoardController < ApplicationController
  before_action :authenticate_user!, except: [:home_page]

  def index
    @board_data = {
      mentoring_tracks: current_user.all_mentoring_tracks.as_json,
      learning_tracks: current_user.learning_tracks.as_json
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
end
