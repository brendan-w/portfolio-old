
import re
from pages import projects
from flask import Flask, render_template

app = Flask(__name__)

app.jinja_env.globals['projects'] = projects
app.jinja_env.tests['image_url'] = lambda e: bool(re.match("(http:|/).*\.(png|jpg|jpeg|bmp|gif)", e, re.I))
app.jinja_env.tests['list']      = lambda e: isinstance(e, list)


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
