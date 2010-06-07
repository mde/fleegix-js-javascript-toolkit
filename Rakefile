#!/usr/bin/ruby

$YUI_COMPRESSOR_PATH = 'lib/yuicompressor-2.1.2.jar'
$COMPRESSION = true
$GZIP = true

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

def get_base_module_file_list(param)
  mods = []
  if not param.nil? and param.length > 0
    mods = param.gsub(' ', '').split(",")
    mods.each do |p|
      p.sub!(/^/, './src/')
    end
  end
  puts mods.inspect
  mods
end

def get_plugin_file_list(param)
  plugins = []
  if not param.nil? and param.length > 0
    plugins = param.gsub(' ', '').split(",")
    plugins.each do |p|
      p.sub!(/^/, './plugins/')
    end
  end
  plugins
end

def concat_sourcefiles(files, filename, exports)
  dist = File.new(filename + '.uncompressed.js', 'w')
  js_file = File.new('./src/base.js')
  js = js_file.readlines.join
  dist << js
  # if (typeof fleegix == 'undefined') { var fleegix = {}; }
  re = Regexp.new('\/\*.*if \(typeof fleegix == \'undefined\'\) \{ var fleegix = \{\}; \}', Regexp::MULTILINE)
  files.each do |f|
    if f != './src/base.js'
      js_file = File.new(f)
      js = js_file.readlines.join
      js.sub!(re, '')
      dist << js
    end
  end
  # Copy all modules onto the exports obj for CommonJS usage
  if exports
    dist << <<-eos
for (var p in fleegix) {
  exports[p] = fleegix[p];
}
    eos
  end

  dist.close
  true
end

def compress_concat(filename)
  msg = %x{java -jar #{ $YUI_COMPRESSOR_PATH } -o #{ filename } #{ filename }.uncompressed.js 2>&1}
  if not $?.success?
    puts msg
  end
  true
end

def gzip_compress(filename)
  msg = %x{gzip -c #{ filename } > #{ filename }.gz 2>&1}
  if not $?.success?
    puts msg
  end
  true
end

desc "This builds a compressed fleegix.js or fleegix_plugins.js for production use."
task :default do
  profile = ENV['profile']
  # Config is a saved profile
  if not profile.nil? and profile.length > 0
    require 'json'
    file = File.new(profile)
    file = file.readlines.join
    conf = JSON.parse(file)
    plugins_only = conf['plugins_only'].to_s
    plugins = conf['plugins']
    exports = conf['exports'] || false
    base_modules = conf['base_modules']
    compression = conf['compression'].to_s
    gzip = conf['gzip'].to_s
  # Otherwise look for command params
  else
    plugins_only = ENV['plugins_only']
    plugins = ENV['plugins']
    exports = ENV['exports'] || false
    base_modules = ENV['base_modules']
    compression = ENV['compression']
    gzip = ENV['gzip']
  end

  if plugins_only == 'true'
    plugins_only = true
    filename = 'fleegix_plugins.js'
  else
    plugins_only = false
    filename = 'fleegix.js'
  end
  if compression.nil?
    compression = $COMPRESSION
  else
    compression = compression == 'false' ? false : true;
  end
  if gzip.nil?
    gzip = $GZIP
  else
    gzip = gzip == 'false' ? false : true;
  end

  files = []
  if plugins_only
    files += []
  elsif not base_modules.nil? and base_modules.length > 0
    puts 'Getting list of base source files ...'
    files += get_base_module_file_list(base_modules)
  else
    puts 'Getting list of base source files ...'
    files = get_source_file_list
  end

  if not plugins.nil? and plugins.length > 0
    puts 'Getting list of plugin source files ...'
    files += get_plugin_file_list(plugins)
  end

  puts 'Reading and concatenating source files ...'
  concat_sourcefiles(files, filename, exports)
  puts 'Built ' + filename + '.uncompresed.js'

  if compression
    puts 'Compressing concatenated file ...'
    compress_concat(filename)
    puts 'Built ' + filename
  end

  if gzip
    puts 'Gzipping compressed file ...'
    gzip_compress(filename)
    puts 'Built ' + filename + '.gz'
  end

  puts 'Done.'
end

desc "This removes any built fleegix.js files."
task :clean do
  %x{rm *.js* 2>&1}
  if $?.success?
    puts 'Removed built fleegix.js files.'
  else
    puts 'No built fleegix.js files to remove.'
  end
  true
end


