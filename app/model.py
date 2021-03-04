from datetime import datetime
from app import db


class lancamentos(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipo = db.Column(db.String(80), nullable=False)
    categoria = db.Column(db.String(80))
    descricao = db.Column(db.String(150))
    valor = db.Column(db.Float(), nullable=False)
    data_lancamento = db.Column(db.DateTime(), nullable=False, default=datetime.now)

    def __repr__(self):
        return "{}, {}, {}, {}, {}, {}".format(self.id, self.tipo, self.categoria, self.descricao, self.valor, self.data_lancamento)