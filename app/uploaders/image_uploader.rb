class ImageUploader < CarrierWave::Uploader::Base
  def store_dir
    "uploads/track_template/#{mounted_as}/#{model.id}"
  end
end
