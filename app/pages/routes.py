from app.pages import pages

from flask import render_template, redirect, url_for, request, flash, json, jsonify, current_app, session

from ..model import db, lancamentos as Lancamento
from ..pages.serialize import lancamento_schema, lancamentos_schema

from unidecode import unidecode
from datetime import datetime

from sqlalchemy import func, extract

################################
# 	CRUD					   #
################################

# CREATE
@pages.route('/create', methods=['GET','POST'])
def create():
	if request.method == "POST":
		try:
			dados = request.json		
			lc = Lancamento()
			lc.tipo = dados['tipo']
			lc.categoria = dados['categoria']
			lc.descricao = dados['descricao']
			lc.valor = dados['valor']

			data_str = dados['data_lancamento']			

			dta_lancamento = datetime.strptime(data_str, '%Y-%m-%d').date()

			lc.data_lancamento = dta_lancamento
			db.session.add(lc)
			db.session.commit()
			
			return jsonify(result='success')
		except Exception as e:
			return jsonify(result='error')
	rows = db.session.query(func.max(Lancamento.id).label('id')).one()
	
	return jsonify(rows=rows.id)

# READ
@pages.route('/', methods=['GET'])
@pages.route('/index', methods=['GET'])
def index():
	page = request.args.get('page', 1, type=int)
	per_page = current_app.config['POSTS_PER_PAGE']	
	try:
		lc = Lancamento.query.all()
		# faz pesquia por campo e valor
		pagination = Lancamento.query.order_by(Lancamento.id.asc()).paginate(
			page, per_page=per_page, error_out=False
		)
		lc = pagination.items
	except Exception:
		flash('Por favor, insira um termo para pesquisa.', 'error')
		return redirect(url_for('pages.index'))

	return render_template('pages/index.html', title='Início', msg='Lançamento', rows=lc, pagination=pagination, page=page)
   

# UPDATE atualiza o registro passado
@pages.route('/update', methods=['POST'])
def update():	
	if request.method == "POST":
		try:
			dados = request.json					
			if (dados['campo']=='data'):
				# 01/03/2021
				data_str = dados['valor']	
				data_str = data_str.split("/")

				dta_lancamento = datetime(int(data_str[2]), int(data_str[1]), int(data_str[0]))
				
				update = Lancamento.query.filter_by(id=dados['id']).update(
					{Lancamento.data_lancamento: dta_lancamento}
				)
				db.session.commit()
				return jsonify(result="success")
			else:
				update = Lancamento.query.filter_by(id=dados['id']).update(
					{unidecode(dados['campo']): dados['valor']}
				)
				db.session.commit()
				return jsonify(result="success")
		except Exception as e:			
			return jsonify(result='error')

# DELETE
@pages.route('/delete', methods=['POST'])
def delete():
	if request.method == "GET":
		return redirect(url_for('pages.index'))	
	if request.method == "POST":
		try:
			dados = request.json
			id = dados['id']
			if Lancamento.query.filter_by(id=id).first() is not None:
				row = Lancamento.query.get(id)
				db.session.delete(row)
				db.session.commit()
				return jsonify(result="success")
		except Exception as e:			
			return jsonify(result="error")

@pages.route('/search', methods=['GET','POST'])
def search():
	page = request.args.get('page', 1, type=int)
	per_page = current_app.config['POSTS_PER_PAGE']	
	
	if request.method == "POST":
		dados = request.form 
		campo = dados['search_param'] # campo type str		
		valor = dados['search_value'] # campo type str		
		# exibo mensagems caso os campos estejam vazios
		if (campo == ""):
			flash('Por favor, selecione um filtro para pesquisa.', 'error')	
			return redirect(url_for('pages.index'))
		elif (valor == ""):
			flash('Por favor, insira um termo para pesquisa.', 'error')	
			return redirect(url_for('pages.index'))
		# armazena na session
		session['search_param'] = campo
		session['search_value'] = valor
		items, pagination = pesquisa(campo, valor, page, per_page)		

		return render_template('pages/search.html', title='Pesquisa', msg='Resultado da pesquisa', rows=items, pagination=pagination, page=page)
	
	campo = session['search_param']
	valor = session['search_value']
	items, pagination = pesquisa(campo, valor, page, per_page)
	return render_template('pages/search.html', title='Pesquisa', msg='Resultado da pesquisa', rows=items, pagination=pagination, page=page)


def pesquisa(campo, valor, page, itens_por_pagina):
	search = "%{}%".format(valor)
	if campo == 'tipo':		
		pagination = Lancamento.query.filter(Lancamento.tipo.like(search)).paginate(
			page, per_page=itens_por_pagina, error_out=False
		)		
		items = pagination.items
	elif (campo == 'categoria'):
		pagination = Lancamento.query.filter(Lancamento.categoria.like(search)).paginate(
			page, per_page=itens_por_pagina, error_out=False
		)		
		items = pagination.items
	elif (campo == 'descricao'):
		pagination = Lancamento.query.filter(Lancamento.descricao.like(search)).paginate(
			page, per_page=itens_por_pagina, error_out=False
		)		
		items = pagination.items
		
	elif (campo == 'valor'):
		pagination = Lancamento.query.filter(Lancamento.valor.like(search)).paginate(
			page, per_page=itens_por_pagina, error_out=False
		)		
		items = pagination.items
	elif (campo == 'data'):
		data_str = valor.split("/")
		dta_lancamento = datetime(int(data_str[2]), int(data_str[1]), int(data_str[0]))
		search = "%{}%".format(dta_lancamento)
		pagination = Lancamento.query.filter(Lancamento.data_lancamento.like(search)).paginate(
			page, per_page=itens_por_pagina, error_out=False
		)		
		items = pagination.items
		
	elif( campo == 'mes_ano'):
		data_str = valor.split("/")
		ano = data_str[1]
		mes = data_str[0]
		pagination = Lancamento.query.filter(extract('month', Lancamento.data_lancamento)== mes).filter(extract('year', Lancamento.data_lancamento) == ano).paginate(
			page, per_page=itens_por_pagina, error_out=False
		)		
		items = pagination.items


		# items = pagination.items
	return items , pagination