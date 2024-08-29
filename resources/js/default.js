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

  // 계산 완료
  $('.btn.btn-primary.result').on('click', function (e) {
    e.preventDefault();
    $('.contents-wrap').animate({
        scrollTop: $('.txt-list-wrap').offset().top
    });
  });

  //인풋에 value값 있을 때 버튼 활성화하기
  const inputField = document.querySelector('.inputField');
  const myButton = document.querySelector('.btn-input');

  // input에 변화가 생길 때마다 실행됩니다.
  inputField.addEventListener('input', function() {
      if (inputField.value.trim() !== "") {
          // 입력 값이 있으면 버튼을 활성화합니다.
          myButton.classList.add('active');
          myButton.disabled = false; // 버튼 활성화
      } else {
          // 입력 값이 없으면 버튼을 비활성화합니다.
          myButton.classList.remove('active');
          myButton.disabled = true; // 버튼 비활성화
      }
  });

  // 페이지 로드 시 초기 상태를 확인합니다.
  document.addEventListener('DOMContentLoaded', function() {
      if (inputField.value.trim() !== "") {
          myButton.classList.add('active');
          myButton.disabled = false; // 버튼 활성화
      } else {
          myButton.classList.remove('active');
          myButton.disabled = true; // 버튼 비활성화
      }
  });

  // input focus
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

  // keyboard focus
  $(document).keydown(function(event){
    if (event.key === "Escape") {
      var inputField = $("input.form-control");
      inputField.blur();
    }
  });

  // popup focus
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

// 레이어팝업 높이 판단하여 block와 position 컨트롤
function layerFunc(_target) {
  if (!_target.hasClass('laypop-all')) {
    if (_target.outerHeight() > $(window).height()) {
      _target.css({ 'position': 'absolute', 'top': '50px', 'left': getCenterAlignPos($(window).width(), _target.outerWidth()) });
      addBlock('full');
    } else {
      _target.css({ 'position': 'fixed', 'top': getCenterAlignPos($(window).height(), _target.outerHeight()), 'left': getCenterAlignPos($(window).width(), _target.outerWidth()) });
      addBlock(_target.attr('id') === "loadingLayer" ? 'removeEvent' : (_target.attr('id') === "customAlertLayer" ? "fixed" : ''));
    }
  }
}

// block 처리
function addBlock(_full) {
  $('.close').on('click', function () {
    $('.block').trigger('click');
  });
}

function deleteBlock(_full) {
  if (_full === 'fixed') {
    $('.block').fadeOut(300).remove();
  }
  $('html, .wrap').css({ 'height': '', 'overflow': '' });
  $('body').removeAttr('style');
}

// messagePopup
function messagePopup(id) {
  var _target = $('#' + id);
  currentTop = $(window).scrollTop();
  $('body').css({ 'position': 'fixed', 'top': -currentTop });

  _target.find('.btn-layer-close, .btn-close, .confirm').on('click', function (e) {
    e.preventDefault();
    closePopup(id);
    $('body').removeAttr('style');
    $(window).scrollTop(currentTop);
  });

  if (_target.hasClass('layer-up') || _target.hasClass('type-alert')) {
    _target.fadeIn(600).addClass("on").focus();
  } else {
    _target.fadeIn(600).addClass("on").focus();
  }
}

// popup
function openPopup(id) {
  var _target = $('#' + id);
  currentTop = $(window).scrollTop();
  $('body').css({ 'position': 'fixed', 'top': -currentTop });

  layerFunc(_target);
  _target.removeClass('close').addClass('on').show().focus();
  _target.find('.btn-layer-close, .btn-close, .confirm').on('click', function (e) {
    e.preventDefault();
    closePopupUp(id);
    $('body').removeAttr('style');
    $(window).scrollTop(currentTop);
    _target.removeClass('on');
  });

  if (_target.has('.ly-select-list').length > 0) {
    _target.find('.ly-select-list > li > button').on('click', function () {
      closePopupUp(id);
      $('body').removeAttr('style');
      $(window).scrollTop(currentTop);
      _target.removeClass('show');
    });
  }

  /** 테이블 팝업 **/
  if (_target.has('.ly-select > .table-type.check').length > 0) {
    _target.find('.ly-select .table-type.check tbody tr').on('click', function () {
      closePopupUp(id);
      $('body').removeAttr('style');
      $(window).scrollTop(currentTop);
      _target.removeClass('show');
    });
  }
}

function closePopup(id) {
  var _target = $('#' + id);
  deleteBlock();
  _target.fadeOut(600).removeClass('on');
  $(window).scrollTop(currentTop);
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
                // 선택된 버튼에 "select-ok" 클래스 추가
                const selectedBtn = document.querySelector('.btn-select.select-ok');
                if (selectedBtn) {
                    selectedBtn.classList.remove('select-ok');
                }
                btn.classList.add('select-ok');
                
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
