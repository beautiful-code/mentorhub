class SectionsController < ApplicationController
  #TODO: Add auth token to ajax requests
  before_action :authenticate_user!, except: [:update, :create, :destroy]
  before_action :set_track
  before_action :set_section, except: [:index]
  before_action :build_resources, only: [:create, :update]

  def create
    if @section.save
      render json: {msg: "success", section: @section}, status: 200
    else
      render json: {msg: "error", errors: @section.errors, section: @section}, status: 422
    end
  end

  def update
    if @section.update(section_params)
      render json: {msg: "success", section: @section}, status: 200
    else
      render json: {msg: "error", errors: @section.errors, section: @section}, status: 422
    end
  end

  def destroy
    if @section.destroy
      render json: {msg: "success"}, status: 200
    else
      render json: {msg: "error"}, status: 422
    end
  end

  private
    def section_params
      params.fetch(:section, {}).permit(:title, :content)
    end

    def set_track
      @track = Track.find(params[:track_id])
    end

    def set_section
      @section = params[:id].present? ? @track.sections.find(params[:id]) : @track.sections.new(section_params)
    end

    def build_resources
      @section.resources = params[:section].delete(:resources).collect {|_,v| v } if params[:section][:resources].present?
    end
end
