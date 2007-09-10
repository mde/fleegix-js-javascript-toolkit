#!/usr/bin/ruby

$SHRINKSAFE_PATH = 'lib/custom_rhino.jar'

def get_source_file_list
  require 'find'
  files = Array.new
  Find.find('./src/') do |f|
    # Don't include .svn version snapshots or vim's .js.swp files
    if FileTest.file?(f) and not f.include? '.svn' and f.index(/\.js$/)
      files.push(f)
    end
  end
  files
end

def get_plugin_file_list(param)
  plugins = []
  if not param.nil? and param.length > 0
    plugins = param.gsub(' ', '').gsub('.js', '').split(",")
    plugins.each do |p|
      p.gsub!('.', '/')
      p.concat('.js')
      p.sub!(/^/, './plugins/')
    end
  end
  plugins
end

def concat_sourcefiles(files, filename)
  dist = File.new(filename + '.uncompressed.js', 'w')
  js_file = File.new('./src/base.js')
  js = js_file.readlines.join
  dist << js
  # if (typeof fleegix == 'undefined') { var fleegix = {}; }
  re = Regexp.new('\/\*.*if \(typeof fleegix == \'undefined\'\) \{ var fleegix = \{\}; \}', Regexp::MULTILINE)
  files.each do |f|
    js_file = File.new(f)
    js = js_file.readlines.join
    js.sub!(re, '')
    dist << js
  end
  dist.close
  true
end

def compress_concat(filename)
  sh %{java -jar #{ $SHRINKSAFE_PATH } -c #{ filename }.uncompressed.js > #{ filename } 2>&1}
  true
end

desc "This builds a compressed fleegix.js or fleegix_plugins.js for production use."
task :default do
  if ENV['plugins_only'] == 'true'
    plugins_only = true
    filename = 'fleegix_plugins.js'
  else
    plugins_only = false
    filename = 'fleegix.js'
  end
  puts 'Getting list of source files ...'
  if plugins_only
    files = []
  else
    files = get_source_file_list
  end
  files += get_plugin_file_list(ENV['plugins'])
  puts 'Reading and concatenating source files ...'
  concat_sourcefiles(files, filename)
  puts 'Compressing concatenated file ...'
  compress_concat(filename)
  puts 'Built ' + filename
end

desc "This removes any built fleegix.js files."
task :clean do
  %x{rm *.js 2>&1}
  if $?.success?
    puts 'Removes built fleegix.js files.'
  else
    puts 'No built fleegix.js files to remove.'
  end
  true
end


