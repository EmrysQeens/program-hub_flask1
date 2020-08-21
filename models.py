from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

class TempBlog(db.Model):
    __tablename__='nvalid_blogs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(255), nullable=False, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, name, email, title, date, content):
        self.name = name
        self.email = email
        self.title = title
        self.date = date
        self.content = content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title':self.title, 'date': self.date, 'content': self.content})


class Blog(db.Model):
    __tablename__ = 'valid_blogs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title=db.Column(db.String(255), nullable=False, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, name, email, title, date, content):
        self.name = name
        self.email = email
        self.title = title
        self.date = date
        self.content = content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title':self.title, 'date': self.date, 'content': self.content})

    def validate_blog(t_blog):
        blog=Blog(name=t_blog.name, email=t_blog.email, date=t_blog.date, title=t_blog.title, content=t_blog.content)
        db.session.add(blog)
        db.session.commit()


class Login(db.Model):
    __tablename__='admin'
    id = db.Column(db.Integer, primary_key=True)
    login_id=db.Column(db.String(35), nullable=False, unique=False)
    passcode=db.Column(db.String(35), nullable=False, unique=False)

    def __init__(self,login_id,passcode):
        self.login_id=login_id
        self.passcode=passcode

    def __repr__(self):
        return str({'id': self.id, 'login_id': self.login_id, 'passcode': self.passcode})
