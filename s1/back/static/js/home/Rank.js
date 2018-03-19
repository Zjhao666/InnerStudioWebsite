
$('#Rank')[0].afterDisplay=()=>{
  $('#Rank .st_name').each((i,elem)=>{
    $(elem).click(()=>{
      $('#Rank').css('display','none');
      $('#Detail').css('display','block');
      NavigateSelected=$('#Detail');
    });
  });
};
