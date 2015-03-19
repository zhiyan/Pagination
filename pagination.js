(function(){

	var defaultOptions = {
		"nextText" : "下一页",
		"prevText" : "上一页",
		"firstText" : "首页",
		"lastText" : "尾页",
		"gotoText": "前往",
		"maxSize" : false,
		"currentPage" : 1,
		"pageSize" : 0,
		"prefix" : "pagination",
		"simple" : false,
		"goto" : false,
		"callback" : function(){ return this; }
	}

	function Pagination( el, options ){
		this.elem = el;

		// opstions
		this.setOptions( null, true );

		if( options ){
			this.setOptions( options );
			this.render();
		}
		return this;
	}

	Pagination.prototype.render = function( options ){
		this.update( options );
		this.bindEvent();
		return this;
	}

	Pagination.prototype.update = function( options ){
		var page = createElement( "div", this.options.prefix ),
			scope,
			domInput,
			domGoto,
			domPage,
			domFirst,
			domLast,
			domPrev,
			domNext,
			domPageNode;

		this.setOptions( options );

		options = this.options;
		scope = calScope( options.currentPage,options.maxSize, options.pageSize);
		domPage = createElement( "div", this.usePrefix( "pages" ) );

		// make goto input
		if( options.goto ){
			domInput = createElement( "input", this.usePrefix( "input" ), options.currentPage );
			domInput.type = "text";
			page.appendChild( domInput );

			domGoto = createElement( "button", this.usePrefix( "goto" ), options.gotoText );
			page.appendChild( domGoto );
		}

		// make first pageObj
		if( !options.simple ){
			domFirst = createElement( "a", this.usePrefix( "first" ), options.firstText );
			if( options.currentPage === 1 ){
				domFirst.className += " " + this.usePrefix( "disabled" );
			}else{
				domFirst.setAttribute( this.usePrefix("rel"),  1 );
			};
			domPage.appendChild( domFirst );
		}

		// make prev pageObj
		domPrev = createElement( "a", this.usePrefix( "prev" ), options.prevText );
		if( options.currentPage === 1 ){
			domPrev.className += " " + this.usePrefix( "disabled" );
		}else{
			domPrev.setAttribute( this.usePrefix("rel"),  options.currentPage - 1 );
		};
		domPage.appendChild( domPrev );

		// make pageList
		if( scope[0] > 1 ){
			domPage.appendChild( createElement( "span", null, "..." ) );
		}
		for( var i = scope[0]; i <= scope[1]; i++ ){
			domPageNode = createElement( "a", options.currentPage === i ? this.usePrefix( "current" ) : null, i );
			if( options.currentPage !== i ){
				domPageNode.setAttribute( this.usePrefix("rel"), i )
			}
			domPage.appendChild( domPageNode );
		}
		if( scope[1] < options.pageSize  ){
			domPage.appendChild( createElement( "span", null, "..." ) );
		}

		// make next pageObj
		domNext = createElement( "a", this.usePrefix( "next" ), this.options.nextText );
		if( options.currentPage >= options.pageSize ){
			domNext.className += " " + this.usePrefix( "disabled" );
		}else{
			domNext.setAttribute( this.usePrefix("rel"),  options.currentPage + 1 );
		};
		domPage.appendChild( domNext );

		// make last pageObj
		if( !options.simple ){
			domFirst = createElement( "a", this.usePrefix( "last" ), options.lastText );
			if( options.currentPage >= options.pageSize ){
				domFirst.className += " " + this.usePrefix( "disabled" );
			}else{
				domFirst.setAttribute( this.usePrefix("rel"),  options.pageSize );
			};
			domPage.appendChild( domFirst );
		}

		page.appendChild( domPage );
		this.elem.innerHTML = "";
		this.elem.appendChild( page );
		return this;
	}

	Pagination.prototype.setOptions = function( options, force ){
		if( !this.options ){
			this.options = {};
		};
		if( !!force ){
			options = defaultOptions;
		};
		if( typeof options === "object" ){
			for( var i in options ){
				this.options[i] = options[i];
			}
		}
		return this;
	}

	Pagination.prototype.usePrefix = function( text ){
		return this.options.prefix + "-" + text;
	}

	Pagination.prototype.bindEvent = function(){
		var that = this,
			rel,
			fn;
		fn = function( e ){
			var target = e.srcElement || e.target,
				pageNum;
			if( rel = target.getAttribute( that.usePrefix("rel") ) ){
				that.options.callback.call( that, +rel );
			}
			// goto
			if( target.tagName.toLowerCase() === "button" ){
				pageNum = ~~that.elem.getElementsByTagName( "input" )[0].value;
				pageNum > 0 && pageNum <= that.options.pageSize && that.options.callback.call( that, pageNum );
			}
		}
		if( this.elem.attachEvent){
			this.elem.attachEvent( "onclick", fn);
		}else{
			this.elem.addEventListener("click",fn,false)
		}
	}

	// utils
	function createElement( name, className, text ){
		var dom = document.createElement( name );
		if( !!className ){
			dom.className = className;
		}
		if( !!text ){
			name === "input" ?  ( dom.value = text ) : ( dom.innerHTML = text );
		}
		if( name === "a" ){
			dom.href = "javascript:void(0)";
		}
		return dom;
	}
	// calculate the scope of page list
	function calScope( currentPage, maxSize, pageSize ){
		var scope = [1,pageSize],
			limit = Math.floor( maxSize/2 );
		if( !!maxSize ){
			scope[0] = Math.max( currentPage - limit, 1);
			scope[1] = Math.min( currentPage + limit, pageSize);
		}
		return scope;
	}

	// exports
	this.Pagination = Pagination;

})(this);