class TracksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_track, except: [:index]

  def index
    @tracks = Track.all
  end

  def create
    if @track.save
      redirect_to tracks_path, success: "Track created"
    else
      render 'new'
    end
  end

  def update
    if @track.update(track_params)
      redirect_to tracks_path, success: "Track updated"
    else
      render 'edit'
    end
  end

  private
    def track_params
      params.fetch(:track, {}).permit(:name, :image, :desc)
    end

    def set_track
      @track = (params[:id].present?)? Track.find(params[:id]) : Track.new(track_params)
    end
end
