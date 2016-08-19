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

ActiveRecord::Schema.define(version: 20160713130429) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "section_interactions", force: :cascade do |t|
    t.string   "title"
    t.string   "goal"
    t.text     "content"
    t.text     "resources"
    t.integer  "track_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "state"
    t.text     "mentee_notes"
    t.boolean  "enabled"
    t.string   "type"
  end

  create_table "section_templates", force: :cascade do |t|
    t.string   "title"
    t.string   "goal"
    t.text     "content"
    t.text     "resources"
    t.integer  "track_template_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "type"
  end

  create_table "todos", force: :cascade do |t|
    t.text     "content"
    t.integer  "section_interaction_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "state"
  end

  create_table "track_templates", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
    t.string   "desc"
    t.string   "type"
  end

  create_table "tracks", force: :cascade do |t|
    t.string   "name"
    t.integer  "mentor_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
    t.datetime "deadline"
    t.string   "type"
    t.integer  "mentee_id"
    t.text     "desc"
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
    t.boolean  "admin"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

end
