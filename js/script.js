$(function(){
  var Q = "";

  // random
  function render(o){
    var t,c;
    $('#contents').empty();
    for(var i = 0; i < o.length; i ++){
      //console.log(o[i]);
      t = o[i].thumb;
      c = o[i].category;
      $('#contents').append(
        $('<div>')
          .addClass('piece')
          .append($('<img>').attr('src',t))
          .append($('<div>').text(c))
	  .attr('data-category', c)
      );
    }
  }
  function renderDetail(o){
    var t,l;
    $('#contents2').empty();
    for(var i = 0; i < o.length; i ++){
      //console.log(o[i]);
      t = o[i].thumb;
      l = o[i].link;
      $('#contents2').append(
        $('<div>')
          .addClass('piece')
	  .attr('data-link',l)
	  .attr('data-img',t)
          .append($('<img>').attr('src',t))
      );
    }
  }
 
 function getLoading(){
   return $('<div>').append($('<img>').attr('src','loading.gif'));
 }

 function makeHash(q,link, img){
   document.location.hash = "q=" +  encodeURIComponent(q) + "&link=" + encodeURIComponent(link) + "&img=" + encodeURIComponent(img);
   remakeTw();
 }
 function parseHash(hash){
   hash = hash.replace("#", "");
   var list = hash.split('&');
   var params = {};
   var tmp;
   for(var i = 0; i < list.length; i ++){
     tmp = list[i].split('=');
     params[tmp[0]] = decodeURIComponent(tmp[1]);
   }

   // validate
   if(params.img){
   gimg = params.img
     if(params.img.search(/^http:\/\/bjin\.me\//) == -1){
       params.img = '';
     }
   }
   if(params.link){
     if(params.link.search(/^http:\/\/bjin\.me\//) == -1){
       params.link = '';
     }
   }

   return params;
 }
  
  // id
  function idSearch(q){
   Q = q;
   $('.pickup').hide('fast');
   $('html,body').animate({ scrollTop: 0 }, 'fast');

   $('.detail').fadeIn();
   $('#contents2').empty();
   $('#contents2').append(getLoading());
   $('.detail-name').text(q);
   $('#contents2').append($('<div>').addClass('tw'))

   makeHash(q, '', '');

   $.ajax({
    url: 'proxy.php',
    data: 'type=search&count=20&format=json&query=' + encodeURIComponent(q),
    dataType: 'json',
    success:function(o){
      var i;
      for(i = 0; i < o.length; i ++){
        //console.log(o[i].category, o[i].id);
	detailSearch(o[i].id);
      }
    }
   });
  }

  function pickup(link, img){
    makeHash(Q, link, img);
    $('html,body').animate({ scrollTop: 0 }, 'slow');
    $('.pickup-inner').empty();
    $('.pickup').show('fast');
    $('.pickup-inner').append(
      $('<a>')
        .attr('href',link)
        .attr('target','_blank')
        .append($('<img>').attr('src', img))
        .append($('<div>').text('bijin.me で詳しく見る'))
    )
  }

  function detailSearch(id){
    $.ajax({
      url: 'proxy.php',
      data: 'type=detail&count=50&format=json&id=' + encodeURIComponent(id),
      dataType: 'json',
      success:function(o){
        //console.log('details',o);
	renderDetail(o);
      }
    });
  }
  
 
  function shuffle(){
    $('.pickup').hide();
    $('.detail').hide();
    $('#contents').empty()
    $('#contents').append(getLoading());
    $.ajax({
      url: 'proxy.php',
      data: 'type=rand&count=20&format=json',
      dataType: 'json',
      success:function(o){
        render(o);
      }
    });
  }
  shuffle();


  $('.pickup').hide();
  $('.detail').hide();
  $('.shuffle').click(function(){ shuffle(); });
  $('#contents').delegate('.piece','click', function(){
    var target = $(this);
    var category = target.attr('data-category');
    idSearch(category);
  });
  $('#contents2').delegate('.piece','click', function(){
    var target = $(this);
    var link = target.attr('data-link');
    var img = target.attr('data-img');
    pickup(link, img);
  });

  function remakeTw(){
    $('.tw').empty();
    $('.tw').html('<a href="https://twitter.com/share" class="twitter-share-button" data-lang="ja" data-count="none">ツイート</a>');

   setTimeout(function(){
   twttr.widgets.load();
// iframe要素とURLを取得
var elTwFrame = document.querySelector('.tw iframe');
console.log(elTwFrame)
var url = elTwFrame.src;

// 任意の文章のボタンを表示するURLを生成
var nextUrl = url
  .replace(/([#&]url=)([^&]+)/, function(s, m1, m2) {
    return m1 + encodeURIComponent(document.location.href);
  });

// URLを書き換え
// （"#"以降の書き換えだと画面が再読み込みされずボタンが変わらないので、
//   一度別のURLに変更してから目的のものを設定する。）
$('.tw iframe').each(function(){
  if(this.src == 'about:blank' || this.src == nextUrl)return;
  this.src = 'about:blank';
  var that = this;
  setTimeout(function() {
    that.src = nextUrl;
  }, 10);
});
    },500);

  }

  var hash = document.location.hash;
  var params;
  if(hash){
    params = parseHash(hash);
    if(params.q){
      idSearch(params.q);
    }
    if(params.img && params.link){
      pickup(params.link, params.img);
    }
  }

  remakeTw();
});
