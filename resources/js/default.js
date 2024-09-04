window.addEventListener('scroll', () => {
	const bwLeft = window.scrollX;
	document.querySelector('#header').style.transform = `translateX(-${bwLeft}px)`;
});

$(document).ready(function() {

  /**  3자리 수마다 콤마 적용 **/
  $(document).on('keyup', 'input[inputmode=numeric]', function () {
    this.value = this.value.replace(/[^0-9]/g, ''); // 입력값이 숫자가 아니면 공백
    this.value = this.value.replace(/,/g, ''); // ,값 공백처리
    this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 정규식을 이용해서 3자리 마다 , 추가
  });

  /** 계산 완료 **/
  $('.btn.btn-primary.result').on('click', function (e) {
    e.preventDefault();
    $('.contents-wrap').animate({
        scrollTop: $('.txt-list-wrap').offset().top
    });
  });

  /** datepicker **/
  //날짜 유효성 검사
$('#btnSearch').click(function(){

  var dateFrom = document.getElementById('dateFrom');	//시작일
  var dateTo = document.getElementById('dateTo');	//종료일
  var today = new Date();				//오늘 날짜

  dateFrom = new Date(dateFrom.value);
  var fromYear = dateFrom.getFullYear();
  var fromMonth = dateFrom.getMonth() + 1;
  var fromDay = dateFrom.getDate();

  //날짜 지정을 하지 않았을 때 NaN이 발생하여 0으로 처리
  if (isNaN(fromYear) || isNaN(fromMonth) || isNaN(fromDay)){
    fromYear  = 0;
    fromMonth = 0;
    fromDay   = 0;
  }

	dateFrom = fromYear +'/'+ fromMonth +'/'+fromDay; 

  dateTo = new Date(dateTo.value);
  var toYear  = dateTo.getFullYear();
  var toMonth = dateTo.getMonth() + 1;
  var toDay   = dateTo.getDate();

  //날짜 지정을 하지 않았을 때 NaN이 발생하여 0으로 처리
  if (isNaN(toYear) || isNaN(toMonth) || isNaN(toDay)){
  toYear  = 0;
  toMonth = 0;
  toDay   = 0;
  }

    dateTo = toYear +'/'+ toMonth +'/'+toDay;

  //오늘날짜 날짜 형식으로 지정
  var todayYear  = today.getFullYear(); 	//2020
  var todayMonth = today.getMonth() + 1;    	//06
  var todayDay   = today.getDate();  		//11
  today = todayYear +'/'+ todayMonth +'/'+todayDay;  // 2020/06/11 (형식 지정은 본인 자유)

  //날짜 조회 시, 시작일이 오늘 날짜보다는 크고, 종료일이 시작일보다는 커야하기 때문에 조건을 걸어줌
  if(dateFrom >= today && dateTo >= dateFrom){
  	return true;
  } else {
 	 alert("해당 기간의 조회가 불가능합니다.");
  }
});//click() end

  /** 툴팁 **/
  $(".info-tooltip").on('click', function(){
    var $this = $(this).parents(".tooltip-wrap");
    $this.toggleClass('on');
  });
  //툴팁 닫기
	$(".tooltip-close").on('click', function(){
		var $this = $(this).parents(".tooltip-wrap");
		$this.removeClass('on');
	});

  // 페이지 로드 시 초기 상태를 확인
  document.addEventListener('DOMContentLoaded', function() {
      if (inputField.value.trim() !== "") {
          myButton.classList.add('active');
          myButton.disabled = false; // 버튼 활성화
      } else {
          myButton.classList.remove('active');
          myButton.disabled = true; // 버튼 비활성화
      }
  });

  /** input focus **/ 
  $('.form-control, textarea').focus(function(){
    if (!$(this).hasClass('select') && !$(this).prop("readonly")) {
      $('.fixed-btn-wrap').hide();
    }
  });

  $('.form-control, textarea').blur(function(){
    if (!$(this).hasClass('select') && !$(this).prop("readonly")) {
      $('.fixed-btn-wrap').show();
    }
  });

  /** keyboard focus **/ 
  $(document).keydown(function(event){
    if (event.key === "Escape") {
      var inputField = $("input.form-control");
      inputField.blur();
    }
  });

  /** popup focus **/
  $('.layerpopup.layer-up .form-control').focus(function(){
    $('.ly-cont-wrap.ly-scroll-con').removeClass('plus-height2').addClass('plus-height3');
  });

  $('.layerpopup.layer-up .form-control').blur(function(){
    $('.ly-cont-wrap.ly-scroll-con').addClass('plus-height2').removeClass('plus-height3');
  });

  /** 리스트 선택이 필요한 경우 **/
  $(document).on('click', '.txt-list-wrap.click .txt-detail-area', function(){
    $('.txt-list-wrap.click .txt-detail-area').not(this).removeClass('on');
    $(this).toggleClass('on');
    $('.txt-list-wrap.click .txt-detail-area').not(this).find('input').removeClass('on');
    $(this).find('input').toggleClass('on');
  });

  /** 테이블 상세현황 **/
  $(".table-type.check tbody tr").click(function () {
    $(".table-type.check tbody tr").not(this).removeClass("checked");
    $(this).toggleClass("checked");
    $(".table-type.result").css("display", $(this).hasClass("checked") ? "block" : "none");
  });

  /** 전체동의 **/
  $('.check.all').on('click', function() {
    var termsPopID = $(this).attr("terms-all");

    if ($(this).prop("checked")) {
      $("#" + termsPopID).closest('.layerpopup').show();
    } else {
      $("#" + termsPopID).closest('.layerpopup').hide();
    }

    if (!$('.level1 .all').closest('fieldset').siblings().hasClass('etc')) {
      // 약관 전체동의
      $('.level2').find('input').prop('checked', $(this).prop('checked'));
    }
  });

  /** 개별 약관 **/
  $('.check').on('click', function() {
    var totalNum = $(".level2 fieldset > .check").length;
    var checkNum = $(".level2 fieldset > .check:checked").length;

    var terms_id = $(this).attr("terms-pop");

    $('.level1 .all').prop('checked', totalNum === checkNum);

    if ($(this).prop("checked")) {
      $("#" + terms_id).closest('.layerpopup').show();
    } else {
      $("#" + terms_id).closest('.layerpopup').hide();
    }

    if (!$(this).closest('div.level3').hasClass('etc')) {
      $('.level1 .all').prop('checked', totalNum === checkNum);
    } else {
      agreeChek();
    }
  });

  /** accordion **/
  $('.accordion .btn-accordion').click(function() {
    var accordionCont = $(this).next('.accordion-cont');
    $(this).toggleClass('on').attr('title', function(_, attr) {
      return attr === '열림' ? '닫힘' : '열림';
    });
    accordionCont.toggleClass('on');
  });

  /** tab & tab scroll **/
  $(".tab-item.type2 > li").click(function() {
    var tabCont = $(this).attr("data-tab");

    $(this).siblings().removeClass("on");
    if (!$(this).hasClass('swiper'))  $(this).addClass("on");

    $(".tab-content").addClass("dp-none");
    $("#" + tabCont).removeClass("dp-none");

    $(".tab-item.scroll > li").click(function() {
      var tabContPosition = $(".tab-item.scroll > li:first-child").offset().left;
      var listItemPosition = $(this).offset().left;
      var distance = listItemPosition - tabContPosition;

      $(".tab-item.scroll").animate({
        scrollLeft: distance
      }, 100);
    });
  });

  $(".tab-item > li").click(function() {
    var tabCont = $(this).attr("data-tab");

    $(this).siblings().removeClass("on");
    if (!$(this).hasClass('swiper'))  $(this).addClass("on");
  });
});

