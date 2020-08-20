from flask_sqlalchemy import SQLAlchemy
import datetime

db=SQLAlchemy()


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
        return str({'id':self.id,  'name':self.name, 'email':self.email, 'date':self.date, 'content':self.content})
