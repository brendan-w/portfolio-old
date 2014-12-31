
import os
import json

this_dir = os.path.dirname(os.path.realpath(__file__))

# get all JSON files in this directory
projects = {}

for f in os.listdir(this_dir):
	path = os.path.join(this_dir, f)
	name, ext = os.path.splitext(f)

	if os.path.isfile(path) and ext == '.json':
		with open(path, 'r') as j_file:
			projects[name] = json.loads(j_file.read())
