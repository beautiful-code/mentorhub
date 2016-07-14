class MentoringTracksController < ApplicationController
  def new
    session[:mtrack_params] ||= {}
    session[:mentoring_track_step] = nil
    @mentoring_track = MentoringTrack.new
    @tracks = Track.all
    @users = User.all
    @index = Section.count
  end

=begin
  def create
    session[:mtrack_params] = params[:mentoring_track] unless params[:mentoring_track].blank?
    @mentoring_track = MentoringTrack.new(mentee_id: session[:mtrack_params]['mentee_id'])
    @mentoring_track.current_step = session[:mentoring_track_step]

    if @mentoring_track.current_step == 'assigning'
      track = Track.find(params[:mentoring_track][:track_id])
      ti_options = track.dup.attributes.except('desc').merge({ 'mentor_id' => current_user.id })
      track_instance = TrackInstance.create(ti_options)

      track.sections.each do |section|
        options = section.dup.attributes.except('track_id', 'code_url').merge({ 'track_instance_id' => track_instance.id })
        @section_interaction = SectionInteraction.create(options)
      end
      session[:track_instance_id] = track_instance.id
    end

    @track_instance = TrackInstance.find(session[:track_instance_id])

    if params[:back_button]
      @mentoring_track.previous_step
    elsif @mentoring_track.last_step?
      @mentoring_track.save!
      @track_instance.update_attribute(:mentoring_track_id, @mentoring_track.id)
    else
      @mentoring_track.next_step
    end

    session[:mentoring_track_step] = @mentoring_track.current_step
    if @mentoring_track.new_record?
      render 'new'
    else
      flash[:success] = "#{@track_instance.name} track was added to #{@mentoring_track.mentee.first_name}"
      session[:mentoring_track_step] = session[:mtrack_params] = nil
      redirect_to mentoring_tracks_path
    end
  end
=end

  def create
    # TODO
    # 1.JSON.parse(params[:mentoring_track]) => {"track_id" => "1", "sections" => [{},{}]}
    # 2. Create track_instance by copying the Track.find(track_id)


    ActiveRecord::Base.transaction do
      @mentoring_track = MentoringTrack.create(mentee_id: mentee_id)
      track_instance_attr = Track.find(track_params['id']).dup.attributes.except("desc").merge(mentor_id: current_user.id)
      track_instance_attr["image"] = Track.find(track_params['id']).image
      track_instance = @mentoring_track.track_instances.create(track_instance_attr)
      
      # 3. Create track_instance.section_interactions.create()
      sections.each do |section|
        byebug
        track_instance.section_interactions.create(section.except('id','code_url','track_id'))
      end
    end
    # 4. Put all these statements in a transaction block
    # 5. render json response with status
    render json: {msg: "success"}, status: 200
  end

  def index
    @mentoring_tracks = MentoringTrack.all
  end

  def show
    @mentoring_track = MentoringTrack.find(params[:id]);
    @section_interactions = @mentoring_track.track_instances.first.section_interactions.preload(:todos)
  end

  def get_todos
    @section_interaction = SectionInteraction.find(params[:id]);
    render json: {
      todos: @section_interaction.todos
    }
  end

  private
  def sections
    JSON.parse(params.require(:sections))
  end

  def track_params
    params.require(:track).permit!
  end

  def mentee_id
    params.require(:menteeId)
  end
end
