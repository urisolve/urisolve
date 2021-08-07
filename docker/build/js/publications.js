
/*
 * publications modal
 * List of U=RIsolve Publications
 */

function openPublicationsModal(){

    let title = "Published Work";
    if(document.getElementById("lang-sel-txt").innerText.toLowerCase() == "português")
        title = "Publicações";

    let pubList = new Array();

    let pub0 = {
        ref:'L. Sousa, M. Alves, and F. Pereira, “U=RIsolve: Teaching & self-learning the nodal analysis method the easy way”. CASHE &#8211 Conference on Academic Success in Higher Education, Politécnico do Porto (ISEP/IPP). Best presentation award',
        year: 2019,
        link:'https://www.isep.ipp.pt/files/CASHE_Talk11.pdf'
    };

    let pub1 = {
        ref:'L. Sousa, “U=RIsolve: a web-based tool for teaching & self-learning the nodal voltage method”. Master’s thesis, Politécnico do Porto (ISEP/IPP), TID: 202550532',
        year: 2020,
        link:'http://hdl.handle.net/10400.22/16940'
    };

    let pub2 = {
        ref:'L. Sousa, A. Rocha, M. Alves and F. Pereira, “Revisiting the nodal voltage method for both human comprehension and software implementation: Towards a teaching/self-learning simulation tool”. Computer Applications in Engineering Education, Wiley',
        year: 2021,
        link:'https://doi.org/10.1002/cae.22414'
    };

    let pub3 = {
        ref:'L. Sousa, A. Rocha, M. Alves and F. Pereira, “U=RIsolve: a web-based application for learning electrical circuit analysis”. Accepted for publication on IEEE Circuits and Systems Magazine',
        year: 2021,
        link:'https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7384'
    };

    pubList.push(pub3,pub2,pub1,pub0);

    let htmlcontent  = '<div class="modal-dialog modal-lg" role="document"><div class="modal-content">';
    htmlcontent += '<div class="modal-header"><h4 class="modal-title text-center"><span>'+title+'</span></h4>';
    htmlcontent += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button></div>';
    htmlcontent += '<div class="modal-body"><div style="margin:20px;">';
    for (let i = 0; i< pubList.length; i++){
        htmlcontent += '<dl class="row"><dt class="col-1">'+pubList[i].year+'</dt><dd class="col-11 pl-4"">'+ pubList[i].ref+'. ';
        htmlcontent += '</br><strong>[Online]</strong> Available at: <a href="' + pubList[i].link + '">'+ pubList[i].link +'</a>. </dd></dl>';
        if(i<pubList.length-1)
            htmlcontent += '<hr style="padding-left:50px; border:none; height: 20px; width: 95%;height: 50px;margin-top: 0;border-bottom: 1px solid #b5b2af; box-shadow: 0 10px 10px -10px #b7b3b3; margin: -50px auto 10px;">';
    }

    htmlcontent += '</div></div>';

    htmlcontent += '<div class="modal-footer"><img src="img/logo_350px.png" alt="" class="img-fluid ml-auto" style="max-width: 150px;"><div>'
    htmlcontent += '</div></div>';



    $('#publicationsModal').html(htmlcontent);
    setTimeout(function(){
        $('#publicationsModal').modal('show');    
    }, 230);
}