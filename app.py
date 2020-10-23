import os
from flask import Flask, render_template, jsonify, request, send_from_directory, redirect, session
from model import *
from p_f import *
from mail import *
import learn as g
from sqlalchemy import func
from decodeimg import decode, ext_, clear
from threading import Thread
from time import sleep

app = Flask(__name__)
url = 'program-hub.herokuapp.com'
#  app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:2134@localhost:5432/program-hub"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://sldkqifiauhnjx:dd2f28d8c4bdc75edab292e79870536420ff6627e67782eece5963e64204286a@ec2-18-235-97-230.compute-1.amazonaws.com:5432/d21odp9vc4hjn6"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'b_\xd0\x80\x80\xba\xc5\xfa\x1eL\x04e\xf21NEx\xeb]\xf8\xe3'
db.init_app(app)
db.app = app


@app.route('/')
def home():
    return render_template('index.html', h='active')


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico',
                               mimetype='image/vnd.microsoft.icon')


class Cls(Thread):
    def __init__(self, title):
        Thread.__init__(self)
        self.title = title

    def run(self):
        sleep(2)
        clear(self.title)


@app.route('/learn/image/<string:title>')
def image(title: str):
    cs: Cs = db.session.query(Cs).filter(func.lower(Cs.title) == title).first()
    if cs is not None:
        decode(cs.title.lower(), cs.img)
        reply = send_from_directory(os.path.join(app.root_path, 'images/learn'), '{}.{}'.format(title, ext_(title)))
        Cls(title).start()
        return reply
    return redirect('/')


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
                                   data['date'], data['typ'], data['content'])
                db.session.add(blog_)
                db.session.commit()
                return jsonify({'stat': 'added'})
            else:
                return jsonify({'stat': 'error'})
        elif data['type'] == 'old' and 'app_user' in session:
            if boolean:
                blog_: Blog = Blog.query.get(data['num'])
                try:
                    blog_.validate(blog_.typ)
                    sender.send_message('Post Verified', Recipient(blog_.email, re(blog_)))
                except Exception:
                    pass
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


@app.route('/edit', methods=['POST', 'GET'])
def edit():
    if request.method == 'POST' and 'app_user' in session:
        try:
            l_: Cs = Cs.query.get(request.form['id_'])
            return render_template('cs_write.html', l=l_, read="readonly", title=l_.title, id=l_.id, content=l_.content,
                                   save='Save')
        except KeyError:
            blog_ = Blog.query.get(request.form.get('id'))
            return render_template('blog.html', blog=blog_, read="readonly", dis='disabled', save='Save')
    return redirect('/')


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
        if len(Login.query.filter_by(login_id=ids.get('email').lower(), passcode=ids.get('password')).all()) == 0:
            return render_template('admin.html', wrong='Wrong password', login=True)
        session['app_user'] = (ids.get('email'), ids.get('password'))
        return render_template('admin.html', login=False)
    if 'app_user' in session:
        return render_template('admin.html', login=False)
    else:
        return render_template('admin.html', login=True)


@app.route('/validate')
def validate():
    if 'app_user' in session:
        t_blogs = Blog.query.all()
        return render_template('blogs.html', blogs=t_blogs, admin=True, title='Admin')
    return render_template('admin.html', login=True)


@app.route('/blogs', methods=['POST', 'GET'])
def blogs():
    if request.method == 'POST':
        v = json.loads(request.form['data'])
        blog_ = Blog.query.get(v['num']) if v['admin'] == 'True' else TechNews.query.get(v['num'])
        return jsonify(
            {'id': blog_.id, 'title': blog_.title, 'name': blog_.name, 'email': blog_.email, 'date': blog_.date,
             'content': blog_.content})
    else:
        blogs_ = TechNews.query.all()
        return render_template('blogs.html', blogs=blogs_, admin=False, bl='active', title='Techs News')


