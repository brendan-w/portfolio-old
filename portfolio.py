

from pages import projects
from flask import Flask, render_template


app = Flask(__name__)


@app.context_processor
def add_global():
    # make all project data available to the templates
    # used for nav construction
    return dict(projects=projects)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
def home_page():
    return render_template('index.html')


@app.route('/work/<project>')
def project_page(project):
    if project in projects:
        return render_template('project.html', project=project)
    else:
        return render_template('404.html')
