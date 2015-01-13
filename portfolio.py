
import re
from flask import Flask, render_template
from werkzeug import secure_filename

app = Flask(__name__)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
def home_page():
    return render_template('index.html')


@app.route('/<catagory>/<article>') # flask ignore /static in this scenario
def project_page(catagory, article):

    template = '%s/%s.html' % (catagory, article)

    if template in app.jinja_env.list_templates():
        return render_template(template, page_name=article)
    else:
        return render_template('404.html')



if __name__ == '__main__':
    app.debug = True
    app.run()
