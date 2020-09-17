import os
from flask import Flask, render_template, jsonify, request, send_from_directory, redirect, session
from model import *
import time
import random
from p_f import *
from mail import *

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///program-hubs.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = random.random
db.init_app(app)
db.app = app


@app.route('/')
def home():
    return render_template('index.html', h='active')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico',
                               mimetype='image/vnd.microsoft.icon')


@app.route('/blog', methods=['POST', 'GET', 'PUT'])
def blog():
    if request.method == 'POST':
        data = json.loads(request.form['data'])
        boolean = len(
            list(filter(lambda v: len(v.query.filter_by(content=data['content']).all()) == 0,
                        list(tables.values())))) == len(tables)
        if data['type'] == 'new':
            if len(Blog.query.filter_by(content=data['content']).all()) == 0 and boolean:
                blog_: Blog = Blog(f_strip(data['name']), g_strip(data['email']), g_strip(data['title']), data['error'],
                                   data['typ'], data['content'])
                db.session.add(blog_)
                db.session.commit()
                return jsonify({'stat': 'added'})
            else:
                return jsonify({'stat': 'error'})
        elif data['type'] == 'old':
            if boolean:
                blog_: Blog = Blog.query.get(data['num'])
                blog_.validate(blog_.typ)
                sender.send_message(Recipient(blog_.email, Content().re(blog_)))
                return jsonify({'stat': 'added'})
            else:
                return jsonify({'stat': 'errors'})
    elif request.method == 'PUT':
        data = json.loads(request.form['data'])
        blog_: Blog = Blog.query.get(data['id'])
        blog_.content = data['content']
        db.session.commit()
        return jsonify({'stat': 'added'})
    else:
        return render_template('blog.html', blog={'name': '', 'title': '', 'content': '', 'email': ''}, save='Create',
                               b='active')


@app.route('/delete', methods=['DELETE'])
def delete():
    num = json.loads(request.form.get('data'))['num']
    db.session.delete(Blog.query.get(num))
    db.session.commit()
    time.sleep(4)  # TODO
    return jsonify({'stat': 'deleted'})


@app.route('/edit', methods=['POST'])
def edit():
    blog_ = Blog.query.get(request.form.get('id'))
    return render_template('blog.html', blog=blog_, read="readonly", dis='disabled', save='Save')


@app.route('/about')
def about():
    return render_template('about.html', a='active')


@app.route('/search', methods=['POST', 'GET'])
def search():
    if request.method == 'POST':
        try:
            data = json.loads(request.form['data'])
            blogs_ = tables[data['type']].query.all()
            id_titles = list({'id': blog_.id, 'title':blog_.title} for blog_ in blogs_)
            response = list(filter(lambda blog_: blog_ == '', blogs_))
            dummy: list[dict[str: int, str: str]]=[
            {'id': 1, 'title': 'Hello world in java'},
            {'id': 2, 'title': 'How to write an hello world program in java'},
            {'id': 3, 'title': 'Java and the hello world program in it'},
            {'id': 4, 'title': 'Hello world in java'},
            {'id': 5, 'title': 'Hello world in java'},
            {'id': 6, 'title': 'Hello world in java'},
            {'id': 7, 'title': 'Hello world in java'},
            {'id': 8, 'title': 'Hello world in java'},
            {'id': 9, 'title': 'Hello world in java'},
            {'id': 10, 'title': 'Hello world in java'},
            {'id': 10, 'title': 'Hello world in java'},
            {'id': 10, 'title': 'Hello world in java'},
            {'id': 10, 'title': 'Hello world in java'},
            {'id': 10, 'title': 'Hello world in java'},
            {'id': 10, 'title': 'Hello world in java'},
            {'id': 10, 'title': 'Hello world in java'},
            {'id': 10, 'title': 'Hello world in java'},
            {'id': 10, 'title': 'Hello world in java'}
        ]
            return jsonify({
            'response': dummy
            })
        except KeyError:
            query=request.form.get('q')
            return render_template('blogs.html', blogs=Java.query.all(), admin=False, s='active', title=g_strip(rm(query)))
    else:
        return render_template('search.html', s='active')


@app.route('/code')
def code():
    return render_template('code.html', c='active')


@app.route('/admin', methods=['POST', 'GET'])
def admin():
    if request.method == 'POST':
        ids = request.form
        if len(Login.query.filter_by(login_id=ids.get('email'), passcode=ids.get('password')).all()) == 0:
            return render_template('admin.html', wrong='Wrong password')
        else:
            t_blogs = Blog.query.all()
            return render_template('blogs.html', blogs=t_blogs, admin=True, title='Admin')
    else:
        return render_template('admin.html')


@app.route('/blogs', methods=['POST', 'GET'])
def blogs():
    if request.method == 'POST':
        v = json.loads(request.form['data'])
        time.sleep(4)
        blog_ = Blog.query.get(v['num']) if v['admin'] == 'True' else TechNews.query.get(v['num'])
        return jsonify(
            {'id': blog_.id, 'title': blog_.title, 'name': blog_.name, 'email': blog_.email, 'date': blog_.date,
             'content': blog_.content})
    else:
        blogs_ = TechNews.query.all()
        return render_template('blogs.html', blogs=blogs_, admin=False, bl='active', title='Technological News Update')


@app.route('/learn', methods=['POST', 'GET'])
def learn():
    if request.method == 'POST':
        v = json.loads(request.form['data'])
        blog_ = Cs.query.get(v['num'])
        return jsonify(
            {'id': blog_.id, 'title': blog_.title, 'name': blog_.name, 'email': blog_.email, 'date': blog_.date,
             'content': blog_.content})
    else:
        blogs_ = Cs.query.all()
        return render_template('blogs.html', blogs=blogs_, admin=False, l='active', title='CS learn')


if __name__ == '__main__':
    db.create_all()
    Flask.run(self=app, debug=True)
