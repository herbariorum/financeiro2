$(document).ready(function () {

    $(document).on('dblclick','#tblEditavel tbody tr td.editavel', () => {
        var corpoTabela = $(".listagem").find("tbody");
        var linha = "<tr>"+
                    "<td>Teste</td>"+
                    "<td>Teste</td>"+
                    "</tr>";

        corpoTabela.append(linha);
    });

});