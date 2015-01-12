
import re
from pages import projects
from flask import Flask, render_template
from werkzeug import secure_filename

app = Flask(__name__)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
def home_page():
    return render_template('index.html')


@app.route('/work/<project>')
def project_page(project):

    t_name = 'work/%s.html' % project

    if t_name in app.jinja_env.list_templates():
        return render_template(t_name, page_name=project)
    else:
        return render_template('404.html')



if __name__ == '__main__':
    app.debug = True
    app.run()
