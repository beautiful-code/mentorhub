class MentoringTracksController < ApplicationController

  def new
    session[:mtrack_params] ||= {}
    session[:mentoring_track_step] = nil
    @mentoring_track = MentoringTrack.new
  end

  def create
    session[:mtrack_params] = params[:mentoring_track] unless params[:mentoring_track].blank?
    @mentoring_track = MentoringTrack.new(mentee_id: session[:mtrack_params]["mentee_id"])
    @mentoring_track.current_step = session[:mentoring_track_step]

    if @mentoring_track.current_step == "assigning"
      track = Track.find(params[:mentoring_track][:track_id])
      ti_options = track.dup.attributes.merge({"mentor_id" => current_user.id})
      track_instance = TrackInstance.create(ti_options)

      track.sections.each do |section|
        options = section.dup.attributes.except("track_id").merge({"track_instance_id" => track_instance.id})
        @section_interaction = SectionInteraction.create(options)
      end
      session[:track_instance_id] = track_instance.id
    end

    @track_instance = TrackInstance.find(session[:track_instance_id])
    if params[:back_button]
      @mentoring_track.previous_step
    elsif @mentoring_track.last_step?
      @mentoring_track.save
      @track_instance.mentoring_track_id = @mentoring_track.id
      @track_instance.save
    else
      @mentoring_track.next_step
    end
    session[:mentoring_track_step] = @mentoring_track.current_step

    if @mentoring_track.new_record?
      render 'new'
    else
      flash[:success] = "#{@track_instance.name} track was added to #{@mentoring_track.mentee.name}"
      session[:mentoring_track_step] = session[:mtrack_params] = nil
      redirect_to root_path
    end
  end
end
