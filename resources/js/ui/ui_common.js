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
			// optionLayerCloseClass = 'stove-btn-close',
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

			// $('<button>', { class: optionLayerCloseClass, title: '닫기' }).appendTo($optionLayer);
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

			// $this.find('.' + optionLayerCloseClass).on({
			// 	click: function(e) {
			// 		e.stopPropagation();
			// 		close();
			// 	},
			// 	blur: function() {
			// 		$this.find('.' + optionLayerClass).addClass(onClass).attr('tabindex', 0).focus();
			// 	}
			// });

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
		document.addEventListener("mousedown", function(e) {
			if (e.target.matches('.se-select[data-stove="select"] select')) {
				if (isIOS()) {
					// iOS 기본 동작
					return;
				}
				e.preventDefault();
			}
		});
	
		document.addEventListener("keydown", function(e) {
			if (e.target.matches('.se-select[data-stove="select"] select')) {
				if (isIOS()) {
					// iOS 기본 동작
					return;
				}
				if (e.key === "Enter" || e.key === " ") { // Enter or Space
					e.preventDefault();
					customSelect(e.target); // Vanilla JS에서 e.target을 직접 전달
				}
			}
		});
	
		document.addEventListener("click", function(e) {
			if (e.target.matches('.se-select[data-stove="select"] select')) {
				if (isIOS()) {
					// iOS 기본 동작
					return;
				}
				e.preventDefault();
				customSelect(e.target); // Vanilla JS에서 e.target을 직접 전달
			}
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
		const datepickerOptions  ={
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
			minDate:null //null
		}

		$.datepicker.setDefaults(datepickerOptions);

		// 커스텀 설정
		$('.datepicker').datepicker({
			showOtherMonths:true,
			showMonthAfterYear: true,
			showButtonPanel: true,
			changeYear: true,
			changeMonth: true,
			yearRange:'c-5:c+5',//선택 범위
			beforeShow: function(input, inst) {
				repositionDatepicker(input, inst);// 위치 조정
				$(window).on('scroll resize', function() {
					repositionDatepicker(input, inst);
				});
	
				setZIndexBasedOnPopup(input);// 팝업 내 z-index 설정
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
                left: inputOffset.left + 'px' // input의 왼쪽
            });
        }

		// 팝업 내에서 z-index 조정 (LayerPopup 확인)
		function setZIndexBasedOnPopup(input) {
			if ($(input).closest('.layerpopup').length) {
				setTimeout(function() {
					$('.ui-datepicker').css('z-index', '202');
				}, 0);
			} else {
				setTimeout(function() {
					$('.ui-datepicker').css('z-index', '2');
				}, 0);
			}
		}

		//오늘 버튼
		function overrideGoToToday(id) {
			var old_goToToday = $.datepicker._gotoToday; // 기존 _gotoToday 메서드 백업
			$.datepicker._gotoToday = function(id) {
				old_goToToday.call(this, id); // 기존 동작 호출
				var target = $(id); // input 포커스 설정
				target.focus();
				this._selectDate(id); // 날짜 선택
				target.blur(); // 포커스 제거
			};
		}overrideGoToToday();
	
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
        document.addEventListener('click', function(e) {
			if (e.target.matches('.toggleChk')) {
				handleToggleClick(e.target);
			} else if (e.target.closest('.toggleChk .btn')) {
				e.preventDefault();
				e.stopPropagation();
			}
		});
    }//개발 수정

    function handleToggleClick($toggleElement) {
        const  $toggleCont = $toggleElement.parent().find('.ques-cont');
        const  isOpen = $toggleElement.toggleClass('active').hasClass('active');
		
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
	// function handleScroll() {
    //     var scrollTop = $(window).scrollTop();

    //     if (scrollTop > 400) {
    //         $('.filter').addClass('fix');
    //     } else {
    //         $('.filter').removeClass('fix');
    //     }
    // }

    // function initScrollEvent() {
    //     $(window).on('scroll', handleScroll);
    // }

    // // 이벤트 초기화 함수 실행
    // initScrollEvent();

	/*********************************************************************
		Input_File #인풋_파일 업로드
	*********************************************************************/
	/*---------------------------------------------
		Input_File [파일 업로드]
	---------------------------------------------*/
	function setupFileInputHandlers() {
		const maxFiles = 3; // 최대 파일 개수
		const maxFileSize = 50 * 1024 * 1024; // 50MB 제한
		const imageExtensions = ['jpg', 'gif', 'png', 'pdf']; // 이미지 파일 확장자
		const documentExtensions = ['xlsx', 'pdf', 'hwp', 'doc', 'pptx']; // 문서 파일 확장자
	
		// .file 클래스를 가진 모든 요소에 대해 처리
		const fileContainers = document.querySelectorAll('.file');
	
		fileContainers.forEach(function(container) {
			const fileInput = container.querySelector('.attachmentFile');
			const addFileList = container.querySelector('.add-file');
			const isImageFile = fileInput.classList.contains('imgFile'); // 이미지 파일 클래스
			const isDocumentFile = fileInput.classList.contains('documentFile'); // 문서 파일 클래스
	
			// 파일 선택 시 처리
			fileInput.addEventListener('change', function() {
				// 파일 개수 초과시
				if (addFileList.children.length >= maxFiles) {
					messageView('최대 3개의 파일만 선택할 수 있습니다.');
					return;
				}
	
				const files = Array.from(this.files);
	
				files.forEach(function(file) {
					const fileSize = file.size;
					const filename = file.name;
					const fileExtension = filename.split('.').pop().toLowerCase();
	
					// 이미지 파일 확인
					if (isImageFile && !imageExtensions.includes(fileExtension)) {
						messageView(fileExtension + '는 지원하지 않는 이미지 파일 확장자입니다.');
						return;
					}
	
					// 문서 파일 확인
					if (isDocumentFile && !documentExtensions.includes(fileExtension)) {
						messageView(fileExtension + '는 지원하지 않는 문서 파일 확장자입니다.');
						return;
					}
	
					// 파일 크기 확인
					if (fileSize > maxFileSize) {
						messageView('파일 크기는 50MB를 초과할 수 없습니다.');
						return;
					}
	
					// 파일 리스트에 추가
					if (addFileList.children.length < maxFiles) {
						const newListItem = document.createElement('li');
						newListItem.textContent = file.name;
	
						const deleteButton = document.createElement('span');
						deleteButton.classList.add('delete-file');
						deleteButton.textContent = '삭제';
	
						// 삭제 버튼 클릭 시 해당 파일 항목 삭제
						deleteButton.addEventListener('click', function() {
							newListItem.remove();
						});
	
						newListItem.appendChild(deleteButton);
						addFileList.appendChild(newListItem);
					}
				});
	
				// 파일 선택 후 파일 입력값 초기화
				fileInput.value = '';
			});
		});
	}
	setupFileInputHandlers();

	/*********************************************************************
		Select Popup [년도 선택_팝업 / 차량 선택 _ 팝업/ 실적조회_테이블]
	*********************************************************************/
	/*---------------------------------------------
		Select Popup [년도 선택_팝업 / 차량 선택 _ 팝업/ 실적조회_테이블]
	---------------------------------------------*/
	// 선택된 항목
	function updateSelection(container, button, link) {

		// disabled
		if (container.classList.contains('disabled')) return;

		// 항목을 선택
		container.classList.add('on');

		// '선택됨' title 추가
		if (button) button.setAttribute('title', '선택됨');
		if (link) link.setAttribute('title', '선택됨');
	}

	// 클릭 이벤트
	function handleContainerClick(e) {
		const container = e.currentTarget;
		const button = container.querySelector('button');
		const link = container.querySelector('a');

		// disabled 이벤트 종료
		if (container.classList.contains('disabled')) return;

		// 부모
		const parent = container.closest('.btnSelect');

		// 리스트 아이템
		const listItems = parent.querySelectorAll('li, div, tr td:first-child');
		listItems.forEach(item => item.classList.remove('on'));

		// 버튼
		const buttons = parent.querySelectorAll('button');
		buttons.forEach(btn => btn.removeAttribute('title'));

		updateSelection(container, button, link);
	}

	// disabled 포커스 방지
	function disableFocusOnDisabledItems() {
		const disabledItems = document.querySelectorAll('.btnSelect .disabled button, .btnSelect .disabled a');
		disabledItems.forEach(item => item.setAttribute('tabindex', '-1'));
	}

	// 클릭 이벤트 초기화
	function initContainerClickEvent() {
		const btnSelects = document.querySelectorAll('.btnSelect');

		btnSelects.forEach(btnSelect => {
			const clickableElements = btnSelect.querySelectorAll('li, div, tr td:first-child');
			clickableElements.forEach(element => element.addEventListener('click', handleContainerClick));
		});

		// disabled 포커스 방지
		disableFocusOnDisabledItems();
	}

	initContainerClickEvent();

	

	/*********************************************************************
		scrollTop Button
	*********************************************************************/
	/*---------------------------------------------
		scrollTop
	---------------------------------------------*/
	function handleScrollTop() {
		if ($('.btn-top').length > 0) {
			$('.btn-top').hide();
		
			$(window).on('scroll', function() {
				var scrollTop = $(this).scrollTop();
				var windowHeight = $(this).height();
				var footerTop = $('footer').offset().top;
				var contentWrapOffset = $('.sub-content').offset(); // #contentWrap의 위치
				var contentWrapWidth = $('.sub-content').outerWidth(); // #contentWrap의 너비
		
				// 위치
				if (scrollTop > 0) {
					
					if ($('.btn-top').css('display') === 'none') {

						$('.btn-top').css({
							display: 'block',
							opacity: 0
						}).stop(true, true).animate({
							opacity: 1
						});

					}
				
					if (scrollTop + windowHeight >= footerTop) {

						$('.btn-top').css({
							position: 'absolute',
							bottom: '30px',
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
								right: ($(window).width() - contentWrapRightEdge + '10px')
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
		
			$('.btn-top').on('click', function() {
				$('html, body').stop().animate({ scrollTop: 0 }, 'linear');
			});
		}
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
			formGroup.find('.form-control.hasCancel').each(function() {
				var inputElement = $(this);
				var btnCancelContainer = inputElement.closest('.col-10'); // 부모
				const btnCancel = $('<button type="button" class="btn btn-cancel" onclick="clearBtn()"><span class="ir">입력취소</span></button>');//개발 : onclick="clearBtn()"
	
				// 페이지 로드 시 값이 있는 경우 취소 버튼 생성
				if (inputElement.val().trim() !== '' && btnCancelContainer.find('.btn-cancel').length === 0) {
					btnCancelContainer.append(btnCancel);
				}
	
				inputElement.off('focus').on('focus', function() {
					inputElement.off('keyup').on('keyup', function() {
						var inputValue = inputElement.val().trim();
						var btnCancelContainer = inputElement.closest('.col-10'); // 부모
						const btnCancel = $('<button type="button" class="btn btn-cancel" onclick="clearBtn()"><span class="ir">입력취소</span></button>');//개발 : onclick="clearBtn()"
	
						if (inputValue !== '') {
							if (btnCancelContainer.find('.btn-cancel').length === 0) {
								btnCancelContainer.append(btnCancel);
							}
						} else {
							btnCancelContainer.find('.btn-cancel').remove();
						}
					});
				});
			});
	
			formGroup.off('click', '.btn-cancel').on('click', '.btn-cancel', function() {
				var inputElement = $(this).closest('.col-10').find('.form-control');
				inputElement.val('');
				$(this).remove();
			});
		});
	}
	
	delEvent();

	
});
