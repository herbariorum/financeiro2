$(document).ready(function () {

    // atualiza campos individuias
    function atualizaNoBD(elemento, id, coluna, conteudo) {
        var data = { "id": id, "campo": coluna, "valor": conteudo };
        var csrftoken = $('meta[name=csrf-token]').attr('content');
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        $.ajax({
            url: '/pages/update',
            type: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            success: function (retorno) {
                if (retorno['result'] == 'success') {
                    if (coluna == 'valor') {
                        elemento.parent().html(conteudo + ',00');
                    } else {
                        elemento.parent().html(conteudo);
                    }

                    if ($('#alert').attr('id') == 'alert') {
                        $('#alert').addClass('alert alert-success');
                        $('#alert').text('Registro atualizado com sucesso.');
                    }
                    setTimeout(() => {
                        $('#alert').fadeOut().empty();
                    }, 5000);
                } else if (retorno['result'] == 'error') {
                    if ($('#alert').attr('id') == 'alert') {
                        $('#alert').addClass('alert alert-danger');
                        $('#alert').text('Não foi possível atualizar o registro.');
                    }
                    setTimeout(() => {
                        $('#alert').fadeOut().empty();
                    }, 5000);
                }
            }
        });
    }

    // após criar uma nova linha com campos
    // salvar no banco de dados
    // a função busca no BD o último id
    // e adiciona um nova linha a tabela
    function criarNovaLinha(dados){
        var csrftoken = $('meta[name=csrf-token]').attr('content');
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        const req = $.ajax({
            url: '/pages/create',
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8'
        });
        req.done((data)=>{
            // remove a linha que contem os campos
            $('.emEdicao').fadeOut(1000).remove();
            // adicionar nova linha a tabela            
            var corpoTabela = $("#tblEditavel").find("tbody");
            var formataData = new Date(dados['data_lancamento']);
            formataData = formataData.toLocaleDateString('pt-Br', { timeZone: 'UTC' });
            var linha = '<tr>';
                linha+= '<td data-id='+data['rows']+'>'+data['rows']+'</td>';
                linha+= '<td class="editavel" style="text-transform: capitalize;">'+dados['tipo']+'</td>';
                linha+= '<td class="editavel" style="text-transform: capitalize;">'+dados['categoria']+'</td>';
                linha+= '<td class="editavel" style="text-transform: capitalize;">'+dados['descricao']+'</td>';
                linha+= '<td class="editavel">'+dados['valor']+',00'+'</td>';
                linha+= '<td class="editavel">'+formataData+'</td>';
                linha+= '<td style="text-align: center; font-size: 21px; color: #cc4b37;">';
                linha+= '<a href="#" class="remover"><i class="fas fa-trash"></i></a>';
                linha+= '</td>';
                linha+= '</tr>';
            corpoTabela.append(linha).fadeIn(1000);

        })
        
    }

    // insere a linha completa no banco de dados
    function InsertNoBD(dados) {
        var csrftoken = $('meta[name=csrf-token]').attr('content');
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        const req = $.ajax({
            url: '/pages/create',
            type: 'POST',
            data: JSON.stringify(dados),
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8'
        });

        req.done((data) => {
            // dados {"tipo": "receita", "categoria": "teste3","descricao": "t3","valor": "20", "data_lancamento": "2021-03-02"}
            // data {"result": "success"}
            // fadeOut -> apaga   fadeIn -> mostra
            
            if (data['result'] == 'success') {    
                criarNovaLinha(dados);
                if ($('#alert').attr('id') == 'alert') {
                    $('#alert').addClass('alert alert-success');
                    $('#alert').text('Registro salvo com sucesso.');
                }
                setTimeout(() => {
                    $('#alert').fadeOut().empty();
                }, 5000);

            } else if (data['result'] == 'error') {
                if ($('#alert').attr('id') == 'alert') {
                    $('#alert').addClass('alert alert-danger');
                    $('#alert').text('Não foi possível inserir os registros.');
                }
                setTimeout(() => {
                    $('#alert').fadeOut().empty();
                }, 5000);
            }
        });

    }
    // verifica se o valor é zero ou vazio
    function validarDados(value) {
        if (value == '0' || value.length === 0) {
            return false;
        } else {
            return true;
        }

    }

    // verifica se o array é valido
    function isInvalid(currentValue, index, arr) {
        return currentValue == true;
    }

    // função para salvar dados clicáveis na tabela
    // salva dados individualmente
    $('#tblEditavel tbody tr td.editavel').dblclick(function () {
        // verifica se existe um objeto input filho de td
        if ($('td > input').length > 0) {
            return;
        }
        var linha = $(this).parent().index() + 1; //pega o valor da linha
        var coluna = $(this).index();
        var table = document.getElementById('tblEditavel');
        var columnName = table.rows[0].cells[coluna].textContent.toLowerCase();
        var id = table.rows[linha].cells[0].textContent;

        var conteudoOriginal = $(this).text();
        var elementInput = $('<input/>', { type: 'text', name: columnName, id: columnName, value: conteudoOriginal }) // passo o input e seus atributos

        var elementDate = $('<input/>', { type: 'date', name: columnName, id: columnName, value: conteudoOriginal });

        if (columnName != 'data') {
            $(this).html(elementInput);
            elementInput.bind('blur keydown', function (e) {
                var keyCode = e.which;
                var conteudoNovo = $(this).val();
                if (keyCode == 13 && conteudoNovo != "" && conteudoNovo != conteudoOriginal) {
                    atualizaNoBD($(this), id, columnName, conteudoNovo);
                }
                if (keyCode == 27 || e.type == "blur") {
                    $(this).parent().html(conteudoOriginal);
                }
            })
        } else if (columnName == 'data') {
            $(this).html(elementDate);
            elementDate.bind('blur keydown', function (e) {
                var keyCode = e.which;
                var conteudoNovo = new Date($(this).val());
                conteudoNovo = conteudoNovo.toLocaleDateString('pt-Br', { timeZone: 'UTC' });

                if (keyCode == 13 && conteudoNovo != "" && conteudoNovo != conteudoOriginal) {
                    atualizaNoBD($(this), id, columnName, conteudoNovo);
                }
                if (keyCode == 27 || e.type == "blur") {
                    $(this).parent().html(conteudoOriginal);
                }
            })
        }
        // após elemento já criado, seleciona o conteúdo dentro do input
        $(this).children().select();
    });

    // cria uma nova linha com campos 
    $(document).on('click', '.adicionar', function () {
        var options = '<option value="0">Selecione</option>';
        options += '<option value="receita">Receita</option>';
        options += '<option value="despesa">Despesa</option>';
        var tipo = '<select name="tipo" id="tipo" class="form-select">' + options + '</select>' // passo o input e seus atributos
        var categoria = "<input type= 'text', class='form-control', name= 'categoria', id= 'categoria', value= '' />";
        var descricao = "<input type= 'text', class='form-control', name= 'descricao', id= 'descricao', value= ''/>";
        var valor = "<input type= 'text', class='form-control', name= 'valor', id= 'valor', value= ''/>";
        var data_lancamento = "<input type='date', class='form-control', name= 'data_lancamento', id= 'data_lancamento', value= ''/>";

        var linha = '<tr class="emEdicao">';
        linha += '<td></td>';
        linha += '<td class="editavel" >' + tipo + '</td>';
        linha += '<td class="editavel" >' + categoria + '</td>';
        linha += '<td class="editavel" >' + descricao + '</td>';
        linha += '<td class="editavel" >' + valor + '</td>';
        linha += '<td class="editavel" >' + data_lancamento + '</td>';
        linha += '<td class="botoes" ><a href="#" class="salvar" ><i class="fas fa-save"></i></a>';
        linha += '<a href="#" class="cancelar"><i class="fas fa-window-close"></i></a></td>';
        linha += '</tr>';
        var corpoTabela = $("#tblEditavel").find("tbody");
        corpoTabela.append(linha);


    });
    // on é utilizado porque o botão é criado dinamicamente
    // remove a linha com campos para inserção
    $(document).on('click', '.cancelar', function () {
        $(this).closest('tr').fadeOut(300).remove();
    });

    // salvar no banco de dados a linha completa
    // utiliza a função InsertNoBD
    $(document).on('click', '.salvar', function () {
        var tipo = $.trim($("#tipo option:selected").val());
        var categoria = $.trim($('#categoria').val());
        var descricao = $.trim($('#descricao').val());
        var valor = $.trim($('#valor').val());
        var data_lancamento = $.trim($('#data_lancamento').val());

        selectorValues = [validarDados(tipo), validarDados(categoria), validarDados(descricao), validarDados(valor), validarDados(data_lancamento)];
        var validate = selectorValues.every(isInvalid);
        var data;
        if (validate == true) {
            $('.emEdicao').css('border', "1px solid #0a0a0a");
            data = { "tipo": tipo, "categoria": categoria, "descricao": descricao, "valor": valor, "data_lancamento": data_lancamento };
            InsertNoBD(data);
        } else {
            if ($('#alert').attr('id') == 'alert') {
                $('#alert').addClass('alert alert-warning');
                $('#alert').text('Todos os campos devem ser preenchidos.');
                $('.emEdicao').css('border', "2px solid red");
            }
            setTimeout(() => {
                $('#alert').fadeOut().empty();
            }, 5000);
        }


    });

    // remove uma linha da tabela
    $('#tblEditavel').on('click', '.remover', function(e){
        
        e.preventDefault;
        var id = $(this).closest('tr').find('td').attr('data-id');
        
        var dados = {'id': id}
        var csrftoken = $('meta[name=csrf-token]').attr('content');

        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        const req = $.ajax({
            url: '/pages/delete',
            type: 'POST',
            data: JSON.stringify(dados),
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8'
        });

        req.done((retorno)=>{
            if (retorno['result'] == 'success') {   
                // remove a linha que contem os campos    
                $(this).closest('tr').fadeOut(300).remove();  
                if ($('#alert').attr('id') == 'alert') {
                    $('#alert').addClass('alert alert-success');
                    $('#alert').text('Registro excluido com sucesso.');
                }
                setTimeout(() => {
                    $('#alert').fadeOut().empty();
                }, 5000);

            }else if (retorno['result'] == 'error') {
                if ($('#alert').attr('id') == 'alert') {
                    $('#alert').addClass('alert alert-danger');
                    $('#alert').text('Não foi possível excluir o registro.');
                }
                setTimeout(() => {
                    $('#alert').fadeOut().empty();
                }, 5000);
            }
        });
    });

    // torna a primeira letra maiuscula
    $(".editavel").css('text-transform', 'capitalize');

    // para os alertas gerados pelo flask

    if ($('.flashes').attr('id') == 'mensagem'){
        $('.flashes').addClass('alert alert-danger');  
        setTimeout(()=>{
            $('.flashes').fadeOut().empty();
        }, 1500) ;     
    }
    

    // ------------------------------------------ //
    //                 PESQUISA                   //
    // ------------------------------------------//
    

    // Exibe o dropdown selecionado no input hidden
    $('.search-panel .dropdown-menu').find('a').click(function(e){
        e.preventDefault();
        var param = $(this).attr("href").replace("#","");
        var concept = $(this).text();        
        $('.search-panel span#search_concept').text(concept);
        $('input#search_param').val(param);        
        
    });

    // $(document).on('click','.localizar', ()=> {
    //     // valor a ser pesquisado
    //     var valor = $('#search_value').val().toLowerCase();
    //     // campo de pesquisa
    //     var campo = $('input#search_param').val();
    //     var data = { "campo": campo, "valor": valor };
    //     var csrftoken = $('meta[name=csrf-token]').attr('content');
    //     $.ajaxSetup({
    //         beforeSend: function (xhr, settings) {
    //             if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
    //                 xhr.setRequestHeader("X-CSRFToken", csrftoken);
    //             }
    //         }
    //     });
    //     $.ajax({
    //         url: '/pages/index',
    //         type: 'POST',
    //         data: JSON.stringify(data),
    //         dataType: 'json',
    //         contentType: 'application/json; charset=UTF-8'
    //     });
    // } )
});




