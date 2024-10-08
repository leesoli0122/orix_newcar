$(document).ready(function() {

	/*********************************************************************
		SELECT #셀렉트
	*********************************************************************/
	/*---------------------------------------------
		Custom Select Functionn
	---------------------------------------------*/
	function customSelect(element) {
		// Check iOS
		if (isIOS()) {
			return;
		}

		var fnName = '[data-stove="select"]',
			$this = $(element).closest(fnName),
			$select = $this.find('select'),
			$stage = $('body');

		/* Class Define */
		var onClass = 'on',
			dimClass = 'stove-dim',
			optionLayerClass = 'stove-option-layer',
			optionLayerScrollClass = 'stove-option-scroll',
			optionLayerCloseClass = 'stove-btn-close',
			optionTitleClass = 'stove-options-title',
			optionListClass = 'stove-options',
			optionClass = 'stove-option';

		/* Extend Define */
		var nowStatus = $this.attr('data-status'),
			statusDisabled = $select.attr('disabled'),
			statusReadonly = $select.attr('readonly'),
			uiCase = $this.attr('data-uicase'),
			optionLength = $select.children('option').length;

		/* Reset */
		if (statusDisabled == 'disabled' || statusReadonly == 'readonly') return;
		$(fnName).find('.' + dimClass + ', .' + optionLayerClass).remove();

		/* Option Init */
		initOptionLayer();

		/* Event Bindings */
		bindOptionEvents();

		/* Init */
		if (nowStatus == 'open') {
			close();
		} else {
			open();
		}

		/* Functions */
		function initOptionLayer() {
			$select.before('<div class="' + dimClass + '"></div>');
			$select.after('<div class="' + optionLayerClass + '" role="dialog"></div>');

			var $dim = $this.find('.' + dimClass),
				$optionLayer = $this.find('.' + optionLayerClass),
				$optionScroll = $('<div>', { class: optionLayerScrollClass }).appendTo($optionLayer),
				$optionList = $('<div>', { class: optionListClass }).appendTo($optionScroll);

			if (uiCase == 'slide') {
				$('<div>', { class: optionTitleClass, text: $select.attr('title') }).appendTo($optionLayer);
			}

			$('<button>', { class: optionLayerCloseClass, title: '닫기' }).appendTo($optionLayer);
			createOptionButtons($optionList, optionLength);
			highlightSelectedOption();
		}

		function createOptionButtons($optionList, optionLength) {
			for (var i = 0; i < optionLength; i++) {
				var option = $select.children('option').eq(i);
				if (option.attr('hidden')) {
					continue;
				} else if (option.attr('disabled')) {
					$('<button>', { class: optionClass, text: option.text(), rel: option.val(), disabled: 'disabled' }).appendTo($optionList);
				} else {
					$('<button>', { class: optionClass, text: option.text(), rel: option.val() }).appendTo($optionList);
				}
			}
		}

		function highlightSelectedOption() {
			setTimeout(function() {
				$this.find('button').each(function() {
					var thisRel = $(this).attr('rel'),
						thisValue = $select.val();
					if (thisRel == thisValue) {
						$(this).addClass(onClass);
					}
				});
			}, 0);
		}

		function open() {
			var $dim = $this.find('.' + dimClass),
				$optionLayer = $this.find('.' + optionLayerClass);

			$optionLayer.addClass('va-' + uiCase);

			if (uiCase == 'slide') {
				setTimeout(function() {
					$dim.addClass(onClass);
					$optionLayer.addClass(onClass);
					$stage.css({ overflow: 'hidden' });
				}, 0);

				setTimeout(function() {
					$optionLayer.attr('tabindex', 0).focus();
				}, 0);

				$dim.click(function(e) {
					e.stopPropagation();
					close();
				});
			} else {
				$optionLayer.attr('tabindex', 0).focus();
				bindGlobalEvents();
			}

			$this.attr('data-status', 'open');
		}

		function close() {
			if (uiCase == 'slide') {
				setTimeout(function() {
					$this.find('.' + dimClass).remove();
					$this.find('.' + optionLayerClass).remove();
					$stage.css({ overflow: 'auto' });
				}, 0);
			} else {
				$stage.off('click keydown');
				setTimeout(function() {
					$this.find('.' + optionLayerClass).remove();
				}, 0);
			}

			setTimeout(function() {
				$select.focus();
				$this.removeAttr('data-status');
			}, 1);
		}

		function bindOptionEvents() {
			$select.on('keydown', function(e) {
				if (e.keyCode === 27) { // ESC key
					e.stopPropagation();
					close();
				}
			});

			$this.find('.' + optionLayerClass).on({
				click: function(e) {
					e.stopPropagation();
				},
				keydown: function(e) {
					if (e.keyCode === 27) { // ESC key
						e.stopPropagation();
						close();
					}
				}
			});

			$this.find('.' + optionLayerCloseClass).on({
				click: function(e) {
					e.stopPropagation();
					close();
				},
				blur: function() {
					$this.find('.' + optionLayerClass).addClass(onClass).attr('tabindex', 0).focus();
				}
			});

			$this.find('.' + optionClass).on('click', function(e) {
				e.stopPropagation();
				$select.val($(this).attr('rel'));
				e.preventDefault(); //select 선택 시 기본 폼 리셋 x
				close();
			});
		}

		function bindGlobalEvents() {
			$stage.on({
				click: function(e) {
					if (!$(e.target).hasClass($this)) {
						close();
					}
				},
				keydown: function(e) {
					if (e.keyCode === 27) { // ESC key
						e.stopPropagation();
						close();
					}
				}
			});
		}
	}

	/*---------------------------------------------
		Check if the device is iOS
	---------------------------------------------*/
	function isIOS() {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	}

	/*---------------------------------------------
		Custom Select  Event Binding
	---------------------------------------------*/
	function customEventBindingHandlers() {
		$(document).on('mousedown', '.se-select[data-stove="select"] select', function(e) {
			if (isIOS()) {
				// iOS 기본 동작
				return;
			}
			e.preventDefault();
		});

		$(document).on('keydown', '.se-select[data-stove="select"] select', function(e) {
			if (isIOS()) {
				// iOS 기본 동작
				return;
			}
			if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
				e.preventDefault();
				customSelect($(this));
			}
		});

		$(document).on('click', '.se-select[data-stove="select"] select', function(e) {
			if (isIOS()) {
				// iOS 기본 동작
				return;
			}
			e.preventDefault();
			customSelect($(this));
		});
	}
	customEventBindingHandlers();
	
	/*********************************************************************
		Datepicker #데이터피커
	*********************************************************************/
	/*---------------------------------------------
		Custom Datepicker Functionn
	---------------------------------------------*/
	function customDatepicker(){
        // 기본 설정
        $.datepicker.setDefaults({
            // showOn: "both",
            // buttonImage:"/resources/images/ic_datepicker.png",
            // buttonImageOnly:true,
            // buttonText:"달력 선택",
            closeText: "닫기",
            prevText: "이전달",
            nextText: "다음달",
            currentText: "오늘",
            monthNames:["01", "02", "03", "04", "05", "06",
			"07", "08", "09", "10", "11", "12"
			],
			monthNamesShort:  ["01", "02", "03", "04", "05", "06",
			"07", "08", "09", "10", "11", "12"
			],
            dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
            dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
            weekHeader: "주",
            dateFormat: "yy.mm.dd",
            firstDay: 0,
            isRTL: true,
			 // yearSuffix: "년",
			minDate:null, //null
			beforeShow: function(input, inst) {
                repositionDatepicker(input, inst);
                $(window).on('scroll resize', function() {
                    repositionDatepicker(input, inst);
                });
            },
            onClose: function() {
                $(window).off('scroll resize');
            }
        });
        
        // 위치 조절 함수
        function repositionDatepicker(input, inst){
            var inputOffset = $(input).offset(); // input의 위치값 가져오기
            var inputHeight = $(input).outerHeight();
            inst.dpDiv.css({
                top: inputOffset.top + inputHeight + 'px', // input 바로 아래
                left: inputOffset.left + '-10px' // input의 왼쪽
            });
        }
        
        $('.datepicker').datepicker({
			showOtherMonths:true,
            showMonthAfterYear: true,
            showButtonPanel: true,
            changeYear: true,
            changeMonth: true,
            yearRange:'c-5:c+5'//선택 범위
        });
    
		//오늘 버튼
		var old_goToToday = $.datepicker._gotoToday;
		$.datepicker._gotoToday = function(id) {
			old_goToToday.call(this,id);
			var target = $(id); // input 포커스 설정
			target.focus();
			this._selectDate(id);
			target.blur();
		};
    }
    // Datepicker 핸들러 실행
    customDatepicker();

	/*********************************************************************
		TOGGLE_ACCORDION #토글_아코디언 [QnA]
	*********************************************************************/
	/*---------------------------------------------
		Toggle_Accordion [QnA]
	---------------------------------------------*/
    function toggleChkHandlers() {
        $(document).on('click', '.toggleChk', function(e){
			handleToggleClick($(this));
		});
		$(document).on('click','.toggleChk .btn', function(e){
			e.preventDefault();
			e.stopPropagation();
		});
    }//개발 수정

    function handleToggleClick($toggleElement) {
        var $toggleCont = $toggleElement.parent().find('.ques-cont');
        var isOpen = $toggleElement.toggleClass('active').hasClass('active');
		
        $toggleCont.toggleClass('active');
        $toggleElement.attr('title', isOpen ? '닫힘' : '열림');
    }

    toggleChkHandlers();
	
	/*********************************************************************
		Filter_fixed #필터fixed
	*********************************************************************/
	/*---------------------------------------------
		Filter_fixed [상담내역]
	---------------------------------------------*/
	function handleScroll() {
        var scrollTop = $(window).scrollTop();

        if (scrollTop > 400) {
            $('.filter').addClass('fix');
        } else {
            $('.filter').removeClass('fix');
        }
    }

    function initScrollEvent() {
        $(window).on('scroll', handleScroll);
    }

    // 이벤트 초기화 함수 실행
    initScrollEvent();

	/*********************************************************************
		Input_File #인풋_파일 업로드
	*********************************************************************/
	/*---------------------------------------------
		Input_File [파일 업로드]
	---------------------------------------------*/
    function setupFileInputHandlers() {
        const $fileInput = $('.attachmentFile');  // 파일 입력
        const $addFileList = $('.add-file'); // 파일 리스트
        const maxFiles = 3;                  // 최대 파일 개수
        const maxFileSize = 50 * 1024 * 1024; // 50MB 제한 (바이트로 변환)

        // "찾아보기" 버튼 트리거
        $('.file .btn-input').on('click', function() {
            $fileInput.click();
        });

        // 파일 선택 (50MB 이하의 xlsx, pdf, hwp, pptx, doc파일 3개까지 업로드)
        $fileInput.on('change', function() {
            // 파일 3개 있는지 확인
            if ($addFileList.children('li').length >= maxFiles) {
                messageView('최대 3개의 파일만 선택할 수 있습니다.');
                return;
            }

            const files = Array.from(this.files);

            // 선택 파일 검사
            files.forEach(function(file) {
                const fileSize = file.size;
				const filename = file.name;
				const allowFileNm = filename.split('.').pop().toLowerCase();
				var allowFile = ['jpg','xlsx','pdf','doc','hwp','pptx'];
				// 파일형식과 크기 검사 (JPC, PNG, 300MB 이하)
				// 파일형식과 크기 검사 (jpg, xlsx, pdf, doc, hwp, pptx, 50MB 이하)
				if($.inArray(allowFileNm , allowFile) === -1){
					messageView(allowFileNm+"는 지원하지 않는 확장자입니다");
					return;
				}
				if (fileSize > maxFileSize) {
					messageView('파일크기는 50MB를 초과할 수 없습니다.');
					return;
				}

				// 파일이 3개 미만일 때만 리스트에 추가
                if ($addFileList.children('li').length < maxFiles) {
                    const $newListItem = $('<li>').text(file.name);
                    const $deleteButton = $('<span>').addClass('delete-file').text('삭제'); // 삭제 버튼 추가
					const $deleteButton2 = $deleteButton.on('click',function(){
						//삭제버튼 추가
						var indexToRemove = $(this).closest('li').index();
						removeFiles(indexToRemove);
						$(this).closest('li').remove();
					})
                    $newListItem.append($deleteButton);
                    $newListItem.append($deleteButton2);
                    $addFileList.append($newListItem);
                }
            });

            // 파일 입력을 초기화
            $fileInput.val('');
        });

		// 삭제 버튼 클릭 이벤트 처리
		$addFileList.on('click', '.delete-file', function() {
			$(this).parent().remove();
			// 파일 목록 업데이트
			$uploadName.text(updatedFileNames.join(', '));
		});
    }

    setupFileInputHandlers();

	/*********************************************************************
		Select Popup [년도 선택_팝업 / 차량 선택 _ 팝업/ 실적조회_테이블]
	*********************************************************************/
	/*---------------------------------------------
		Select Popup [년도 선택_팝업 / 차량 선택 _ 팝업/ 실적조회_테이블]
	---------------------------------------------*/
	function handleContainerClick(e) {
		const container = e.currentTarget;
		const button = $(container).find('button').get(0);
		const a = $(container).find('a').get(0);

		// 초기화
		const parent = $(container).closest('.btnSelect');
		parent.find('li, div, tr td:first-child').removeClass('on');
		parent.find('button').attr('title', '');
	
		$(container).addClass('on');
		$(button).attr('title', '선택됨');
		$(a).attr('title', '선택됨');

		button.focus();
		a.focus();
	}
	
	function initContainerClickEvent() {
		$('.btnSelect').each(function() {
			$(this).find('li, div, tr td:first-child').on('click', handleContainerClick);
		});
	}

	initContainerClickEvent();

	/*********************************************************************
		scrollTop Button
	*********************************************************************/
	/*---------------------------------------------
		scrollTop
	---------------------------------------------*/
	function handleScrollTop() {
		$('.btn-top').hide();
	
		$(window).on('scroll', function() {
			var scrollTop = $(this).scrollTop();
			var windowHeight = $(this).height();
			var footerTop = $('footer').offset().top;
			var contentWrapOffset = $('#contentWrap').offset(); // #contentWrap의 위치
        	var contentWrapWidth = $('#contentWrap').outerWidth(); // #contentWrap의 너비
	
			// 위치
			if (scrollTop > 0) {
				
				if ($('.btn-top').css('display') === 'none') {
					$('.btn-top').css({
						display: 'block',
						opacity: 0
					}).stop(true, true).animate({
						opacity: 1
					}, 0);
				}
			
				if (scrollTop + windowHeight >= footerTop) {

					$('.btn-top').css({
						position: 'absolute',
						bottom: `${30}px`,
						right: '10px'
					});
				} else {
					
					$('.btn-top').css({
						position: 'fixed',
						bottom: '30px',
						right: '10px'
					});

					// contentWrap
					var buttonWidth = $('.btn-top').outerWidth();
					var contentWrapRightEdge = contentWrapOffset.left + contentWrapWidth;
					var buttonRightEdge = $(window).width() - buttonWidth - 10;
	
					// #contentWrap 밖으로 나갈 경우
					if (buttonRightEdge > contentWrapRightEdge) {
						$('.btn-top').css({
							right: `${$(window).width() - contentWrapRightEdge + 10}px`
						});
					} else {
						$('.btn-top').css({
							right: '10px' // 원래 위치
						});
					}
				}

				
				
			} else {

				$('.btn-top').css('display', 'none');
			}
		});
	
		$(document).on('click', '.btn-top', function() {
			$('html, body').stop().animate({ scrollTop: 0 }, 'linear');
		});
	}
	
	handleScrollTop();
	
	/*********************************************************************
		Input_Delete Button
	*********************************************************************/
	/*---------------------------------------------
		Input_Delete Button
	---------------------------------------------*/
	function delEvent() {

		$('.form-wrap .form-group').each(function(idx, obj) {
			var formGroup = $(obj);
	
			// input 필드를 선택
			formGroup.find('.form-control.hasCancel').off('focus').on('focus', function() {
				var inputElement = $(this);
	
				// 클래스 확인
				if (inputElement.hasClass('hasCancel')) {
	
					// 취소 버튼 표시 또는 숨기기
					inputElement.off('keyup').on('keyup', function() {
						var inputValue = inputElement.val().trim();
						var btnCancelContainer = inputElement.closest('.col-10'); // 부모
						const btnCancel = $('<button type="button" class="btn btn-cancel"><span class="ir">입력취소</span></button>');
	
						// 입력값이 있을 경우
						if (inputValue !== '') {
							if (btnCancelContainer.find('.btn-cancel').length === 0) {
								
								btnCancelContainer.append(btnCancel);
							}
						} else {
							
							btnCancelContainer.find('.btn-cancel').remove();
						}
					});
				}
			});
	
			// 동적으로 추가된 취소 버튼 클릭 이벤트 처리
			formGroup.off('click', '.btn-cancel').on('click', '.btn-cancel', function() {
				var inputElement = $(this).closest('.col-10').find('.form-control'); // 입력 필드
				inputElement.val(''); // 입력 필드 비움
				$(this).remove();     // 취소 버튼 제거
			});
		});
	}
	
	delEvent();

});