@app.route('/learn', methods=['POST', 'GET', 'PUT'])
def learn():
    if request.method == 'POST':
        data = json.loads(request.form['data'])
        if data['type'] == 'templates':
            learns = Cs.query.order_by('title').all()
            return jsonify({'templates': [t.template() for t in learns[data['len']:data['len'] + 10]],
                            'end': len(learns) < data['len'] + 2})
        elif data['type'] == 'upload' and 'app_user' in session:
            title = f_strip(data['title'])
            if len(Cs.query.filter_by(title=title).all()) == 0:
                db.session.add(Cs(title, data['img'], data['content']))
                db.session.commit()
                subscribers: list = Subscriber.query.all()
                try:
                    for subscriber in subscribers:
                        sender.send_message(data['title'], Recipient(subscriber.address, le(data['title'], url)))
                except Exception:
                    return jsonify({'result': True})
                return jsonify({'result': True})
            return jsonify({'result': False})
        return jsonify({'pushed': True})
    elif request.method == 'PUT' and 'app_user' in session:
        data = json.loads(request.form['data'])
        cs: Cs = Cs.query.get(data['id'])
        cs.content = data['content']
        cs.img = data['img']
        decode(cs.title.lower(), data['img'])
        db.session.commit()
        return jsonify({'result': True})
    return render_template('learn.html', learn=Cs.query.order_by('title').all()[:30], l='active', templates=True,
                           admin=False, g=g)


@app.route('/edit/learn', methods=['POST', 'GET'])
def edit_learn():
    # if request.method == 'POST':
    #     return render_template('learn.html', learn=Cs.query.order_by('title').all()[:30], l='active',
    #                            templates=True, g=g, admin=True)
    if "app_user" in session:
        return render_template('learn.html', learn=Cs.query.order_by('title').all()[:30], l='active',
                               templates=True, g=g, admin=True)
    return render_template('admin.html', login=True)


@app.route('/edit/learn/<string:name>', methods=['POST', 'GET'])
def edit_learn_p(name):
    if 'app_user' in session:
        if request.method == 'POST':
            return learn_('', True)
        return learn_(name, True)
    return render_template('admin.html', login=True)


@app.route('/learn/<string:name>', methods=['POST', 'GET'])
def learn_(name, admin_=False):
    if request.method == 'POST':
        data = json.loads(request.form['data'])
        cs: list = Cs.query.order_by('title').all()
        cs_: Cs = cs[(data['id'] + 1) if data['nxt'] else (data['id'] - 1)]
        try:
            r = (data['id'] + 2) if data['nxt'] else (data['id'] - 2)
            if r < 0 or r == len(cs):
                raise IndexError
        except IndexError:
            return jsonify({'title': cs_.title, 'id': cs_.id, 'img': cs_.img, 'content': cs_.content, 'disable': True})
        return jsonify({'title': cs_.title, 'id': cs_.id, 'img': cs_.img, 'content': cs_.content, 'disable': False})
    cs: Cs = Cs.query.filter_by(title=f_strip(name)).first()
    if cs is not None:
        _all: list = Cs.query.order_by('title').all()
        pos: int = _all.index(cs)
        return render_template('learn.html', admin=admin_, templates=False, cs=cs,
                               pos=pos, p='disabled' if pos == 0 else '', n='disabled' if pos == len(_all) - 1 else '')
    return render_template('error.html', url=g_strip(name))


@app.route('/write', methods=['POST', 'GET'])
def write():
    if 'app_user' in session:
        return render_template('cs_write.html', save='Create')
    return render_template('admin.html', login=True)


@app.route('/logout')
def logout():
    if 'app_user' in session:
        session.pop('app_user')
        return redirect('/')
    return redirect('/')


@app.route('/like_unlike', methods=['POST'])
def like_unlike():
    # loads data from request and json parse it.
    data = json.loads(request.form['data'])
    # gets id of mail if its in database already else add it to database.
    return jsonify({'stat': 'success', 'value': vote(data['upvote'], data['address'], data['id'])})


def err_404(e):
    print(e)
    return render_template('error.html')


@app.route('/subscribe', methods=['POST'])
def subscribe():
    if request.method == 'POST':
        address: str = json.loads(request.form['data'])['address'].lower()
        if len(Subscriber.query.filter_by(address=address).all()) == 0:
            db.session.add(Subscriber(address))
            db.session.commit()
            try:
                sender.send_message('Thanks for Subscribing', Recipient(address, su(address, url=url)))
            except Exception:
                pass
            return jsonify({'subscribed': True})
        return jsonify({'subscribed': False})


@app.route('/subscribe/<string:address>')
def unsubscribe(address):
    subscriber: Subscriber = Subscriber.query.filter_by(address=address.lower()).first()
    if subscriber is not None:
        db.session.delete(subscriber)
        db.session.commit()
        return "<script>alert('You have succesfully unsubscribed')</script>"
    return redirect('/')


if __name__ == '__main__':
    db.create_all()
    app.register_error_handler(404, err_404)
    Flask.run(self=app, debug=True)
