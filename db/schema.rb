# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160623075926) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "mentoring_tracks", force: :cascade do |t|
    t.string   "name"
    t.integer  "mentee_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "section_interactions", force: :cascade do |t|
    t.string   "title"
    t.string   "goal"
    t.text     "content"
    t.string   "code_url"
    t.string   "resources"
    t.integer  "track_instance_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sections", force: :cascade do |t|
    t.string   "title"
    t.string   "goal"
    t.text     "content"
    t.string   "code_url"
    t.string   "resources"
    t.integer  "track_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "todos", force: :cascade do |t|
    t.text     "content"
    t.integer  "section_interaction_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "track_instances", force: :cascade do |t|
    t.string   "name"
    t.string   "track_type"
    t.integer  "mentor_id"
    t.integer  "mentoring_track_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
  end

  create_table "tracks", force: :cascade do |t|
    t.string   "name"
    t.string   "track_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
    t.string   "desc"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.string   "provider"
    t.integer  "uid"
    t.datetime "oauth_expires_at"
    t.string   "image"
    t.string   "first_name"
    t.string   "last_name"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
