class SectionTemplatesController < ApplicationController
  # TODO: Add auth token to ajax requests
  before_action :authenticate_user!, except: [:update, :create, :destroy]
  before_action :set_track_template
  before_action :set_section, except: [:index]

  def index
    render json: {
      track_template: @track_template,
      sections: @track_template.section_templates,
      current_user: current_user
    }
  end

  def create
    if @section.save
      render json: { msg: 'success', section: @section }, status: 200
    else
      render json: { msg: 'error', errors: @section.errors,
                     section: @section }, status: 422
    end
  end

  def update
    if @section.update(section_params)
      render json: { msg: 'success', section: @section }, status: 200
    else
      render json: { msg: 'error', errors: @section.errors,
                     section: @section }, status: 422
    end
  end

  def destroy
    if @section.destroy
      render json: { msg: 'success' }, status: 200
    else
      render json: { msg: 'error' }, status: 422
    end
  end

  private

  def section_params
    params.fetch(:section_template, {}).permit(
      :id, :title, :content, :exercise,
      questions: [:question], resources: [:text, :url]
    )
  end

  def set_track_template
    @track_template = TrackTemplate.find(params[:track_template_id])
  end

  def set_section
    @section = if params[:id].present?
                 @track_template.section_templates.find(params[:id])
               else
                 @track_template.section_templates.new(section_params)
               end
  end
end
