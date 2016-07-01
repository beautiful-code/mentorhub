class HomeController < ApplicationController
  before_action :authenticate_user!

  def learning_tracks
    @learning_tracks = current_user.mentoring_tracks
  end

  def view
    @mentoring_tracks = MentoringTrack.all
    @user_exercise_tracks = current_user.mentoring_tracks
    @todo = Todo.new
  end
end
