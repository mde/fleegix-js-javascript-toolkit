#!/usr/bin/ruby

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
  files.each do |f|
    js_file = File.new(f)
    dist << js_file.readlines.join
  end
  dist.close
  true
end

def compress_dist
  sh %{java -jar lib/custom_rhino.jar -c fleegix.js.uncompressed.js > fleegix.js 2>&1}
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
