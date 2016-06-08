require 'rails_helper'

RSpec.describe Track, :type => :model do
    it "is not valid without a name" do
      track = Track.new(name: nil)
      expect(track).to_not be_valid
    end

    it "is not valid without a type" do
      track = Track.new(track_type: "")
      expect(track).to_not be_valid
    end
end
