import os
from flask import Flask, render_template, jsonify, request, send_from_directory, redirect, session
from models import *
import datetime
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///program-hub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
db.app = app


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/blog', methods=['POST', 'GET'])
def blog():
    if request.method == 'POST':
        data = json.loads(request.form['data'])
        if data['type'] == 'new':
            if len(TempBlog.query.filter_by(content=data['content']).all()) == 0 and len(Blog.query.filter_by(content=data['content']).all()) == 0 :
                db.session.add(
                    TempBlog(name=data['name'].lower(), email=data['email'].lower(), title=data['title'],
                         content=data['content'], date=datetime.datetime.today()))
                db.session.commit()
                return jsonify({'stat': 'added'})
            else:
                return jsonify({'stat': 'error'})
        elif data['type'] == 'old':
            if  len(Blog.query.filter_by(content=data['content']).all())== 0:
                Blog.validate_blog(TempBlog.query.get(data['num']))
                db.session.delete(TempBlog.query.get(data['num']))
                db.session.commit()
                return jsonify({'stat': 'added'})
            else:
                return jsonify({'stat': 'errors'})
    else:
        return render_template('blog.html')

@app.route('/delete', methods=['POST'])
def delete():
    num=json.loads(request.form.get('data'))['num']
    db.session.delete(TempBlog.query.get(num))
    db.session.commit()
    return jsonify({'stat':'deleted'})

@app.route('/edit', methods=["POST"])
def edit():
    return render_template('blog.html')

@app.route('/blogs', methods=['POST', 'GET'])
def blogs():
    if request.method == 'POST':
        v=json.loads(request.form['num'])
        blog = TempBlog.query.get(v['num']) if v['admin'] == 'True' else Blog.query.get(v['num'])
        return jsonify(
             {'id': blog.id, 'title':blog.title, 'name': blog.name, 'email': blog.email, 'date': blog.date, 'content': blog.content})
    else:
        blogs = Blog.query.all()
        return render_template('blogs.html', blogs=blogs, admin=False)


@app.route('/about')
def about():
    pass


@app.route('/search')
def search():
    pass


@app.route('/challenges')
def challenges():
    pass


@app.route('/admin', methods=['POST', 'GET'])
def admin():
    if request.method == 'POST':
        ids=request.form
        if len(Login.query.filter_by(login_id=ids.get('email'), passcode=ids.get('password')).all()) == 0:
            return render_template('admin.html', wrong='Wrong password')
        else:
            t_blogs=TempBlog.query.all()
            return render_template('blogs.html', blogs=t_blogs, admin=True)
    else:
        return render_template('admin.html')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico',
                               mimetype='image/vnd.microsoft.icon')


if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
