require 'rails_helper'

RSpec.describe Section, :type => :model do
  it "is not valid without a title" do
    section = Section.new(title: nil)
    expect(section).to_not be_valid
  end
  it "is not valid without a goal" do
    section = Section.new(goal: nil)
    expect(section).to_not be_valid
  end
  it "is not valid without a content" do
    section = Section.new(content: nil)
    expect(section).to_not be_valid
  end
end
