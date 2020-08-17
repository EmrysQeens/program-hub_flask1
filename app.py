from flask import Flask, render_template, jsonify, request
from blog import blogs as b


app=Flask(__name__)
#app.config('SQLALCHEMY_DATABASE_URI')='sqlite:///blogs.db'


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/blog')
def blog():
    return render_template('blog.html')


@app.route('/blogs')
def blogs():
    return render_template('blogs.html',blogs=b)


@app.route('/about')
def about():
    pass



@app.route('/search')
def search():
    pass


@app.route('/challenges')
def challenges():
    pass


@app.route('/admin')
def admin():
    pass


if __name__=='__main__':
    app.run(debug=True,port=5000)
