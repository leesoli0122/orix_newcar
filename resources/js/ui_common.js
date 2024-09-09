
/*********************************************************************
	SELECT #셀렉트
*********************************************************************/
/*---------------------------------------------
	Custom Select Functionn
---------------------------------------------*/

var customSelect = function(element) {
	
	/* Funtion Define */
	var fnName = '[data-stove="select"]'
		$this = $(element).closest(fnName),
		$select = $this.find('select');
		$stage = $('body');

	/* Class Define */
	var	onClass = 'on',
		dimClass = 'stove-dim',
		optionLayerClass = 'stove-option-layer',
		optionLayerScrollClass = 'stove-option-scroll',
		optionLayerCloseClass = 'stove-btn-close',
		optionTitleClass = 'stove-options-title',
		optionListClass= 'stove-options',
		optionClass = 'stove-option';

	/* Extend Define */
	var	nowStatus = $this.attr('data-status'),
		statusDisabled = $select.attr('disabled'),
		statusReadonly = $select.attr('readonly'),
		uiCase = $this.attr('data-uicase'),
		optionLength = $select.children('option').length;
		

	/* Reset */
	if ( statusDisabled == 'disabled' ||  statusReadonly == 'readonly' ) return;
	$(fnName).find('.'+dimClass+', .'+optionLayerClass+'').remove();

	/* Option Init */
	$select.before('<div class="'+dimClass+'"></div>');	
	$select.after('<div class="'+optionLayerClass+'" role="dialog"></div>');
	
	var $dim = $this.find('.'+dimClass),
		$optionLayer = $this.find('.'+optionLayerClass);
	var $optionScroll = $('<div>', {
			class: optionLayerScrollClass
		}).appendTo($optionLayer);
	var $optionList = $('<div>', {
			class: optionListClass
		}).appendTo($optionScroll);
		
	if ( uiCase == 'slide' ) {
		$('<div>', {
			class: optionTitleClass,
			text: $select.attr('title')
		}).appendTo($optionLayer);
	}  

	var $closeBtn = $('<button>', {
		class: optionLayerCloseClass,
		title: '닫기'
	}).appendTo($optionLayer);

	for ( var i = 0; i < optionLength; i++ ) {
		var option = $select.children('option').eq(i);
		if ( option.attr('hidden') ) {
 
		} else if ( option.attr('disabled') ) {
			$('<button>', {
				class: optionClass,
				text: option.text(),
				rel: option.val(),
				disabled: 'disabled'
			}).appendTo($optionList);
		} else {
			$('<button>', {
				class: optionClass,
				text: option.text(),
				rel: option.val()
			}).appendTo($optionList);
		}
	}

	var $optionBtn = $optionList.find('button');
	setTimeout(function(){
		$optionBtn.each(function(){
			var thisRel = $(this).attr('rel'),
				thisValue = $select.val();
			if ( thisRel == thisValue ) {
				$(this).addClass(onClass);
			}
		})			
	}, 0);

		
	/* Common Function */
	function open(){
		$optionLayer.addClass('va-'+uiCase);
		if ( uiCase == 'slide' ) {
			setTimeout(function(){
				$dim.addClass(onClass);
				$optionLayer.addClass(onClass)
				$stage.css({'overflow':'hidden'})
			}, 0);
			setTimeout(function(){
				$optionLayer.attr('tabindex', 0).focus();
			}, 0);
			$dim.click(function(e) {
				e.stopPropagation();
				close();
			});
		} else {
			$optionLayer.attr('tabindex', 0).focus();
			$stage.on({ 
				click: function(e) { 
					if(!$(e.target).hasClass($this)) {
						close();
					};
				}, keydown: function(e) { 
					if ( e.keyCode==27 ) {
						e.stopPropagation();
						close();
					};
				}
			});
		};
		$this.attr('data-status','open');
	};

	function close(){
		if ( uiCase == 'slide' ) {
			setTimeout(function(){
				$dim.remove();
				$optionLayer.remove();
				$stage.css({'overflow':'auto'})
			}, 0);
		} else {
			$stage.off('click keydown');
			setTimeout(function(){
				$optionLayer.remove();
			}, 0);
		};
		setTimeout(function(){
			$select.focus();
			$this.removeAttr('data-status');
		}, 1);
		return;
	};

	/* Event Binding */
	$select.on({
		keydown: function(e) {
			if ( e.keyCode==27 ) {
				e.stopPropagation();
				close();
			};
		}
	});

	$optionLayer.on({
		click: function(e) {
			e.stopPropagation();
		}, keydown: function(e) {
			if ( e.keyCode==27 ) {
				e.stopPropagation();
				close();
			};
		}
	});

	$closeBtn.on({
		click: function(e) {
			e.stopPropagation();
			close();
		}, blur: function(e) { 	
			$optionLayer.addClass(onClass).attr('tabindex', 0).focus();
		}
	});

	$optionBtn.on({
		click: function(e) {
			e.stopPropagation();
			$select.val($(this).attr('rel'));
			close();
		}
	});
		
	/* Init */
	if ( nowStatus == 'open' ) {
		close();
	} else {
		open();
	}
	
}

/*---------------------------------------------
	Custom Select Event
---------------------------------------------*/

/* 셀렉트박스 이벤트바인딩*/
$(document).on('mousedown','.se-select[data-stove="select"] select',function(e){
	e.preventDefault();
});
$(document).on('keydown','.se-select[data-stove="select"] select',function(e){
	if ( e.keyCode==13 || e.keyCode==32 ) {
		e.preventDefault();
		customSelect($(this));
	}
});
$(document).on('click','.se-select[data-stove="select"] select',function(e){
	e.preventDefault();
	customSelect($(this));
});

/*********************************************************************
	TOGGLE_ACCORDION #토글_아코디언 [QnA]
*********************************************************************/
/*---------------------------------------------
	Toggle_Accordion [QnA]
---------------------------------------------*/
document.addEventListener('DOMContentLoaded', function() {
    function toggleChkHandlers() {
        var toggles = document.querySelectorAll('.toggleChk');

        toggles.forEach(function(toggle) {
            toggle.addEventListener('click', function() {
                var toggleCont = this.parentElement.querySelector('.ques-cont');
                var isOpen = this.classList.toggle('active');
                toggleCont.classList.toggle('active');

                if (isOpen) {
                    this.setAttribute('title', '닫힘');
                } else {
                    this.setAttribute('title', '열림');
                }
            });
        });
    }

    // 이벤트 리스너가 로드된 후 함수 실행
    toggleChkHandlers();
});

