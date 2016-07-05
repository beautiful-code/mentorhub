class BoardController < ApplicationController
  before_action :authenticate_user!

  def index
    @mentoring_tracks = TrackInstance.where(mentor_id: current_user.id)
    @learning_tracks = MentoringTrack.where(mentee_id: current_user.id)
  end
end
