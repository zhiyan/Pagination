# 极简分页控件
============================

    var pageNum = 1;
    var pageObj = new Pagination( document.getElementById("wrap") );
    pageObj.render({
        "pageSize" : 10,
        "simple" : true,
        "callback" : function( page ){
            this.update({
                "currentPage" : page
            });
        }
    });
    