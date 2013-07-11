require 'fileutils'
require 'nokogiri'

EXTENSION_DIR = "C:/Users/mars26/AppData/Roaming/Mozilla/Firefox/Profiles/r05cejhr.dev/extensions"

DIRNAME = __dir__.split('/').last
IGNORE_EXTS = ['~', '.komodoproject']

desc "Pack firefox extension to xpi"
task :pack do
  filelist = []
  Dir.foreach('.') do |entry|
    next if entry == '.' or entry == '..'
    next if entry == 'Rakefile'
    next if entry.start_with?('.') # hidden entry
    next if IGNORE_EXTS.any? { |ignore_exts| entry.end_with? ignore_exts }
    
    filelist << entry
  end

  xpi_dest = "../#{DIRNAME}.xpi"
  FileUtils.rm_f xpi_dest
  system "7z a -tzip #{xpi_dest} #{filelist.join(' ')}"
  
  doc = Nokogiri::XML(open('install.rdf'))
  extension_id = doc.css('Description em|id').first.content
  dest       = File.join(EXTENSION_DIR, xpi_dest)
  final_dest = File.join(EXTENSION_DIR, "#{extension_id}.xpi")

  FileUtils.cp xpi_dest, dest
  File.rename(dest, final_dest)
end
