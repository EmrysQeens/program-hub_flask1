from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db: SQLAlchemy = SQLAlchemy()


class Login(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    login_id = db.Column(db.String(35), nullable=False, unique=False)
    passcode = db.Column(db.String(35), nullable=False, unique=False)

    def __init__(self, login_id, passcode):
        self.login_id = login_id
        self.passcode = passcode

    def __repr__(self):
        return str({'id': self.id, 'login_id': self.login_id, 'passcode': self.passcode})


"""For the java belonging problems"""


class Java(db.Model):
    __tablename__ = 'JAVA'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the kotlin belonging problems"""


class Kotlin(db.Model):
    __tablename__ = 'KOTLIN'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the python belonging problems"""


class Python(db.Model):
    __tablename__ = 'PYTHON'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the C belonging problems"""


class C(db.Model):
    __tablename__ = 'C'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the C++ belonging problems"""


class Cpp(db.Model):
    __tablename__ = 'CPP'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the C# belonging problems"""


class C_Sharp(db.Model):
    __tablename__ = 'C_SHARP'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the javascript belonging problems"""


class Javascript(db.Model):
    __tablename__ = 'JAVASCRIPT'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the C belonging problems"""


class Node(db.Model):
    __tablename__ = 'NODE'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the C belonging problems"""


class Php(db.Model):
    __tablename__ = 'PHP'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


# For operating systems
"""For the linux belonging problems"""


class Linux(db.Model):
    __tablename__ = 'LINUX'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the windows belonging problems"""


class Windows(db.Model):
    __tablename__ = 'WINDOWS'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the android belonging problems"""


class Android(db.Model):
    __tablename__ = 'ANDROID'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the C belonging problems"""


class Ios(db.Model):
    __tablename__ = 'IOS'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the Computer science blogs"""


class Cs(db.Model):
    __tablename__ = 'CS'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


"""For the C belonging problems"""


class TechNews(db.Model):
    __tablename__ = 'TU'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, blog):
        self.name = blog.name
        self.email = blog.email
        self.title = blog.title
        self.error = blog.error
        self.date = blog.date
        self.content = blog.content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})


tables = {'java': Java, 'kotlin': Kotlin, 'cpp': Cpp, 'c#': C_Sharp, 'c': C, 'android': Android, 'ios': Ios,
          'linux': Linux, 'javascript': Javascript, 'php': Php, 'python': Python, 'node': Node, 'windows': Windows,
          'cs': Cs, 'tn': TechNews}


class Blog(db.Model):
    __tablename__ = 'BLOGS'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=False)
    email = db.Column(db.String(35), nullable=False, unique=False)
    title = db.Column(db.String(75), nullable=False, unique=False)
    error = db.Column(db.String(50), nullable=True, unique=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    typ= db.Column(db.String(12), nullable=False, unique=False)
    content = db.Column(db.Text, nullable=False, unique=True)

    def __init__(self, name, email, title, error, typ, content):
        self.name = name
        self.email = email
        self.title = title
        self.error = error
        self.typ=typ
        self.content = content

    def __repr__(self):
        return str({'id': self.id, 'name': self.name, 'email': self.email, 'title': self.title, 'date': self.date,
                    'content': self.content})

    def validate(self, typ: str):
        db.session.add(tables[typ](self))
        db.session.delete(self)
        db.session.commit()
        
        
        
def back_blog(blog):
    db.session.add(Blog(blog.name, blog.email, blog.title, blog.error, 'tn',  blog.content))
    db.session.delete(blog)
    db.session.commit()
