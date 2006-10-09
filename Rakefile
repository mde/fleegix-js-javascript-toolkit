#!/usr/bin/ruby

$SHRINKSAFE_PATH = 'lib/custom_rhino.jar'

def read_sourcefiles
  require 'find'
  files = Array.new
  Find.find('./src/') do |f| 
    if FileTest.file?(f) and not f.include? '.svn' 
      files.push(f)
    end
  end
  files
end

def concat_sourcefiles(files)
  dist = File.new('fleegix.js.uncompressed.js', 'w')
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

def compress_dist
  sh %{java -jar #{ $SHRINKSAFE_PATH } -c fleegix.js.uncompressed.js > fleegix.js 2>&1}
  true
end

task :default do
  puts 'Reading source files ...'
  files = read_sourcefiles
  puts 'Concatenating source files ...'
  concat_sourcefiles(files) 
  puts 'Compressing distribution file ...'
  compress_dist
  puts 'Built fleegix.js'
end
