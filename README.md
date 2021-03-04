# EXEMPLO FINANCEIRO 2
Criado por José Elias G. Lima
@2021


### O básico
crie o diretório da aplicação, caso baixe o zip
Ex. $mdkir financeiro
ou clone:
```
   $git clone <Projeto>
```
entre no mesmo:
```
    $cd financeiro
```
crie o ambiente virtual
```
   $python -m venv venv
 ```
ative o ambiente
```
   $source venv/bin/activate
   ```
instale os requisitos básicos:
```
   $pip install -r requirements.txt
```
### Em config.py, pode-se alterar o número de páginas através da constante POSTS_PER_PAGE
   Neste arquivo também é possível alterar as configurações de Banco de Dados.
   O model.py, contém todos os campos necessários à migração para o Banco de Dados.


### Usando o flask para criar o banco de dados
```
   $flask db init
   $flask db migrate -m "Migração Inicial"
   $flask db upgrade
```
### crie o arquivo .flaskenv com o conteúdo:
```
FLASK_APP=app
FLASK_ENV=development
FLASK_RUN_EXTRA_FILES=README.md
```

### Desative o projeto 
```
   $deactivate
```
