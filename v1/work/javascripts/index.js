
function uploadimg( option , success , error) {
    var $ = jQuery,
        $list = $('.uploader-list'),
        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio,

        // Web Uploader实例
        uploader;

    // 初始化Web Uploader
    uploader = WebUploader.create({

        // 自动上传。
        auto: true,

        // swf文件路径
        //swf: BASE_URL + '/js/Uploader.swf',

        // 文件接收服务端。
        server: 'diyUpload/fileupload.php',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker',

        // 只允许选择文件，可选。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    });

    // 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {
        var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                    '<img>' +
                    '<div class="info">' + file.name + '</div>' +
                '</div>'
                ),
            $img = $li.find('img');

        $list.append( $li );

        // 创建缩略图
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
    });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        var $li = $( '#'+file.id ),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<p class="progress"><span></span></p>')
                    .appendTo( $li )
                    .find('span');
        }

        $percent.css( 'width', percentage * 100 + '%' );
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', success);

    // 文件上传失败，现实上传出错。
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) {
            $error = $('<div class="error"></div>').appendTo( $li );
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });
}


 $(function() {

    // 设置根字体大小            
    setRootFontSize = function() {
        var ww = $(".worktai").width();
        var root;

        if (ww < 320) root = 50;
        else if (320 <= ww && ww < 640) root = ww * 100 / 640;
        else if (640 <= ww) root = 100;

        $("html").css("font-size", root + "px");
    }
    
    $(document).resize(setRootFontSize).load(setRootFontSize).resize();

    function clickRegisterButton(){
        $(".right-side .pop-window").removeClass("hidden");
        $(".but1").click(function(){
            $(".pop").addClass("show");
            $(".pop-con").removeClass("show");
            $("." + $(this).val() ).addClass("show");
        });
    }   

    function clickRoleTitle(){
        //$(".rule").toggleClass("on");
        $(".right-side .guize").removeClass("hidden");
        
        var rules = $(".rule li");
        var ruleString="";
        $(".rule li").each(function(_, elem){
            ruleString += $(elem).text().replace(/^\s*/ , "")+"\r\n";
        });
        $("#guize-content").val(ruleString);
    }

    function clickImage($this){    

        $(".right-side .uploader").empty().removeClass("hidden").append($("#img-reset-tpl").text());
        uploadimg('' , function( file ) {
            $( '#'+file.id ).addClass('upload-state-done');
            var oldImgSrc = $this.prop("src");
            var imgPosition = $this.data("pos");
            var newImgSrc = "generate/images/" + $("#fileList .info:last").text();
            $this.prop("src" , newImgSrc);
            $("#fileList").find(".smallimg").remove();
        });

        $(".uploader-list").append("<img class='smallimg' width=100 height=100 src='"+ $this.prop("src") +"'>");

    }

    $(".worktai")
    .on("click", ".wrapper img , .rule , .btn-cnt .btn", function(e) {

        var $this = $(this);
        var $pop = $(".pop");
        if($pop.hasClass("show")){
            $pop.removeClass("show");
        }

        $(".right-side .tpl").addClass("hidden");

        $(".wrapper img , .rule, .btn-cnt .btn")
        .removeClass("mouse-click")
        .filter(this)
        .addClass("mouse-click");

        if($this.hasClass("rule")){
            clickRoleTitle();
        }else if($this.hasClass("btn")){
            clickRegisterButton();
        }else{
            clickImage($this);
        }
    });

    $(".close").click(function(){                
        $(".pop , .pop-con").removeClass("show");
    });

    $(".defaultSetting img").click(function(){
        var $this = $(this);
        $(".right-side .uploaderIconContainer").empty().append($("#img-reset-tpl").text());
        uploadimg('' , function( file ) {                                        
            var newImgSrc = "generate/images/" + $("#fileList .info:last").text();
            $this.prop("src" , newImgSrc);                    
        });
    });


    $(".poptxt").each(function (_, elem){                
        elem.value = $($(elem).data("elemclass")).text();                
    });

    $(".poptxt").keyup(function(){
        var newVal = $(this).val();
        var selector = $(this).data("elemclass");
        $(selector).text(newVal);
    });

});


var myApp = angular.module('myApp', []);
myApp.controller('ctrl1', ['$scope', '$http', function($scope, $http) {            
    $scope.$watch('titleColor', function () {
        $(".rule .title").css("background-color" , $scope.titleColor);
    });

    $scope.$watch('guizeContent', function () {

        if(!$scope.guizeContent){
            return ;
        }
        var rules = ($scope.guizeContent).split("\n");                
        var x = rules.join("</li><li>");
        console.log(x);
        $(".rule .cnt").empty().append("<li>" +  rules.join("</li><li>") + "</li>");

    });

    

    $scope.$watch('popupBtnColor', function () {
        $(".btn").css({
            "background-color" : $scope.popupBtnColor,
            "box-shadow" : "1px 2px 0 0 " + $scope.popupBtnColor
        });
        
    });   

    $scope.$watch('backgroundColor', function () {
        $(".wrapper").css("background-color" , $scope.backgroundColor);                
    });        
    
}]);