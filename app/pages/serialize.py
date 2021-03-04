from app import ma
from ..model import lancamentos
from flask_marshmallow import fields

class LancamentoSerialize(ma.Schema):
    class Meta:
        fields = ("id", "tipo", "categoria", "descricao", "valor", "data_lancamento")


lancamento_schema = LancamentoSerialize()
lancamentos_schema = LancamentoSerialize(many=True)