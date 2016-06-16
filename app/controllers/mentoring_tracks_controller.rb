class MentoringTracksController < ApplicationController

  def new
    @mentoring_track = MentoringTrack.new
  end

  def create
    @mentoring_track = MentoringTrack.new(mentoring_track_params)
    if params[:back_button]
      @mentoring_track.previous_step
    else
      @mentoring_track.next_step
    end
    render 'new'
  end

  private

  def mentoring_track_params
    params.require(:mentoring_track).permit(:name, :mentee_id)
  end
end
