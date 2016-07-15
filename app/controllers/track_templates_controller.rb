class TrackTemplatesController < ApplicationController
  # TODO: Ajax auth token
  before_action :authenticate_user!, except: [:create, :update,
                                              :destroy, :sections]
  before_action :set_track_template, except: [:index]

  def index
    @track_templates = TrackTemplate.all.order('created_at ASC')
  end

  def new
    render 'sections/index'
  end

  def show
    @sections = @track_template.section_templates.order('id')
    render 'sections/index'
  end

  def create
    if @track_template.save
      render json: { msg: 'success',
                     track_template: @track_template }, status: 200
    else
      render json: {
        msg: 'error',
        errors: @track_template.errors,
        track_template: @track_template
      }, status: 422
    end
  end

  def update
    if @track_template.update(track_template_params)
      render json: { msg: 'success',
                     track_template: @track_template }, status: 200
    else
      render json: {
        msg: 'error',
        errors: @track_template.errors,
        track_template: @track_template
      }, status: 422
    end
  end

  private

  def track_template_params
    params.fetch(:track_template, {}).permit(:name, :image, :desc)
  end

  def set_track_template
    @track_template = if params[:id].present?
                        TrackTemplate.find(params[:id])
                      else
                        TrackTemplate.new(track_template_params)
                      end
  end
end
