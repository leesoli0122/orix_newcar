$(document).ready(function() {

  /**  3자리 수마다 콤마 적용 **/
  $(document).on('keyup', 'input[inputmode=numeric]', function () {
    this.value = this.value.replace(/[^0-9]/g, ''); // 입력값이 숫자가 아니면 공백
    this.value = this.value.replace(/,/g, ''); // ,값 공백처리
    this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 정규식을 이용해서 3자리 마다 , 추가
  });

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

  /** tab & tab scroll **/
  $(".tab-item.type2 > li, .tab-item > li").click(function() {
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

function messagePopup(id) {
  const _target = $('#' + id);
  const currentTop = $(window).scrollTop();
  $('body').css({ 'position': 'fixed', 'top': -currentTop + 'px' });
  
  _target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
      closePopup(id, currentTop);
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

      // swiper 추가
      var swiper = new Swiper(".mySwiper", {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
      });

      // close 버튼에 이벤트 추가
      $target.find('.btn-layer-close, .btn-close, .confirm').on('click', function () {
          closePopup(id);
      });
  }
}

function closePopup(id, storedScrollPosition) {
  const $target = $('#' + id);

  deleteBlock();
  $target.fadeOut(200).removeClass('on');

  // 스크롤 위치 복원 및 스타일 초기화
  $('body').css({
      'overflow': '',
      'position': '',
      'top': ''
  });

  // 스크롤 위치 복원
  if (storedScrollPosition !== undefined) {
      console.log('Restoring scroll position:', storedScrollPosition);
      $(window).scrollTop(storedScrollPosition);
  }
}

function closePopupUp(id) {
  deleteBlock();
  $('#' + id).scrollTop(0).fadeOut(600);
}
