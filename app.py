import os
from flask import Flask, render_template, jsonify, request, send_from_directory
from model import *
import random
from p_f import *
from mail import *

app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:2134@localhost:5432/program-hub"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://sldkqifiauhnjx:dd2f28d8c4bdc75edab292e79870536420ff6627e67782eece5963e64204286a@ec2-18-235-97-230.compute-1.amazonaws.com:5432/d21odp9vc4hjn6"
# 'sqlite :///program-hubs.db'
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
                try:
                    sender.send_message(Recipient(blog_.email, Content().re(blog_)))
                except Exception:
                    print('mail not sent')
                return jsonify({'stat': 'added'})
            else:
                return jsonify({'stat': 'error'})
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
    return jsonify({'stat': 'deleted'})


@app.route('/edit', methods=['POST'])
def edit():
    blog_ = Blog.query.get(request.form.get('id'))
    return render_template('blog.html', blog=blog_, read="readonly", dis='disabled', save='Save')


@app.route('/more')
def about():
    return render_template('about.html', a='active')


@app.route('/search', methods=['POST', 'GET'])
def search():
    if request.method == 'POST':
        try:
            data = json.loads(request.form['data'])
            blogs_ = tables[data['type']].query.all()
            txt = data['text']
            resp = list(blog_.title for blog_ in blogs_) if err_title(txt) else list(blog_.error for blog_ in blogs_)
            response = list(filter(lambda sh: search_(rm(txt), sh), resp))
            return jsonify({
                'response': response
            })
        except KeyError:
            query = request.form.get('q')
            type_ = request.form.get('t')
            blogs_ = tables[type_].query.all()
            response = list(filter(lambda blog_: search_(rm(query), blog_.title), blogs_)) if err_title(
                query) else list(filter(lambda blog_: search_(rm(query), blog_.error), blogs_))
            return render_template('blogs.html', blogs=response, admin=False, s='active',
                                   title='Query: ' + g_strip(rm(query)) if err_title(query) else 'Error: ' + g_strip(
                                       rm(query)))
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
        blog_ = Blog.query.get(v['num']) if v['admin'] == 'True' else TechNews.query.get(v['num'])
        print(blog_.content)
        return jsonify(
            {'id': blog_.id, 'title': blog_.title, 'name': blog_.name, 'email': blog_.email, 'date': blog_.date,
             'content': blog_.content})
    else:
        blogs_ = TechNews.query.all()
        return render_template('blogs.html', blogs=blogs_, admin=False, bl='active', title='Techs News')


@app.route('/learn', methods=['POST', 'GET'])
def learn():
    if request.method == 'POST':
        data = json.loads(request.form['data'])
        if data['type'] == 'templates':
            learns = Cs.query.order_by('title').all()
            return jsonify({'templates': [t.template() for t in learns[data['len']:data['len'] + 2]], 'end': len(learns) < data['len'] + 2})
        return jsonify({'pushed': True})
    return render_template('learn.html', learn=Cs.query.order_by('title').all()[:6], l='active')


@app.route('/like_unlike', methods=['POST'])
def like_unlike():
    # loads data from request and json parse it.
    data = json.loads(request.form['data'])
    # gets id of mail if its in database already else add it to database.
    return jsonify({'stat': 'success', 'value': vote(data['upvote'], data['address'], data['id'])})


if __name__ == '__main__':
    db.create_all()
    Flask.run(self=app, debug=True)
