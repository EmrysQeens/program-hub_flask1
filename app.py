import os
from flask import Flask, render_template, jsonify, request, send_from_directory
from models import *
from blog import blogs as b


app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///program-hub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
db.init_app(app)
db.app=app


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/blog', methods=['POST','GET'])
def blog():
    if request.method == 'POST':
        pass
    else:
        return render_template('blog.html')


@app.route('/blogs', methods=['POST','GET'])
def blogs():
    if request.method=='POST':
        pass
    else:
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
    
@app.route('/favicon.ico')
def favicon(): 
   return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__=='__main__':
    app.run(debug=True,port=5000)
