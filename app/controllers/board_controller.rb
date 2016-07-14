class BoardController < ApplicationController
  before_action :authenticate_user!

  def index
    @mentoring_tracks = current_user.mentoring_tracks
    @learning_tracks = current_user.learning_tracks
  end
end
