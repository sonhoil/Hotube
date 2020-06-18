$(function () {
    $('#replyform').submit(function(e){
            // alert('댓글쓰기 완료');
            url =  $('#replyform').attr('action'); //원래 다녀와야하는 url
            params =  $('#replyform').serialize(); //현재 폼에 담겨있는 값들을 가지고 올 수 있게 해준다.
            $.ajax({
                dataType: 'text',
                url:url,
                method : "GET", 
                data: params,
                error : function() {
                    alert('통신실패!!');
                },
                success : function(data) {
                    console.log(location.href)
                    
                    $("div#replys").load(location.href+` div.replybox`);
                    
                    console.log("pass")
                   
                }
            })
            $('input[name="reply"]').val("");
        
        return false;   //이게 없으면 다시 리로드 되서 다녀온다.
    });
});