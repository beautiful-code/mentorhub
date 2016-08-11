class ImageUploader < CarrierWave::Uploader::Base
  storage :fog

  def store_dir
    "uploads/track_template/#{mounted_as}/#{model.id}"
  end
end
