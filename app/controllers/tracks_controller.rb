class TracksController < ApplicationController
  #TODO: Ajax auth token
  before_action :authenticate_user!, except: [:create, :update, :destroy, :sections]
  before_action :set_track, except: [:index]

  def index
    @tracks = Track.all.order('created_at ASC')
    # render json: tracks, status: 200
  end

  def new
    render 'sections/index'
  end

  def show
    @sections = @track.sections.order('id')
    render 'sections/index'
  end

  def sections
    render json: {
      track: @track,
      sections: @track.sections,
      current_user: current_user
    }
  end

  def sections
    render json: {
      track: @track,
      sections: @track.sections,
      current_user: current_user
    }
  end

  def create
    if @track.save
      render json: { msg: 'success', track: @track }, status: 200
    else
      render json: { msg: 'error', errors: @track.errors, track: @track }, status: 422
    end
  end

  def update
    if @track.update(track_params)
      render json: { msg: 'success', track: @track }, status: 200
    else
      render json: { msg: 'error', errors: @track.errors, track: @track }, status: 422
    end
  end

  private

  def track_params
    params.fetch(:track, {}).permit(:name, :image, :desc)
  end

  def set_track
    @track = params[:id].present? ? Track.find(params[:id]) : Track.new(track_params)
  end
end
