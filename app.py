import os
from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import datetime
from blog import blogs as b


app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///blogs.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
db=SQLAlchemy(app)


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
    
@app.route('/favicon.ico')
def favicon(): 
   return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


class Blog(db.Model):
    __tablename__='blogs'
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(120), nullable=False, unique=True)
    email=db.Column(db.String(35), nullable=False, unique=True)
    date=db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow())
    content=db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, id, name, email, date, content):
        self.id=id
        self.name=name
        self.email=email
        self.date=date
        self.content=content

    def __repr__(self):
        return f'{self.id}  {self.name}'

if __name__=='__main__':
    app.run(debug=True,port=5000)
    db.create_all(app=app)
    db.session.add(Blog(1, 'dfgg', 'ghdfgdfg', datetime.utcnow(), 'drfdfgdgfdsfsdf'))
