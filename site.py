
from flask import Flask, render_template


app = Flask(__name__)


@app.route('/foo/<path:filename>')
def send_foo(filename):
    return send_from_directory('static/', filename)


@app.route('/')
def hello_world():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
