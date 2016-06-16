class MentoringTracksController < ApplicationController

  def new
    @mentoring_track = MentoringTrack.new
  end

  def create
    @mentoring_track = MentoringTrack.new(mentoring_track_params)
    @mentoring_track.mentee_id = params[:mentoring_track][:mentee]

    @track_id = params[:mentoring_track][:id]
    @track = Track.find(@track_id)
    @track_dup = @track.dup
    @track_instance = TrackInstance.create(@track_dup.attributes)
    @track_instance.mentor_id = current_user.id

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
