require 'rubygems'
require 'sinatra'

Sinatra::Application.set(:run, false)
Sinatra::Application.set(:logging, false)
Sinatra::Application.set(:environment, :production)

require 'app'
run Sinatra::application