// 레이어팝업 높이 판단하여 block과 position 컨트롤
function layerFunc(_target) {
  if (!_target.hasClass('laypop-all')) {
      if (_target.outerHeight() > $(window).height()) {
          console.log('Full screen layer required');
          addBlock('full');
      } else {
          if (_target.attr('id') === "loadingLayer") {
              console.log('Loading layer detected');
              addBlock('removeEvent');
          } else if (_target.attr('id') === "customAlertLayer") {
              console.log('Custom alert layer detected');
              addBlock('fixed');
          } else {
              console.log('Regular layer');
              addBlock();
          }
      }
  } else {
      console.log('Skipping laypop-all class');
  }
}

// block 추가 및 삭제
function addBlock(_full) {
  console.log('Adding block:', _full);
  // 블록 추가 로직 필요 시 구현
  // 예: $('body').append('<div class="block"></div>');

  // close 버튼에 이벤트 추가
  $('.close').on('click', function () {
      $('.block').trigger('click');
  });
}

function deleteBlock(_full) {
  console.log('Deleting block:', _full);
  if (_full === 'fixed') {
      $('.block').fadeOut(300).remove();
  }
  $('html, .wrap').css({ 'height': '', 'overflow': '' });
  $('body').removeAttr('style');
}

// 메시지 팝업
function messagePopup(id) {
  const _target = $('#' + id);
  const currentTop = $(window).scrollTop();
  $('body').css({ 'position': 'fixed', 'top': -currentTop + 'px' });
  
  _target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
      closePopup(id);
      $('body').css({ 'position': '', 'top': '' });
      $(window).scrollTop(currentTop);
  });

  _target.fadeIn(600).addClass('on').focus();
}

