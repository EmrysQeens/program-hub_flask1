import os
from flask import Flask, render_template, jsonify, request, send_from_directory, redirect, session
from models import *
import datetime
import time
import json
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///program-hub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = random.random
db.init_app(app)
db.app = app


@app.route('/')
def home():
    return render_template('index.html', h='active')


@app.route('/blog', methods=['POST', 'GET', 'PUT'])
def blog():
    if request.method == 'POST':
        time.sleep(4)
        data = json.loads(request.form['data'])
        if data['type'] == 'new':
            if len(TempBlog.query.filter_by(content=data['content']).all()) == 0 and len(
                    Blog.query.filter_by(content=data['content']).all()) == 0:
                db.session.add(
                    TempBlog(name=data['name'].lower(), email=data['email'].lower(), title=data['title'],
                             content=data['content'], date=datetime.datetime.today()))
                db.session.commit()
                return jsonify({'stat': 'added'})
            else:
                return jsonify({'stat': 'error'})
        elif data['type'] == 'old':
            if len(Blog.query.filter_by(content=data['content']).all()) == 0:
                Blog.validate_blog(TempBlog.query.get(data['num']))
                db.session.delete(TempBlog.query.get(data['num']))
                db.session.commit()
                return jsonify({'stat': 'added'})
            else:
                return jsonify({'stat': 'errors'})
    elif request.method == 'PUT':
        data = json.loads(request.form['data'])
        blog: TempBlog = TempBlog.query.get(data['id'])
        blog.content = data['content']
        db.session.commit()
        return jsonify({'putted': True})
    else:
        return render_template('blog.html', blog={'name': '', 'title': '', 'content': '', 'email': ''}, save='Create',
                               b='active')


@app.route('/delete', methods=['DELETE'])
def delete():
    num = json.loads(request.form.get('data'))['num']
    db.session.delete(TempBlog.query.get(num))
    db.session.commit()
    time.sleep(4)
    return jsonify({'stat': 'deleted'})


@app.route('/edit/<int:id>')
def edit(id):
    blog = Blog.query.get(id)
    return render_template('blog.html', blog=blog, read="readonly", save='Save')


@app.route('/blogs', methods=['POST', 'GET'])
def blogs():
    if request.method == 'POST':
        v = json.loads(request.form['data'])
        time.sleep(5)
        blog = TempBlog.query.get(v['num']) if v['admin'] == 'True' else Blog.query.get(v['num'])
        return jsonify(
            {'id': blog.id, 'title': blog.title, 'name': blog.name, 'email': blog.email, 'date': blog.date,
             'content': blog.content})
    else:
        blogs = Blog.query.all()
        return render_template('blogs.html', blogs=blogs, admin=False, bl='active')


@app.route('/about')
def about():
    return render_template('about.html', a='active')


@app.route('/search')
def search():
    pass


@app.route('/code')
def code():
    pass


@app.route('/admin', methods=['POST', 'GET'])
def admin():
    if request.method == 'POST':
        ids = request.form
        if len(Login.query.filter_by(login_id=ids.get('email'), passcode=ids.get('password')).all()) == 0:
            return render_template('admin.html', wrong='Wrong password')
        else:
            t_blogs = TempBlog.query.all()
            return render_template('blogs.html', blogs=t_blogs, admin=True)
    else:
        return render_template('admin.html')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico',
                               mimetype='image/vnd.microsoft.icon')


if __name__ == '__main__':
    db.create_all()
    Flask.run(self=app,debug=True)
