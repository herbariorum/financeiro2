import os
from flask import Flask, redirect, url_for
from flask_wtf import CSRFProtect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow

from app.filters.filters import datefilter, moneyfilter

db = SQLAlchemy()
ma = Marshmallow()
csrf = CSRFProtect()

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_pyfile('../config.py')

    # filtros data e moeda
    app.add_template_filter(datefilter)
    app.add_template_filter(moneyfilter)

    with app.app_context():
        db.init_app(app)
        csrf.init_app(app)
        ma.init_app(app)

        migrate = Migrate(app, db)

        from app.pages import pages as pages_blueprint
        app.register_blueprint(pages_blueprint, url_prefix='/pages')

        @app.route('/')
        @app.route('/index')
        def index():
            return redirect(url_for('pages.index'))
            
    return app