// 팝업 열기 및 닫기
let scrollPosition = 0;

function openPopup(id) {
  const $target = $('#' + id);

  if ($target.length) {
      // 현재 스크롤 위치 저장
      scrollPosition = $(window).scrollTop();
      console.log('Scroll position saved:', scrollPosition);

      showPopup($target);
  } else {
      console.error('Target element not found:', id);
  }

  function showPopup($target) {
      layerFunc($target);
      $target.removeClass('close').addClass('on').show().focus();

      // close 버튼에 이벤트 추가
      $target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
          closePopup(id);
      });
  }
}

function closePopup(id) {
  const $target = $('#' + id);

  deleteBlock();
  $target.fadeOut(200).removeClass('on');

  // 스크롤 위치 복원 및 스타일 초기화
  $('body').css({
      'overflow': '',
      'position': '',
      'width': '',
      'top': ''
  });

  if (scrollPosition) {
      console.log('Restoring scroll position:', scrollPosition);
      $(window).scrollTop(scrollPosition);
      scrollPosition = 0; // 초기화
  }
}

function closePopupUp(id) {
  deleteBlock();
  $('#' + id).scrollTop(0).fadeOut(600);
}

/**selectbox***/
document.addEventListener('DOMContentLoaded', function() {
  // 버튼과 리스트를 가져오기
  const btns = document.querySelectorAll('.btn-select');
  const lists = document.querySelectorAll('.select-list');

  // 각각의 버튼에 대해 이벤트 리스너 추가
  btns.forEach((btn, index) => {
      const list = lists[index];
      btn.addEventListener('click', (event) => {
          event.preventDefault(); // form의 기본 동작 중지
          if (!btn.classList.contains('disabled')) {
              btn.classList.toggle('action');
          }
      });

      list.addEventListener('click', (event) => {
        if (event.target.nodeName === "BUTTON") {
            if (!btn.classList.contains('disabled')) {
                // 선택된 항목의 텍스트를 버튼의 텍스트로 설정
                btn.innerText = event.target.innerText;
                btn.classList.remove('action');

                // 여기에 check 클래스 추가 로직을 삽입
                const currentSelected = document.querySelector('.select-list button.check');
                // 기존에 check 클래스가 적용된 버튼이 있으면 제거
                if (currentSelected) {
                    currentSelected.classList.remove('check');
                }
                // 현재 선택된 버튼에 check 클래스 추가
                event.target.classList.add('check');
            }
        }
    });
  });

  // 선택된 항목을 btn-select에 표시
  const selectedOption = document.querySelector('.select button');
  if (selectedOption) {
      btns[0].innerText = selectedOption.innerText;
  }

  // 외부 영역 클릭 시 모든 버튼의 action 클래스 제거
  document.addEventListener('click', (event) => {
      const targetElement = event.target;

      btns.forEach((btn) => {
          // 클릭된 요소가 버튼이거나 버튼의 자식 요소이면 이벤트를 처리하지 않음
          if (targetElement.closest('.btn-select') === btn) {
              return;
          }
          // 외부 영역을 클릭한 경우 action 클래스 제거
          btn.classList.remove('action');
      });
  });
});
