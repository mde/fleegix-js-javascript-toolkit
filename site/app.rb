require 'rubygems'
require 'sinatra'

FLEEGIX_VERSION = '0.5.0'
FLEEGIX_PATH = 'http://downloads.fleegix.org/fleegix_js/releases/fleegix-' + FLEEGIX_VERSION
FLEEGIX_REPO = 'http://github.com/mde/fleegix-js-javascript-toolkit/tree/master'

TITLES = {
  'download' =>'Downloads',
  'build' => 'Building',
  'contribute' => 'Contribute',
  'docs' => 'Docs',
  'ref' => 'Reference',
  'plugins' => 'Plugins',
  'plugins/date/date' => 'Plugins: timezone-enabled JavaScript Date',
  'plugins/date/util' => 'Plugins: date strftime, add, diff',
  'plugins/ejs' => 'Plugins: EJS',
  'plugins/xml' => 'Plugins: XML',
  'plugins/form/diff' => 'Plugins: form diff',
  'plugins/form/restore' => 'Plugins: form restore',
  'plugins/hash/hash' => 'Plugins: hash',
  'plugins/color/convert' => 'Plugins: color conversion',
  'plugins/popup' => 'Plugins: popups'
}

get '/*' do
  @environment = options.environment
  # Get the entire path
  url = params[:splat][0]
  # Default to the index page for /
  url = 'index' if url.nil? or url.length == 0
  # Strip off any trailing slash
  url = url.chomp('/')
  @title = TITLES[url] || ''
  erb url.to_sym
end

